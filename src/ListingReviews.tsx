import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react";
import type { Lang } from "./i18n";
import type { Listing } from "./data";
import { analyzeReviews, getListingReviews } from "./reviews";
import type { Review, TopicCount } from "./reviews";
import { reviewCopy, concernNames, reviewDate } from "./reviewContent";
import { summarizeReviews } from "./reviewSummary";
import type { SummaryMode } from "./reviewSummary";
import "./reviews.css";

function ReviewStars({ rating }: { rating: number }) {
  return (
    <span className="review-stars" role="img" aria-label={`${rating}/5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={12} fill={i < rating ? "currentColor" : "none"} />
      ))}
    </span>
  );
}
function ZlpyAI({
  reviews,
  lang,
  onSource,
}: {
  reviews: Review[];
  lang: Lang;
  onSource: (id: string) => void;
}) {
  const c = reviewCopy[lang];
  const [mode, setMode] = useState<SummaryMode>("summary");
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState("");
  const response = useMemo(
    () => summarizeReviews(reviews, lang, mode, question),
    [reviews, lang, mode, question],
  );
  const a = response.analysis;
  const number = (value: number) =>
    new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }).format(value);
  const topic = (item: TopicCount, negative = false) => (
    <button
      key={item.topic}
      onClick={() => {
        setQuestion(c[item.topic]);
        setInput("");
      }}
    >
      <span>{negative ? concernNames[lang][item.topic] : c[item.topic]}</span>
      <small>
        {item.count}/{reviews.length}
      </small>
      <ArrowUpRight size={12} />
    </button>
  );
  return (
    <section className="zlpy-card" aria-labelledby="zlpy-title">
      <div className="zlpy-card-glow" aria-hidden="true" />
      <div className="zlpy-header">
        <div className="zlpy-brand">
          <span className="zlpy-mark">
            <Sparkles size={21} strokeWidth={1.6} />
          </span>
          <span>
            <strong id="zlpy-title">
              zlpy <span>ai</span>
            </strong>
            <small>{c.assistant}</small>
          </span>
        </div>
        <span className="zlpy-demo">
          <span />
          Demo
        </span>
      </div>
      <p className="zlpy-intro">{c.intro}</p>
      <div className="zlpy-topics">
        <div>
          <h4>
            <ThumbsUp size={14} />
            {c.topLikes}
          </h4>
          <div>{a.positive.slice(0, 3).map((item) => topic(item))}</div>
        </div>
        <div>
          <h4>
            <TriangleAlert size={14} />
            {c.watch}
          </h4>
          <div>
            {a.negative.length ? (
              a.negative.slice(0, 3).map((item) => topic(item, true))
            ) : (
              <p>{c.none}</p>
            )}
          </div>
        </div>
      </div>
      <div className="zlpy-questions" aria-label={c.assistant}>
        {(
          ["summary", "liked", "concerns", "reasons", "fit"] as SummaryMode[]
        ).map((key) => (
          <button
            key={key}
            aria-pressed={!question && mode === key}
            className={!question && mode === key ? "active" : ""}
            onClick={() => {
              setQuestion("");
              setMode(key);
            }}
          >
            {c[key]}
          </button>
        ))}
      </div>
      <div
        className="zlpy-answer"
        aria-live="polite"
        key={`${lang}-${mode}-${question}`}
      >
        <div className="zlpy-answer-heading">
          <Sparkles size={13} />
          <strong>{question || c[mode]}</strong>
        </div>
        <p>{response.text}</p>
        {mode === "reasons" && !question && (
          <div className="zlpy-score-note">
            <span>
              {c.average}
              <strong>
                {number(a.average)}
                <small> / 5</small>
              </strong>
            </span>
            <span>
              {c.fiveGap}
              <strong>{number(5 - a.average)}</strong>
            </span>
            <p>{c.scoreNote}</p>
          </div>
        )}
        {response.evidenceIds.length > 0 && (
          <div className="zlpy-sources">
            <span>
              <ShieldCheck size={12} />
              {c.evidence}
            </span>
            <div>
              {response.evidenceIds.map((id) => {
                const r = reviews.find((review) => review.id === id)!;
                return (
                  <button key={id} onClick={() => onSource(id)} title={c.read}>
                    {r.author.split(" ")[0]}
                    <span>{r.rating}/5</span>
                    <ArrowUpRight size={12} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <form
        className="zlpy-input"
        onSubmit={(event) => {
          event.preventDefault();
          if (input.trim()) {
            setQuestion(input.trim());
            setInput("");
          }
        }}
      >
        <MessageSquareText size={16} />
        <input
          value={input}
          maxLength={300}
          onChange={(event) => setInput(event.target.value)}
          aria-label={c.input}
          placeholder={c.input}
        />
        <button type="submit" disabled={!input.trim()} aria-label={c.send}>
          <Send size={16} />
        </button>
      </form>
      <div className="zlpy-footer">
        <span>
          <Check size={12} />
          {reviews.length} {c.analyzed}
        </span>
        <details>
          <summary>
            {c.methodLabel}
            <ChevronDown size={11} />
          </summary>
          <p>{c.method}</p>
        </details>
      </div>
      <small className="zlpy-scope">{c.sourceNote}</small>
    </section>
  );
}
export default function ListingReviews({
  listing,
  lang,
}: {
  listing: Listing;
  lang: Lang;
}) {
  const c = reviewCopy[lang];
  const reviews = getListingReviews(listing.id),
    a = analyzeReviews(reviews);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [expanded, setExpanded] = useState(false);
  const [highlight, setHighlight] = useState("");
  const matched = reviews
    .filter(
      (r) =>
        filter === "all" ||
        (filter === "positive"
          ? r.rating >= 4
          : r.mentions.some((m) => m.sentiment === "negative")),
    )
    .slice()
    .sort((x, y) =>
      sort === "low"
        ? x.rating - y.rating
        : sort === "high"
          ? y.rating - x.rating
          : y.date.localeCompare(x.date),
    );
  const scoreLabel =
    a.average >= 4.7
      ? c.excellent
      : a.average >= 4.2
        ? c.great
        : a.average >= 3.5
          ? c.good
          : c.fair;
  const number = (value: number) =>
    new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }).format(value);
  useEffect(() => {
    if (!highlight) return;
    const frame = requestAnimationFrame(() => {
      const el = document.getElementById(highlight);
      el?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
      });
      el?.focus({ preventScroll: true });
    });
    const timer = setTimeout(() => setHighlight(""), 4500);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [highlight]);
  const source = (id: string) => {
    setFilter("all");
    setExpanded(true);
    setHighlight(id);
  };
  return (
    <div className="listing-reviews">
      <ZlpyAI reviews={reviews} lang={lang} onSource={source} />
      <section className="reviews-section" aria-labelledby="reviews-heading">
        <div className="reviews-heading">
          <span className="eyebrow">ZZZLEP STORIES</span>
          <h2 id="reviews-heading">{c.title}</h2>
          <p>{c.subtitle}</p>
        </div>
        <div className="reviews-overview">
          <div className="reviews-score">
            <strong>
              {number(a.average)}
              <span>/ 5</span>
            </strong>
            <span>
              <Star size={14} fill="currentColor" />
              {scoreLabel}
            </span>
            <small>
              {reviews.length} {c.total}
            </small>
          </div>
          <div className="reviews-distribution" aria-label={c.average}>
            {a.distribution.map((row) => (
              <div key={row.score}>
                <span>
                  {row.score}
                  <Star size={8} fill="currentColor" />
                </span>
                <span className="review-bar">
                  <i
                    style={{ width: `${(row.count / reviews.length) * 100}%` }}
                  />
                </span>
                <small>{row.count}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="reviews-toolbar">
          <div className="review-filters">
            {(["all", "positive", "critical"] as const).map((key) => (
              <button
                key={key}
                className={filter === key ? "active" : ""}
                aria-pressed={filter === key}
                onClick={() => {
                  setFilter(key);
                  setExpanded(false);
                }}
              >
                {c[key]}
                <span>
                  {key === "all"
                    ? reviews.length
                    : reviews.filter((r) =>
                        key === "positive"
                          ? r.rating >= 4
                          : r.mentions.some((m) => m.sentiment === "negative"),
                      ).length}
                </span>
              </button>
            ))}
          </div>
          <label className="review-sort">
            <ArrowDown size={13} />
            <select
              aria-label={c.recent}
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="recent">{c.recent}</option>
              <option value="low">{c.low}</option>
              <option value="high">{c.high}</option>
            </select>
          </label>
        </div>
        <div className="review-grid" key={filter}>
          {matched.slice(0, expanded ? reviews.length : 4).map((r, index) => (
            <article
              className={`guest-review ${highlight === r.id ? "is-highlighted" : ""}`}
              id={r.id}
              key={r.id}
              tabIndex={-1}
              style={{ animationDelay: `${(index % 4) * 55}ms` }}
            >
              <div className="guest-review-person">
                <span
                  className={`review-avatar tone-${(reviews.indexOf(r) + listing.id.length) % 5}`}
                >
                  {r.author
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")}
                </span>
                <span>
                  <strong>{r.author}</strong>
                  <small>{r.city}</small>
                </span>
                <span
                  className={`guest-review-rating ${r.rating <= 3 ? "is-mixed" : ""}`}
                >
                  {r.rating}
                  <Star size={10} fill="currentColor" />
                </span>
              </div>
              <div className="guest-review-meta">
                <ReviewStars rating={r.rating} />
                <time dateTime={r.date}>{reviewDate(r.date, lang)}</time>
              </div>
              <p>{r.text[lang]}</p>
            </article>
          ))}
        </div>
        {!matched.length && <p className="reviews-empty">{c.noReviews}</p>}
        {matched.length > 4 && (
          <button
            className="reviews-show-more btn btn-outline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? c.less : `${c.more} (${matched.length})`}
            <ArrowRight size={15} />
          </button>
        )}
        <p className="reviews-demo-note">
          <ShieldCheck size={12} />
          {c.demo}
        </p>
      </section>
    </div>
  );
}
