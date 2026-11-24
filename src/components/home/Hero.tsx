import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '../ui/Icons';
import { HeroScene } from '../three/HeroScene';
import { detectWebGL } from '../three/webgl';
import { useInView } from '../../hooks/useUi';

export function Hero() {
  const [ready, setReady] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const { ref: sectionRef, inView } = useInView<HTMLElement>({ once: false, threshold: 0 });
  const webgl = useMemo(() => detectWebGL(), []);

  useEffect(() => {
    const onChange = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return (
    <section className="hero" ref={sectionRef} aria-labelledby="hero-title">
      {webgl && <HeroScene active={inView && pageVisible} onReady={() => setReady(true)} />}
      <img
        className={`hero__poster${ready ? ' is-hidden' : ''}`}
        src="/assets/images/coastal-hero.svg"
        alt="Architectural rendering of a contemporary coastal villa above the Pacific at golden hour, with limestone terraces, glass facades and an infinity pool."
        fetchPriority="high"
        decoding="async"
      />
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__badge" aria-hidden="true">
        <span className="dot" />
        Coastal prototype · 3D
      </div>
      <div className="hero__topline">
        <span>Private residential development</span>
        <span>Malibu · Aspen · Sydney</span>
      </div>

      <div className="container hero__content">
        <div className="hero__grid">
          <h1 className="hero__title" id="hero-title">
            <span>
              <span>The Art</span>
            </span>
            <span>
              <span>
                of Living<em>.</em>
              </span>
            </span>
          </h1>
          <div className="hero__aside">
            <p className="hero__support">
              Discover residences where extraordinary architecture, thoughtful design, and exceptional
              living come together.
            </p>
            <div className="hero__ctas">
              <Link to="/residences" className="btn btn--light">
                Explore our residences
                <ArrowUpRight size={14} />
              </Link>
              <Link to="/architecture" className="btn btn--light">
                Discover our vision
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="hero__bottom">
          <div className="hero__locations">
            <span>Malibu, California</span>
            <span>Aspen, Colorado</span>
            <span>Sydney, Australia</span>
          </div>
          <a href="#introduction" className="hero__scroll" aria-label="Scroll to our introduction">
            <span className="hero__scroll-label">Scroll</span>
            <span className="hero__scroll-line" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
