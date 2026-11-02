import { analyzeReviews } from "./reviews.ts";
import type { Review, Topic } from "./reviews.ts";
import { reviewCopy, concernNames } from "./reviewContent.ts";
import type { Lang } from "./i18n.ts";
export type SummaryMode = "summary" | "liked" | "concerns" | "reasons" | "fit";
const topics: Record<Topic, RegExp> = {
  cleanliness: /təmiz|temiz|clean|чист|убор/,
  location: /yerləş|yerles|məkan|mekan|location|area|располож|район/,
  host: /sahib|host|хозя/,
  wifi: /wi.?fi|internet|интернет/,
  noise: /sakit|səs|ses|noise|quiet|шум|тишин/,
  comfort: /rahat|yataq|comfort|bed|комфорт|кроват|матрас/,
  value: /qiym|price|value|цена|цену|стоим/,
  checkin: /giriş|giris|açar|acar|check.?in|ключ|заселен/,
};
export function summarizeReviews(
  reviews: Review[],
  lang: Lang,
  mode: SummaryMode = "summary",
  question = "",
) {
  const c = reviewCopy[lang],
    analysis = analyzeReviews(reviews);
  const n = (value: number) =>
    new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }).format(value);
  const list = (items: typeof analysis.positive, negative = false) =>
    items
      .slice(0, 3)
      .map(
        (item) =>
          `${negative ? concernNames[lang][item.topic] : c[item.topic]} (${item.count}/${reviews.length})`,
      )
      .join(", ");
  const overview = `${reviews.length} ${c.headingPrefix}: ${n(analysis.average)}/5.`;
  const praise = `${c.likePrefix}: ${list(analysis.positive)}.`;
  const concern = analysis.negative.length
    ? `${c.concernPrefix}: ${list(analysis.negative, true)}.`
    : c.none;
  let text = "",
    evidenceIds: string[] = [];
  if (question) {
    const value = question.toLocaleLowerCase(lang);
    const topic = (Object.entries(topics) as [Topic, RegExp][]).find(
      ([, pattern]) => pattern.test(value),
    )?.[0];
    if (topic) {
      const pos = analysis.positive.find((item) => item.topic === topic),
        neg = analysis.negative.find((item) => item.topic === topic);
      text =
        !pos && !neg
          ? c.notMentioned
          : `${c[topic]}: ${[pos ? `${c.positive} — ${pos.count}/${reviews.length}` : "", neg ? `${c.critical} — ${neg.count}/${reviews.length}` : ""].filter(Boolean).join(". ")}.`;
      evidenceIds = [...(pos?.reviewIds || []), ...(neg?.reviewIds || [])];
    } else if (/şikayət|sikayet|complain|concern|жалоб|замечан/.test(value))
      mode = "concerns";
    else if (/niyə|niye|why|rating|xal|почему|оценк/.test(value))
      mode = "reasons";
    else if (/bəyən|beyen|love|like|понрав|хвал/.test(value)) mode = "liked";
    else if (/uyğun|uygun|recommend|right|подойд|рекоменд/.test(value))
      mode = "fit";
    else text = c.unsupported;
  }
  if (!text) {
    if (mode === "summary") {
      text = `${overview} ${praise} ${concern}`;
      evidenceIds = [
        ...(analysis.positive[0]?.reviewIds.slice(0, 1) || []),
        ...(analysis.negative[0]?.reviewIds.slice(0, 2) || []),
      ];
    }
    if (mode === "liked") {
      text = praise;
      evidenceIds = analysis.positive.slice(0, 2).flatMap((t) => t.reviewIds);
    }
    if (mode === "concerns") {
      text = concern;
      evidenceIds = analysis.negative.flatMap((t) => t.reviewIds);
    }
    if (mode === "reasons") {
      text = `${overview} ${c.criticalPrefix}: ${analysis.criticalCount}/${reviews.length}. ${concern} ${c.reasonLimit}`;
      evidenceIds = reviews.filter((r) => r.rating <= 3).map((r) => r.id);
    }
    if (mode === "fit") {
      text = [
        analysis.average >= 4.5 ? c.neutralFit : c.mixedFit,
        analysis.negative.some((t) => t.topic === "wifi") ? c.workFit : "",
        analysis.negative.some((t) => t.topic === "noise") ? c.quietFit : "",
      ]
        .filter(Boolean)
        .join(" ");
      evidenceIds = analysis.negative.flatMap((t) => t.reviewIds);
    }
  }
  return { text, evidenceIds: [...new Set(evidenceIds)].slice(0, 3), analysis };
}
