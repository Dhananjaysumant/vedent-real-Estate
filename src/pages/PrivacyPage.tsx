import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { CONTACT } from '../lib/site';

const sections = [
  { id: 'who-we-are', title: 'Who we are' },
  { id: 'data-we-collect', title: 'Data we collect' },
  { id: 'how-we-use', title: 'How we use data' },
  { id: 'ai-concierge', title: 'AI concierge' },
  { id: 'storage-security', title: 'Storage & security' },
  { id: 'retention', title: 'Retention' },
  { id: 'your-rights', title: 'Your rights' },
  { id: 'cookies', title: 'Cookies & analytics' },
  { id: 'contact-privacy', title: 'Contact' },
];

export function PrivacyPage() {
  usePageMeta({
    title: 'Privacy Policy',
    description:
      'Privacy notice for the Vanguard Estates demonstration website, covering enquiry data, consent, the AI concierge, retention, security and your rights.',
    path: '/privacy',
    noindex: true,
  });

  return (
    <main id="main-content" className="legal-page">
      <header className="legal-hero">
        <div className="container">
          <span className="eyebrow">Legal</span>
          <h1>Privacy Policy</h1>
          <p>
            How this demonstration handles the limited personal information you choose to share, and how
            the Vanguard Private Concierge processes messages.
          </p>
          <span className="meta">Last updated: 23 November 2026</span>
        </div>
      </header>

      <div className="container legal-layout">
        <nav className="legal-toc" aria-label="On this page">
          <span className="meta">On this page</span>
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="legal">
          <div className="legal-notice">
            <strong>Demonstration notice.</strong> Vanguard Estates is a fictional brand presented as an
            interactive design/engineering demonstration. This notice is a project template, not legal
            advice, and has not been reviewed for compliance with any particular jurisdiction. Obtain
            professional legal review before using it for a commercial service.
          </div>

          <section id="who-we-are">
            <h2>1. Who we are</h2>
            <p>
              “Vanguard Estates” is the demonstration brand operating this website. In this notice, “we”,
              “us” and “our” refer to that project. The website is not a real estate agency, brokerage or
              property developer, and it does not offer real property for sale.
            </p>
            <p>
              Contact details displayed on the website use reserved demonstration information. A working
              project contact address is provided at the end of this notice.
            </p>
          </section>

          <section id="data-we-collect">
            <h2>2. Data we collect</h2>
            <p>We collect only the information you actively submit through the private viewing form:</p>
            <ul>
              <li>Full name (required).</li>
              <li>Email address (required).</li>
              <li>Telephone number (optional).</li>
              <li>Property of interest, preferred date and message (optional).</li>
              <li>Preferred contact method (email or telephone).</li>
              <li>Your consent to storage and contact (required).</li>
            </ul>
            <p>
              We also process a one-way, salted hash of your IP address and a coarse timestamp for rate
              limiting and abuse prevention. We do not request financial account details, payment card
              data, government identification, health information or other sensitive personal data.
              Please do not include such information in the message field.
            </p>
            <p>
              The AI concierge processes the messages you type into that panel. Do not include sensitive
              personal information in concierge messages.
            </p>
          </section>

          <section id="how-we-use">
            <h2>3. How we use data</h2>
            <p>We use enquiry information to:</p>
            <ul>
              <li>Review and respond to your demonstration enquiry.</li>
              <li>Understand interest in the fictional residences for evaluation of this project.</li>
              <li>Protect the service against spam, abuse and automated submission.</li>
              <li>Maintain basic operational records and honour retention limits.</li>
            </ul>
            <p>
              We do not sell enquiry data, use it for advertising, or share it with property agents or
              third-party marketers. A real deployment would require a lawful basis for processing,
              clear disclosures and appropriate processor agreements.
            </p>
          </section>

          <section id="ai-concierge">
            <h2>4. AI concierge</h2>
            <p>
              The Vanguard Private Concierge is an AI-assisted demonstration. Messages are sent to a
              server-side endpoint and may be forwarded to Google’s Gemini API for generation. The API
              key is held server-side and is never exposed to the browser.
            </p>
            <p>
              The assistant is constrained to a trusted property knowledge base. It is instructed not to
              provide legal, financial, investment, availability or booking confirmation. Conversations
              are held in memory for the duration of your visit and are not stored with your enquiry.
              Google’s handling of API requests is governed by its own terms and privacy documentation.
            </p>
            <p>
              When no AI service is configured or the service is unavailable, the concierge answers from a
              deterministic fallback knowledge base. It is clearly labelled accordingly.
            </p>
          </section>

          <section id="storage-security">
            <h2>5. Storage &amp; security</h2>
            <p>
              Enquiries are stored in a server-side JSON Lines file outside the public web root, with
              restricted filesystem access. The demo applies server-side validation, request-size limits,
              rate limiting, security headers, input sanitisation and a restrictive cross-origin policy.
              AI requests are protected by server-side limits and prompt-injection defences.
            </p>
            <p>
              No system is completely secure. We cannot guarantee absolute confidentiality, availability
              or security, and we do not claim security certification. Do not submit information you
              would not be comfortable storing in a demonstration environment.
            </p>
          </section>

          <section id="retention">
            <h2>6. Retention</h2>
            <p>
              Demonstration enquiries are retained for up to 12 months for project evaluation, after which
              they should be deleted. Rate-limit counters are ephemeral. A production deployment should
              document a formal retention schedule and implement automated deletion.
            </p>
          </section>

          <section id="your-rights">
            <h2>7. Your rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, delete, restrict or
              object to the processing of your personal data, and to withdraw consent. Because this is a
              demonstration, the most reliable way to exercise these rights is to use the project contact
              below and identify the reference number shown after submission.
            </p>
            <p>
              You may withdraw consent at any time. Withdrawal does not affect processing carried out
              before withdrawal. You may also have the right to complain to a data protection authority in
              your jurisdiction.
            </p>
          </section>

          <section id="cookies">
            <h2>8. Cookies &amp; analytics</h2>
            <p>
              This application does not set advertising or analytics cookies. Fonts and visual assets are
              served locally. Enquiry preferences are held in memory and are not persisted to cookies or
              local storage. The 3D viewer does not transmit model data to a third party.
            </p>
            <p>
              Server logs may record standard request metadata for security and rate limiting. Any future
              analytics would require an updated notice and, where required, consent.
            </p>
          </section>

          <section id="contact-privacy">
            <h2>9. Contact</h2>
            <p>
              For privacy questions about this demonstration, use the project contact form and mark your
              message “Privacy request”. Displayed brand contact details are fictional; the reserved
              demonstration address is <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </p>
            <p>
              This notice may be updated as the demonstration evolves. Material changes will be reflected
              here with a revised date.
            </p>
          </section>

          <div className="legal-footer">
            <Link to="/terms" className="link-arrow">
              Read the Terms of Use
            </Link>
            <Link to="/contact" className="link-arrow">
              Contact the project
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
