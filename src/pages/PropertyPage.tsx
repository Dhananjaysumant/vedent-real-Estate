import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Cube } from '../components/ui/Icons';
import { Reveal } from '../components/ui/Reveal';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  floors,
  formatArea,
  formatPrice,
  getProperty,
  properties,
  PRICE_NOTE,
  type FloorId,
} from '../data/properties';
import { SITE } from '../lib/site';
import { EnquiryForm } from '../components/forms/EnquiryForm';
import { NotFoundPage } from './NotFoundPage';

export function PropertyPage() {
  const { slug } = useParams<{ slug: string }>();
  const property = getProperty(slug);
  const [activeFloor, setActiveFloor] = useState<FloorId>('ground');

  if (!property) return <NotFoundPage />;

  const nextProperty = properties[(properties.findIndex((item) => item.slug === property.slug) + 1) % properties.length];
  const activeFloorData = floors.find((floor) => floor.id === activeFloor) ?? floors[0];

  return (
    <>
      <PropertyMeta property={property} />

      <section className="property-hero">
        <img
          className="property-hero__image"
          src={property.heroImage}
          alt={property.heroAlt}
          fetchPriority="high"
          decoding="async"
          width={1600}
          height={1000}
        />
        <div className="property-hero__veil" aria-hidden="true" />
        <div className="container property-hero__inner">
          <Link to="/residences" className="property-hero__back">
            <ArrowLeft size={14} />
            All residences
          </Link>
          <div className="property-hero__content">
            <div className="property-hero__eyebrow">
              <span>{property.collection}</span>
              <span className="dot" aria-hidden="true" />
              <span>
                {property.location.city}, {property.location.region}, {property.location.country}
              </span>
            </div>
            <h1>{property.name}</h1>
            <p>{property.tagline}</p>
          </div>
        </div>
      </section>

      <main id="main-content">
        <div className="property-bar">
          <div className="container property-bar__inner">
            <dl className="property-bar__facts">
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
                <dt>Style</dt>
                <dd>{property.style}</dd>
              </div>
            </dl>
            <div className="property-bar__price">
              <span className="meta">Illustrative from</span>
              <strong>{formatPrice(property)}</strong>
            </div>
            <a href="#property-enquiry" className="btn btn--solid btn--small property-bar__cta">
              Request a viewing
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        <section className="container section property-overview">
          <Reveal className="property-overview__aside">
            <span className="section-index">
              <span>01</span>
              <span>The residence</span>
            </span>
            <p className="meta">{property.location.setting}</p>
            <dl className="rule-list">
              <li>
                <dt>Architect</dt>
                <dd>{property.architect}</dd>
              </li>
              <li>
                <dt>Completion</dt>
                <dd>{property.completion}</dd>
              </li>
              <li>
                <dt>Site</dt>
                <dd>{property.plot}</dd>
              </li>
              <li>
                <dt>Price</dt>
                <dd>
                  {formatPrice(property)} <span className="muted">(illustrative)</span>
                </dd>
              </li>
            </dl>
          </Reveal>
          <Reveal className="property-overview__copy" delay={100}>
            <p className="property-overview__lede">{property.intro}</p>
            <div className="body-copy">
              {property.description.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <p className="property-note">{property.modelNote}</p>
            <p className="property-note">{PRICE_NOTE}</p>
          </Reveal>
        </section>

        <section className="container section property-highlights" aria-labelledby="highlights-title">
          <Reveal>
            <span className="eyebrow">Defining features</span>
            <h2 id="highlights-title">Three ideas, held in the architecture</h2>
          </Reveal>
          <div className="property-highlights__grid">
            {property.highlights.map((highlight, index) => (
              <Reveal key={highlight.title} delay={index * 80}>
                <article className="highlight-card">
                  <span className="highlight-card__num">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{highlight.title}</h3>
                  <p>{highlight.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container section property-gallery" aria-labelledby="gallery-title">
          <div className="section-head">
            <Reveal>
              <span className="section-index">
                <span>02</span>
                <span>Gallery</span>
              </span>
              <h2 id="gallery-title">A closer look</h2>
            </Reveal>
            <Reveal className="section-head__aside" delay={80}>
              <p>
                Architectural illustrations prepared for this demonstration. Final photography and film
                are pending asset production.
              </p>
            </Reveal>
          </div>
          <div className="gallery-grid">
            {property.gallery.map((image, index) => (
              <Reveal key={image.src + index} delay={index * 60}>
                <figure className={`figure figure--zoom gallery-grid__item gallery-grid__item--${index + 1}`}>
                  <img src={image.src} alt={image.alt} loading="lazy" decoding="async" width={1600} height={1000} />
                  <figcaption>
                    <span>{image.caption}</span>
                    <span className="meta">Illustrative</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container section property-details">
          <Reveal>
            <span className="section-index">
              <span>03</span>
              <span>Specification</span>
            </span>
            <h2>Materials &amp; accommodation</h2>
          </Reveal>
          <div className="property-details__grid">
            <Reveal className="property-details__col">
              <h3>Material palette</h3>
              <ul className="rule-list">
                {property.materials.map((material) => (
                  <li key={material}>
                    <span>{material}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="property-details__col" delay={80}>
              <h3>Selected features</h3>
              <ul className="rule-list">
                {property.features.map((feature) => (
                  <li key={feature}>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="container section floor-plans" aria-labelledby="plans-title">
          <div className="section-head">
            <Reveal>
              <span className="section-index">
                <span>04</span>
                <span>Plans</span>
              </span>
              <h2 id="plans-title">Accommodation by level</h2>
            </Reveal>
            <Reveal className="section-head__aside" delay={80}>
              <p>
                Illustrative plans, not measured surveys. Select a level to review its rooms and
                arrangement.
              </p>
            </Reveal>
          </div>

          <div className="plan-tabs" role="tablist" aria-label="Floor plans">
            {floors.map((floor) => (
              <button
                key={floor.id}
                type="button"
                role="tab"
                id={`plan-tab-${floor.id}`}
                aria-selected={activeFloor === floor.id}
                aria-controls="plan-panel"
                tabIndex={activeFloor === floor.id ? 0 : -1}
                className={activeFloor === floor.id ? 'is-active' : ''}
                onClick={() => setActiveFloor(floor.id)}
                onKeyDown={(event) => {
                  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
                  event.preventDefault();
                  const current = floors.findIndex((floor) => floor.id === activeFloor);
                  const next =
                    event.key === 'ArrowRight'
                      ? (current + 1) % floors.length
                      : (current + floors.length - 1) % floors.length;
                  setActiveFloor(floors[next].id);
                  document.getElementById(`plan-tab-${floors[next].id}`)?.focus();
                }}
              >
                <span>{floor.index}</span>
                {floor.name}
              </button>
            ))}
          </div>

          <div
            className="plan-panel"
            role="tabpanel"
            id="plan-panel"
            aria-labelledby={`plan-tab-${activeFloorData.id}`}
          >
            <div className="plan-panel__media">
              <img
                src={activeFloorData.planImage}
                alt={`Illustrative architectural plan of the ${activeFloorData.name.toLowerCase()}.`}
                loading="lazy"
                width={1200}
                height={900}
              />
            </div>
            <div className="plan-panel__copy">
              <span className="meta">
                {activeFloorData.index} · {activeFloorData.level} · {activeFloorData.area} m²
              </span>
              <h3>{activeFloorData.name}</h3>
              <p>{activeFloorData.details}</p>
              <ul>
                {activeFloorData.rooms.map((room) => (
                  <li key={room}>{room}</li>
                ))}
              </ul>
              <Link to="/explorer" className="link-arrow">
                Explore this level in 3D
                <Cube size={13} />
              </Link>
            </div>
          </div>
        </section>

        <section className="property-3d dark-section">
          <div className="container property-3d__inner">
            <div className="property-3d__media" aria-hidden="true">
              <img src="/assets/images/plan-ground.svg" alt="" loading="lazy" width={1200} height={900} />
            </div>
            <div>
              <span className="eyebrow eyebrow--light">Interactive architecture</span>
              <h2>Walk the residence before you visit.</h2>
              <p>
                The Vanguard 3D explorer presents the same architectural principles in a real-time model:
                four levels, seven spaces, three lighting conditions and a material palette you can
                change.
              </p>
              <Link to="/explorer" className="btn btn--gold">
                Enter the 3D explorer
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="property-enquiry dark-section" id="property-enquiry">
          <div className="container property-enquiry__grid">
            <div className="property-enquiry__copy">
              <span className="eyebrow eyebrow--light">Private viewing</span>
              <h2>Arrange a private viewing of {property.name}.</h2>
              <p>
                Share your details and a property specialist will respond to confirm availability and a
                suitable time. Demonstration enquiries are stored for evaluation of this project only.
              </p>
              <dl className="property-enquiry__facts">
                <div>
                  <dt>Collection</dt>
                  <dd>{property.collection}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>
                    {property.location.city}, {property.location.region}
                  </dd>
                </div>
                <div>
                  <dt>Illustrative price</dt>
                  <dd>{formatPrice(property)}</dd>
                </div>
              </dl>
            </div>
            <EnquiryForm
              propertySlug={property.slug}
              source={`property-${property.slug}`}
              title="Private enquiry"
              intro="Requests are reviewed personally. This does not create a confirmed appointment."
            />
          </div>
        </section>

        <nav className="property-next container" aria-label="Next residence">
          <span className="meta">Next residence</span>
          <Link to={`/residences/${nextProperty.slug}`}>
            <span>{nextProperty.collection}</span>
            <strong>{nextProperty.name}</strong>
            <ArrowUpRight size={20} />
          </Link>
        </nav>
      </main>
    </>
  );
}

function PropertyMeta({ property }: { property: NonNullable<ReturnType<typeof getProperty>> }) {
  usePageMeta({
    title: `${property.name}, ${property.location.city}`,
    description: `${property.intro} Illustrative demonstration residence in ${property.location.city}, ${property.location.country}.`,
    path: `/residences/${property.slug}`,
    image: property.heroImage,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Residence',
      name: property.name,
      description: property.intro,
      url: `${SITE.url}/residences/${property.slug}`,
      image: `${SITE.url}${property.heroImage}`,
      numberOfRooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.areaSqm,
        unitCode: 'MTK',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.location.city,
        addressRegion: property.location.region,
        addressCountry: property.location.country,
      },
      disambiguatingDescription:
        'Fictional demonstration property with illustrative pricing. Not a real listing, offer or statement of availability.',
    },
  });
  return null;
}
