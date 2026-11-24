import { Link } from 'react-router-dom';
import { ArrowUpRight } from '../ui/Icons';
import { CONTACT } from '../../lib/site';

export function ViewingCta() {
  return (
    <section className="viewing-cta dark-section" id="viewing" aria-labelledby="viewing-title">
      <div className="viewing-cta__bg" aria-hidden="true">
        <img
          src="/assets/images/coastal-pool.svg"
          alt=""
          loading="lazy"
          width={1600}
          height={1000}
        />
      </div>
      <div className="container">
        <div className="viewing-cta__inner">
          <span className="eyebrow eyebrow--light">Private viewing</span>
          <h2 id="viewing-title">
            Your next chapter <em>begins here.</em>
          </h2>
          <p>
            Discover a residence that reflects your vision. Connect with our property specialists to
            arrange a private consultation.
          </p>
          <div className="viewing-cta__actions">
            <Link to="/contact#enquiry" className="btn btn--gold">
              Request a private viewing
              <ArrowUpRight size={14} />
            </Link>
            <Link to="/residences" className="btn btn--light">
              Explore the residences
            </Link>
          </div>
          <div className="viewing-cta__contact">
            <span>Private enquiries</span>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <span className="muted">Demonstration contact details</span>
          </div>
        </div>
      </div>
    </section>
  );
}
