import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Flame,
  Heart,
  House,
  Laptop,
  MapPin,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Utensils,
  Waves,
  Wifi,
  X,
  GitCompareArrows,
  Expand,
} from "lucide-react";
import { cityNames } from "./data";
import type { Listing } from "./data";
import type { Lang } from "./i18n";
import { addDays, bookingPrice, todayISO, validateBooking } from "./booking";
import "./detail.css";

const copy = {
  az: {
    back: "Məkanlara qayıt",
    favorite: "Seçilmişlərə əlavə et",
    saved: "Seçilmişlərdə",
    compare: "Müqayisə et",
    reviews: "rəy",
    guests: "qonaq",
    bedrooms: "yataq otağı",
    beds: "çarpayı",
    entire: "Bütün ev sizin ixtiyarınızda",
    hosted: "Ev sahibiniz",
    fictional: "Farazi ev sahibi",
    superhost: "Seçilmiş ev sahibi",
    about: "Bu məkan haqqında",
    description:
      "Gündəlik həyatın ritmindən uzaqlaşın və özünüzə bir az zaman ayırın. Rahat interyer, düşünülmüş detallar və dinclik dolu bir mühit sizi gözləyir. Səhər qəhvənizi mənzərəyə qarşı için, axşam isə sevdiklərinizlə unudulmaz xatirələr yaradın.",
    amenities: "Rahatlığınız üçün hər şey",
    wifi: "Sürətli Wi-Fi",
    parking: "Pulsuz parkinq",
    pool: "Üzgüçülük hovuzu",
    kitchen: "Tam təchizli mətbəx",
    ac: "Kondisioner",
    fireplace: "Kamin",
    bbq: "Mangal sahəsi",
    desk: "İş masası",
    night: "gecə",
    checkIn: "Giriş tarixi",
    checkOut: "Çıxış tarixi",
    reserve: "Sınaq rezervasiyası",
    noCharge: "İndi heç bir ödəniş etmirsiniz",
    service: "Xidmət haqqı (5%)",
    total: "Yekun məbləğ",
    demo: "Bu tədris layihəsidir. Real ödəniş və rezervasiya aparılmır.",
    dates: "Giriş və çıxış tarixlərini seçin.",
    past: "Keçmiş tarix üçün rezervasiya mümkün deyil.",
    order: "Çıxış tarixi giriş tarixindən sonra olmalıdır.",
    guestError: "Qonaq sayı evin tutumuna uyğun olmalıdır.",
    booked: "Səfəriniz xəyalda başladı!",
    bookedDescription: "Sınaq rezervasiyanız uğurla yaradıldı.",
    demoConfirmation:
      "Bu sınaq rezervasiyasıdır. Real ödəniş və ya rezervasiya aparılmayıb.",
    reference: "Sınaq rezervasiya nömrəsi",
    home: "Məkanları kəşf et",
    gallery: "Şəkil qalereyası",
    allPhotos: "Bütün şəkillər",
    close: "Bağla",
    previous: "Əvvəlki şəkil",
    next: "Növbəti şəkil",
    reviewText:
      "Çox rahat və gözəl bir məkan idi. Təmizlik, sakitlik və düşünülmüş detallar səfərimizi daha da xüsusi etdi. Yenidən gəlmək istərdik!",
    reviewAuthor: "Aysel",
    reviewDate: "Sentyabr 2026 · Farazi rəy",
    trustTitle: "Rahatlıq detallarda gizlidir",
    trustText: "Özünüzə aid bir məkan. Yaxşı yuxu. Gözəl bir səfər.",
    special: "Zzzlep seçimi",
    capacity: "Maksimum",
    checkoutNote: "Tarixləri dəyişərək yekun qiyməti görə bilərsiniz.",
    copied: "Saxlanılıb",
    welcome: "Xoş gəlmisiniz",
    secure: "Şəffaf qiymət, sürprizsiz planlar",
    view: "Mənzərəli istirahət",
    checkinTitle: "Rahat giriş",
    checkinText: "Giriş: 15:00-dan · Çıxış: 11:00-a qədər",
    rules: "Məkan qaydaları",
    rulesText:
      "Siqaret çəkmək və tədbir keçirmək olmaz. Məkanın sakitliyinə hörmət edin.",
  },
  en: {
    back: "Back to stays",
    favorite: "Save this stay",
    saved: "Saved",
    compare: "Compare",
    reviews: "reviews",
    guests: "guests",
    bedrooms: "bedrooms",
    beds: "beds",
    entire: "The whole place, just for you",
    hosted: "Your host",
    fictional: "Fictional host",
    superhost: "Featured host",
    about: "About this space",
    description:
      "Step away from the everyday and make a little time for yourself. A comfortable interior, thoughtful details, and a peaceful setting await. Enjoy your morning coffee with a view and spend your evenings making memories with the people you love.",
    amenities: "Everything for a comfortable stay",
    wifi: "Fast Wi-Fi",
    parking: "Free parking",
    pool: "Swimming pool",
    kitchen: "Fully equipped kitchen",
    ac: "Air conditioning",
    fireplace: "Indoor fireplace",
    bbq: "Barbecue area",
    desk: "Dedicated workspace",
    night: "night",
    checkIn: "Check-in",
    checkOut: "Check-out",
    reserve: "Try a reservation",
    noCharge: "You won’t be charged",
    service: "Service fee (5%)",
    total: "Total",
    demo: "Educational project. No real payment or reservation takes place.",
    dates: "Choose check-in and check-out dates.",
    past: "Check-in cannot be in the past.",
    order: "Check-out must be after check-in.",
    guestError: "Guest count must be within the property’s capacity.",
    booked: "Your dream trip starts here!",
    bookedDescription: "Your demo reservation was created successfully.",
    demoConfirmation:
      "This is a demo reservation. No real payment or booking has been made.",
    reference: "Demo reservation number",
    home: "Explore more stays",
    gallery: "Photo gallery",
    allPhotos: "Show all photos",
    close: "Close",
    previous: "Previous photo",
    next: "Next photo",
    reviewText:
      "Such a lovely and comfortable place. The cleanliness, quiet surroundings, and thoughtful details made our trip feel special. We would love to come back!",
    reviewAuthor: "Aysel",
    reviewDate: "September 2026 · Fictional review",
    trustTitle: "Comfort is in the details",
    trustText: "A place of your own. A good night’s sleep. A wonderful trip.",
    special: "Zzzlep selection",
    capacity: "Up to",
    checkoutNote: "Change the dates to see your total price.",
    copied: "Saved",
    welcome: "Make yourself at home",
    secure: "Transparent pricing, effortless planning",
    view: "A stay with a view",
    checkinTitle: "Easy arrival",
    checkinText: "Check-in: from 3 PM · Check-out: by 11 AM",
    rules: "House rules",
    rulesText:
      "No smoking or events. Please respect the peaceful surroundings.",
  },
  ru: {
    back: "К вариантам жилья",
    favorite: "Сохранить",
    saved: "Сохранено",
    compare: "Сравнить",
    reviews: "отзывов",
    guests: "гостей",
    bedrooms: "спальни",
    beds: "кровати",
    entire: "Весь дом только для вас",
    hosted: "Ваш хозяин",
    fictional: "Вымышленный хозяин",
    superhost: "Избранный хозяин",
    about: "Об этом месте",
    description:
      "Отдохните от повседневной суеты и уделите немного времени себе. Вас ждут уютный интерьер, продуманные детали и спокойная атмосфера. Наслаждайтесь утренним кофе с прекрасным видом, а вечера проводите с близкими, создавая незабываемые воспоминания.",
    amenities: "Всё для комфортного отдыха",
    wifi: "Быстрый Wi-Fi",
    parking: "Бесплатная парковка",
    pool: "Бассейн",
    kitchen: "Оборудованная кухня",
    ac: "Кондиционер",
    fireplace: "Камин",
    bbq: "Зона барбекю",
    desk: "Рабочее место",
    night: "ночь",
    checkIn: "Заезд",
    checkOut: "Выезд",
    reserve: "Пробная бронь",
    noCharge: "Оплата не взимается",
    service: "Сервисный сбор (5%)",
    total: "Итого",
    demo: "Учебный проект. Реальная оплата и бронирование не производятся.",
    dates: "Выберите даты заезда и выезда.",
    past: "Дата заезда не может быть в прошлом.",
    order: "Дата выезда должна быть позже даты заезда.",
    guestError: "Число гостей должно соответствовать вместимости жилья.",
    booked: "Путешествие мечты начинается!",
    bookedDescription: "Пробное бронирование успешно создано.",
    demoConfirmation:
      "Это пробное бронирование. Реальная оплата и бронирование не производились.",
    reference: "Номер пробной брони",
    home: "Найти другое жильё",
    gallery: "Фотогалерея",
    allPhotos: "Все фотографии",
    close: "Закрыть",
    previous: "Предыдущее фото",
    next: "Следующее фото",
    reviewText:
      "Очень уютное и красивое место. Чистота, тишина и продуманные детали сделали нашу поездку особенной. С удовольствием вернулись бы снова!",
    reviewAuthor: "Айсель",
    reviewDate: "Сентябрь 2026 · Вымышленный отзыв",
    trustTitle: "Уют в каждой детали",
    trustText: "Место для себя. Крепкий сон. Прекрасное путешествие.",
    special: "Выбор Zzzlep",
    capacity: "До",
    checkoutNote: "Измените даты, чтобы узнать итоговую стоимость.",
    copied: "Сохранено",
    welcome: "Чувствуйте себя как дома",
    secure: "Прозрачные цены, лёгкое планирование",
    view: "Отдых с прекрасным видом",
    checkinTitle: "Удобный заезд",
    checkinText: "Заезд: с 15:00 · Выезд: до 11:00",
    rules: "Правила проживания",
    rulesText: "Курение и мероприятия запрещены. Пожалуйста, уважайте тишину.",
  },
};
const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  pool: Waves,
  kitchen: Utensils,
  ac: Snowflake,
  fireplace: Flame,
  bbq: Coffee,
  desk: Laptop,
};
type Props = {
  listing: Listing;
  lang: Lang;
  t: (key: string) => string;
  favorite: boolean;
  onFavorite: () => void;
  onCompare: () => void;
  onBack: () => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
};

