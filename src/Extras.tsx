import { priceInAZN } from "./currency";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Coins,
  Heart,
  Minus,
  Plus,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import type { Listing } from "./data";
import type { Lang } from "./i18n";
import "./extras.css";

const copy = {
  az: {
    empty: "Hər evin öz hekayəsi var.",
    emptyDescription:
      "Sizə ən uyğun olanı tapmaq üçün 3-dək evi müqayisəyə əlavə edin.",
    explore: "Evləri kəşf et",
    best: "Ən sərfəli",
    remove: "Müqayisədən çıxar",
    view: "Evə bax",
    night: "gecə",
    price: "Gecəlik qiymət",
    guests: "Qonaq sayı",
    bedrooms: "Yataq otaqları",
    beds: "Çarpayılar",
    rating: "Qonaq reytinqi",
    amenities: "Rahatlıqlar",
    people: "nəfər",
    reviews: "rəy",
    wifi: "Wi-Fi",
    parking: "Pulsuz parkinq",
    pool: "Hovuz",
    kitchen: "Mətbəx",
    ac: "Kondisioner",
    fireplace: "Kamin",
    bbq: "Mangal",
    desk: "İş masası",
    splitBadge: "Birlikdə daha gözəl",
    splitIntro: "Səfəri siz planlayın, hesabı biz bölək.",
    splitDescription:
      "Evinizi və tarixləri seçin. Xidmət haqqı daxil olmaqla hər kəsin payını əvvəlcədən görün.",
    chooseHome: "Qalacağınız ev",
    arrival: "Giriş tarixi",
    departure: "Çıxış tarixi",
    friends: "Neçə nəfərsiniz?",
    capacity: "Bu evdə maksimum",
    perPerson: "Hər nəfər üçün",
    total: "Ümumi məbləğ",
    accommodation: "Qalma xərci",
    fee: "Xidmət haqqı (5%)",
    nights: "gecə",
    priceNote:
      "Qiymətlər elanda göstərilən valyutadadır. Məbləğ seçdiyiniz tarixlər və qonaq sayına görə hesablanır.",
    plan: "Səfərin büdcəsi",
    notCharged: "Heç bir ödəniş tələb olunmur",
    demo: "Bu yalnız büdcə hesablamasıdır. Real ödəniş və ya rezervasiya aparılmır.",
    invalidDates: "Çıxış tarixi giriş tarixindən sonra olmalıdır.",
    pastDate: "Keçmiş tarix seçilə bilməz.",
    invalidPeople: "Nəfər sayı 1 ilə evin tutumu arasında olmalıdır.",
    pickDates: "Hər iki tarixi seçin.",
    splitBy: "Bölünür",
    dayTip: "Kiçik bir fasilə, böyük xatirələr.",
    dayTipText:
      "Dostlarla səfərdə ən gözəl şey xatirələri bölüşməkdir. Xərcləri bölmək isə bizlikdir.",
  },
  en: {
    empty: "Every home has a story.",
    emptyDescription: "Add up to 3 homes to compare and find your perfect fit.",
    explore: "Explore stays",
    best: "Best value",
    remove: "Remove from comparison",
    view: "View stay",
    night: "night",
    price: "Price per night",
    guests: "Guests",
    bedrooms: "Bedrooms",
    beds: "Beds",
    rating: "Guest rating",
    amenities: "Amenities",
    people: "guests",
    reviews: "reviews",
    wifi: "Wi-Fi",
    parking: "Free parking",
    pool: "Pool",
    kitchen: "Kitchen",
    ac: "Air conditioning",
    fireplace: "Fireplace",
    bbq: "Barbecue",
    desk: "Workspace",
    splitBadge: "Better together",
    splitIntro: "You plan the trip. We split the cost.",
    splitDescription:
      "Choose your home and dates. See everyone’s share upfront, including the service fee.",
    chooseHome: "Your chosen home",
    arrival: "Check-in",
    departure: "Check-out",
    friends: "How many of you?",
    capacity: "This home sleeps up to",
    perPerson: "Per person",
    total: "Total cost",
    accommodation: "Accommodation",
    fee: "Service fee (5%)",
    nights: "nights",
    priceNote:
      "Prices use the currency shown on the listing. Your estimate is based on your selected dates and group size.",
    plan: "Your trip budget",
    notCharged: "No payment required",
    demo: "This is a budget estimate only. No actual payment or booking takes place.",
    invalidDates: "Check-out must be after check-in.",
    pastDate: "Dates cannot be in the past.",
    invalidPeople: "Group size must be between 1 and the home’s capacity.",
    pickDates: "Please select both dates.",
    splitBy: "Shared between",
    dayTip: "A little getaway. A lot of memories.",
    dayTipText:
      "The best part of traveling with friends is sharing the memories. Leave sharing the costs to us.",
  },
  ru: {
    empty: "У каждого дома своя история.",
    emptyDescription:
      "Добавьте до 3 домов для сравнения и найдите свой идеальный вариант.",
    explore: "Найти жильё",
    best: "Лучшая цена",
    remove: "Убрать из сравнения",
    view: "Посмотреть дом",
    night: "ночь",
    price: "Цена за ночь",
    guests: "Количество гостей",
    bedrooms: "Спальни",
    beds: "Кровати",
    rating: "Оценка гостей",
    amenities: "Удобства",
    people: "гостей",
    reviews: "отзывов",
    wifi: "Wi-Fi",
    parking: "Бесплатная парковка",
    pool: "Бассейн",
    kitchen: "Кухня",
    ac: "Кондиционер",
    fireplace: "Камин",
    bbq: "Мангал",
    desk: "Рабочее место",
    splitBadge: "Вместе лучше",
    splitIntro: "Вы планируете поездку. Мы делим расходы.",
    splitDescription:
      "Выберите дом и даты. Узнайте долю каждого гостя заранее, включая сервисный сбор.",
    chooseHome: "Выбранный дом",
    arrival: "Заезд",
    departure: "Выезд",
    friends: "Сколько вас?",
    capacity: "Максимум гостей в этом доме:",
    perPerson: "На человека",
    total: "Общая стоимость",
    accommodation: "Проживание",
    fee: "Сервисный сбор (5%)",
    nights: "ночей",
    priceNote:
      "Цены указаны в валюте объявления. Расчёт зависит от выбранных дат и размера группы.",
    plan: "Бюджет поездки",
    notCharged: "Оплата не требуется",
    demo: "Это только расчёт бюджета. Реальная оплата и бронирование не производятся.",
    invalidDates: "Дата выезда должна быть позже даты заезда.",
    pastDate: "Нельзя выбрать прошедшую дату.",
    invalidPeople: "Число гостей должно быть от 1 до вместимости дома.",
    pickDates: "Выберите обе даты.",
    splitBy: "Делим на",
    dayTip: "Небольшой отдых. Большие воспоминания.",
    dayTipText:
      "Лучшее в путешествии с друзьями — общие воспоминания. А разделить расходы поможем мы.",
  },
};

