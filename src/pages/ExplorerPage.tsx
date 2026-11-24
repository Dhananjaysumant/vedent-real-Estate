import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { VillaExplorer } from '../components/three/VillaExplorer';
import { ArrowUpRight } from '../components/ui/Icons';

export function ExplorerPage() {
  usePageMeta({
    title: 'Interactive 3D Villa Explorer',
    description:
      'Explore the Vanguard villa in real time: orbit the architecture, separate four floors, change day, sunset and night lighting, apply material finishes and open architectural hotspots.',
    path: '/explorer',
    image: '/assets/images/coastal-hero.svg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Interactive 3D Villa Explorer — Vanguard Estates',
      description:
        'A real-time 3D architectural explorer for a fictional luxury villa demonstration, with lighting, floor, material and camera controls.',
      isPartOf: { '@type': 'WebSite', name: 'Vanguard Estates' },
    },
  });

  return (
    <>
      <VillaExplorer />
      <main id="main-content" className="explorer-notes dark-section">
        <div className="container">
          <div className="explorer-notes__head">
            <span className="eyebrow eyebrow--light">About this experience</span>
            <h2>A working architectural model, not a video.</h2>
            <p>
              Every view is rendered live in your browser. The villa is an original procedural
              composition of stone, glass, timber and landscape, built for this demonstration. It is a
              representative prototype — not a measured survey or a real listing.
            </p>
          </div>
          <div className="explorer-notes__grid">
            <article>
              <span className="meta">Controls</span>
              <h3>Explore at your own pace</h3>
              <p>
                Drag or use the camera presets to orbit the villa. Scroll or pinch to zoom. On touch
                devices, enable touch exploration only when you are ready so that the page continues to
                scroll normally outside the model.
              </p>
            </article>
            <article>
              <span className="meta">Accessibility</span>
              <h3>Beyond WebGL</h3>
              <p>
                Camera presets, rotate and zoom buttons, floor selection, hotspot lists and material
                controls are keyboard accessible. If WebGL is unavailable, the explorer presents the
                architecture through illustrations and descriptive text instead of a blank canvas.
              </p>
            </article>
            <article>
              <span className="meta">Performance</span>
              <h3>Adapted to the device</h3>
              <p>
                The scene reduces pixel density, shadow resolution and reflections on lower-powered
                devices, and pauses rendering when it is off screen or the browser tab is hidden.
                Reduced-motion preferences are respected.
              </p>
            </article>
          </div>
          <div className="explorer-notes__actions">
            <Link to="/residences/vanguard-residence-coastal" className="btn btn--light">
              The Coastal Residence
              <ArrowUpRight size={14} />
            </Link>
            <Link to="/contact#enquiry" className="btn btn--gold">
              Request a private viewing
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
