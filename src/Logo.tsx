import { useId } from "react";
/** A compact folded-Z monogram: one recognizable silhouette at small sizes. */
export default function Logo() {
  const id = useId();
  return (
    <span className="logo logo-refined logo-signature">
      <svg
        className="brand-mark"
        width="43"
        height="43"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={id}
            x1="5"
            y1="2"
            x2="44"
            y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7160da" />
            <stop offset="1" stopColor="#3e319e" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="14" fill={`url(#${id})`} />
        <path
          d="M14 15.5h20.5L14 33h20.5"
          stroke="white"
          strokeWidth="4.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m36.5 7.5 1.4 4.1 4.1 1.4-4.1 1.4-1.4 4.1-1.4-4.1-4.1-1.4 4.1-1.4z"
          fill="#e9d3aa"
        />
        <path
          d="m16 30 14-12"
          stroke="#d9d2ff"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity=".65"
        />
      </svg>
      <span className="brand-type">
        <span>
          zzzlep<span className="brand-period">.</span>
        </span>
        <small>stay a little closer</small>
      </span>
    </span>
  );
}
