import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { CONTACT } from '../lib/site';

export function TermsPage() {
  usePageMeta({
    title: 'Terms of Use',
    description:
      'Terms of use for the Vanguard Estates interactive demonstration, including the illustrative nature of properties, acceptable use, AI limitations and intellectual property.',
    path: '/terms',
    noindex: true,
  });

  return (
    <main id="main-content" className="legal-page">
      <header className="legal-hero">
        <div className="container">
          <span className="eyebrow">Legal</span>
          <h1>Terms of Use</h1>
          <p>
            The conditions that apply to your use of this demonstration website, its interactive 3D
            experience and the Vanguard Private Concierge.
          </p>
          <span className="meta">Last updated: 23 November 2026</span>
        </div>
      </header>

      <div className="container legal-layout legal-layout--simple">
        <article className="legal">
          <div className="legal-notice">
            <strong>Demonstration notice.</strong> Vanguard Estates is a fictional brand, created to
            demonstrate premium web design and engineering. This document is a project template, not legal
            advice. Obtain professional legal review before commercial use.
          </div>

          <section>
            <h2>1. Acceptance</h2>
            <p>
              By accessing this website you agree to these Terms of Use. If you do not agree, please
              discontinue use. These terms apply to all visitors, including those who explore the 3D model
              or submit an enquiry.
            </p>
          </section>

          <section>
            <h2>2. A demonstration, not an offer</h2>
            <p>
              Vanguard Estates is a fictional residential development brand. All properties, residences,
              addresses, locations, prices, areas, availability, completion dates, studio information,
              statistics, team profiles and images are illustrative and created for demonstration purposes.
              Nothing on this website constitutes:
            </p>
            <ul>
              <li>an offer, invitation or contract for the sale, lease or acquisition of real property;</li>
              <li>a statement of actual availability, title, planning permission or legal status;</li>
              <li>financial, investment, tax, legal, architectural or real estate advice;</li>
              <li>a guarantee of investment return, appreciation, approval or performance.</li>
            </ul>
            <p>
              You should not rely on any information here for a property, financial or legal decision. Any
              engagement with a real property would require independent verification and professional
              advice.
            </p>
          </section>

          <section>
            <h2>3. Interactive 3D content</h2>
            <p>
              The 3D explorer is a representative procedural model of a coastal villa prototype, not a
              measured survey of any specific residence. Geometry, dimensions, finishes, furniture,
              planting and lighting are indicative and may not correspond to a real building. Floor plans
              are illustrative and not to scale.
            </p>
            <p>
              Real-time 3D performance depends on your device, browser and graphics capability. A
              non-WebGL photographic alternative is provided. We do not guarantee uninterrupted
              availability of the 3D scene.
            </p>
          </section>

          <section>
            <h2>4. AI concierge</h2>
            <p>
              The Vanguard Private Concierge is an AI-assisted interface that answers from a fixed
              demonstration knowledge base. Outputs may be incomplete or inaccurate, are generated
              automatically, and do not constitute professional advice or a binding statement by any
              person. You must not rely on concierge outputs for legal, financial, investment or property
              decisions.
            </p>
            <p>
              The concierge cannot confirm availability, pricing, financing, approval or appointments. It
              does not create a contract. Do not submit confidential or sensitive information through the
              concierge.
            </p>
          </section>

          <section>
            <h2>5. Enquiries and requests</h2>
            <p>
              Submitting the private viewing form creates a request for contact only. It does not create a
              confirmed appointment, booking, reservation or contractual relationship. Any date you propose
              is indicative. No calendar integration is configured and no automated booking is made.
            </p>
            <p>
              You agree to provide accurate information and to obtain any consent required from any person
              whose details you submit. You must not use the form for spam, harassment, unlawful content or
              automated submissions.
            </p>
          </section>

          <section>
            <h2>6. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>attempt to gain unauthorised access to the server, data stores or administrative areas;</li>
              <li>probe, scan or test the security of the service except with written authorisation;</li>
              <li>interfere with rate limits, security controls or other users’ access;</li>
              <li>submit malicious code, injection payloads or abusive content;</li>
              <li>scrape the service at a scale that degrades availability;</li>
              <li>use the website in breach of applicable law or the rights of others.</li>
            </ul>
            <p>
              We may restrict or block access to protect the service, and may report unlawful activity to
              appropriate authorities.
            </p>
          </section>

          <section>
            <h2>7. Intellectual property</h2>
            <p>
              The Vanguard Estates name, visual identity, original written content, original architectural
              illustrations, 3D model and interface design are demonstration materials. You may view and
              share links to the website for evaluation and portfolio purposes. You may not reproduce,
              redistribute, resell or create derivative commercial works from the site’s original assets
              without permission.
            </p>
            <p>
              Reference brands and websites named in project documentation are the property of their
              respective owners and are referenced for design research only. No affiliation or endorsement
              is implied. No third-party proprietary models, logos or artwork are included in this project.
            </p>
          </section>

          <section>
            <h2>8. Third-party services and links</h2>
            <p>
              The website may link to third-party sites, including social platforms. Those sites operate
              independently and under their own terms and privacy policies. We are not responsible for their
              content, availability or practices. Links do not imply endorsement.
            </p>
          </section>

          <section>
            <h2>9. Disclaimers and limitation</h2>
            <p>
              The website is provided “as is” and “as available”, without warranties of any kind to the
              fullest extent permitted by law. We do not warrant accuracy, completeness, fitness for a
              particular purpose, uninterrupted access or freedom from harmful components.
            </p>
            <p>
              To the fullest extent permitted by law, the project owner and contributors are not liable for
              any indirect, incidental, special or consequential loss arising from use of, or inability to
              use, this demonstration website, including reliance on illustrative content or AI outputs.
              Nothing in these terms excludes liability that cannot lawfully be excluded.
            </p>
          </section>

          <section>
            <h2>10. Changes and governing terms</h2>
            <p>
              We may update these terms as the demonstration develops. The revised date will be shown at
              the top of this page. Continued use after changes constitutes acceptance of the updated
              terms.
            </p>
            <p>
              These terms are intended as a demonstration template. No specific governing law or
              jurisdiction is asserted. A commercial deployment should specify governing law, dispute
              resolution, consumer-law disclosures and any mandatory local requirements with professional
              advice.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              Questions about these terms or the demonstration may be sent through the project contact
              form or to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. Displayed brand contact
              details are fictional.
            </p>
          </section>

          <div className="legal-footer">
            <Link to="/privacy" className="link-arrow">
              Read the Privacy Policy
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
