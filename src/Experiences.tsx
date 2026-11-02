import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CableCar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Compass,
  Globe2,
  Landmark,
  MapPin,
  Minus,
  Mountain,
  Paintbrush,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import {
  experiences,
  experienceCountries,
  experienceTimes,
  experienceTotal,
  validateExperienceSelection,
} from "./experiences";
import type { Experience, ExperienceCategory } from "./experiences";
import { experienceCopy } from "./experienceContent";
import type { Lang } from "./i18n";
import { addDays, todayISO } from "./booking";
import "./experiences.css";
const ExperienceMenu = lazy(() => import("./ExperienceMenu"));
const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const categoryIcons = {
  food: UtensilsCrossed,
  outdoor: Mountain,
  culture: Landmark,
  craft: Paintbrush,
};
const countryName = (code: string, lang: Lang) =>
  experienceCountries.find((c) => c.code === code)?.name[lang] || code;
function Duration({ minutes, lang }: { minutes: number; lang: Lang }) {
  const c = experienceCopy[lang];
  return (
    <>
      {minutes % 60 === 0
        ? `${minutes / 60} ${c.hours}`
        : `${minutes} ${c.minutes}`}
    </>
  );
}
export function ExperienceCard({
  experience: e,
  lang,
}: {
  experience: Experience;
  lang: Lang;
}) {
  const c = experienceCopy[lang],
    Icon = e.id === "sheki-cable" ? CableCar : categoryIcons[e.category];
  return (
    <article className="experience-card">
      <a
        className="experience-card-photo"
        href={`#/experience/${e.id}`}
        aria-label={e.title[lang]}
      >
        <img src={asset(e.hero)} alt={e.title[lang]} loading="lazy" />
        <span className="experience-card-shade" />
        <span className="experience-category-badge">
          <Icon size={13} />
          {c[e.category]}
        </span>
        {e.concept && (
          <span className="experience-concept-badge">{c.concept}</span>
        )}
        <span className="experience-photo-arrow">
          <ArrowUpRight size={20} />
        </span>
      </a>
      <div className="experience-card-meta">
        <span>
          <MapPin size={12} />
          {e.city[lang]}, {countryName(e.country, lang)}
        </span>
        <span>
          <Clock3 size={12} />
          <Duration minutes={e.duration} lang={lang} />
        </span>
      </div>
      <a className="experience-card-title" href={`#/experience/${e.id}`}>
        {e.title[lang]}
      </a>
      <p className="experience-card-capacity">
        <Users size={12} />
        {e.maxGuests} {c.group}
      </p>
      <div className="experience-card-price">
        <strong>${e.price}</strong>
        <span>/ {c.perPerson}</span>
        <small>USD</small>
      </div>
    </article>
  );
}
export function ExperiencePreview({ lang }: { lang: Lang }) {
  const c = experienceCopy[lang];
  return (
    <section className="experience-preview container">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{c.eyebrow}</span>
          <h2>{c.homeTitle}</h2>
          <p>{c.homeText}</p>
        </div>
        <a className="text-link" href="#/experiences">
          {c.viewAll}
          <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="experience-preview-grid">
        {experiences.slice(0, 3).map((e) => (
          <ExperienceCard key={e.id} experience={e} lang={lang} />
        ))}
      </div>
      <a
        className="experience-preview-mobile-link text-link"
        href="#/experiences"
      >
        {c.viewAll}
        <ArrowRight size={16} />
      </a>
    </section>
  );
}
function ExperiencesList({
  lang,
  route,
  onNavigate,
}: {
  lang: Lang;
  route: string;
  onNavigate: (path: string) => void;
}) {
  const c = experienceCopy[lang],
    query = new URLSearchParams(route.split("?")[1] || "");
  const country = experienceCountries.some(
    (e) => e.code === query.get("country"),
  )
    ? query.get("country")!
    : "all";
  const kind = ["food", "outdoor", "culture", "craft"].includes(
    query.get("category") || "",
  )
    ? query.get("category")!
    : "all";
  const [search, setSearch] = useState(""),
    [sort, setSort] = useState("recommended"),
    [maxPrice, setMaxPrice] = useState(250);
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(route.split("?")[1] || "");
    value === "all" ? next.delete(key) : next.set(key, value);
    onNavigate(`/experiences${next.size ? `?${next}` : ""}`);
  };
  const visible = experiences
    .filter(
      (e) =>
        (country === "all" || e.country === country) &&
        (kind === "all" || e.category === kind) &&
        e.price <= maxPrice &&
        [
          e.title[lang],
          e.description[lang],
          e.city[lang],
          countryName(e.country, lang),
        ]
          .join(" ")
          .toLocaleLowerCase(lang)
          .includes(search.toLocaleLowerCase(lang).trim()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "duration"
            ? a.duration - b.duration
            : 0,
    );
  return (
    <div className="experience-page container">
      <section className="experience-hero">
        <div className="experience-hero-copy">
          <span className="eyebrow">
            <Sparkles size={13} />
            {c.eyebrow}
          </span>
          <h1>{c.title}</h1>
          <p>{c.description}</p>
          <span className="experience-hero-foot">
            <Globe2 size={14} />
            {experienceCountries.length}{" "}
            {lang === "az" ? "ölkə" : lang === "en" ? "countries" : "стран"}
            <i />
            {experiences.length} {c.results}
          </span>
        </div>
        <div className="experience-hero-art" aria-hidden="true">
          <span className="experience-orbit" />
          <figure className="experience-art-food">
            <img src={asset("/experiences/chinese-cuisine.webp")} alt="" />
            <figcaption>
              <UtensilsCrossed size={14} />
              {c.foodHero}
            </figcaption>
          </figure>
          <figure className="experience-art-nature">
            <img src={asset("/images/city-3.jpg")} alt="" />
            <figcaption>
              <CableCar size={14} />
              {c.natureHero}
            </figcaption>
          </figure>
          <span className="experience-art-sparkle">✦</span>
        </div>
      </section>
      <div className="experience-search">
        <label>
          <Search size={18} />
          <input
            aria-label={c.search}
            placeholder={c.search}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label={c.reset}>
              <X size={16} />
            </button>
          )}
        </label>
        <label className="experience-country-select">
          <Globe2 size={17} />
          <select
            aria-label={c.country}
            value={country}
            onChange={(event) => change("country", event.target.value)}
          >
            <option value="all">{c.allCountries}</option>
            {experienceCountries.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name[lang]}
              </option>
            ))}
          </select>
          <ChevronDown size={13} />
        </label>
      </div>
      <nav className="experience-categories" aria-label={c.all}>
        {[
          { id: "all", icon: Compass },
          ...Object.entries(categoryIcons).map(([id, icon]) => ({ id, icon })),
        ].map(({ id, icon: Icon }) => (
          <button
            key={id}
            className={kind === id ? "active" : ""}
            aria-pressed={kind === id}
            onClick={() => change("category", id)}
          >
            <Icon size={19} />
            {id === "all" ? c.all : c[id as ExperienceCategory]}
          </button>
        ))}
      </nav>
      <div className="experience-results-heading">
        <div>
          <span className="eyebrow">{c.eyebrow}</span>
          <h2>
            {country === "all" ? c.all : countryName(country, lang)}
            <span>
              {visible.length} {c.results}
            </span>
          </h2>
        </div>
        <div className="experience-result-options">
          <label className="experience-price-filter">
            <span>
              {c.maxPrice}: <b>${maxPrice}</b>
            </span>
            <input
              type="range"
              min={20}
              max={250}
              step={5}
              value={maxPrice}
              aria-label={c.maxPrice}
              onChange={(event) => setMaxPrice(+event.target.value)}
            />
          </label>
          <select
            value={sort}
            aria-label={c.sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="recommended">{c.recommended}</option>
            <option value="low">{c.low}</option>
            <option value="high">{c.high}</option>
            <option value="duration">{c.durationSort}</option>
          </select>
        </div>
      </div>
      {visible.length ? (
        <div className="experience-grid">
          {visible.map((e) => (
            <ExperienceCard key={e.id} experience={e} lang={lang} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Compass size={32} />
          <h3>{c.empty}</h3>
          <p>{c.emptyText}</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSearch("");
              setMaxPrice(250);
              setSort("recommended");
              onNavigate("/experiences");
            }}
          >
            {c.reset}
            <ArrowRight size={16} />
          </button>
        </div>
      )}
      <p className="experience-demo-strip">
        <ShieldCheck size={13} />
        {c.demo}
      </p>
    </div>
  );
}
interface DemoPlan {
  id: string;
  experienceId: string;
  date: string;
  time: string;
  people: number;
  total: number;
  currency: "USD";
  dishes: string[];
  demo: true;
}
function Confirmation({
  experience: e,
  plan,
  lang,
  onClose,
  onExplore,
}: {
  experience: Experience;
  plan: DemoPlan;
  lang: Lang;
  onClose: () => void;
  onExplore: () => void;
}) {
  const c = experienceCopy[lang],
    ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const shell = document.querySelector<HTMLElement>(".site-shell");
    const wasInert = shell?.inert;
    const overflow = document.body.style.overflow;
    if (shell) shell.inert = true;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const all = Array.from(
          ref.current?.querySelectorAll<HTMLButtonElement>("button") || [],
        );
        const first = all[0],
          last = all[all.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      if (shell) shell.inert = !!wasInert;
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, [onClose]);
  return createPortal(
    <div className="experience-confirm-overlay" onClick={onClose}>
      <div
        ref={ref}
        className="experience-confirm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="experience-confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="icon-button experience-confirm-close"
          onClick={onClose}
          aria-label={c.close}
        >
          <X size={19} />
        </button>
        <span className="experience-confirm-success">
          <CheckCircle2 size={31} />
        </span>
        <span className="eyebrow">ZZZLEP EXPERIENCES</span>
        <h2 id="experience-confirm-title">{c.confirmation}</h2>
        <p>{c.confirmationText}</p>
        <div className="experience-confirm-home">
          <img src={asset(e.hero)} alt="" />
          <div>
            <strong>{e.title[lang]}</strong>
            <small>
              {e.city[lang]} · {countryName(e.country, lang)}
            </small>
          </div>
        </div>
        <dl>
          <div>
            <dt>{c.date}</dt>
            <dd>{plan.date}</dd>
          </div>
          <div>
            <dt>{c.time}</dt>
            <dd>{plan.time}</dd>
          </div>
          <div>
            <dt>{c.people}</dt>
            <dd>{plan.people}</dd>
          </div>
          <div>
            <dt>{c.total}</dt>
            <dd>${plan.total} USD</dd>
          </div>
        </dl>
        {plan.dishes.length > 0 && (
          <div className="experience-confirm-picks">
            <UtensilsCrossed size={13} />
            {plan.dishes.length} {c.savedDishes}
          </div>
        )}
        <div className="experience-reference">
          <span>{c.reference}</span>
          <strong>{plan.id}</strong>
        </div>
        <p className="experience-confirm-demo">
          <ShieldCheck size={15} />
          {c.confirmationDemo}
        </p>
        <button className="btn btn-primary" onClick={onExplore}>
          {c.more}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>,
    document.body,
  );
}
function ExperienceDetail({
  experience: e,
  lang,
  onNavigate,
}: {
  experience: Experience;
  lang: Lang;
  onNavigate: (path: string) => void;
}) {
  const c = experienceCopy[lang],
    Icon = e.id === "sheki-cable" ? CableCar : categoryIcons[e.category];
  const [selected, setSelected] = useState<string[]>([]),
    [date, setDate] = useState(addDays(todayISO(), 7)),
    [time, setTime] = useState("14:00"),
    [people, setPeople] = useState(2),
    [error, setError] = useState("");
  const [plan, setPlan] = useState<DemoPlan | null>(null);
  const total = experienceTotal(e, people);
  const reserve = (event: React.FormEvent) => {
    event.preventDefault();
    const invalid = validateExperienceSelection(e, { date, time, people });
    if (invalid) {
      setError(c[invalid]);
      return;
    }
    setError("");
    const next: DemoPlan = {
      id: `ZXP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      experienceId: e.id,
      date,
      time,
      people,
      total,
      currency: "USD",
      dishes: selected,
      demo: true,
    };
    try {
      let old: unknown;
      try {
        old = JSON.parse(
          localStorage.getItem("zzzlep-experience-plans") || "[]",
        );
      } catch {
        old = [];
      }
      localStorage.setItem(
        "zzzlep-experience-plans",
        JSON.stringify([...(Array.isArray(old) ? old : []), next]),
      );
    } catch {
      /* The on-screen demo confirmation remains usable without local storage. */
    }
    setPlan(next);
  };
  return (
    <article className="experience-detail container">
      <button className="back-link" onClick={() => onNavigate("/experiences")}>
        <ArrowLeft size={16} />
        {c.back}
      </button>
      <div className="experience-detail-heading">
        <div>
          <span className="eyebrow">
            <Icon size={14} />
            {c[e.category]} · {countryName(e.country, lang)}
          </span>
          <h1>{e.title[lang]}</h1>
          <div className="experience-detail-meta">
            <span>
              <MapPin size={14} />
              {e.city[lang]}
            </span>
            <span>
              <Clock3 size={14} />
              <Duration minutes={e.duration} lang={lang} />
            </span>
            <span>
              <Users size={14} />
              {e.maxGuests} {c.group}
            </span>
          </div>
        </div>
        <span className="experience-detail-demo">
          {e.concept ? c.concept : c.sample}
        </span>
      </div>
      <div
        className={`experience-detail-hero ${e.country === "US" && e.menu ? "american-hero" : ""}`}
      >
        <img src={asset(e.hero)} alt={e.title[lang]} />
        <span className="experience-detail-hero-gradient" />
        <div>
          <span>
            <Icon size={20} />
          </span>
          <p>{c.accent}</p>
          <strong>
            ${e.price}
            <small> / {c.perPerson}</small>
          </strong>
        </div>
      </div>
      {e.menu && (
        <Suspense fallback={<div className="experience-menu-loading" />}>
          <ExperienceMenu
            experience={e}
            lang={lang}
            selected={selected}
            onSelect={(id) =>
              setSelected((old) => (old.includes(id) ? old : [...old, id]))
            }
            onRemove={(id) => setSelected((old) => old.filter((d) => d !== id))}
          />
        </Suspense>
      )}
      <div className="experience-detail-body">
        <div className="experience-story">
          <section>
            <span className="eyebrow">ZZZLEP EXPERIENCES</span>
            <h2>{c.about}</h2>
            <p>{e.description[lang]}</p>
            <div className="experience-host">
              <span>
                {e.host
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div>
                <strong>{e.host}</strong>
                <small>
                  {c.host} · {c.hostNote}
                </small>
              </div>
              <Compass size={22} />
            </div>
            <div className="experience-facts">
              <div>
                <Globe2 size={18} />
                <span>
                  <small>{c.language}</small>
                  {e.languages[lang]}
                </span>
              </div>
              <div>
                <Users size={18} />
                <span>
                  <small>{c.age}</small>
                  {e.minAge} {c.years}
                </span>
              </div>
            </div>
          </section>
          <section>
            <h2>{c.itinerary}</h2>
            <div className="experience-timeline">
              {e.steps.map((step, index) => (
                <div key={index}>
                  <span className="experience-step-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span>
                      {step.minutes} {c.minutes}
                    </span>
                    <h3>{step.title[lang]}</h3>
                    <p>{step.body[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="experience-inclusions">
            <div>
              <h3>
                <Check size={17} />
                {c.included}
              </h3>
              {e.included.map((item, i) => (
                <p key={i}>
                  <Check size={13} />
                  {item[lang]}
                </p>
              ))}
            </div>
            <div>
              <h3>{c.notIncluded}</h3>
              {e.excluded.map((item, i) => (
                <p key={i}>
                  <Minus size={13} />
                  {item[lang]}
                </p>
              ))}
            </div>
          </section>
          <section>
            <h2>{c.meeting}</h2>
            <div className="experience-meeting">
              <MapPin size={23} />
              <div>
                <strong>
                  {e.city[lang]}, {countryName(e.country, lang)}
                </strong>
                <p>{c.meetingNote}</p>
              </div>
            </div>
          </section>
          <section className="experience-practical">
            <ShieldCheck size={21} />
            <div>
              <h3>{c.practical}</h3>
              <p>{c.practicalText}</p>
            </div>
          </section>
        </div>
        <aside className="experience-plan" id="experience-plan">
          <form onSubmit={reserve} noValidate>
            <span className="experience-plan-kicker">
              <Ticket size={15} />
              {c.sample}
            </span>
            <h2>{c.planTitle}</h2>
            <div className="experience-plan-price">
              <strong>${e.price}</strong>
              <span>{c.perPerson}</span>
              <small>USD</small>
            </div>
            <div className="experience-plan-dates">
              <label>
                {c.date}
                <input
                  type="date"
                  required
                  min={todayISO()}
                  value={date}
                  aria-label={c.date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setError("");
                  }}
                />
              </label>
              <label>
                {c.time}
                <select
                  value={time}
                  aria-label={c.time}
                  onChange={(event) => {
                    setTime(event.target.value);
                    setError("");
                  }}
                >
                  {experienceTimes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="experience-people">
              <span>
                <strong>{c.people}</strong>
                <small>
                  {e.maxGuests} {c.group}
                </small>
              </span>
              <div>
                <button
                  type="button"
                  disabled={people <= 1}
                  onClick={() => setPeople((p) => p - 1)}
                  aria-label={`${c.people} −`}
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  value={people}
                  min={1}
                  max={e.maxGuests}
                  aria-label={c.people}
                  onChange={(event) => setPeople(Number(event.target.value))}
                />
                <button
                  type="button"
                  disabled={people >= e.maxGuests}
                  onClick={() => setPeople((p) => p + 1)}
                  aria-label={`${c.people} +`}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            {e.menu && (
              <div className="experience-plan-picks">
                <UtensilsCrossed size={14} />
                {selected.length} {c.savedDishes}
                <small>{c.menuIncluded}</small>
              </div>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="btn btn-primary experience-reserve"
            >
              {c.plan}
              <ArrowRight size={17} />
            </button>
            <span className="experience-no-charge">
              <ShieldCheck size={13} />
              {c.noCharge}
            </span>
            <div className="experience-total">
              <span>
                ${e.price} × {people} {c.person}
              </span>
              <strong>${Number.isFinite(total) ? total : 0} USD</strong>
            </div>
            <p className="experience-fee-note">{c.feeNote}</p>
            <div className="experience-plan-total">
              <strong>{c.total}</strong>
              <strong>${Number.isFinite(total) ? total : 0} USD</strong>
            </div>
            <p className="experience-plan-demo">{c.demo}</p>
          </form>
        </aside>
      </div>
      {plan && (
        <Confirmation
          experience={e}
          plan={plan}
          lang={lang}
          onClose={() => setPlan(null)}
          onExplore={() => {
            setPlan(null);
            onNavigate("/experiences");
          }}
        />
      )}
    </article>
  );
}
export default function Experiences({
  route,
  lang,
  onNavigate,
}: {
  route: string;
  lang: Lang;
  onNavigate: (path: string) => void;
}) {
  const path = route.split("?")[0];
  if (path === "/experiences")
    return (
      <ExperiencesList route={route} lang={lang} onNavigate={onNavigate} />
    );
  const e = experiences.find((e) => e.id === path.split("/")[2]);
  if (e)
    return (
      <ExperienceDetail
        key={e.id}
        experience={e}
        lang={lang}
        onNavigate={onNavigate}
      />
    );
  return (
    <div className="empty-state">
      <Compass size={32} />
      <h1>{experienceCopy[lang].unknown}</h1>
      <button
        className="btn btn-primary"
        onClick={() => onNavigate("/experiences")}
      >
        {experienceCopy[lang].back}
      </button>
    </div>
  );
}