export default function ListingDetail({
  listing,
  lang,
  favorite,
  onFavorite,
  onCompare,
  onBack,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: Props) {
  const c = copy[lang];
  const [gallery, setGallery] = useState<number | null>(null);
  const initialDate =
    initialCheckIn &&
    !validateBooking({
      checkIn: initialCheckIn,
      checkOut: addDays(initialCheckIn, 1),
      guests: 1,
      maxGuests: listing.guests,
    })
      ? initialCheckIn
      : addDays(todayISO(), 7);
  const [checkIn, setCheckIn] = useState(initialDate);
  const [checkOut, setCheckOut] = useState(
    initialCheckOut &&
      !validateBooking({
        checkIn: initialDate,
        checkOut: initialCheckOut,
        guests: 1,
        maxGuests: listing.guests,
      })
      ? initialCheckOut
      : addDays(initialDate, 3),
  );
  const [guests, setGuests] = useState(
    Math.max(
      1,
      Math.min(
        listing.guests,
        Number.isFinite(initialGuests) ? Math.floor(initialGuests!) : 2,
      ),
    ),
  );
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const bookingRef = useRef<HTMLButtonElement>(null);
  const galleryButton = useRef<HTMLButtonElement>(null);
  const price = bookingPrice(listing.price, checkIn, checkOut);
  const money = (amount: number) =>
    new Intl.NumberFormat(
      lang === "az" ? "az-AZ" : lang === "ru" ? "ru-RU" : "en-US",
      { maximumFractionDigits: 2 },
    ).format(amount);
  const formatDate = (date: string) =>
    new Date(`${date}T12:00:00`).toLocaleDateString(
      lang === "az" ? "az-AZ" : lang === "ru" ? "ru-RU" : "en-GB",
      { day: "numeric", month: "short", year: "numeric" },
    );
  const closeModal = () => {
    setGallery(null);
    setConfirmation(null);
    (confirmation ? bookingRef : galleryButton).current?.focus();
  };

  useEffect(() => {
    if (gallery === null && !confirmation) return;
    closeRef.current?.focus();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
      if (gallery !== null && event.key === "ArrowRight")
        setGallery((gallery + 1) % listing.images.length);
      if (gallery !== null && event.key === "ArrowLeft")
        setGallery(
          (gallery - 1 + listing.images.length) % listing.images.length,
        );
      if (event.key === "Tab") {
        const modal = document.querySelector(".detail-modal");
        const focusable = modal?.querySelectorAll<HTMLElement>(
          'button, input, select, [href], [tabindex="0"]',
        );
        if (focusable?.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
          if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [gallery, confirmation, listing.images.length]);

  function reserve(event: React.FormEvent) {
    event.preventDefault();
    const invalid = validateBooking({
      checkIn,
      checkOut,
      guests,
      maxGuests: listing.guests,
    });
    if (invalid) {
      setError(invalid === "guests" ? c.guestError : c[invalid]);
      return;
    }
    setError("");
    const id = `ZZZ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    setConfirmation(id);
    try {
      let old: unknown = [];
      try {
        old = JSON.parse(localStorage.getItem("zzzlep-bookings") || "[]");
      } catch {
        /* Replace invalid stored history with this valid demo booking. */
      }
      localStorage.setItem(
        "zzzlep-bookings",
        JSON.stringify([
          ...(Array.isArray(old) ? old : []),
          {
            id,
            listingId: listing.id,
            checkIn,
            checkOut,
            guests,
            total: price.total,
            demo: true,
          },
        ]),
      );
    } catch {
      /* Confirmation remains usable if browser storage is unavailable. */
    }
  }

  return (
    <article className="detail-page">
      <div className="detail-demo-strip">
        <ShieldCheck size={14} />
        {c.demo}
      </div>
      <button className="detail-back" onClick={onBack}>
        <ArrowLeft size={17} /> {c.back}
      </button>
      <div className="detail-heading">
        <div>
          <span className="detail-eyebrow">
            <Sparkles size={13} /> {c.special}
          </span>
          <h1>{listing.title[lang]}</h1>
          <div className="detail-meta">
            <span>
              <Star size={15} fill="currentColor" />{" "}
              <b>{listing.rating.toFixed(2)}</b>{" "}
              <span className="detail-muted">
                ({listing.reviews} {c.reviews})
              </span>
            </span>
            <span>
              <MapPin size={15} />{" "}
              {cityNames[listing.city]?.[lang] || listing.city}, {listing.area}
            </span>
          </div>
        </div>
        <div className="detail-actions">
          <button
            className={favorite ? "detail-saved" : ""}
            onClick={onFavorite}
          >
            <Heart size={17} fill={favorite ? "currentColor" : "none"} />{" "}
            {favorite ? c.saved : c.favorite}
          </button>
          <button onClick={onCompare}>
            <GitCompareArrows size={17} />
            {c.compare}
          </button>
        </div>
      </div>
      <div className="detail-gallery">
        {listing.images.slice(0, 3).map((image, index) => (
          <button
            key={`${image}-${index}`}
            className={`detail-photo detail-photo-${index}`}
            onClick={() => setGallery(index)}
            aria-label={`${c.gallery} ${index + 1}`}
          >
            <img src={image} alt={`${listing.title[lang]} — ${index + 1}`} />
          </button>
        ))}
        <button
          ref={galleryButton}
          className="detail-all-photos"
          onClick={() => setGallery(0)}
        >
          <Expand size={15} /> {c.allPhotos}
        </button>
      </div>
      <div className="detail-columns">
        <div className="detail-story">
          <section className="detail-overview">
            <div>
              <h2>{c.entire}</h2>
              <p>
                {listing.guests} {c.guests}
                <span>·</span>
                {listing.bedrooms} {c.bedrooms}
                <span>·</span>
                {listing.beds} {c.beds}
              </p>
            </div>
            <span className="detail-house-icon">
              <House size={27} strokeWidth={1.5} />
            </span>
          </section>
          <div className="detail-host">
            <span className="detail-avatar">{listing.host.slice(0, 1)}</span>
            <div>
              <strong>
                {c.hosted}: {listing.host}
              </strong>
              <small>
                {c.fictional} · {c.superhost}
              </small>
            </div>
            <ShieldCheck size={25} />
          </div>
          <div className="detail-benefits">
            <div>
              <Sparkles size={23} />
              <span>
                <strong>{c.view}</strong>
                <small>{c.trustText}</small>
              </span>
            </div>
            <div>
              <CheckCircle2 size={23} />
              <span>
                <strong>{c.checkinTitle}</strong>
                <small>{c.checkinText}</small>
              </span>
            </div>
          </div>
          <section className="detail-section">
            <h2>{c.about}</h2>
            <p>{listing.description[lang]}</p>
          </section>
          <section className="detail-section">
            <h2>{c.amenities}</h2>
            <div className="detail-amenities">
              {listing.amenities.map((amenity) => {
                const Icon =
                  amenityIcons[amenity as keyof typeof amenityIcons] || Check;
                return (
                  <div key={amenity}>
                    <Icon size={22} strokeWidth={1.5} />
                    <span>{c[amenity as keyof typeof c] || amenity}</span>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="detail-section">
            <h2 className="detail-rating-heading">
              <Star size={21} fill="currentColor" /> {listing.rating.toFixed(2)}{" "}
              <span>
                · {listing.reviews} {c.reviews}
              </span>
            </h2>
            <div className="detail-review">
              <div className="detail-review-person">
                <span className="detail-avatar detail-avatar-review">A</span>
                <span>
                  <strong>{c.reviewAuthor}</strong>
                  <small>{c.reviewDate}</small>
                </span>
                <span className="detail-review-stars">★★★★★</span>
              </div>
              <p>{c.reviewText}</p>
            </div>
          </section>
          <section className="detail-section">
            <h2>{c.rules}</h2>
            <p>{c.rulesText}</p>
          </section>
        </div>
        <aside className="booking-wrap">
          <form className="booking-panel" onSubmit={reserve} noValidate>
            <div className="booking-price">
              <span>
                <b>{money(listing.price)} ₼</b> / {c.night}
              </span>
              <span>
                <Star size={13} fill="currentColor" />{" "}
                {listing.rating.toFixed(2)}
              </span>
            </div>
            <p className="booking-note">{c.checkoutNote}</p>
            <div className="booking-dates">
              <label>
                {c.checkIn}
                <input
                  type="date"
                  aria-label={c.checkIn}
                  min={todayISO()}
                  value={checkIn}
                  onChange={(event) => {
                    setCheckIn(event.target.value);
                    setError("");
                  }}
                  required
                />
              </label>
              <label>
                {c.checkOut}
                <input
                  type="date"
                  aria-label={c.checkOut}
                  min={checkIn ? addDays(checkIn, 1) : todayISO()}
                  value={checkOut}
                  onChange={(event) => {
                    setCheckOut(event.target.value);
                    setError("");
                  }}
                  required
                />
              </label>
            </div>
            <label className="booking-guests">
              {c.guests}
              <select
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
                aria-label={c.guests}
              >
                {Array.from({ length: listing.guests }, (_, index) => (
                  <option value={index + 1} key={index}>
                    {index + 1} {c.guests}
                  </option>
                ))}
              </select>
            </label>
            {error && (
              <p className="booking-error" role="alert">
                {error}
              </p>
            )}
            <button ref={bookingRef} type="submit" className="booking-submit">
              {c.reserve}
              <ArrowRight size={18} />
            </button>
            <span className="booking-no-charge">
              <ShieldCheck size={14} />
              {c.noCharge}
            </span>
            <div className="booking-breakdown">
              <div>
                <span>
                  {money(listing.price)} ₼ × {price.nights} {c.night}
                </span>
                <span>{money(price.subtotal)} ₼</span>
              </div>
              <div>
                <span>{c.service}</span>
                <span>{money(price.fee)} ₼</span>
              </div>
              <div className="booking-total">
                <strong>{c.total}</strong>
                <strong>{money(price.total)} ₼</strong>
              </div>
            </div>
            <p className="booking-demo">{c.demo}</p>
          </form>
          <div className="booking-trust">
            <ShieldCheck size={20} />
            <span>{c.secure}</span>
          </div>
        </aside>
      </div>
      {(gallery !== null || confirmation) && (
        <div
          className={`detail-modal-overlay ${confirmation ? "booking-confirm-overlay" : "gallery-overlay"}`}
          onClick={(event) => {
            if (event.currentTarget === event.target) closeModal();
          }}
        >
          <div
            className={`detail-modal ${confirmation ? "booking-confirm" : "gallery-modal"}`}
            role="dialog"
            aria-modal="true"
            aria-label={confirmation ? c.booked : c.gallery}
          >
            <button
              ref={closeRef}
              className="detail-modal-close"
              aria-label={c.close}
              onClick={closeModal}
            >
              <X size={22} />
            </button>
            {confirmation ? (
              <>
                <div className="booking-success-icon">
                  <Check size={31} strokeWidth={2.5} />
                </div>
                <span className="detail-eyebrow">Zzzlep</span>
                <h2>{c.booked}</h2>
                <p className="booking-confirm-subtitle">
                  {c.bookedDescription}
                </p>
                <div className="booking-confirm-stay">
                  <img src={listing.images[0]} alt={listing.title[lang]} />
                  <div>
                    <strong>{listing.title[lang]}</strong>
                    <span>
                      <MapPin size={13} />{" "}
                      {cityNames[listing.city]?.[lang] || listing.city}
                    </span>
                  </div>
                </div>
                <dl className="booking-confirm-details">
                  <div>
                    <dt>{c.checkIn}</dt>
                    <dd>{formatDate(checkIn)}</dd>
                  </div>
                  <div>
                    <dt>{c.checkOut}</dt>
                    <dd>{formatDate(checkOut)}</dd>
                  </div>
                  <div>
                    <dt>{c.guests}</dt>
                    <dd>{guests}</dd>
                  </div>
                  <div>
                    <dt>{c.total}</dt>
                    <dd>{money(price.total)} ₼</dd>
                  </div>
                </dl>
                <div className="booking-reference">
                  <span>{c.reference}</span>
                  <strong>{confirmation}</strong>
                </div>
                <p className="booking-confirm-demo">
                  <ShieldCheck size={18} />
                  {c.demoConfirmation}
                </p>
                <button className="booking-submit" onClick={onBack}>
                  {c.home}
                  <ArrowRight size={17} />
                </button>
              </>
            ) : (
              gallery !== null && (
                <>
                  <img
                    className="gallery-full-image"
                    src={listing.images[gallery]}
                    alt={`${listing.title[lang]} — ${gallery + 1}`}
                  />
                  <button
                    className="gallery-arrow gallery-previous"
                    aria-label={c.previous}
                    onClick={() =>
                      setGallery(
                        (gallery - 1 + listing.images.length) %
                          listing.images.length,
                      )
                    }
                  >
                    <ChevronLeft size={25} />
                  </button>
                  <button
                    className="gallery-arrow gallery-next"
                    aria-label={c.next}
                    onClick={() =>
                      setGallery((gallery + 1) % listing.images.length)
                    }
                  >
                    <ChevronRight size={25} />
                  </button>
                  <span className="gallery-count">
                    {gallery + 1} / {listing.images.length}
                  </span>
                  <div className="gallery-thumbs">
                    {listing.images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        className={index === gallery ? "gallery-active" : ""}
                        onClick={() => setGallery(index)}
                        aria-label={`${c.gallery} ${index + 1}`}
                      >
                        <img src={image} alt="" />
                      </button>
                    ))}
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}
    </article>
  );
}
