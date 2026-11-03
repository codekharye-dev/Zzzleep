import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { StayListing } from "./types";
import type { HomeViewer } from "./engine/viewer";

interface Props {
  listing: StayListing;
  floor?: number;
  roomId?: string | null;
  view?: number;
  onRoomSelect?: (id: string) => void;
  autoRotate?: boolean;
  errorText?: string;
  height?: number;
  className?: string;
  style?: CSSProperties;
}
export function StayHomeViewer({
  listing,
  floor = 0,
  roomId = null,
  view = 0,
  onRoomSelect,
  autoRotate = false,
  height = 480,
  className,
  style,
  errorText = "3D baxışı üçün WebGL dəstəyi lazımdır.",
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const instance = useRef<HomeViewer | null>(null);
  const callback = useRef(onRoomSelect);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  callback.current = onRoomSelect;
  useEffect(() => {
    let cancelled = false;
    setError("");
    import("./engine/viewer.js")
      .then(({ HomeViewer: Viewer }) => {
        if (cancelled || !container.current) return;
        instance.current = new Viewer(container.current, {
          onRoomSelect: (id) => callback.current?.(id),
        });
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setError(errorText);
      });
    return () => {
      cancelled = true;
      instance.current?.dispose();
      instance.current = null;
    };
  }, []);
  useEffect(() => {
    if (!ready || !instance.current) return;
    if (roomId) instance.current.room(listing, roomId, view);
    else instance.current.home(listing, floor);
  }, [listing, floor, roomId, view, ready]);
  useEffect(() => {
    if (ready) instance.current?.rotate(autoRotate);
  }, [ready, autoRotate]);
  return (
    <div
      className={className}
      style={{ width: "100%", height, position: "relative", ...style }}
    >
      <div ref={container} style={{ width: "100%", height: "100%" }} />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
