import { Link } from 'react-router-dom';
import { PageHero } from '../components/ui/PageHero';
import { ArrowUpRight } from '../components/ui/Icons';
import { Reveal } from '../components/ui/Reveal';
import { usePageMeta } from '../hooks/usePageMeta';
import { formatArea, formatPrice, properties } from '../data/properties';
import { SITE } from '../lib/site';

export function ResidencesPage() {
  usePageMeta({
    title: 'The Residences',
    description:
      'Explore three illustrative Vanguard Estates residences: a Malibu coastal villa, an Aspen alpine estate and Sydney harbour residences.',
    path: '/residences',
    image: '/assets/images/coastal-hero.svg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Vanguard Estates — illustrative demonstration residences',
      url: `${SITE.url}/residences`,
      numberOfItems: properties.length,
      itemListElement: properties.map((property, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: property.name,
        url: `${SITE.url}/residences/${property.slug}`,
      })),
    },
  });

  return (
    <>
      <PageHero
        eyebrow="The collection"
        title="The Residences"
        intro="Three landscapes, three distinct architectural responses — each conceived around privacy, natural light and a long view."
        image="/assets/images/aurelia-hero.svg"
        imageAlt="Layered contemporary harbour residences with deep planted loggias at dusk."
        crumb="Residences"
        meta={['Malibu, California', 'Aspen, Colorado', 'Sydney, Australia']}
      />

      <main id="main-content">
        <section className="container section residences-intro">
          <div className="section-head">
            <Reveal>
              <span className="section-index">
                <span>01</span>
                <span>Portfolio</span>
              </span>
              <h2>Three landscapes, one standard</h2>
            </Reveal>
            <Reveal className="section-head__aside" delay={100}>
              <p>
                Every Vanguard residence begins with a reading of its site: the path of the sun, the
                prevailing wind, the neighbours, the trees and the horizon.
              </p>
            </Reveal>
          </div>

          <div className="collection">
            {properties.map((property, index) => (
              <Reveal key={property.slug}>
                <article className={`collection-row${index % 2 === 1 ? ' collection-row--reverse' : ''}`}>
                  <Link
                    to={`/residences/${property.slug}`}
                    className="collection-row__media figure figure--zoom"
                    aria-label={`View ${property.name}`}
                  >
                    <img
                      src={property.heroImage}
                      alt={property.heroAlt}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      width={1600}
                      height={1000}
                    />
                    <span className="collection-row__index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </Link>

                  <div className="collection-row__body">
                    <div className="collection-row__eyebrow">
                      <span>{property.collection}</span>
                      <span className="dot" aria-hidden="true" />
                      <span>
                        {property.location.city}, {property.location.region}
                      </span>
                    </div>
                    <h2>
                      <Link to={`/residences/${property.slug}`}>{property.name}</Link>
                    </h2>
                    <p className="collection-row__tagline">{property.tagline}</p>
                    <p className="collection-row__intro">{property.intro}</p>

                    <dl className="collection-row__facts">
                      <div>
                        <dt>Bedrooms</dt>
                        <dd>{property.bedrooms}</dd>
                      </div>
                      <div>
                        <dt>Bathrooms</dt>
                        <dd>{property.bathrooms}</dd>
                      </div>
                      <div>
                        <dt>Internal area</dt>
                        <dd>{formatArea(property.areaSqm)} m²</dd>
                      </div>
                      <div>
                        <dt>Setting</dt>
                        <dd>{property.location.setting}</dd>
                      </div>
                    </dl>

                    <div className="collection-row__price">
                      <span className="meta">Illustrative from</span>
                      <strong>{formatPrice(property)}</strong>
                      <span className="tag">Demonstration pricing</span>
                    </div>

                    <div className="btn-row">
                      <Link to={`/residences/${property.slug}`} className="btn btn--solid btn--small">
                        Explore property
                        <ArrowUpRight size={13} />
                      </Link>
                      <Link to="/explorer" className="btn btn--ghost btn--small">
                        View in 3D
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="page-cta dark-section">
          <div className="container page-cta__inner">
            <div>
              <span className="eyebrow eyebrow--light">Not seeing the right fit?</span>
              <h2>A residence shaped around you.</h2>
              <p>
                Our atelier also undertakes a limited number of private architectural commissions. Speak
                with a specialist about a site, a landscape or a particular way of living.
              </p>
            </div>
            <div className="btn-row">
              <Link to="/contact#enquiry" className="btn btn--gold">
                Request a private consultation
                <ArrowUpRight size={14} />
              </Link>
              <Link to="/architecture" className="btn btn--light">
                Our approach
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
