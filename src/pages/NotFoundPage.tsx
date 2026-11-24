import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from '../components/ui/Icons';
import { usePageMeta } from '../hooks/usePageMeta';

export function NotFoundPage() {
  usePageMeta({
    title: 'Page not found',
    description: 'The page you were looking for could not be found. Return to Vanguard Estates.',
    path: '/404',
    noindex: true,
  });

  return (
    <main id="main-content" className="not-found dark-section">
      <div className="container not-found__inner">
        <span className="eyebrow eyebrow--light">404 — Off the plan</span>
        <h1>
          This path
          <br />
          leads nowhere.
        </h1>
        <p>
          The page you were looking for may have moved, or the address may be incorrect. Return to the
          collection, or explore the architecture in 3D.
        </p>
        <div className="btn-row">
          <Link to="/" className="btn btn--light">
            <ArrowRight size={14} />
            Return home
          </Link>
          <Link to="/residences" className="btn btn--gold">
            View the residences
            <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="not-found__links">
          <Link to="/explorer">3D Explorer</Link>
          <Link to="/architecture">Architecture</Link>
          <Link to="/contact">Private viewing</Link>
        </div>
      </div>
    </main>
  );
}
