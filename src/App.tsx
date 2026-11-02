import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Globe2,
  Heart,
  House,
  Leaf,
  MapPin,
  Menu,
  Moon,
  Mountain,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Trees,
  Users,
  Waves,
  X,
  GitCompareArrows,
  Wallet,
  Plus,
  Minus,
  TentTree,
  Building2,
  BadgeCheck,
} from "lucide-react";
import { cities } from "./data";
import { catalog as sourceListings, countries, countryFor } from "./countries";
import type { CountryCode } from "./countries";
import Logo from "./Logo";
import { worldCopy } from "./worldContent";
const WorldDiscovery = lazy(() => import("./WorldDiscovery"));
import type { Listing } from "./data";
import { translations } from "./i18n";
import type { Lang } from "./i18n";
import ListingDetail from "./ListingDetail";
import { CompareView, SplitView } from "./Extras";
import { todayISO, validateBooking } from "./booking";
import { extraCopy } from "./content";

const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const listings: Listing[] = sourceListings.map((listing) => ({
  ...listing,
  images: listing.images.map(asset),
}));
const categories = [
  { id: "all", icon: Compass },
  { id: "cabin", icon: Mountain },
  { id: "villa", icon: Waves },
  { id: "apartment", icon: Building2 },
  { id: "cottage", icon: Trees },
  { id: "tiny", icon: TentTree },
];
function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return initial;
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(initial)) {
        return (
          Array.isArray(parsed)
            ? parsed.filter((item) => typeof item === "string")
            : initial
        ) as T;
      }
      return typeof parsed === typeof initial ? (parsed as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Keep the current session usable when browser storage is unavailable. */
    }
  }, [key, value]);
  return [value, setValue] as const;
}
function App() {
  const [lang, setLang] = useStored<Lang>("zzzlep-language", "az");
  const [dark, setDark] = useStored("zzzlep-dark", false);
  const [favorites, setFavorites] = useStored<string[]>("zzzlep-favorites", []);
  const [compared, setCompared] = useStored<string[]>("zzzlep-compared", []);
  const [route, setRoute] = useState(location.hash.slice(1) || "/");
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [worldRequested, setWorldRequested] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const [languageMenu, setLanguageMenu] = useState(false);
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(600);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [limit, setLimit] = useState(8);
  const [toast, setToast] = useState("");
  const [info, setInfo] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [formError, setFormError] = useState("");
  const [searchError, setSearchError] = useState("");
  const resultsRef = useRef<HTMLElement>(null);
  const safeLang: Lang = ["az", "en", "ru"].includes(lang) ? lang : "az";
  const copy = extraCopy[safeLang];
  const t = (key: string) =>
    (copy as Record<string, string>)[key] || translations[safeLang][key] || key;
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.lang = safeLang;
  }, [dark, safeLang]);
  useEffect(() => {
    const change = () => {
      setRoute(location.hash.slice(1) || "/");
      setMenu(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
        setInfo("");
        setLanguageMenu(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    document.body.style.overflow = filterOpen || info ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterOpen, info]);
  useEffect(() => {
    if (!filterOpen && !info) return;
    const previous = document.activeElement as HTMLElement | null;
    const shell = document.querySelector<HTMLElement>(".site-shell");
    if (shell) shell.inert = true;
    const dialog = document.querySelector<HTMLElement>(
      ".filter-modal,.info-modal",
    );
    const controls = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button,input,select,a[href],[tabindex="0"]',
        ) || [],
      ).filter((el) => !el.hasAttribute("disabled"));
    controls()[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const all = controls();
      if (!all.length) return;
      const first = all[0],
        last = all[all.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      if (shell) shell.inert = false;
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [filterOpen, info]);
  const go = (path: string) => {
    if (location.hash === `#${path}`) {
      setRoute(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else location.hash = path;
  };
  const toggleFavorite = (id: string) => {
    setFavorites((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
    );
    setToast(t(favorites.includes(id) ? "savedRemoved" : "savedAdded"));
  };
  const toggleCompare = (id: string) => {
    if (compared.includes(id)) {
      setCompared((old) => old.filter((x) => x !== id));
      setToast(t("compareRemoved"));
    } else if (compared.length >= 3) setToast(t("compareLimit"));
    else {
      setCompared((old) => [...old, id]);
      setToast(t("compareAdded"));
    }
  };
  const reset = () => {
    setCity("");
    setGuests(1);
    setMaxPrice(600);
    setAmenities([]);
    setCategory("all");
    setCheckIn("");
    setCheckOut("");
    setLimit(8);
    setSort("recommended");
  };
  useEffect(() => {
    if (route === "/favorites" || route === "/") reset();
  }, [route]);
  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    if (
      (checkIn || checkOut) &&
      validateBooking({ checkIn, checkOut, guests, maxGuests: 12 })
    ) {
      setSearchError(
        safeLang === "az"
          ? "Giriş və çıxış tarixlərini düzgün seçin."
          : safeLang === "en"
            ? "Choose valid arrival and departure dates."
            : "Выберите корректные даты заезда и выезда.",
      );
      return;
    }
    setSearchError("");
    setLimit(8);
    go(route.startsWith("/country/") ? route : "/search");
  };
  const isFavorites = route === "/favorites";
  const routeCountry = route.startsWith("/country/")
    ? countryFor(route.split("/")[2])
    : undefined;
  const country = routeCountry || countryFor("AZ")!;
  const selectCountry = (code: CountryCode) => {
    reset();
    go(`/country/${code}`);
  };
  const openWorld = () => {
    setWorldRequested(true);
    if (route !== "/") go("/");
    setMenu(false);
  };
  useEffect(() => {
    if (!worldRequested || route !== "/") return;
    const scroll = () => {
      const section = document.getElementById("world");
      if (!section) return false;
      section.scrollIntoView({behavior:"smooth"});
      setWorldRequested(false);
      return true;
    };
    if (scroll()) return;
    const observer = new MutationObserver(() => { if(scroll()) observer.disconnect(); });
    observer.observe(document.body,{childList:true,subtree:true});
    return () => observer.disconnect();
  }, [worldRequested,route]);
  const countryName = (code: string) =>
    countryFor(code)?.name[safeLang] || code;
  const availableCities =
    country.code === "AZ"
      ? cities
      : Array.from(
          new Set(
            listings
              .filter((l) => l.country === country.code)
              .map((l) => l.city),
          ),
        );
  const isSearch = route === "/search" || !!routeCountry;
  const isHome = route === "/";
  const result = listings
    .filter(
      (l) =>
        (!isFavorites || favorites.includes(l.id)) &&
        (isFavorites || l.country === country.code) &&
        (!city || l.city === city) &&
        (category === "all" || l.type === category) &&
        l.price <= maxPrice &&
        l.guests >= guests &&
        amenities.every((a) => l.amenities.includes(a)),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "rating"
            ? b.rating - a.rating
            : 0,
    );
  const selected = route.startsWith("/listing/")
    ? listings.find((l) => l.id === route.split("/")[2])
    : undefined;
  const cityNames: Record<string, Record<Lang, string>> = {
    Bakı: { az: "Bakı", en: "Baku", ru: "Баку" },
    Quba: { az: "Quba", en: "Guba", ru: "Губа" },
    Qəbələ: { az: "Qəbələ", en: "Gabala", ru: "Габала" },
    Şəki: { az: "Şəki", en: "Sheki", ru: "Шеки" },
    Şamaxı: { az: "Şamaxı", en: "Shamakhi", ru: "Шамахы" },
    Lənkəran: { az: "Lənkəran", en: "Lankaran", ru: "Ленкорань" },
  };
  const cityName = (name: string) => cityNames[name]?.[safeLang] || name;
  const amenityNames: Record<string, string> = {
    wifi: "Wi-Fi",
    parking:
      safeLang === "az"
        ? "Parkinq"
        : safeLang === "en"
          ? "Free parking"
          : "Парковка",
    pool: safeLang === "az" ? "Hovuz" : safeLang === "en" ? "Pool" : "Бассейн",
    kitchen:
      safeLang === "az" ? "Mətbəx" : safeLang === "en" ? "Kitchen" : "Кухня",
    fireplace:
      safeLang === "az" ? "Kamin" : safeLang === "en" ? "Fireplace" : "Камин",
    ac:
      safeLang === "az"
        ? "Kondisioner"
        : safeLang === "en"
          ? "Air conditioning"
          : "Кондиционер",
    bbq:
      safeLang === "az" ? "Mangal" : safeLang === "en" ? "Barbecue" : "Мангал",
    desk:
      safeLang === "az"
        ? "İş masası"
        : safeLang === "en"
          ? "Workspace"
          : "Рабочее место",
  };
  const scrollResults = () =>
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const renderCard = (l: Listing, i: number) => (
    <article
      className="stay-card"
      key={l.id}
      style={{ animationDelay: `${(i % 4) * 70}ms` }}
    >
      <div className="stay-image">
        <a href={`#/listing/${l.id}`} aria-label={l.title[safeLang]}>
          <img
            src={l.images[0]}
            alt={l.title[safeLang]}
            loading={i < 4 ? "eager" : "lazy"}
          />
        </a>
        {i % 3 !== 2 && (
          <span className="guest-favorite">
            <BadgeCheck size={13} />
            {t("topChoice")}
          </span>
        )}
        <button
          className={`heart-button ${favorites.includes(l.id) ? "is-saved" : ""}`}
          onClick={() => toggleFavorite(l.id)}
          aria-label={`${t("favorites")}: ${l.title[safeLang]}`}
          aria-pressed={favorites.includes(l.id)}
        >
          <Heart size={20} />
        </button>
        <button
          className={`card-compare ${compared.includes(l.id) ? "active" : ""}`}
          onClick={() => toggleCompare(l.id)}
          aria-label={`${t("compare")}: ${l.title[safeLang]}`}
          aria-pressed={compared.includes(l.id)}
        >
          <GitCompareArrows size={16} />
        </button>
        <div className="photo-dots">
          <i className="active" />
          <i />
          <i />
        </div>
      </div>
      <div className="stay-meta">
        <span>
          <MapPin size={13} />
          {cityName(l.city)}, {countryName(l.country)}
        </span>
        <span className="stay-rating">
          <Star size={13} fill="currentColor" />
          {l.rating.toFixed(2)}
        </span>
      </div>
      <a className="stay-title" href={`#/listing/${l.id}`}>
        {l.title[safeLang]}
      </a>
      <p className="stay-capacity">
        {l.guests} {t("guests").toLocaleLowerCase(safeLang)} <span>·</span>{" "}
        {l.bedrooms} {t("bedrooms").toLocaleLowerCase(safeLang)}
      </p>
      <div className="stay-price">
        <strong>{l.price} ₼</strong>
        <span>/ {t("night")}</span>
        <a href={`#/listing/${l.id}`} aria-label={t("details")}>
          <ArrowUpRight size={19} />
        </a>
      </div>
    </article>
  );
  return (
    <>
      <div className="site-shell">
        <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
          <div className="header-inner">
            <a className="brand" href="#/" aria-label="Zzzlep">
              <Logo />
            </a>
            <nav className="desktop-nav" aria-label="Main navigation">
              <a
                className={isHome || isSearch || selected ? "active" : ""}
                href="#/"
              >
                {t("discover")}
              </a>
              <button className="world-nav-link" onClick={openWorld}>
                <Globe2 size={14} />
                {worldCopy[safeLang].nav}
              </button>
              <a className={isFavorites ? "active" : ""} href="#/favorites">
                {t("favorites")}
                {favorites.length > 0 && (
                  <span className="nav-count">{favorites.length}</span>
                )}
              </a>
              <a className={route === "/split" ? "active" : ""} href="#/split">
                {t("split")}
              </a>
            </nav>
            <div className="header-actions">
              <button className="host-link" onClick={() => setInfo("host")}>
                {t("host")}
                <ArrowUpRight size={15} />
              </button>
              <div className="language-wrap">
                <button
                  className="language-button"
                  onClick={() => setLanguageMenu(!languageMenu)}
                  aria-expanded={languageMenu}
                  aria-label={translations[safeLang].language}
                >
                  <Globe2 size={17} />
                  <span>{safeLang.toUpperCase()}</span>
                  <ChevronDown size={12} />
                </button>
                {languageMenu && (
                  <div className="language-dropdown">
                    {(["az", "en", "ru"] as Lang[]).map((value) => (
                      <button
                        key={value}
                        onClick={() => {
                          setLang(value);
                          setLanguageMenu(false);
                        }}
                      >
                        {value === "az"
                          ? "Azərbaycanca"
                          : value === "en"
                            ? "English"
                            : "Русский"}
                        {safeLang === value && <Check size={15} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="header-divider" />
              <button
                className="icon-button theme-button"
                onClick={() => setDark(!dark)}
                aria-label={
                  dark
                    ? translations[safeLang].lightMode
                    : translations[safeLang].darkMode
                }
              >
                {dark ? <Sun size={19} /> : <Moon size={19} />}
              </button>
              <button
                className="mobile-toggle icon-button"
                onClick={() => setMenu(!menu)}
                aria-label={
                  safeLang === "az"
                    ? "Menyu"
                    : safeLang === "ru"
                      ? "Меню"
                      : "Menu"
                }
                aria-expanded={menu}
              >
                {menu ? <X /> : <Menu />}
              </button>
            </div>
          </div>
          {menu && (
            <nav className="mobile-menu" onClick={() => setMenu(false)}>
              <a href="#/">{t("discover")}</a>
              <button onClick={openWorld}>
                <Globe2 size={16} />
                {worldCopy[safeLang].nav}
              </button>
              <a href="#/favorites">
                {t("favorites")} ({favorites.length})
              </a>
              <a href="#/compare">
                {t("compare")} ({compared.length})
              </a>
              <a href="#/split">{t("split")}</a>
              <button
                onClick={() => {
                  setMenu(false);
                  setInfo("host");
                }}
              >
                {t("host")}
              </button>
            </nav>
          )}
        </header>
        <main>
          {isHome && (
            <>
              <section className="hero-section container">
                <div className="hero">
                  <img
                    className="hero-image"
                    src={asset("/images/hero.jpg")}
                    alt={
                      safeLang === "az"
                        ? "Təbiət qoynunda sakit istirahət məkanı"
                        : safeLang === "en"
                          ? "A peaceful escape in nature"
                          : "Спокойный отдых на природе"
                    }
                  />
                  <div className="hero-shade" />
                  <div className="hero-content">
                    <span className="hero-eyebrow">
                      <span />
                      {t("heroBadge")}
                    </span>
                    <h1>
                      {t("heroLine")}
                      <br />
                      <span>{t("heroAccent")}</span>
                    </h1>
                    <p>{t("heroText")}</p>
                    <div className="hero-social">
                      <div className="guest-avatars">
                        {["A", "L", "N"].map((n) => (
                          <span key={n}>{n}</span>
                        ))}
                      </div>
                      <div>
                        <div className="tiny-stars">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} size={10} fill="currentColor" />
                          ))}
                        </div>
                        <span>
                          {safeLang === "az"
                            ? "Kiçik qaçışlar, böyük təbəssümlər"
                            : safeLang === "en"
                              ? "Little escapes, lasting smiles"
                              : "Маленькие поездки, большие улыбки"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hero-location">
                    <span className="location-icon">
                      <MapPin size={18} />
                    </span>
                    <div>
                      <strong>
                        {safeLang === "az"
                          ? "Təbiətə bir addım yaxın"
                          : safeLang === "en"
                            ? "A little closer to nature"
                            : "Чуть ближе к природе"}
                      </strong>
                      <span>
                        {safeLang === "az"
                          ? "Növbəti hekayənin başlanğıcı"
                          : safeLang === "en"
                            ? "Your next story starts here"
                            : "Здесь начинается ваша история"}
                      </span>
                    </div>
                    <ArrowUpRight size={18} />
                  </div>
                  <span className="hero-image-credit">
                    Z Z Z L E P · A Z E R B A I J A N
                  </span>
                </div>
              </section>
            </>
          )}
          {(isHome || isSearch) && (
            <section
              className={`search-section container ${isSearch ? "search-page-bar" : ""}`}
            >
              <form className="search-bar" onSubmit={onSearch}>
                <label className="search-field destination-field">
                  <MapPin size={20} />
                  <span>
                    <b>{t("where")}</b>
                    <select
                      aria-label={t("where")}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="">{t("searchHint")}</option>
                      {availableCities.map((c) => (
                        <option key={c} value={c}>
                          {cityName(c)}
                        </option>
                      ))}
                    </select>
                  </span>
                  <ChevronDown size={14} />
                </label>
                <label className="search-field">
                  <CalendarDays size={19} />
                  <span>
                    <b>{t("checkIn")}</b>
                    <input
                      type="date"
                      aria-label={t("checkIn")}
                      min={todayISO()}
                      value={checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        if (checkOut && checkOut <= e.target.value)
                          setCheckOut("");
                      }}
                    />
                  </span>
                </label>
                <label className="search-field">
                  <CalendarDays size={19} />
                  <span>
                    <b>{t("checkOut")}</b>
                    <input
                      type="date"
                      aria-label={t("checkOut")}
                      min={checkIn || todayISO()}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </span>
                </label>
                <label className="search-field guest-field">
                  <Users size={19} />
                  <span>
                    <b>{t("guests")}</b>
                    <select
                      aria-label={t("guests")}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {t("people")}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
                <button type="submit" className="search-submit">
                  <Search size={19} />
                  <span>{t("search")}</span>
                  <ArrowRight size={17} />
                </button>
              </form>
              {searchError && (
                <p className="form-error" role="alert">
                  {searchError}
                </p>
              )}
            </section>
          )}
          {(isHome || isSearch || isFavorites) && (
            <div className="container">
              <div className="discovery-toolbar">
                <div className="category-list">
                  {categories.map(({ id, icon: Icon }) => (
                    <button
                      key={id}
                      className={`category ${category === id ? "active" : ""}`}
                      onClick={() => {
                        setCategory(id);
                        setLimit(8);
                      }}
                    >
                      <Icon size={23} strokeWidth={1.55} />
                      <span>{t(id)}</span>
                    </button>
                  ))}
                </div>
                <button
                  className={`filter-button ${amenities.length || maxPrice < 600 ? "has-filters" : ""}`}
                  onClick={() => setFilterOpen(true)}
                >
                  <SlidersHorizontal size={17} />
                  {t("filter")}
                  {(amenities.length > 0 || maxPrice < 600) && (
                    <span>{amenities.length + (maxPrice < 600 ? 1 : 0)}</span>
                  )}
                </button>
              </div>
            </div>
          )}
          {isSearch && (
            <nav
              className="country-result-tabs container"
              aria-label={worldCopy[safeLang].browse}
            >
              {countries.map((item) => (
                <button
                  key={item.code}
                  className={country.code === item.code ? "active" : ""}
                  onClick={() => selectCountry(item.code)}
                >
                  <img src={asset(item.image)} alt="" />
                  {item.name[safeLang]}
                </button>
              ))}
            </nav>
          )}
          {(isHome || isSearch || isFavorites) && (
            <section className="listings-section container" ref={resultsRef}>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    {isFavorites
                      ? t("favorites")
                      : isSearch
                        ? routeCountry
                          ? worldCopy[safeLang].nav
                          : t("explore")
                        : t("curated")}
                  </span>
                  <h2>
                    {isFavorites
                      ? t("savedTitle")
                      : isSearch
                        ? `${city ? cityName(city) : country.name[safeLang]} · ${result.length} ${t("results")}`
                        : t("staysTitle")}
                  </h2>
                  <p>
                    {isFavorites
                      ? t("savedSubtitle")
                      : isSearch
                        ? `${checkIn && checkOut ? `${checkIn} — ${checkOut} · ` : ""}${guests} ${t("people")}`
                        : t("staysSubtitle")}
                  </p>
                </div>
                {isHome ? (
                  <button
                    className="text-link"
                    onClick={() => {
                      go("/search");
                    }}
                  >
                    {t("viewAll")}
                    <ArrowUpRight size={18} />
                  </button>
                ) : (
                  <label className="sort-select">
                    <ArrowDown size={15} />
                    <select
                      aria-label={t("recommended")}
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="recommended">{t("recommended")}</option>
                      <option value="low">{t("priceLow")}</option>
                      <option value="high">{t("priceHigh")}</option>
                      <option value="rating">{t("rating")}</option>
                    </select>
                    <ChevronDown size={13} />
                  </label>
                )}
              </div>
              {result.length ? (
                <>
                  <div className="stay-grid">
                    {result.slice(0, limit).map(renderCard)}
                  </div>
                  <div className="load-more">
                    {limit < result.length ? (
                      <button
                        className="btn btn-outline"
                        onClick={() => setLimit((n) => n + 8)}
                      >
                        {t("showMore")}
                        <ArrowRight size={17} />
                      </button>
                    ) : (
                      <span>
                        {t("allSeen")}
                        <Check size={15} />
                      </span>
                    )}
                    <small>
                      {t("showing")} {Math.min(limit, result.length)} /{" "}
                      {result.length} {t("stays")}
                    </small>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">
                    {isFavorites ? <Heart size={32} /> : <Search size={32} />}
                  </span>
                  <h3>{isFavorites ? t("savedEmpty") : t("empty")}</h3>
                  <p>{isFavorites ? t("savedEmptyText") : t("emptyText")}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      reset();
                      if (isFavorites) go("/");
                    }}
                  >
                    {t("startOver")}
                    <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </section>
          )}
          {isHome && (
            <>
              <Suspense fallback={<div className="world-loading container" />}>
                <WorldDiscovery lang={safeLang} onSelect={selectCountry} />
              </Suspense>
              <section className="destinations-section">
                <div className="container">
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">{t("destEyebrow")}</span>
                      <h2>{t("placesTitle")}</h2>
                      <p>{t("placesSubtitle")}</p>
                    </div>
                    <span className="destination-decoration">
                      <Compass size={37} strokeWidth={1} />
                    </span>
                  </div>
                  <div className="destination-grid">
                    {cities.map((c, i) => (
                      <button
                        className="destination-card"
                        key={c}
                        onClick={() => {
                          reset();
                          setCity(c);
                          go("/search");
                        }}
                      >
                        <img
                          src={asset(`/images/city-${i + 1}.jpg`)}
                          alt={cityName(c)}
                          loading="lazy"
                        />
                        <span className="destination-gradient" />
                        <span className="destination-text">
                          <strong>{cityName(c)}</strong>
                          <small>
                            {listings.filter((l) => l.city === c).length}{" "}
                            {t("stays")}
                          </small>
                        </span>
                        <span className="destination-arrow">
                          <ArrowUpRight size={18} />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
              <section className="trust-section container">
                <div>
                  <span className="trust-icon">
                    <House size={25} strokeWidth={1.5} />
                  </span>
                  <span>
                    <strong>{t("trust1")}</strong>
                    <small>
                      {safeLang === "az"
                        ? "Hər zövqə uyğun, sevgi ilə seçilmiş."
                        : safeLang === "en"
                          ? "Carefully chosen, for every kind of you."
                          : "Выбраны с заботой, на любой вкус."}
                    </small>
                  </span>
                </div>
                <div>
                  <span className="trust-icon">
                    <ShieldCheck size={25} strokeWidth={1.5} />
                  </span>
                  <span>
                    <strong>{t("trust2")}</strong>
                    <small>
                      {safeLang === "az"
                        ? "Sürprizlər səfərində olsun, qiymətdə yox."
                        : safeLang === "en"
                          ? "Keep the surprises for the journey."
                          : "Сюрпризы в поездке, а не в цене."}
                    </small>
                  </span>
                </div>
                <div>
                  <span className="trust-icon">
                    <Heart size={25} strokeWidth={1.5} />
                  </span>
                  <span>
                    <strong>{t("trust3")}</strong>
                    <small>
                      {safeLang === "az"
                        ? "Özünü qonaq yox, evində hiss et."
                        : safeLang === "en"
                          ? "Feel a little less like a guest."
                          : "Почувствуйте себя как дома."}
                    </small>
                  </span>
                </div>
              </section>
              <section className="editorial-section container">
                <div className="editorial-copy">
                  <span className="eyebrow">
                    <Moon size={16} />
                    {safeLang === "az"
                      ? "BİR AZ FASİLƏ YAXŞI GƏLƏR"
                      : safeLang === "en"
                        ? "MAKE ROOM FOR A LITTLE SLOW"
                        : "ВРЕМЯ НЕМНОГО ЗАМЕДЛИТЬСЯ"}
                  </span>
                  <h2>{t("bannerTitle")}</h2>
                  <p>{t("bannerText")}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      reset();
                      go("/search");
                    }}
                  >
                    {t("bannerCta")}
                    <ArrowUpRight size={17} />
                  </button>
                  <span className="editorial-sparkle">✦</span>
                </div>
                <div className="editorial-image">
                  <img
                    src={asset("/images/stay-3.jpg")}
                    alt={
                      safeLang === "az"
                        ? "Sakit istirahət üçün xüsusi ev"
                        : safeLang === "en"
                          ? "A thoughtfully chosen home for your escape"
                          : "Уютный дом для вашего отдыха"
                    }
                    loading="lazy"
                  />
                  <span className="image-note">
                    <Leaf size={16} />
                    {safeLang === "az"
                      ? "Tələsməməyə icazən var."
                      : safeLang === "en"
                        ? "Permission to slow down."
                        : "Можно никуда не спешить."}
                  </span>
                </div>
              </section>
            </>
          )}
          {selected && (
            <div className="container detail-container">
              <ListingDetail
                key={selected.id}
                initialCheckIn={checkIn}
                initialCheckOut={checkOut}
                initialGuests={guests}
                listing={selected}
                lang={safeLang}
                t={t}
                favorite={favorites.includes(selected.id)}
                onFavorite={() => toggleFavorite(selected.id)}
                onCompare={() => toggleCompare(selected.id)}
                onBack={() => go(selected.country === "AZ" ? "/search" : `/country/${selected.country}`)}
              />
            </div>
          )}
          {route === "/compare" && (
            <section className="container inner-page">
              <button className="back-link" onClick={() => go("/")}>
                <ChevronLeft size={17} />
                {t("back")}
              </button>
              <span className="eyebrow">{t("compare")}</span>
              <h1>{t("compareTitle")}</h1>
              <CompareView
                items={listings.filter((l) => compared.includes(l.id))}
                lang={safeLang}
                onRemove={toggleCompare}
                onExplore={() => go("/search")}
                onOpen={(id) => go(`/listing/${id}`)}
              />
            </section>
          )}
          {route === "/split" && (
            <section className="container inner-page">
              <button className="back-link" onClick={() => go("/")}>
                <ChevronLeft size={17} />
                {t("back")}
              </button>
              <span className="eyebrow">{t("split")}</span>
              <h1>{t("splitTitle")}</h1>
              <SplitView listings={listings} lang={safeLang} />
            </section>
          )}
          {!isHome &&
            !isSearch &&
            !isFavorites &&
            !selected &&
            route !== "/compare" &&
            route !== "/split" && (
              <div className="empty-state">
                <Compass size={40} />
                <h1>404</h1>
                <p>{t("empty")}</p>
                <button className="btn btn-primary" onClick={() => go("/")}>
                  {t("discover")}
                </button>
              </div>
            )}
        </main>
        <section className="newsletter container">
          <div>
            <span className="newsletter-icon">
              <Sparkles size={25} strokeWidth={1.5} />
            </span>
            <div>
              <h3>{t("newsletter")}</h3>
              <p>{t("newsletterText")}</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setFormError(t("invalidEmail"));
                return;
              }
              setSubscribed(true);
              setFormError("");
            }}
          >
            {subscribed ? (
              <span className="subscription-success" role="status">
                <Check size={18} />
                {t("subscribed")}
              </span>
            ) : (
              <>
                <div className="email-input">
                  <input
                    type="email"
                    required
                    aria-label={t("emailPlaceholder")}
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" aria-label={t("subscribe")}>
                    <ArrowRight size={20} />
                  </button>
                </div>
                {formError && <small className="form-error">{formError}</small>}
              </>
            )}
          </form>
        </section>
        <footer className="footer">
          <div className="footer-main container">
            <div className="footer-brand">
              <a href="#/" aria-label="Zzzlep">
                <Logo />
              </a>
              <p>{t("footerAbout")}</p>
              <span className="footer-tag">
                <MapPin size={12} />
                {translations[safeLang].madeWith}
              </span>
            </div>
            <div className="footer-column">
              <h4>{t("footerExplore")}</h4>
              <a href="#/search" onClick={() => reset()}>
                {t("viewAll")}
              </a>
              <a href="#/favorites">{t("favorites")}</a>
              <a href="#/compare">{t("compare")}</a>
            </div>
            <div className="footer-column">
              <h4>{t("footerZzzlep")}</h4>
              <button onClick={() => setInfo("about")}>{t("about")}</button>
              <a href="#/split">{t("split")}</a>
              <button onClick={() => setInfo("host")}>{t("host")}</button>
            </div>
            <div className="footer-column">
              <h4>{t("footerSupport")}</h4>
              <button onClick={() => setInfo("faq")}>{t("help")}</button>
              <button onClick={() => setInfo("privacy")}>{t("privacy")}</button>
              <button onClick={() => setInfo("terms")}>{t("terms")}</button>
            </div>
          </div>
          <div className="footer-bottom container">
            <span>{t("copyright")}</span>
            <span>
              <Globe2 size={14} />
              {safeLang === "az"
                ? "Azərbaycan"
                : safeLang === "en"
                  ? "Azerbaijan"
                  : "Азербайджан"}{" "}
              <span>·</span> AZN ₼
            </span>
          </div>
          <div className="demo-notice">
            <span />
            {t("demo")}
          </div>
        </footer>
      </div>
      {compared.length > 0 && route !== "/compare" && (
        <div className="compare-tray">
          <div className="compare-thumbnails">
            {listings
              .filter((l) => compared.includes(l.id))
              .map((l) => (
                <img key={l.id} src={l.images[0]} alt={l.title[safeLang]} />
              ))}
          </div>
          <button onClick={() => go("/compare")}>
            {t("compare")}
            <span>{compared.length}/3</span>
            <ArrowRight size={17} />
          </button>
          <button
            className="tray-close"
            onClick={() => setCompared([])}
            aria-label={t("close")}
          >
            <X size={17} />
          </button>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
        </div>
      )}
      {filterOpen && (
        <div className="modal-backdrop" onClick={() => setFilterOpen(false)}>
          <section
            className="filter-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">ZZZLEP</span>
                <h2 id="filter-title">{t("filter")}</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setFilterOpen(false)}
                aria-label={t("close")}
              >
                <X size={21} />
              </button>
            </div>
            <div className="filter-content">
              <div className="filter-price-label">
                <h3>{t("maxPrice")}</h3>
                <strong>{maxPrice} ₼</strong>
              </div>
              <div className="price-histogram">
                {[
                  20, 30, 24, 44, 50, 65, 76, 85, 92, 83, 97, 86, 74, 78, 65,
                  55, 62, 46, 35, 40, 26, 31, 20, 14,
                ].map((v, i) => (
                  <i
                    key={i}
                    style={{
                      height: `${v}%`,
                      opacity: (i / 24) * 600 < maxPrice ? 1 : 0.25,
                    }}
                  />
                ))}
              </div>
              <input
                className="price-slider"
                type="range"
                min="50"
                max="600"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
                aria-label={t("maxPrice")}
              />
              <div className="range-labels">
                <span>50 ₼</span>
                <span>600 ₼</span>
              </div>
              <h3>{t("amenities")}</h3>
              <div className="amenity-options">
                {Object.entries(amenityNames).map(([key, label]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={amenities.includes(key)}
                      onChange={() =>
                        setAmenities((old) =>
                          old.includes(key)
                            ? old.filter((x) => x !== key)
                            : [...old, key],
                        )
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="text-link"
                onClick={() => {
                  setMaxPrice(600);
                  setAmenities([]);
                }}
              >
                {t("reset")}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setFilterOpen(false);
                  setLimit(8);
                }}
              >
                {t("apply")} ({result.length})<ArrowRight size={17} />
              </button>
            </div>
          </section>
        </div>
      )}
      {info && (
        <div className="modal-backdrop" onClick={() => setInfo("")}>
          <section
            className="info-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="icon-button modal-close"
              onClick={() => setInfo("")}
              aria-label={t("close")}
            >
              <X />
            </button>
            <span className="info-icon">
              {info === "host" ? (
                <House size={32} />
              ) : info === "about" ? (
                <Moon size={32} />
              ) : (
                <ShieldCheck size={32} />
              )}
            </span>
            <span className="eyebrow">ZZZLEP</span>
            <h2 id="info-title">
              {info === "host"
                ? t("hostTitle")
                : info === "about"
                  ? t("bannerTitle")
                  : info === "faq"
                    ? t("faqTitle")
                    : t(info)}
            </h2>
            <p>
              {info === "host"
                ? t("hostText")
                : info === "about"
                  ? t("bannerText")
                  : info === "faq"
                    ? t("faqAnswer")
                    : t(`${info}Text`)}
            </p>
            {info === "about" && <p className="info-demo">{t("demo")}</p>}
            <button className="btn btn-primary" onClick={() => setInfo("")}>
              {t("close")}
              <Check size={17} />
            </button>
          </section>
        </div>
      )}
    </>
  );
}
export default App;
