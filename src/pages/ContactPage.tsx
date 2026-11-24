import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageHero } from '../components/ui/PageHero';
import { EnquiryForm } from '../components/forms/EnquiryForm';
import { ArrowUpRight, Mail, MapPin, Phone } from '../components/ui/Icons';
import { Reveal } from '../components/ui/Reveal';
import { CONTACT } from '../lib/site';

const steps = [
  {
    number: '01',
    title: 'Share your interest',
    body: 'Tell us which residence or collection has caught your attention, and how you would prefer to be contacted.',
  },
  {
    number: '02',
    title: 'A personal response',
    body: 'A property specialist reviews your enquiry and responds to discuss the residence, materials and availability of a viewing.',
  },
  {
    number: '03',
    title: 'Arrange the visit',
    body: 'We agree a time and prepare the details for your private consultation. A viewing is only confirmed once we have spoken.',
  },
];

const faqs = [
  {
    question: 'Are these real properties for sale?',
    answer:
      'No. Vanguard Estates is a fictional brand created for this interactive demonstration. All residences, addresses, prices, availability and studio details are illustrative and do not constitute an offer or listing.',
  },
  {
    question: 'What happens after I send an enquiry?',
    answer:
      'Your request is stored securely and reviewed for the purpose of this demonstration. In a real deployment, a property specialist would respond using your preferred contact method to discuss the residence and confirm a viewing time. No appointment is created automatically.',
  },
  {
    question: 'Can I explore the architecture in 3D?',
    answer:
      'Yes. The interactive explorer lets you orbit a representative villa, separate its four levels, change lighting between day, sunset and night, apply material finishes and open architectural hotspots. A non-WebGL photographic alternative is available if your device cannot run the 3D scene.',
  },
  {
    question: 'How is my enquiry data handled?',
    answer:
      'We collect only the information you choose to provide: name, email, optional telephone, property preference, optional date and message. Consent is required before storage. We do not request financial, identity or sensitive information, and we do not sell enquiry data. See the Privacy Policy for details.',
  },
  {
    question: 'Is the AI concierge giving professional advice?',
    answer:
      'No. The Vanguard Private Concierge answers from a fixed, trusted demonstration knowledge base. It does not provide legal, financial, investment or availability advice, and it cannot confirm a booking. Any figures it quotes are illustrative.',
  },
];

export function ContactPage() {
  usePageMeta({
    title: 'Private Viewing & Contact',
    description:
      'Request a private viewing or speak with a Vanguard Estates property specialist. Demonstration enquiry workflow with consent, validation and confirmation-only requests.',
    path: '/contact',
    image: '/assets/images/coastal-pool.svg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Private Viewing — Vanguard Estates',
      description: 'Contact and private viewing request page for a fictional demonstration real estate brand.',
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Private viewing"
        title={
          <>
            Begin a
            <br />
            conversation.
          </>
        }
        intro="Arrange a private consultation with a Vanguard property specialist and discover a residence shaped around the way you want to live."
        image="/assets/images/coastal-pool.svg"
        imageAlt="The villa’s infinity pool and lit interiors at dusk."
        crumb="Contact"
        meta={['Private enquiries', 'Personal response', 'Confirmation-only requests']}
      />

      <main id="main-content">
        <section className="container section contact-layout" id="enquiry">
          <div className="contact-side">
            <Reveal>
              <span className="section-index">
                <span>01</span>
                <span>Private enquiries</span>
              </span>
              <h2>We are here to help.</h2>
              <p className="contact-side__lede">
                Every enquiry is reviewed personally. Share as much or as little as you wish — we only
                ask for what is needed to respond.
              </p>
              <div className="contact-details">
                <a href={`mailto:${CONTACT.email}`}>
                  <Mail size={17} />
                  <span>
                    <small>Email</small>
                    {CONTACT.email}
                  </span>
                </a>
                <a href={CONTACT.phoneHref}>
                  <Phone size={17} />
                  <span>
                    <small>Telephone</small>
                    {CONTACT.phone}
                  </span>
                </a>
                <div>
                  <MapPin size={17} />
                  <span>
                    <small>Demonstration studio</small>
                    {CONTACT.addressLines.slice(1).join(', ')}
                  </span>
                </div>
              </div>
              <p className="contact-note">
                Contact details use reserved demonstration information and are not monitored. Please use
                the enquiry form for this project.
              </p>
            </Reveal>

            <Reveal className="contact-steps" delay={100}>
              <h3>What happens next</h3>
              <ol>
                {steps.map((step) => (
                  <li key={step.number}>
                    <span>{step.number}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="contact-explore" delay={120}>
              <h3>Prefer to explore first?</h3>
              <p>
                You can discover the residences, study the architecture or spend time in the real-time 3D
                villa before making contact.
              </p>
              <div className="btn-row">
                <Link to="/residences" className="btn btn--ghost btn--small">
                  Residences
                </Link>
                <Link to="/explorer" className="btn btn--ghost btn--small">
                  3D Explorer
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="contact-form">
            <EnquiryForm source="contact" />
          </div>
        </section>

        <section className="container section contact-faq" aria-labelledby="faq-title">
          <div className="section-head">
            <Reveal>
              <span className="section-index">
                <span>02</span>
                <span>Questions</span>
              </span>
              <h2 id="faq-title">Before you enquire</h2>
            </Reveal>
            <Reveal className="section-head__aside" delay={80}>
              <p>
                Clear answers about the demonstration, the viewing workflow, your data and the AI
                concierge.
              </p>
            </Reveal>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question} className="faq">
                <summary>
                  {faq.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="container section offices-section">
          <div className="offices">
            <h2 className="offices__title">Representative locations</h2>
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
              Fictional offices shown for demonstration purposes. No walk-in appointments are available.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
