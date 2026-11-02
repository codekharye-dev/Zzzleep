import { reviewedScore } from "./reviews.ts";
import { listings } from "./data.ts";
import type { Listing, LocalizedText } from "./data.ts";
export type CountryCode = "AZ" | "TR" | "US" | "IT" | "JP";
export interface Country {
  code: CountryCode;
  name: LocalizedText;
  city: LocalizedText;
  description: LocalizedText;
  lat: number;
  lng: number;
  image: string;
}
export const countries: Country[] = [
  {
    code: "AZ",
    name: { az: "Azərbaycan", en: "Azerbaijan", ru: "Азербайджан" },
    city: {
      az: "Bakıdan Qəbələyə",
      en: "From Baku to Gabala",
      ru: "От Баку до Габалы",
    },
    description: {
      az: "Doğma yerlər, tamam yeni hisslər. Meşə içində sakit bir evdən şəhərin qəlbindəki mənzilə — öz Azərbaycanını yenidən kəşf et.",
      en: "Familiar places, brand-new feelings. From a woodland hideaway to a home in the heart of the city — find your Azerbaijan.",
      ru: "Знакомые места, новые чувства. От лесного домика до квартиры в сердце города — откройте свой Азербайджан.",
    },
    lat: 40.4,
    lng: 49.8,
    image: "/flags/az.svg",
  },
  {
    code: "TR",
    name: { az: "Türkiyə", en: "Türkiye", ru: "Турция" },
    city: {
      az: "İstanbul, Kaş və Kapadokya",
      en: "Istanbul, Kaş & Cappadocia",
      ru: "Стамбул, Каш и Каппадокия",
    },
    description: {
      az: "Bir fincan qəhvə, dənizdən gələn meh və yeni hekayələr. İstanbulun küçələrindən Aralıq dənizinin sahillərinə öz ritmini tap.",
      en: "A cup of coffee, a sea breeze, a new story. Find your rhythm between Istanbul’s streets and the Mediterranean coast.",
      ru: "Чашка кофе, морской бриз и новая история. Найдите свой ритм между улицами Стамбула и берегом Средиземного моря.",
    },
    lat: 39,
    lng: 35,
    image: "/flags/tr.svg",
  },
  {
    code: "US",
    name: { az: "ABŞ", en: "United States", ru: "США" },
    city: {
      az: "Nyu-Yorkdan Kaliforniyaya",
      en: "New York to California",
      ru: "От Нью-Йорка до Калифорнии",
    },
    description: {
      az: "Böyük şəhərlərin enerjisi, təbiətin sonsuz sakitliyi. Meşə kabinəsi və ya günəşli sahil evi — növbəti macəranı özün seç.",
      en: "Big-city energy, wide-open quiet. A cabin among the trees or a sunny coastal home — choose your next adventure.",
      ru: "Энергия большого города и бескрайняя тишина природы. Домик в лесу или на солнечном побережье — выбирайте своё приключение.",
    },
    lat: 38,
    lng: -98,
    image: "/flags/us.svg",
  },
  {
    code: "IT",
    name: { az: "İtaliya", en: "Italy", ru: "Италия" },
    city: {
      az: "Toskana, Roma və Komo",
      en: "Tuscany, Rome & Como",
      ru: "Тоскана, Рим и Комо",
    },
    description: {
      az: "Tələsmədən yaşamağın öz gözəlliyi var. Toskana təpələrində gün batımı, Roma səhərləri və İtaliyaya aid kiçik xoşbəxtliklər.",
      en: "There is an art to taking your time. Tuscan sunsets, Roman mornings and those little joys that belong to Italy.",
      ru: "В неспешной жизни есть особая красота. Закаты Тосканы, римские утра и маленькие итальянские радости.",
    },
    lat: 43,
    lng: 12,
    image: "/flags/it.svg",
  },
  {
    code: "JP",
    name: { az: "Yaponiya", en: "Japan", ru: "Япония" },
    city: {
      az: "Tokio, Kyoto və Hakone",
      en: "Tokyo, Kyoto & Hakone",
      ru: "Токио, Киото и Хаконе",
    },
    description: {
      az: "Hər detalda harmoniya. Kyotonun sakit bağlarından Tokionun işıqlarına — gündəlik həyatdan uzaq, özünə yaxın bir səfər.",
      en: "Harmony in every little detail. From Kyoto’s quiet gardens to the lights of Tokyo — a journey closer to yourself.",
      ru: "Гармония в каждой детали. От тихих садов Киото до огней Токио — путешествие навстречу себе.",
    },
    lat: 36,
    lng: 138,
    image: "/flags/jp.svg",
  },
];
const seeds: [
  CountryCode,
  string,
  string,
  string,
  string,
  string,
  number,
  number,
][] = [
  [
    "TR",
    "İstanbul",
    "Boğaz mənzərəli işıqlı mənzil",
    "A bright Bosphorus apartment",
    "Светлая квартира у Босфора",
    "apartment",
    135,
    4,
  ],
  [
    "TR",
    "Kaş",
    "Aralıq dənizi sahilində villa",
    "A Mediterranean coastal villa",
    "Вилла на Средиземном море",
    "villa",
    260,
    8,
  ],
  [
    "TR",
    "Kapadokya",
    "Kapadokyada sakit bir sığınacaq",
    "A quiet Cappadocia retreat",
    "Тихий уголок Каппадокии",
    "cottage",
    155,
    4,
  ],
  [
    "TR",
    "Sapanca",
    "Ağaclar arasında dağ evi",
    "A cabin among Sapanca’s trees",
    "Домик среди деревьев Сапанджи",
    "cabin",
    175,
    4,
  ],
  [
    "US",
    "New York",
    "Bruklində zövqlü şəhər loftu",
    "A considered Brooklyn loft",
    "Стильный лофт в Бруклине",
    "apartment",
    245,
    4,
  ],
  [
    "US",
    "Joshua Tree",
    "Səhranın səssizliyində ev",
    "A peaceful desert hideaway",
    "Тихое убежище в пустыне",
    "tiny",
    210,
    2,
  ],
  [
    "US",
    "Lake Tahoe",
    "Göl yaxınlığında meşə kabinəsi",
    "A woodland cabin by Lake Tahoe",
    "Лесной домик у озера Тахо",
    "cabin",
    285,
    6,
  ],
  [
    "US",
    "Palm Springs",
    "Günəşli Kaliforniya villası",
    "A sunny California villa",
    "Солнечная калифорнийская вилла",
    "villa",
    390,
    8,
  ],
  [
    "IT",
    "Toscana",
    "Toskana təpələrində bağ evi",
    "A cottage in the Tuscan hills",
    "Дом среди холмов Тосканы",
    "cottage",
    195,
    4,
  ],
  [
    "IT",
    "Roma",
    "Romanın qəlbində rahat mənzil",
    "A cozy home in the heart of Rome",
    "Уютный дом в сердце Рима",
    "apartment",
    165,
    4,
  ],
  [
    "IT",
    "Como",
    "Komo gölü yaxınlığında villa",
    "A private villa near Lake Como",
    "Вилла у озера Комо",
    "villa",
    340,
    6,
  ],
  [
    "IT",
    "Dolomiti",
    "Dolomit dağlarında kiçik ev",
    "A tiny hideaway in the Dolomites",
    "Домик в Доломитовых Альпах",
    "tiny",
    185,
    2,
  ],
  [
    "JP",
    "Tokyo",
    "Tokioda minimal şəhər mənzili",
    "A minimal Tokyo apartment",
    "Минималистичная квартира в Токио",
    "apartment",
    150,
    2,
  ],
  [
    "JP",
    "Kyoto",
    "Kyoto bağlarında sakit bir ev",
    "A quiet home in Kyoto’s gardens",
    "Тихий дом в садах Киото",
    "cottage",
    180,
    4,
  ],
  [
    "JP",
    "Hakone",
    "Hakonedə təbiətə açılan kabinə",
    "A nature retreat in Hakone",
    "Домик на природе в Хаконе",
    "cabin",
    230,
    4,
  ],
  [
    "JP",
    "Fujikawaguchiko",
    "Fuji yaxınlığında ailə villası",
    "A family villa near Mount Fuji",
    "Семейная вилла у горы Фудзи",
    "villa",
    295,
    6,
  ],
];
export const internationalListings: Listing[] = seeds.map(
  ([country, city, az, en, ru, type, price, guests], index) => {
    const template = listings.find((item) => item.type === type)!;
    return {
      ...template,
      id: `${country.toLowerCase()}-${index + 1}`,
      country,
      city,
      area: city,
      title: { az, en, ru },
      price,
      guests,
      bedrooms: guests > 4 ? 3 : guests > 2 ? 2 : 1,
      beds: guests > 4 ? 4 : guests > 2 ? 3 : 1,
      ...reviewedScore(`${country.toLowerCase()}-${index + 1}`),
      host: ["Deniz", "Alex", "Luca", "Haru"][Math.floor(index / 4)],
    };
  },
);
export const catalog: Listing[] = [...listings, ...internationalListings];
export const countryFor = (code: string) =>
  countries.find((country) => country.code === code);
