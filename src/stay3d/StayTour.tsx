import { useState } from "react";
import { Box, RotateCw } from "lucide-react";
import { StayHomeViewer } from "./StayHomeViewer";
import { listings } from "./listings";
import type { Lang } from "../i18n";
import "./tour.css";
const text = {
  az: {
    title: "Məkanı 3D ilə kəşf et",
    open: "3D baxışı aç",
    close: "3D baxışı bağla",
    floor: "Mərtəbə",
    room: "Otaq",
    whole: "Bütöv ev",
    angle: "Baxış",
    rotate: "Avtomatik fırlatma",
    note: "Demo model · Şəkillər illüstrativdir. Model və xəritə nöqtəsi real kirayə ünvanı deyil.",
    hint: "Fırlatmaq üçün sürüşdürün, yaxınlaşmaq üçün iki barmaqdan və ya siçan təkərindən istifadə edin. Otağa toxunaraq daxil olun.",
  },
  en: {
    title: "Explore the space in 3D",
    open: "Open 3D tour",
    close: "Close 3D tour",
    floor: "Floor",
    room: "Room",
    whole: "Whole home",
    angle: "View",
    rotate: "Auto rotate",
    note: "Demo model · Photos are illustrative. The model and map point are not a real rental address.",
    hint: "Drag to orbit; pinch or scroll to zoom. Select a room to step inside.",
  },
  ru: {
    title: "Изучите дом в 3D",
    open: "Открыть 3D-тур",
    close: "Закрыть 3D-тур",
    floor: "Этаж",
    room: "Комната",
    whole: "Весь дом",
    angle: "Ракурс",
    rotate: "Автовращение",
    note: "Демо-модель · Фотографии иллюстративные. Модель и точка на карте не являются реальным адресом аренды.",
    hint: "Перетаскивайте для вращения; используйте жест или колесо для масштаба. Выберите комнату, чтобы войти.",
  },
};
const roomNames: Record<string, [string, string]> = {
  bedroom: ["Bedroom", "Спальня"],
  living: ["Living room", "Гостиная"],
  kitchen: ["Kitchen", "Кухня"],
  bathroom: ["Bathroom", "Ванная"],
  balcony: ["Balcony", "Балкон"],
  corridor: ["Hallway", "Коридор"],
  stairs: ["Stairs", "Лестница"],
  dining: ["Dining room", "Столовая"],
};
export default function StayTour({
  modelId,
  lang,
}: {
  modelId: string;
  lang: Lang;
}) {
  const model = listings.find((item) => item.id === modelId);
  const [open, setOpen] = useState(false);
  const [floor, setFloor] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [view, setView] = useState(0);
  const [rotate, setRotate] = useState(false);
  const c = text[lang];
  if (!model) return null;
  const room = model.rooms.find((item) => item.id === roomId);
  const name = (r: (typeof model.rooms)[number]) =>
    lang === "az"
      ? r.name
      : `${roomNames[r.type]?.[lang === "en" ? 0 : 1] || r.type} ${model.rooms.filter((x) => x.type === r.type).indexOf(r) + 1}`;
  return (
    <section className="stay-tour" aria-label={c.title}>
      <div className="tour-heading">
        <div>
          <span className="detail-eyebrow">
            <Box size={15} /> 3D TOUR
          </span>
          <h2>{c.title}</h2>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          {open ? c.close : c.open}
        </button>
      </div>
      <p className="tour-note">{c.note}</p>
      {open && (
        <>
          <div className="tour-controls">
            <label>
              {c.floor}
              <select
                value={floor}
                onChange={(e) => {
                  setFloor(Number(e.target.value));
                  setRoomId(null);
                  setView(0);
                }}
              >
                {Array.from({ length: model.floors }, (_, i) => (
                  <option key={i} value={i}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {c.room}
              <select
                value={roomId || ""}
                onChange={(e) => {
                  setRoomId(e.target.value || null);
                  setView(0);
                }}
              >
                <option value="">{c.whole}</option>
                {model.rooms
                  .filter((r) => r.floor === floor)
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {name(r)} · {r.area} m²
                    </option>
                  ))}
              </select>
            </label>
            <button
              onClick={() => {
                setRoomId(null);
                setView(0);
              }}
            >
              {c.whole}
            </button>
            {[0, 1].map((v) => (
              <button
                key={v}
                disabled={!roomId}
                aria-pressed={!!roomId && view === v}
                onClick={() => setView(v)}
              >
                {c.angle} {v + 1}
              </button>
            ))}
            <button aria-pressed={rotate} onClick={() => setRotate(!rotate)}>
              <RotateCw size={15} />
              {c.rotate}
            </button>
          </div>
          <StayHomeViewer
            listing={model}
            floor={floor}
            roomId={roomId}
            view={view}
            onRoomSelect={(id) => {
              setRoomId(id);
              setView(0);
            }}
            autoRotate={rotate}
            errorText={
              lang === "az"
                ? "3D baxışı açıla bilmədi. WebGL dəstəyi olan brauzerdə yenidən sınayın."
                : lang === "en"
                  ? "3D is unavailable. Try a browser with WebGL support."
                  : "3D недоступен. Используйте браузер с поддержкой WebGL."
            }
          />
          <p className="tour-hint" aria-live="polite">
            {room
              ? `${name(room)} · ${room.width} × ${room.depth} m · ${room.area} m²`
              : `${model.area} m² · ${model.floors} ${c.floor.toLowerCase()}`}{" "}
          </p>
          <p className="tour-note">{c.hint}</p>
        </>
      )}
    </section>
  );
}
