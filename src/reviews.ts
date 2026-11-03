import type { LocalizedText } from "./data.ts";
export type Topic =
  | "cleanliness"
  | "location"
  | "host"
  | "wifi"
  | "noise"
  | "comfort"
  | "value"
  | "checkin";
export interface Review {
  id: string;
  author: string;
  city: string;
  date: string;
  rating: number;
  text: LocalizedText;
  mentions: { topic: Topic; sentiment: "positive" | "negative" }[];
}
const authors = [
  ["Nigar Əliyeva", "Bakı"],
  ["Murad Həsənli", "Gəncə"],
  ["Leyla Məmmədova", "Sumqayıt"],
  ["Orxan Rzayev", "Bakı"],
  ["Səbinə Quliyeva", "Şəki"],
  ["Elvin Abbasov", "Quba"],
  ["Günel İsmayılova", "Bakı"],
  ["Rəşad Hüseynov", "Lənkəran"],
  ["Nərmin Cəfərova", "Gəncə"],
  ["Tural Əhmədov", "Şamaxı"],
  ["Zəhra Kərimova", "Bakı"],
  ["Kamran Səfərov", "Şəki"],
  ["Dəniz Yılmaz", "İstanbul"],
  ["Alex Morgan", "London"],
  ["Mina Tanaka", "Tokyo"],
  ["Luca Rossi", "Roma"],
  ["Aysel Vəliyeva", "Bakı"],
  ["Emil Qasımov", "Sumqayıt"],
  ["Lalə Nəcəfova", "Gəncə"],
  ["Fərid Babayev", "Bakı"],
];
type Sentence = {
  topic: Topic;
  sentiment: "positive" | "negative";
  text: LocalizedText;
};
const positive: Sentence[] = [
  {
    topic: "cleanliness",
    sentiment: "positive",
    text: {
      az: "Ev təmiz idi, yataq dəsti və mətbəx səliqəli hazırlanmışdı.",
      en: "The home was clean, with fresh bedding and a tidy kitchen.",
      ru: "Дом был чистым, постельное бельё свежее, кухня аккуратная.",
    },
  },
  {
    topic: "location",
    sentiment: "positive",
    text: {
      az: "Yerləşməsi çox xoşuma gəldi, ətrafı gəzmək rahat idi.",
      en: "I loved the location; it was easy to explore the area.",
      ru: "Расположение понравилось, окрестности удобно изучать.",
    },
  },
  {
    topic: "host",
    sentiment: "positive",
    text: {
      az: "Ev sahibi suallarımıza tez cavab verdi və faydalı tövsiyələr paylaşdı.",
      en: "The host replied quickly and shared helpful recommendations.",
      ru: "Хозяин быстро отвечал и делился полезными рекомендациями.",
    },
  },
  {
    topic: "comfort",
    sentiment: "positive",
    text: {
      az: "Yataq rahat idi, bir neçə günlük istirahət üçün evdə lazım olanlar vardı.",
      en: "The bed was comfortable and the home had what we needed for a short break.",
      ru: "Кровать удобная, в доме было всё необходимое для короткого отдыха.",
    },
  },
  {
    topic: "checkin",
    sentiment: "positive",
    text: {
      az: "Giriş təlimatları aydın idi, açarı gözləmədən götürdük.",
      en: "Check-in instructions were clear and we picked up the key without waiting.",
      ru: "Инструкции по заселению понятные, ключ получили без ожидания.",
    },
  },
  {
    topic: "value",
    sentiment: "positive",
    text: {
      az: "Bu qiymətə yaxşı seçimdir, xüsusilə dostlarla xərci böləndə sərfəli olur.",
      en: "Good value at this price, especially when sharing the cost with friends.",
      ru: "За эту цену хороший вариант, особенно если разделить расходы с друзьями.",
    },
  },
  {
    topic: "wifi",
    sentiment: "positive",
    text: {
      az: "Wi-Fi videozənglərimiz üçün kifayət etdi, bağlantı sabit idi.",
      en: "Wi-Fi was stable and worked well for our video calls.",
      ru: "Wi-Fi работал стабильно, для видеозвонков хватало.",
    },
  },
  {
    topic: "noise",
    sentiment: "positive",
    text: {
      az: "Gecələr sakit idi, rahat yatıb dincələ bildik.",
      en: "The nights were quiet and we slept well.",
      ru: "По ночам было тихо, удалось выспаться.",
    },
  },
];
const negative: Sentence[] = [
  {
    topic: "wifi",
    sentiment: "negative",
    text: {
      az: "Amma Wi-Fi axşamlar zəifləyirdi; iş üçün sabit internet vacibdirsə, bunu nəzərə alın.",
      en: "However, Wi-Fi slowed down in the evenings; keep this in mind if reliable internet is essential for work.",
      ru: "Но вечером Wi-Fi замедлялся; учитывайте это, если стабильный интернет нужен для работы.",
    },
  },
  {
    topic: "noise",
    sentiment: "negative",
    text: {
      az: "Axşam saatlarında kənardan səs gəlirdi, yuxusu həssas olanlara mane ola bilər.",
      en: "There was noise outside in the evening, which may bother light sleepers.",
      ru: "Вечером снаружи было шумно, людям с чутким сном это может мешать.",
    },
  },
  {
    topic: "cleanliness",
    sentiment: "negative",
    text: {
      az: "Hamamda təmizlik daha diqqətli ola bilərdi; bəzi künclərdə toz qalmışdı.",
      en: "The bathroom needed more careful cleaning, with dust left in a few corners.",
      ru: "Ванная нуждалась в более тщательной уборке, в углах оставалась пыль.",
    },
  },
  {
    topic: "comfort",
    sentiment: "negative",
    text: {
      az: "Döşək mənə bir az sərt gəldi, bəzi mebellər də yenilənməyə ehtiyac duyur.",
      en: "The mattress felt a little firm and some furniture could use an update.",
      ru: "Матрас показался жестковатым, часть мебели стоит обновить.",
    },
  },
  {
    topic: "checkin",
    sentiment: "negative",
    text: {
      az: "Giriş zamanı açarı almaq üçün gözlədik; təlimatlar əvvəlcədən daha aydın göndərilməlidir.",
      en: "We had to wait for the key at check-in; clearer instructions should be sent beforehand.",
      ru: "При заселении пришлось ждать ключ; инструкции стоит присылать заранее и подробнее.",
    },
  },
  {
    topic: "value",
    sentiment: "negative",
    text: {
      az: "Ümumi təcrübə normal idi, amma bu vəziyyətdə qiymət mənə bir qədər yüksək göründü.",
      en: "The stay was fine overall, but the price felt a little high for the condition of the place.",
      ru: "В целом нормально, но для такого состояния жилья цена показалась завышенной.",
    },
  },
];
const hash = (id: string) =>
  Array.from(id).reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 0);
