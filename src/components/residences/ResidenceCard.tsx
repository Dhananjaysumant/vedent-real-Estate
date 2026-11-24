import { Link } from 'react-router-dom';
import { ArrowUpRight } from '../ui/Icons';
import { formatArea, formatPrice, type Residence } from '../../data/properties';

export function ResidenceCard({ property, wide = false }: { property: Residence; wide?: boolean }) {
  return (
    <article className={`residence-card${wide ? ' residence-card--wide' : ''}`}>
      <Link
        to={`/residences/${property.slug}`}
        className="residence-card__media"
        aria-label={`Explore ${property.name}, ${property.location.city}`}
      >
        <span className="residence-card__tag">Illustrative demonstration</span>
        <img
          src={property.heroImage}
          alt={property.heroAlt}
          loading={wide ? 'eager' : 'lazy'}
          decoding="async"
          width={1600}
          height={1000}
        />
        <span className="residence-card__explore" aria-hidden="true">
          Explore property
          <ArrowUpRight size={12} />
        </span>
      </Link>

      <div className="residence-card__info">
        <div>
          <div className="residence-card__eyebrow">
            <span>{property.collection}</span>
            <span className="dot" aria-hidden="true" />
            <span>
              {property.location.city}, {property.location.region}
            </span>
          </div>
          <h3 className="residence-card__name">
            <Link to={`/residences/${property.slug}`}>{property.name}</Link>
          </h3>
        </div>
        <div className="residence-card__price">
          <span className="meta">Illustrative from</span>
          <strong>{formatPrice(property)}</strong>
        </div>
      </div>

      <div className="residence-card__specs">
        <span>{property.style}</span>
        <span>{property.bedrooms} bedrooms</span>
        <span>{property.bathrooms} bathrooms</span>
        <span>{formatArea(property.areaSqm)} m²</span>
      </div>
    </article>
  );
}
