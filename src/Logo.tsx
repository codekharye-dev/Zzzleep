import { useId } from "react";
export default function Logo() {
  const id = useId();
  return (
    <span className="logo logo-refined">
      <svg
        className="brand-mark"
        viewBox="0 0 48 48"
        width="43"
        height="43"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={id}
            x1="5"
            y1="2"
            x2="43"
            y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8570ec" />
            <stop offset="1" stopColor="#4435b6" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="46" height="46" rx="15" fill={`url(#${id})`} />
        <path
          d="m11 26 12-11 13 11M15 24v12h19V24"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 27h8l-8 6h8"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M34 9a5.5 5.5 0 0 0 6 7 5.5 5.5 0 1 1-6-7Z" fill="#f8d78c" />
        <path
          d="m13 10 .7 2.3L16 13l-2.3.7L13 16l-.7-2.3L10 13l2.3-.7Z"
          fill="#d5c9ff"
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
