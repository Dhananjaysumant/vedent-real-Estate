import { Link } from 'react-router-dom';
import { ArrowUpRight } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import { materials } from '../../data/properties';

const principles = [
  {
    title: 'The right material, in the right place',
    body: 'Honed limestone underfoot, oak where the hand meets the house, bronze at the horizon line. Materials are selected for touch, patina and the way they hold light.',
  },
  {
    title: 'Light as a building material',
    body: 'Orientation, overhang and glazing are designed together, so rooms are lit by the day rather than by switches. Shade is given as much attention as sunlight.',
  },
  {
    title: 'Rooms that know their purpose',
    body: 'Spatial planning begins with daily rituals: where coffee is made, where work ends, where guests gather, and where the day can be watched from a quiet chair.',
  },
  {
    title: 'A long-term architecture',
    body: 'Low-energy systems, durable envelopes and native planting reduce the resources a house needs without reducing the pleasure it gives.',
  },
  {
    title: 'The garden is part of the plan',
    body: 'Inside and outside are composed as one continuous experience, with terraces, courts and planting that extend the living space into the landscape.',
  },
  {
    title: 'Craft you can read',
    body: 'Seams, reveals and junctions are detailed with the same care as the overall composition. The quality of the making is visible in the quiet moments.',
  },
];

export function Philosophy() {
  return (
    <section className="philosophy container section" id="philosophy" aria-labelledby="philosophy-title">
      <div className="philosophy__grid">
        <Reveal className="philosophy__media">
          <figure className="figure figure--zoom philosophy__media-main">
            <img
              src="/assets/images/detail-stone.svg"
              alt="Close material study of limestone, oak and bronze in raking afternoon light."
              loading="lazy"
              decoding="async"
              width={1600}
              height={1000}
            />
            <figcaption>
              <span>Material honesty</span>
              <span className="meta">Honed limestone</span>
            </figcaption>
          </figure>
          <div className="philosophy__media-sub">
            <figure className="figure figure--zoom">
              <img
                src="/assets/images/detail-timber.svg"
                alt="Charred timber battens meeting quarry-split stone with a thin reveal of warm interior light."
                loading="lazy"
                decoding="async"
                width={1600}
                height={1000}
              />
            </figure>
            <figure className="figure figure--zoom">
              <img
                src="/assets/images/coastal-interior.svg"
                alt="Warm interior with a view to the ocean through full-height glass."
                loading="lazy"
                decoding="async"
                width={1600}
                height={1000}
              />
            </figure>
          </div>
        </Reveal>

        <div className="philosophy__content">
          <Reveal>
            <span className="section-index">
              <span>04</span>
              <span>Philosophy</span>
            </span>
            <h2 id="philosophy-title">
              Form, light
              <br />& <em>material.</em>
            </h2>
            <p className="philosophy__intro">
              Architecture is not an object placed on a site. It is a way of framing the landscape, the
              climate and the rhythm of a life.
            </p>
          </Reveal>

          <div className="principles">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 40}>
                <article className="principle">
                  <span className="principle__num">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="philosophy__link" delay={100}>
            <Link to="/architecture" className="link-arrow">
              Architecture &amp; philosophy
              <ArrowUpRight size={13} />
            </Link>
          </Reveal>
        </div>
      </div>

      <Reveal className="materials-strip" aria-label="Material palette">
        {materials.map((material) => (
          <Link
            key={material.id}
            to="/explorer"
            style={{ '--swatch': material.swatch } as React.CSSProperties}
            aria-label={`${material.name} — explore this finish in 3D`}
          >
            <span>{material.name}</span>
            <small>{material.origin}</small>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
