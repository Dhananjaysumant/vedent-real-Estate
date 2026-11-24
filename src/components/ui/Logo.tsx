import { Link } from 'react-router-dom';

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 34 38"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1.5 37V17C1.5 8.43 8.43 1.5 17 1.5S32.5 8.43 32.5 17v20"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M7.5 37V18.75C7.5 13.5 11.75 9.25 17 9.25s9.5 4.25 9.5 9.5V37"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity=".5"
      />
      <path d="M11.75 17.5 17 29.5l5.25-12" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

export function Logo({ link = true }: { link?: boolean }) {
  const content = (
    <>
      <BrandMark className="brand__mark" />
      <span className="brand__text">
        <span className="brand__name">Vanguard</span>
        <span className="brand__sub">Estates</span>
      </span>
    </>
  );

  if (!link) return <span className="brand">{content}</span>;

  return (
    <Link to="/" className="brand" aria-label="Vanguard Estates — return to home">
      {content}
    </Link>
  );
}
