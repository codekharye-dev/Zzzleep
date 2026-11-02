import { useState } from "react";
import { Check, UtensilsCrossed, X } from "lucide-react";
import SushiConveyorMenu from "./components/ui/sushi-conveyor-menu";
import type { Experience } from "./experiences";
import type { Lang } from "./i18n";
import { experienceCopy } from "./experienceContent";
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.slice(1)}`;
export default function ExperienceMenu({
  experience,
  lang,
  selected,
  onSelect,
  onRemove,
}: {
  experience: Experience;
  lang: Lang;
  selected: string[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [paused, setPaused] = useState(false);
  const c = experienceCopy[lang];
  const dishes = experience.menu || [];
  return (
    <section
      className="experience-menu-section"
      id="experience-menu"
      aria-label={c.menuTitle}
    >
      <SushiConveyorMenu
        key={experience.id}
        className="experience-conveyor"
        items={dishes.map((d) => ({
          id: d.id,
          name: d.name[lang],
          description: d.description[lang],
          price: c.includedShort,
          tier: d.tier,
          image: asset(d.image),
          details: d.details.map((t) => t[lang]),
        }))}
        legend={{ 1: c.starter, 2: c.main, 3: c.dessert }}
        eyebrow={c.menuEyebrow}
        heading={c.menuTitle}
        caption={c.menuText}
        autoplay={false}
        speed={18}
        paused={paused}
        onPausedChange={setPaused}
        onAdd={(dish) => onSelect(dish.id)}
        labels={{
          add: c.addDish,
          close: c.close,
          previous: c.previousDish,
          next: c.nextDish,
          pause: paused ? c.play : c.pause,
        }}
        action={
          <span className="experience-menu-included">
            <Check size={14} />
            {c.menuIncluded}
          </span>
        }
      />
      <div className="experience-tasting-plan">
        <div>
          <UtensilsCrossed size={18} />
          <h3>{c.selected}</h3>
          <span>
            {selected.length}/{dishes.length}
          </span>
        </div>
        <div aria-live="polite">
          {selected.length ? (
            selected.map((id) => {
              const dish = dishes.find((d) => d.id === id)!;
              return (
                <span key={id} className="experience-picked-dish">
                  <img src={asset(dish.image)} alt="" />
                  {dish.name[lang]}
                  <button
                    onClick={() => onRemove(id)}
                    aria-label={`${c.removeDish}: ${dish.name[lang]}`}
                  >
                    <X size={13} />
                  </button>
                </span>
              );
            })
          ) : (
            <p>{c.noSelection}</p>
          )}
        </div>
        <small>{c.menuNote}</small>
      </div>
    </section>
  );
}
