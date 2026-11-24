import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  image: string;
  imageAlt: string;
  meta?: string[];
  crumb: string;
}

export function PageHero({ eyebrow, title, intro, image, imageAlt, meta, crumb }: PageHeroProps) {
  return (
    <section className="page-hero">
      <img className="page-hero__image" src={image} alt={imageAlt} fetchPriority="high" decoding="async" />
      <div className="page-hero__veil" aria-hidden="true" />
      <div className="container page-hero__inner">
        <nav className="page-hero__crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{crumb}</span>
        </nav>
        <div className="page-hero__content">
          <span className="eyebrow eyebrow--light">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
        {meta && meta.length > 0 && (
          <ul className="page-hero__meta">
            {meta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