const locales = { az: "az-AZ", en: "en-GB", ru: "ru-RU" };
const cityTranslations: Record<string, Record<Lang, string>> = {
  Bakı: { az: "Bakı", en: "Baku", ru: "Баку" },
  Quba: { az: "Quba", en: "Guba", ru: "Губа" },
  Qəbələ: { az: "Qəbələ", en: "Gabala", ru: "Габала" },
  Şəki: { az: "Şəki", en: "Sheki", ru: "Шеки" },
  Şamaxı: { az: "Şamaxı", en: "Shamakhi", ru: "Шамахы" },
  Lənkəran: { az: "Lənkəran", en: "Lankaran", ru: "Ленкорань" },
};
const cityLabel = (city: string, lang: Lang) =>
  cityTranslations[city]?.[lang] ?? city;
const money = (value: number, lang: Lang) =>
  new Intl.NumberFormat(locales[lang], { maximumFractionDigits: 2 }).format(
    value,
  );
const amenityKeys = [
  "wifi",
  "parking",
  "pool",
  "kitchen",
  "ac",
  "fireplace",
  "bbq",
  "desk",
] as const;

export function CompareView({
  items,
  lang,
  onRemove,
  onExplore,
  onOpen,
}: {
  items: Listing[];
  lang: Lang;
  onRemove: (id: string) => void;
  onExplore: () => void;
  onOpen: (id: string) => void;
}) {
  const c = copy[lang];
  if (!items.length)
    return (
      <div className="extras-empty">
        <span className="extras-empty-icon">
          <Scale size={34} strokeWidth={1.5} />
        </span>
        <h2>{c.empty}</h2>
        <p>{c.emptyDescription}</p>
        <button className="btn btn-primary" onClick={onExplore}>
          {c.explore}
          <ArrowRight size={18} />
        </button>
      </div>
    );
  const cheapest = Math.min(...items.map(priceInAZN));
  const rows = [
    {
      label: c.price,
      values: items.map((item) => (
        <span className="extras-price" key={item.id}>
          {money(item.price, lang)} <small>{item.currency || "AZN"}</small>
        </span>
      )),
    },
    {
      label: c.guests,
      values: items.map((item) => `${item.guests} ${c.people}`),
    },
    { label: c.bedrooms, values: items.map((item) => item.bedrooms) },
    { label: c.beds, values: items.map((item) => item.beds) },
    {
      label: c.rating,
      values: items.map((item) => (
        <span className="extras-rating" key={item.id}>
          ★ {item.rating.toFixed(2)}{" "}
          <small>
            ({item.reviews} {c.reviews})
          </small>
        </span>
      )),
    },
  ];
  return (
    <div className="extras-comparison-wrap">
      <table
        className="extras-comparison"
        aria-label={
          lang === "az"
            ? "Evlərin müqayisəsi"
            : lang === "ru"
              ? "Сравнение домов"
              : "Compare stays"
        }
      >
        <thead>
          <tr>
            <th className="extras-row-label">
              <Scale size={24} />
              <span>{items.length}/3</span>
            </th>
            {items.map((item) => (
              <th key={item.id}>
                <div className="extras-compare-home">
                  <div className="extras-compare-image">
                    <img src={item.images[0]} alt={item.title[lang]} />
                    <button
                      className="icon-button"
                      onClick={() => onRemove(item.id)}
                      aria-label={`${c.remove}: ${item.title[lang]}`}
                    >
                      <X size={17} />
                    </button>
                    {priceInAZN(item) === cheapest && (
                      <span className="extras-value-badge">
                        <Sparkles size={12} />
                        {c.best}
                      </span>
                    )}
                  </div>
                  <small>
                    {cityLabel(item.city, lang)}, {item.area}
                  </small>
                  <h3>{item.title[lang]}</h3>
                  <button
                    className="extras-view-link"
                    onClick={() => onOpen(item.id)}
                  >
                    {c.view}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {row.values.map((value, index) => (
                <td key={items[index].id}>{value}</td>
              ))}
            </tr>
          ))}
          <tr className="extras-amenity-heading">
            <th colSpan={items.length + 1}>{c.amenities}</th>
          </tr>
          {amenityKeys.map((key) => (
            <tr key={key}>
              <th scope="row">{c[key]}</th>
              {items.map((item) => (
                <td key={item.id}>
                  {item.amenities.includes(key) ? (
                    <Check
                      size={19}
                      className="extras-yes"
                      aria-label={
                        lang === "az"
                          ? "Var"
                          : lang === "ru"
                            ? "Есть"
                            : "Included"
                      }
                    />
                  ) : (
                    <Minus
                      size={18}
                      className="extras-no"
                      aria-label={
                        lang === "az"
                          ? "Yoxdur"
                          : lang === "ru"
                            ? "Нет"
                            : "Not included"
                      }
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function dateOffset(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function SplitView({
  listings,
  lang,
}: {
  listings: Listing[];
  lang: Lang;
}) {
  const c = copy[lang];
  const [listingId, setListingId] = useState(listings[0]?.id ?? "");
  const [arrival, setArrival] = useState(() => dateOffset(1));
  const [departure, setDeparture] = useState(() => dateOffset(4));
  const [people, setPeople] = useState(Math.min(4, listings[0]?.guests ?? 1));
  const listing = listings.find((item) => item.id === listingId) ?? listings[0];
  if (!listing) return null;
  const nights = Math.round(
    (Date.parse(`${departure}T00:00:00Z`) -
      Date.parse(`${arrival}T00:00:00Z`)) /
      86400000,
  );
  const dateError =
    !arrival || !departure
      ? c.pickDates
      : arrival < dateOffset(0)
        ? c.pastDate
        : nights < 1 || !Number.isFinite(nights)
          ? c.invalidDates
          : "";
  const peopleError =
    !Number.isInteger(people) || people < 1 || people > listing.guests
      ? c.invalidPeople
      : "";
  const error = dateError || peopleError;
  const accommodation = error ? 0 : nights * listing.price;
  const fee = Math.round(accommodation * 0.05 * 100) / 100;
  const total = accommodation + fee;
  const perPerson = error ? 0 : total / people;
  return (
    <div className="extras-split-layout">
      <section className="extras-split-form">
        <div className="extras-kicker">
          <Users size={16} />
          {c.splitBadge}
        </div>
        <h2>{c.splitIntro}</h2>
        <p className="extras-intro">{c.splitDescription}</p>
        <div className="extras-field">
          <label htmlFor="split-home">{c.chooseHome}</label>
          <div className="extras-select">
            <select
              id="split-home"
              value={listing.id}
              onChange={(event) => {
                setListingId(event.target.value);
                const next = listings.find(
                  (item) => item.id === event.target.value,
                );
                if (next) setPeople((value) => Math.min(value, next.guests));
              }}
            >
              {listings.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.title[lang]} · {cityLabel(item.city, lang)}
                </option>
              ))}
            </select>
            <ChevronDown size={17} />
          </div>
        </div>
        <div className="extras-date-fields">
          <div className="extras-field">
            <label htmlFor="split-arrival">{c.arrival}</label>
            <input
              id="split-arrival"
              aria-invalid={!!dateError}
              aria-describedby={error ? "split-error" : undefined}
              type="date"
              min={dateOffset(0)}
              value={arrival}
              onChange={(event) => setArrival(event.target.value)}
            />
          </div>
          <div className="extras-field">
            <label htmlFor="split-departure">{c.departure}</label>
            <input
              id="split-departure"
              aria-invalid={!!dateError}
              aria-describedby={error ? "split-error" : undefined}
              type="date"
              min={arrival || dateOffset(0)}
              value={departure}
              onChange={(event) => setDeparture(event.target.value)}
            />
          </div>
        </div>
        <div className="extras-people-field">
          <div>
            <label htmlFor="split-people">{c.friends}</label>
            <small>
              {c.capacity} {listing.guests} {c.people}
            </small>
          </div>
          <div className="extras-stepper">
            <button
              type="button"
              aria-label={`${c.friends} −`}
              disabled={people <= 1}
              onClick={() => setPeople((value) => value - 1)}
            >
              <Minus size={16} />
            </button>
            <input
              id="split-people"
              aria-invalid={!!peopleError}
              aria-describedby={error ? "split-error" : undefined}
              type="number"
              min={1}
              max={listing.guests}
              value={people}
              onChange={(event) => setPeople(Number(event.target.value))}
            />
            <button
              type="button"
              aria-label={`${c.friends} +`}
              disabled={people >= listing.guests}
              onClick={() => setPeople((value) => value + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        {error && (
          <p id="split-error" className="extras-error" role="alert">
            {error}
          </p>
        )}
        <div className="extras-split-tip">
          <span>
            <Heart size={20} />
          </span>
          <div>
            <strong>{c.dayTip}</strong>
            <p>{c.dayTipText}</p>
          </div>
        </div>
      </section>
      <aside className="extras-budget">
        <div className="extras-budget-heading">
          <Coins size={20} />
          <h3>{c.plan}</h3>
        </div>
        <div className="extras-budget-home">
          <img src={listing.images[0]} alt={listing.title[lang]} />
          <div>
            <small>{cityLabel(listing.city, lang)}</small>
            <strong>{listing.title[lang]}</strong>
            <span>★ {listing.rating.toFixed(2)}</span>
          </div>
        </div>
        <div className="extras-per-person">
          <span>{c.perPerson}</span>
          <div aria-live="polite">
            {error ? "—" : money(perPerson, lang)}{" "}
            <small>{listing.currency || "AZN"}</small>
          </div>
          <span>
            {!error && `${nights} ${c.nights} · ${people} ${c.people}`}
          </span>
        </div>
        <dl className="extras-breakdown">
          <div>
            <dt>
              {c.accommodation}
              <small>
                {money(listing.price, lang)} {listing.currency || "AZN"} ×{" "}
                {error ? "—" : nights} {c.nights}
              </small>
            </dt>
            <dd>
              {error ? "—" : money(accommodation, lang)}{" "}
              {listing.currency || "AZN"}
            </dd>
          </div>
          <div>
            <dt>
              {c.fee}
              <CircleHelp size={13} />
            </dt>
            <dd>
              {error ? "—" : money(fee, lang)} {listing.currency || "AZN"}
            </dd>
          </div>
          <div className="extras-budget-total">
            <dt>{c.total}</dt>
            <dd>
              {error ? "—" : money(total, lang)} {listing.currency || "AZN"}
            </dd>
          </div>
          <div>
            <dt>{c.splitBy}</dt>
            <dd>
              {people} {c.people}
            </dd>
          </div>
        </dl>
        <p className="extras-price-note">{c.priceNote}</p>
        <div className="extras-no-payment">
          <ShieldCheck size={16} />
          {c.notCharged}
        </div>
        <p className="extras-demo-note">{c.demo}</p>
      </aside>
    </div>
  );
}
