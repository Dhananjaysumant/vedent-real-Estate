import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageHero } from '../components/ui/PageHero';
import { ArrowUpRight } from '../components/ui/Icons';
import { Reveal } from '../components/ui/Reveal';
import { CONTACT } from '../lib/site';

const principles = [
  {
    title: 'Site before signature',
    body: 'We design with the land, not against it. Orientation, outlook and existing ecology determine the architecture before style does.',
  },
  {
    title: 'Room for life',
    body: 'Plans are generous where life happens and quiet where it does not. Storage, light and circulation receive the same attention as principal rooms.',
  },
  {
    title: 'A quieter definition of luxury',
    body: 'Luxury is space, privacy, natural material and time. It is not quantity, surface or spectacle.',
  },
];

const timeline = [
  { year: '2012', title: 'Atelier founded', body: 'Established as a small residential design practice with a focus on coastal and landscape architecture.' },
  { year: '2016', title: 'First alpine commission', body: 'The studio’s work extends into high-country sites, with a research focus on thermal mass and timber envelopes.' },
  { year: '2020', title: 'Integrated delivery', body: 'Architecture, interiors and landscape brought together under one studio to protect intent from concept to completion.' },
  { year: '2024', title: 'Harbour collection', body: 'The practice begins work on multi-residential projects with a house-scale approach to shared living.' },
];

const team = [
  { initials: 'AM', name: 'Amelia Marchetti', role: 'Founding Principal, Architecture' },
  { initials: 'JR', name: 'Jonah Reyes', role: 'Principal, Interiors & Materials' },
  { initials: 'SK', name: 'Sofia Kjeldsen', role: 'Director, Landscape & Sustainability' },
];

export function AboutPage() {
  usePageMeta({
    title: 'About Vanguard',
    description:
      'Vanguard Estates is a fictional residential development studio presented through this interactive demonstration. Explore the studio’s approach, principles and representative team.',
    path: '/about',
    image: '/assets/images/highlands-hero.svg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Vanguard Estates',
      description:
        'A representative studio profile created for an interactive luxury real estate demonstration.',
      about: { '@type': 'Organization', name: 'Vanguard Estates' },
    },
  });

  return (
    <>
      <PageHero
        eyebrow="The studio"
        title={
          <>
            A studio built
            <br />
            around the long view.
          </>
        }
        intro="Vanguard Estates is a residential design and development studio working across coastal, alpine and urban landscapes."
        image="/assets/images/highlands-hero.svg"
        imageAlt="A modern stone and timber alpine residence in a meadow beneath snow-covered mountains."
        crumb="About"
        meta={['Los Angeles', 'Sydney', 'Toronto']}
      />

      <main id="main-content">
        <section className="container section about-intro">
          <Reveal className="about-intro__heading">
            <span className="section-index">
              <span>01</span>
              <span>Our story</span>
            </span>
            <h2>Architecture that belongs.</h2>
            <p className="meta">Illustrative studio profile · demonstration project</p>
          </Reveal>
          <Reveal className="about-intro__copy" delay={100}>
            <p className="lede">
              We are a small atelier with a simple conviction: a house should make its inhabitants feel
              more connected to the place they live.
            </p>
            <div className="body-copy">
              <p>
                Vanguard Estates was conceived as a studio that could carry a residence from first site
                reading through architecture, interiors, landscape and delivery. That continuity protects
                the ideas that make a house feel whole.
              </p>
              <p>
                We work with a limited number of clients each year. Every project begins with a
                conversation about how you want to spend a Tuesday, not just how the house should look in
                a photograph.
              </p>
              <p>
                This website is a fictional demonstration of the brand, its service and its digital
                experience. Residences, prices, profiles, studio history and statistics are illustrative
                only and do not describe a real company or real listings.
              </p>
            </div>
            <div className="about-intro__quote">
              <p>
                “The best houses are not the loudest. They are the ones that make you feel completely at
                home in the landscape.”
              </p>
              <span>Amelia Marchetti · Founding Principal (illustrative)</span>
            </div>
          </Reveal>
        </section>

        <section className="container section about-media">
          <Reveal>
            <figure className="figure figure--zoom about-media__figure">
              <img
                src="/assets/images/coastal-interior.svg"
                alt="Warm minimalist living pavilion with a limestone wall and ocean view."
                loading="lazy"
                width={1600}
                height={1000}
              />
              <figcaption>
                <span>Coastal Collection · Living pavilion</span>
                <span className="meta">Illustrative architectural visual</span>
              </figcaption>
            </figure>
          </Reveal>
          <div className="about-media__side">
            <Reveal delay={80}>
              <h2>Principles before style.</h2>
              <p>
                We do not work with a signature look. Each house is the result of the same questions,
                asked of a particular place.
              </p>
            </Reveal>
            <div className="about-principles">
              {principles.map((principle, index) => (
                <Reveal key={principle.title} delay={index * 60}>
                  <article>
                    <span className="meta">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{principle.title}</h3>
                    <p>{principle.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="container section about-timeline" aria-labelledby="timeline-title">
          <div className="section-head">
            <Reveal>
              <span className="section-index">
                <span>02</span>
                <span>Evolution</span>
              </span>
              <h2 id="timeline-title">A considered evolution</h2>
            </Reveal>
            <Reveal className="section-head__aside" delay={80}>
              <p>Representative milestones created for this demonstration, not verified company history.</p>
            </Reveal>
          </div>
          <ol className="timeline">
            {timeline.map((item, index) => (
              <Reveal key={item.year} delay={index * 60}>
                <li>
                  <span className="timeline__year">{item.year}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="about-team dark-section section" aria-labelledby="team-title">
          <div className="container">
            <div className="section-head">
              <Reveal>
                <span className="section-index">
                  <span>03</span>
                  <span>The atelier</span>
                </span>
                <h2 id="team-title">Small by design</h2>
              </Reveal>
              <Reveal className="section-head__aside" delay={80}>
                <p>
                  A representative, fictional studio team. No real individuals are depicted on this
                  demonstration website.
                </p>
              </Reveal>
            </div>
            <div className="team-grid">
              {team.map((person, index) => (
                <Reveal key={person.name} delay={index * 80}>
                  <article className="team-card">
                    <span className="team-card__monogram" aria-hidden="true">
                      {person.initials}
                    </span>
                    <h3>{person.name}</h3>
                    <p>{person.role}</p>
                    <span className="tag">Illustrative profile</span>
                  </article>
                </Reveal>
              ))}
            </div>

            <div className="offices">
              <h3 className="offices__title">Studios</h3>
              <ul>
                {CONTACT.offices.map((office) => (
                  <li key={office.city}>
                    <span className="meta">{office.country}</span>
                    <strong>{office.city}</strong>
                    <span>{office.region}</span>
                  </li>
                ))}
              </ul>
              <p className="offices__note">
                Fictional studio locations. Correspondence for this demonstration is handled through the
                contact form only.
              </p>
            </div>
          </div>
        </section>

        <section className="page-cta">
          <div className="container page-cta__inner">
            <div>
              <span className="eyebrow">Begin a conversation</span>
              <h2>Discuss a residence with us.</h2>
              <p>
                Tell us about the landscape, the life and the timeline you have in mind. Private
                consultations are available by request.
              </p>
            </div>
            <div className="btn-row">
              <Link to="/contact#enquiry" className="btn btn--solid">
                Request a private consultation
                <ArrowUpRight size={14} />
              </Link>
              <Link to="/residences" className="btn btn--ghost">
                View the residences
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
