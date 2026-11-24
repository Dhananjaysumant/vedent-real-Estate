import { Link } from 'react-router-dom';
import { ArrowUpRight } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import { properties } from '../../data/properties';
import { ResidenceCard } from '../residences/ResidenceCard';

export function FeaturedResidences() {
  return (
    <section className="featured container section" id="featured" aria-labelledby="featured-title">
      <div className="section-head">
        <Reveal>
          <span className="section-index">
            <span>02</span>
            <span>The collection</span>
          </span>
          <h2 id="featured-title">Featured residences</h2>
        </Reveal>
        <Reveal className="section-head__aside" delay={120}>
          <p>
            Three demonstration residences, each shaped by a distinct landscape — the Pacific coast,
            the Colorado high country and Sydney’s harbour.
          </p>
          <Link to="/residences" className="link-arrow" style={{ marginTop: '1.5rem' }}>
            View all residences
            <ArrowUpRight size={13} />
          </Link>
        </Reveal>
      </div>

      <div className="residence-grid">
        {properties.map((property, index) => (
          <Reveal key={property.slug} delay={index * 80}>
            <ResidenceCard property={property} wide={index === 0} />
          </Reveal>
        ))}
      </div>

      <div className="featured__note">
        <span>
          Illustrative demonstration properties and pricing. Not real listings, offers or statements of
          availability.
        </span>
        <span className="pill-note">
          <span className="dot" aria-hidden="true" />
          All three collections
        </span>
      </div>
    </section>
  );
}
