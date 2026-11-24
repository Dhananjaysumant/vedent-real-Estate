import { Link } from 'react-router-dom';
import { ArrowUpRight } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';

export function BrandIntro() {
  return (
    <section className="intro container section" id="introduction" aria-labelledby="intro-title">
      <div className="intro__top">
        <Reveal className="intro__heading">
          <span className="section-index">
            <span>01</span>
            <span>Introduction</span>
          </span>
          <h2 id="intro-title">
            Beyond the
            <br />
            <em>ordinary.</em>
          </h2>
        </Reveal>
        <Reveal className="intro__copy" delay={120}>
          <p className="lede">
            We create residences that begin with the land, and end with a way of living that feels
            entirely your own.
          </p>
          <div className="body-copy">
            <p>
              Vanguard Estates is a residential development studio working at the intersection of
              architecture, landscape and craft. Each commission is developed slowly, in close
              collaboration with its architects, makers and future owner.
            </p>
            <p>
              Our work is guided by proportion, natural material and the quality of light. We design
              for the long view: houses that settle into their surroundings, age with grace, and become
              more beautiful in use.
            </p>
          </div>
          <div className="intro__signature">
            <span>Vanguard Atelier</span>
            <span className="meta">Architecture &amp; Development</span>
          </div>
        </Reveal>
      </div>

      <Reveal className="intro__media">
        <figure className="figure figure--zoom intro__figure-main">
          <img
            src="/assets/images/coastal-interior.svg"
            alt="Interior of a Vanguard villa with warm oak floors, a limestone wall and full-height glass opening to the ocean."
            loading="lazy"
            decoding="async"
            width={1600}
            height={1000}
          />
          <figcaption>
            <span>Coastal Collection · Living pavilion</span>
            <span className="meta">Illustrative visual</span>
          </figcaption>
        </figure>
        <figure className="figure figure--zoom intro__figure-side">
          <img
            src="/assets/images/detail-stone.svg"
            alt="Material study showing honed limestone, warm oak slats and bronze detailing in afternoon light."
            loading="lazy"
            decoding="async"
            width={1600}
            height={1000}
          />
          <figcaption>
            <span>Material study</span>
            <span className="meta">Limestone / oak</span>
          </figcaption>
        </figure>
      </Reveal>

      <Reveal className="intro__stats">
        <div className="intro__stat">
          <strong>03</strong>
          <span>Signature collections</span>
        </div>
        <div className="intro__stat">
          <strong>12</strong>
          <span>Residences in development</span>
        </div>
        <div className="intro__stat">
          <strong>01</strong>
          <span>Integrated atelier</span>
        </div>
      </Reveal>
      <p className="intro__footnote">
        Studio figures are illustrative for this demonstration and do not represent verified company
        data.
      </p>

      <Reveal className="intro__link">
        <Link to="/about" className="link-arrow">
          The studio behind the residences
          <ArrowUpRight size={13} />
        </Link>
      </Reveal>
    </section>
  );
}