const profiles = [
  [5, 5, 5, 5, 4, 5],
  [5, 4, 4, 3, 4, 4],
  [4, 3, 4, 3, 3, 4],
  [3, 3, 4, 2, 3, 4],
];
const cache = new Map<string, Review[]>();
/** Stable fictional reviews: the displayed score and the assistant use this exact evidence. */
export function getListingReviews(id: string): Review[] {
  if (id.startsWith("model-") || id.startsWith("stay-")) return [];
  if (cache.has(id)) return cache.get(id)!;
  const seed = hash(id),
    tier = seed % 4;
  const ratings = profiles[tier];
  const reviews = ratings.map((rating, i) => {
    const author = authors[(seed + i * 3) % authors.length];
    const praise = positive[(seed + i) % positive.length];
    const concern = negative[(seed + (i % 2 === 0 ? 1 : 0)) % negative.length];
    const hasConcern =
      rating <= 3 || (tier === 1 && i === 2) || (tier === 0 && rating === 4);
    const sentences: Sentence[] = hasConcern
      ? [praise, concern]
      : [praise, positive[(seed + i + 3) % positive.length]];
    return {
      id: `${id}-review-${i + 1}`,
      author: author[0],
      city: author[1],
      date: `2026-${i < 3 ? "10" : "09"}-${String(26 - i * 3).padStart(2, "0")}`,
      rating,
      text: {
        az: sentences.map((s) => s.text.az).join(" "),
        en: sentences.map((s) => s.text.en).join(" "),
        ru: sentences.map((s) => s.text.ru).join(" "),
      },
      mentions: sentences.map(({ topic, sentiment }) => ({ topic, sentiment })),
    };
  });
  cache.set(id, reviews);
  return reviews;
}
export interface TopicCount {
  topic: Topic;
  count: number;
  reviewIds: string[];
}
export function analyzeReviews(reviews: Review[]) {
  const topicCounts = (sentiment: "positive" | "negative"): TopicCount[] => {
    const groups = new Map<Topic, string[]>();
    for (const review of reviews)
      for (const topic of new Set(
        review.mentions
          .filter((m) => m.sentiment === sentiment)
          .map((m) => m.topic),
      )) {
        groups.set(topic, [...(groups.get(topic) || []), review.id]);
      }
    return [...groups]
      .map(([topic, reviewIds]) => ({
        topic,
        count: reviewIds.length,
        reviewIds,
      }))
      .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
  };
  const average = reviews.length
    ? Math.round(
        (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 100,
      ) / 100
    : 0;
  return {
    average,
    count: reviews.length,
    positive: topicCounts("positive"),
    negative: topicCounts("negative"),
    criticalCount: reviews.filter((r) => r.rating <= 3).length,
    distribution: [5, 4, 3, 2, 1].map((score) => ({
      score,
      count: reviews.filter((r) => r.rating === score).length,
    })),
  };
}
export function reviewedScore(id: string) {
  const { average, count } = analyzeReviews(getListingReviews(id));
  return { rating: average, reviews: count };
}
