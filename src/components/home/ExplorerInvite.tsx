import { Link } from 'react-router-dom';
import { ArrowUpRight, Cube } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';

export function ExplorerInvite() {
  return (
    <section className="explorer-invite dark-section" id="explorer" aria-labelledby="explorer-title">
      <div className="container explorer-invite__grid">
        <Reveal className="explorer-invite__copy">
          <span className="section-index">
            <span>03</span>
            <span>Signature feature</span>
          </span>
          <h2 id="explorer-title">
            Experience architecture <em>differently.</em>
          </h2>
          <p className="explorer-invite__body">
            Step inside a real-time architectural model. Move around the villa, separate its floors,
            change the light from noon to night, and explore the materials and spaces that define it.
          </p>
          <div className="explorer-invite__instruction">
            <Cube size={18} />
            Drag to explore. Select a floor. Discover the details.
          </div>
          <div className="explorer-invite__actions">
            <Link to="/explorer" className="btn btn--gold">
              Enter 3D experience
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="explorer-invite__capabilities">
            <span>Day · sunset · night</span>
            <span>Four floors</span>
            <span>Seven architectural hotspots</span>
            <span>Six material finishes</span>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <Link
            to="/explorer"
            className="explorer-mock"
            aria-label="Open the interactive 3D villa explorer"
          >
            <div className="explorer-mock__bar">
              <span>Vanguard Villa / Level 00</span>
              <span className="explorer-mock__lights" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="explorer-mock__screen">
              <img
                src="/assets/images/plan-ground.svg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={1200}
                height={900}
              />
              <div className="explorer-mock__floors" aria-hidden="true">
                <span>G</span>
                <span>1</span>
                <span>2</span>
                <span>R</span>
              </div>
              <span className="explorer-mock__hotspot explorer-mock__hotspot--a" aria-hidden="true" />
              <span className="explorer-mock__hotspot explorer-mock__hotspot--b" aria-hidden="true" />
              <span className="explorer-mock__hotspot explorer-mock__hotspot--c" aria-hidden="true" />
              <span className="explorer-mock__label">
                <i className="explorer-mock__live" aria-hidden="true" />
                Real-time 3D · open explorer
              </span>
            </div>
            <div className="explorer-mock__foot">
              <span>Architectural prototype · illustrative</span>
              <span>Open →</span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
