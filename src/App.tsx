import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { SiteHeader } from './components/navigation/SiteHeader';
import { SiteFooter } from './components/footer/SiteFooter';
import { Concierge } from './components/concierge/Concierge';
import { useReducedMotion } from './hooks/useUi';
import { HomePage } from './pages/HomePage';
import { ResidencesPage } from './pages/ResidencesPage';
import { PropertyPage } from './pages/PropertyPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const timer = window.setTimeout(() => {
        const element = document.getElementById(id);
        if (!element) return;
        element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }, 80);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, reducedMotion]);

  return null;
}

function RouteView() {
  const location = useLocation();
  return (
    <div className="route-view" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/residences" element={<ResidencesPage />} />
        <Route path="/residences/:slug" element={<PropertyPage />} />
        <Route path="/explorer" element={<ExplorerPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <ScrollManager />
      <SiteHeader />
      <RouteView />
      <Concierge />
      <SiteFooter />
    </BrowserRouter>
  );
}
