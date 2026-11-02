import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Globe2,
  MoveHorizontal,
  Pause,
  Play,
} from "lucide-react";
import { TestimonialGlobe } from "./components/ui/testimonial-globe";
import { catalog, countries } from "./countries";
import type { CountryCode } from "./countries";
import type { Lang } from "./i18n";
import "./world.css";
import { worldCopy } from "./worldContent";
export default function WorldDiscovery({
  lang,
  onSelect,
}: {
  lang: Lang;
  onSelect: (code: CountryCode) => void;
}) {
  const [spinning, setSpinning] = useState(true);
  const c = worldCopy[lang];
  const items = useMemo(
    () =>
      countries.map((country) => ({
        id: country.code,
        name: country.name[lang],
        city: country.city[lang],
        country: country.code,
        quote: country.description[lang],
        lat: country.lat,
        lng: country.lng,
        image: `${import.meta.env.BASE_URL}${country.image.slice(1)}`,
        role: `${catalog.filter((l) => l.country === country.code).length} ${c.places}`,
      })),
    [lang, c.places],
  );
  return (
    <section
      className="world-discovery container"
      id="world"
      aria-label={c.nav}
    >
      <div className="world-section-top">
        <span>
          <Globe2 size={14} />
          ZZZLEP WORLD
        </span>
        <span>{c.note}</span>
      </div>
      <TestimonialGlobe
        items={items}
        totalPlaces={catalog.length}
        eyebrow={c.eyebrow}
        heading={c.title}
        caption={c.caption}
        size={440}
        autoRotate={spinning}
        rotationSpeed={0.075}
        onExplore={(item) => onSelect(item.id as CountryCode)}
        labels={{
          previous: c.previous,
          next: c.next,
          pin: c.pin,
          places: c.places,
          countries: c.countries,
          explore: c.explore,
        }}
      />
      <div className="world-controls">
        <span>
          <MoveHorizontal size={15} />
          {c.drag}
        </span>
        <button
          onClick={() => setSpinning(!spinning)}
          aria-label={spinning ? c.pause : c.play}
          aria-pressed={!spinning}
        >
          {spinning ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>
      <nav className="world-countries" aria-label={c.browse}>
        {countries.map((country) => (
          <button key={country.code} onClick={() => onSelect(country.code)}>
            <img
              src={`${import.meta.env.BASE_URL}${country.image.slice(1)}`}
              alt=""
            />
            <span>{country.name[lang]}</span>
            <ArrowUpRight size={14} />
          </button>
        ))}
      </nav>
    </section>
  );
}
