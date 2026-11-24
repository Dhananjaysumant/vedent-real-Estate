import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageHero } from '../components/ui/PageHero';
import { ArrowUpRight, Check } from '../components/ui/Icons';
import { Reveal } from '../components/ui/Reveal';
import { MaterialLab } from '../components/architecture/MaterialLab';

const method = [
  {
    number: '01',
    title: 'Read the site',
    copy: 'Before a line is drawn, we spend time on the land: the path of the sun, prevailing winds, existing trees, the sound of water and the quality of the horizon. The house begins as a response, not a signature.',
    image: '/assets/images/highlands-hero.svg',
    alt: 'The alpine estate sitting low in its meadow beneath the mountain ridge.',
  },
  {
    number: '02',
    title: 'Compose the light',
    copy: 'Rooms are arranged around the moments of light that matter. Deep overhangs, clerestories and reflected water are used to shape illumination across the day and the seasons, reducing reliance on artificial light.',
    image: '/assets/images/coastal-interior.svg',
    alt: 'Interior with full-height glass framing the ocean and natural light.',
  },
  {
    number: '03',
    title: 'Choose materials that age',
    copy: 'We prefer materials that improve with use: honed stone, fumed oak, bronze, unlacquered metal. Each is selected for its texture, its response to light and the way it will look in twenty years.',
    image: '/assets/images/detail-stone.svg',
    alt: 'Close study of limestone, oak and bronze materials.',
  },
  {
    number: '04',
    title: 'Build the landscape',
    copy: 'Garden, terrace and architecture are designed as one continuous place. Native and climate-appropriate planting extends the living space, supports biodiversity and reduces irrigation demand.',
    image: '/assets/images/coastal-pool.svg',
    alt: 'The pool terrace and garden at dusk.',
  },
];

const intentions = [
  {
    title: 'Energy',
    body: 'Passive orientation, high-performance envelopes and efficient systems are treated as primary design decisions, not later additions. Performance targets would be set per site.',
  },
  {
    title: 'Water',
    body: 'Drought-tolerant planting, rainwater harvesting and low-flow fixtures are considered from the outset. Pool and landscape systems are specified for low evaporation and minimal chemical use.',
  },
  {
    title: 'Material',
    body: 'Long-life, low-maintenance materials with transparent provenance are preferred. Where possible, stone and timber are sourced regionally, and existing site materials are reused.',
  },
];

export function ArchitecturePage() {
  usePageMeta({
    title: 'Architecture & Philosophy',
    description:
      'The architectural philosophy of Vanguard Estates: site, light, material and landscape, with an interactive material palette and design intentions for long-term living.',
    path: '/architecture',
    image: '/assets/images/detail-stone.svg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Architecture & Philosophy — Vanguard Estates',
      description:
        'An overview of the fictional Vanguard Estates design approach, presented as a demonstration.',
      isPartOf: { '@type': 'WebSite', name: 'Vanguard Estates' },
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Architecture & philosophy"
        title={
          <>
            Built from
            <br />
            the land.
          </>
        }
        intro="Architecture should feel inevitable: a house that belongs to its site, its climate and the life it is made for."
        image="/assets/images/detail-stone.svg"
        imageAlt="Architectural study of limestone, oak and bronze in warm raking light."
        crumb="Architecture"
        meta={['Site', 'Light', 'Material', 'Landscape']}
      />

      <main id="main-content">
        <section className="container section manifesto">
          <Reveal className="manifesto__statement">
            <span className="section-index">
              <span>01</span>
              <span>Manifesto</span>
            </span>
            <p>
              A residence is not a collection of rooms. It is a way of <em>holding the landscape</em>, and
              a way of noticing the day.
            </p>
          </Reveal>
          <Reveal className="manifesto__copy" delay={100}>
            <p>
              Our work begins with restraint. Rather than imposing a shape on a site, we look for the
              quiet, inevitable composition that the land already suggests — then resolve it with rigour,
              proportion and detail.
            </p>
            <p>
              The result is architecture that feels calm but not empty; generous but not excessive;
              specific to its place, yet enduring enough to be lived in for generations.
            </p>
            <p className="meta">Vanguard Atelier · Design principles</p>
          </Reveal>
          <Reveal className="manifesto__media">
            <figure className="figure figure--zoom">
              <img
                src="/assets/images/coastal-hero.svg"
                alt="Coastal villa composed of limestone, glass and a deep roof plane above the Pacific."
                loading="lazy"
                width={1600}
                height={1000}
              />
              <figcaption>
                <span>Coastal prototype · West elevation</span>
                <span className="meta">Illustrative</span>
              </figcaption>
            </figure>
          </Reveal>
        </section>

        <section className="container section method" aria-labelledby="method-title">
          <div className="section-head">
            <Reveal>
              <span className="section-index">
                <span>02</span>
                <span>Method</span>
              </span>
              <h2 id="method-title">A method of four movements</h2>
            </Reveal>
            <Reveal className="section-head__aside" delay={80}>
              <p>
                The same sequence guides every commission, from a coastal villa to a multi-residential
                harbour building.
              </p>
            </Reveal>
          </div>

          <div className="method__rows">
            {method.map((item, index) => (
              <Reveal key={item.number}>
                <article className={`method-row${index % 2 === 1 ? ' method-row--reverse' : ''}`}>
                  <figure className="figure figure--zoom method-row__media">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      width={1600}
                      height={1000}
                    />
                  </figure>
                  <div className="method-row__copy">
                    <span className="method-row__number">{item.number}</span>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="material-section" id="materials" aria-labelledby="material-title">
          <div className="container">
            <div className="section-head">
              <Reveal>
                <span className="section-index">
                  <span>03</span>
                  <span>Material palette</span>
                </span>
                <h2 id="material-title">Materials you can read</h2>
              </Reveal>
              <Reveal className="section-head__aside" delay={80}>
                <p>
                  A demonstration palette for the coastal prototype. Select a material to read its
                  character and where it is used. The same finishes can be applied to the live 3D model.
                </p>
              </Reveal>
            </div>
            <MaterialLab />
          </div>
        </section>

        <section className="sustainability dark-section section" aria-labelledby="sustainability-title">
          <div className="container">
            <div className="section-head">
              <Reveal>
                <span className="section-index">
                  <span>04</span>
                  <span>Long-term thinking</span>
                </span>
                <h2 id="sustainability-title">Designed for the long view</h2>
              </Reveal>
              <Reveal className="section-head__aside" delay={80}>
                <p>
                  These are design intentions for the demonstration project, not certifications or
                  measured performance claims. Targets would be established site by site.
                </p>
              </Reveal>
            </div>
            <div className="intentions">
              {intentions.map((item, index) => (
                <Reveal key={item.title} className="intention" delay={index * 80}>
                  <span className="intention__number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <span className="intention__check">
                    <Check size={13} /> Design intention
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="page-cta">
          <div className="container page-cta__inner">
            <div>
              <span className="eyebrow">Continue the exploration</span>
              <h2>See the ideas applied.</h2>
              <p>
                The interactive villa brings the material palette, floor planning and lighting strategy
                into a single real-time model.
              </p>
            </div>
            <div className="btn-row">
              <Link to="/explorer" className="btn btn--solid">
                Enter the 3D explorer
                <ArrowUpRight size={14} />
              </Link>
              <Link to="/contact#enquiry" className="btn btn--ghost">
                Speak with a specialist
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
