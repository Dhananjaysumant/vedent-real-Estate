import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from '../ui/Icons';
import { StoryScene } from '../three/StoryScene';
import { useInView, useReducedMotion } from '../../hooks/useUi';

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    number: '01',
    title: 'The Arrival',
    copy: 'A limestone plinth, a shallow reflecting court, and a roof plane that seems to hold the horizon. The house announces itself quietly.',
    image: '/assets/images/coastal-hero.svg',
    alt: 'The coastal villa seen from its arrival court at golden hour.',
  },
  {
    number: '02',
    title: 'The Architecture',
    copy: 'A cantilevered oak volume rests above a shadowed glass pavilion. Bronze mullions draw fine lines across the landscape; deep overhangs keep the sun at a distance.',
    image: '/assets/images/detail-stone.svg',
    alt: 'Close architectural study of limestone, oak and bronze.',
  },
  {
    number: '03',
    title: 'The Spaces',
    copy: 'Inside, the living pavilion opens nine metres to the terrace. A stone island anchors the kitchen; the primary suite floats above the water court in its own quiet volume.',
    image: '/assets/images/coastal-interior.svg',
    alt: 'The living pavilion with oak floors, limestone walls and ocean views.',
  },
  {
    number: '04',
    title: 'The Landscape',
    copy: 'Olive, rosemary and native grasses hold the house in a Mediterranean garden. The pool is set flush with the terrace, dark-lined so that it holds the sky.',
    image: '/assets/images/coastal-pool.svg',
    alt: 'The infinity pool and terrace at dusk.',
  },
  {
    number: '05',
    title: 'The Experience',
    copy: 'As evening arrives, the interiors begin to glow. Architecture becomes atmosphere — and the house becomes a place to live.',
    image: '/assets/images/aurelia-pool.svg',
    alt: 'A rooftop pool and lit pavilion at night.',
  },
];

export function ScrollStory() {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { ref: observerRef, inView } = useInView<HTMLDivElement>({ once: false, rootMargin: '500px' });

  useEffect(() => {
    if (inView) setMounted(true);
  }, [inView]);

  useEffect(() => {
    if (reducedMotion) return;
    const track = trackRef.current;
    if (!track) return;

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const index = Math.min(
          chapters.length - 1,
          Math.max(0, Math.floor(self.progress * chapters.length)),
        );
        setActive((current) => (current === index ? current : index));
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  const goToChapter = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const top = window.scrollY + track.getBoundingClientRect().top;
    const scrollable = track.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + scrollable * (index / (chapters.length - 1)),
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  if (reducedMotion) {
    return (
      <section className="story story--static dark-section" aria-labelledby="story-title">
        <div className="container story__header">
          <span className="eyebrow eyebrow--light">Chaptered perspective</span>
          <h2 id="story-title">An architectural narrative</h2>
          <p>
            Five views of the residence, from arrival to evening. This reduced-motion version presents
            the same narrative as a still sequence.
          </p>
        </div>
        <div className="container story-static">
          {chapters.map((chapter) => (
            <article key={chapter.number} className="story-static__chapter">
              <figure className="figure">
                <img src={chapter.image} alt={chapter.alt} loading="lazy" />
              </figure>
              <div>
                <span className="eyebrow eyebrow--light">Chapter {chapter.number}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.copy}</p>
                {chapter.number === '05' && (
                  <Link to="/explorer" className="link-arrow">
                    Enter the 3D explorer
                    <ArrowUpRight size={13} />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="story dark-section" aria-labelledby="story-title">
      <div className="container story__header">
        <div>
          <span className="eyebrow eyebrow--light">Chaptered perspective</span>
          <h2 id="story-title">An architectural narrative</h2>
        </div>
        <p>
          Scroll to move through the house and its landscape. Every chapter is yours to control — the
          experience never takes over the page.
        </p>
      </div>

      <div className="story__track" ref={trackRef} id="story-track">
        <div className="story__sticky" ref={observerRef}>
          {mounted && (
            <div className="story__scene" aria-hidden="true">
              <StoryScene progress={progressRef} chapter={active} active={inView} />
            </div>
          )}
          <div className="story__veil" aria-hidden="true" />

          <div className="story__topline">
            <span>Vanguard Estates · Coastal prototype</span>
            <Link to="/explorer" className="story__skip">
              Skip to 3D explorer
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="story__chapters" aria-live="polite">
            {chapters.map((chapter, index) => (
              <article
                key={chapter.number}
                className={`story-chapter${active === index ? ' is-active' : ''}`}
                aria-hidden={active !== index}
              >
                <span className="story-chapter__number">
                  Chapter {chapter.number} <i aria-hidden="true" /> 05
                </span>
                <h3>{chapter.title}</h3>
                <p>{chapter.copy}</p>
                {chapter.number === '05' && (
                  <div className="story-chapter__actions">
                    <Link to="/explorer" className="btn btn--light btn--small">
                      Enter the 3D experience
                      <ArrowUpRight size={13} />
                    </Link>
                    <Link to="/contact#enquiry" className="link-arrow">
                      Request a viewing
                      <ArrowUpRight size={12} />
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="story__rail" aria-label="Narrative chapters">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.number}
                type="button"
                className={active === index ? 'is-active' : ''}
                onClick={() => goToChapter(index)}
                aria-label={`Go to chapter ${chapter.number}: ${chapter.title}`}
                aria-current={active === index ? 'true' : undefined}
              >
                <span>{chapter.number}</span>
                <i aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="story__counter" aria-hidden="true">
            <strong>{chapters[active].number}</strong>
            <span>/ 05</span>
          </div>
        </div>
      </div>
    </section>
  );
}
