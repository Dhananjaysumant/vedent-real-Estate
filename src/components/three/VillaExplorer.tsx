import { Canvas, useFrame } from '@react-three/fiber';
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import {
  cameraPresets,
  floors,
  hotspots,
  lightingModes,
  materials as finishes,
  type CameraPresetId,
  type FloorId,
  type LightingMode,
  type MaterialId,
} from '../../data/properties';
import { useInView, useMediaQuery, useReducedMotion } from '../../hooks/useUi';
import { Modal } from '../ui/Modal';
import {
  ArrowUpRight,
  Close,
  Compass,
  Cube,
  Expand,
  Layers,
  Minus,
  Moon,
  Plus,
  Rotate,
  Sun,
  Sunset,
} from '../ui/Icons';
import { CameraController, type CameraCommand } from './CameraController';
import { LightingRig } from './Lighting';
import { Villa, type Quality } from './Villa';
import { detectQuality, detectWebGL } from './webgl';

type PanelTab = 'floors' | 'camera' | 'materials';

type CameraAction =
  | { type: 'rotate'; delta: number }
  | { type: 'zoom'; factor: number }
  | { type: 'reset' };

const LIGHT_ICONS = {
  day: Sun,
  sunset: Sunset,
  night: Moon,
} as const;

const HOTSPOT_PRESET: Record<string, CameraPresetId> = {
  living: 'interior',
  kitchen: 'interior',
  bedroom: 'aerial',
  terrace: 'aerial',
  pool: 'pool',
  garden: 'garden',
  garage: 'front',
};

function ReadySignal({ onReady }: { onReady: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady();
  });
  return null;
}

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function ViewerFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="viewer-fallback">
      <div className="viewer-fallback__media">
        <img
          src="/assets/images/coastal-hero.svg"
          alt="Architectural illustration of the Vanguard coastal villa at golden hour."
        />
      </div>
      <div className="viewer-fallback__body">
        <span className="eyebrow">Photographic alternative</span>
        <h2>The villa, without WebGL</h2>
        <p>
          Your browser or device could not start the real-time 3D scene. All the essential architecture and
          residence information is available below, and the full gallery can be viewed without 3D.
        </p>
        {onRetry && (
          <button type="button" className="btn btn--light" onClick={onRetry}>
            Try the 3D scene again
          </button>
        )}
        <div className="viewer-fallback__floors">
          {floors.map((floor) => (
            <article key={floor.id}>
              <span className="meta">
                {floor.index} · {floor.level} · {floor.area} m²
              </span>
              <h3>{floor.name}</h3>
              <p>{floor.details}</p>
              <ul>
                {floor.rooms.map((room) => (
                  <li key={room}>{room}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="viewer-fallback__actions">
          <Link to="/residences/vanguard-residence-coastal" className="btn btn--light">
            View the Coastal Residence
            <ArrowUpRight size={14} />
          </Link>
          <Link to="/contact#enquiry" className="btn btn--gold">
            Request a private viewing
          </Link>
        </div>
      </div>
    </div>
  );
}

export function VillaExplorer() {
  const shellRef = useRef<HTMLDivElement>(null);
  const webgl = useMemo(() => detectWebGL(), []);
  const detectedQuality = useMemo<Quality>(() => detectQuality(), []);
  const isMobile = useMediaQuery('(max-width: 900px)');
  const reducedMotion = useReducedMotion();
  const { ref: stageRef, inView } = useInView<HTMLDivElement>({ once: false, rootMargin: '120px' });

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [mode, setMode] = useState<LightingMode>('sunset');
  const [finish, setFinish] = useState<MaterialId>('limestone');
  const [floorId, setFloorId] = useState<FloorId | null>(null);
  const [exploded, setExploded] = useState(false);
  const [preset, setPreset] = useState<CameraPresetId>('front');
  const [hotspotId, setHotspotId] = useState<string | null>(null);
  const [tab, setTab] = useState<PanelTab>('floors');
  const [planOpen, setPlanOpen] = useState(false);
  const [command, setCommand] = useState<CameraCommand | null>(null);
  const [touchEnabled, setTouchEnabled] = useState(!isMobile);
  const [fullscreen, setFullscreen] = useState(false);
  const commandId = useRef(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const floor = floorId ? floors.find((item) => item.id === floorId) ?? null : null;
  const hotspot = hotspotId ? hotspots.find((item) => item.id === hotspotId) ?? null : null;
  const activeFinish = finishes.find((item) => item.id === finish) ?? finishes[0];
  const quality: Quality = detectedQuality;
  const visibleHotspots = hotspots.filter((item) => !floorId || item.floor === floorId);

  useEffect(() => {
    setTouchEnabled(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const sendCommand = useCallback((next: CameraAction) => {
    commandId.current += 1;
    setCommand({ ...next, id: commandId.current } as CameraCommand);
  }, []);

  const selectFloor = (id: FloorId | null) => {
    setFloorId(id);
    setHotspotId(null);
    if (id) {
      setExploded(true);
      setPreset('aerial');
    } else {
      setExploded(false);
      setPreset('front');
    }
  };

  const selectHotspot = (id: string | null) => {
    setHotspotId(id);
    if (!id) return;
    const target = hotspots.find((item) => item.id === id);
    if (!target) return;
    setFloorId(target.floor);
    const nextPreset = HOTSPOT_PRESET[id];
    if (nextPreset) setPreset(nextPreset);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await shellRef.current?.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch {
      /* Fullscreen can be blocked by the browser; the viewer remains usable. */
    }
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const nextIndex =
      event.key === 'ArrowRight'
        ? (index + 1) % 3
        : (index + 2) % 3;
    const nextTab = (['floors', 'camera', 'materials'] as PanelTab[])[nextIndex];
    setTab(nextTab);
    tabRefs.current[nextIndex]?.focus();
  };

  const scene = (
    <Canvas
      shadows={quality === 'high'}
      dpr={[1, quality === 'high' ? 1.7 : 1.25]}
      frameloop={inView && !failed ? 'always' : 'never'}
      camera={{ position: [3, 7.2, 29], fov: 38, near: 0.1, far: 1200 }}
      gl={{ antialias: quality === 'high', powerPreference: 'high-performance', alpha: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.02;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          setFailed(true);
        });
      }}
      aria-label="Interactive three-dimensional architectural model of the Vanguard villa"
    >
      <Suspense fallback={null}>
        <LightingRig mode={mode} quality={quality} />
        <Villa
          finish={finish}
          mode={mode}
          quality={quality}
          selectedFloor={floorId}
          exploded={exploded}
          activeHotspot={hotspotId}
          onHotspot={selectHotspot}
        />
        <CameraController
          preset={preset}
          command={command}
          enabled={!isMobile || touchEnabled}
          reducedMotion={reducedMotion}
        />
        <ReadySignal onReady={() => setReady(true)} />
      </Suspense>
    </Canvas>
  );

  return (
    <div className="viewer dark-section" ref={shellRef}>
      <div className="viewer__backdrop" aria-hidden="true" />
      {webgl && !failed ? (
        <div className="viewer__stage" ref={stageRef} role="region" aria-label="Interactive 3D villa model">
          <div className={`viewer__canvas${ready ? ' is-ready' : ''}`}>
            <SceneBoundary
              key={retry}
              fallback={
                <ViewerFallback
                  onRetry={() => {
                    setRetry((value) => value + 1);
                    setFailed(false);
                    setReady(false);
                  }}
                />
              }
            >
              {scene}
            </SceneBoundary>
          </div>
          <div className="viewer__shade" aria-hidden="true" />
          {!ready && (
            <div className="viewer__loading" role="status">
              <span className="viewer__loading-line" aria-hidden="true" />
              Preparing the villa
            </div>
          )}
          {isMobile && (
            <button
              type="button"
              className="viewer__touch-toggle"
              aria-pressed={touchEnabled}
              onClick={() => setTouchEnabled((value) => !value)}
            >
              {touchEnabled ? 'Touch explore on — tap to pause' : 'Enable touch controls'}
            </button>
          )}
          {ready && (
            <div className="viewer__hint" aria-hidden="true">
              Drag to rotate · Scroll to zoom
            </div>
          )}
        </div>
      ) : (
        <div className="viewer__stage viewer__stage--fallback">
          <ViewerFallback />
        </div>
      )}

      <header className="viewer__intro">
        <span className="eyebrow eyebrow--light">Interactive architecture</span>
        <h1>The Vanguard Villa</h1>
        <p>Coastal prototype · Real-time 3D demonstration</p>
      </header>

      {webgl && !failed && (
        <>
          <aside className="viewer-panel" aria-label="Villa explorer controls">
            <div className="viewer-panel__head">
              <span>Viewer controls</span>
              <span className="viewer-panel__live">
                <i aria-hidden="true" /> WebGL
              </span>
            </div>

            <div className="light-switch" role="group" aria-label="Lighting mode">
              {lightingModes.map((lighting) => {
                const Icon = LIGHT_ICONS[lighting.id];
                return (
                  <button
                    key={lighting.id}
                    type="button"
                    className={`light-switch__btn${mode === lighting.id ? ' is-active' : ''}`}
                    onClick={() => setMode(lighting.id)}
                    aria-pressed={mode === lighting.id}
                    title={lighting.description}
                  >
                    <Icon size={15} />
                    {lighting.label}
                  </button>
                );
              })}
            </div>

            <div className="viewer-tabs" role="tablist" aria-label="Explorer panels">
              {(
                [
                  ['floors', 'Floors'],
                  ['camera', 'Camera'],
                  ['materials', 'Materials'],
                ] as [PanelTab, string][]
              ).map(([id, label], index) => (
                <button
                  key={id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`viewer-tab-${id}`}
                  aria-selected={tab === id}
                  aria-controls={`viewer-panel-${id}`}
                  tabIndex={tab === id ? 0 : -1}
                  className={`viewer-tabs__btn${tab === id ? ' is-active' : ''}`}
                  onClick={() => setTab(id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === 'floors' && (
              <div
                className="viewer-panel__content"
                role="tabpanel"
                id="viewer-panel-floors"
                aria-labelledby="viewer-tab-floors"
              >
                <div className="floor-list">
                  <button
                    type="button"
                    className={`floor-list__item floor-list__all${floorId === null ? ' is-active' : ''}`}
                    onClick={() => selectFloor(null)}
                    aria-pressed={floorId === null}
                  >
                    <span className="floor-list__index">
                      <Layers size={15} />
                    </span>
                    <span>
                      <strong>All floors</strong>
                      <small>Complete villa composition</small>
                    </span>
                  </button>
                  {floors.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`floor-list__item${floorId === item.id ? ' is-active' : ''}`}
                      onClick={() => selectFloor(floorId === item.id ? null : item.id)}
                      aria-pressed={floorId === item.id}
                    >
                      <span className="floor-list__index">{item.index}</span>
                      <span>
                        <strong>{item.name}</strong>
                        <small>{item.area} m² · {item.rooms.slice(0, 2).join(' · ')}</small>
                      </span>
                    </button>
                  ))}
                </div>

                <div className="viewer-switch">
                  <span>
                    <strong>Exploded view</strong>
                    <small>Separate the levels vertically</small>
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={exploded}
                    className={`switch${exploded ? ' is-on' : ''}`}
                    onClick={() => setExploded((value) => !value)}
                  >
                    <span className="sr-only">Toggle exploded floor view</span>
                    <span className="switch__thumb" aria-hidden="true" />
                  </button>
                </div>

                {floor ? (
                  <div className="floor-brief">
                    <div className="floor-brief__head">
                      <span className="meta">
                        {floor.index} · {floor.level}
                      </span>
                      <strong>{floor.area} m²</strong>
                    </div>
                    <h3>{floor.name}</h3>
                    <p>{floor.summary}</p>
                    <ul className="floor-brief__rooms">
                      {floor.rooms.map((room) => (
                        <li key={room}>{room}</li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="link-arrow floor-brief__plan"
                      onClick={() => setPlanOpen(true)}
                    >
                      View floor plan
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                ) : (
                  <p className="viewer-panel__note">
                    Select a floor to lift it from the composition and read its accommodation. The
                    model is a representative prototype.
                  </p>
                )}
              </div>
            )}

            {tab === 'camera' && (
              <div
                className="viewer-panel__content"
                role="tabpanel"
                id="viewer-panel-camera"
                aria-labelledby="viewer-tab-camera"
              >
                <p className="viewer-panel__label">Camera presets</p>
                <div className="preset-grid">
                  {cameraPresets.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`preset-grid__btn${preset === item.id ? ' is-active' : ''}`}
                      onClick={() => setPreset(item.id)}
                      aria-pressed={preset === item.id}
                      title={item.description}
                    >
                      <Compass size={14} />
                      {item.label}
                    </button>
                  ))}
                </div>
                <p className="viewer-panel__note">
                  Keyboard and touch alternatives to dragging: use the rotate and zoom controls
                  below.
                </p>
                <div className="camera-tools" role="group" aria-label="Camera movement">
                  <button type="button" onClick={() => sendCommand({ type: 'rotate', delta: Math.PI / 12 })}>
                    <Rotate size={14} />
                    <span>Rotate left</span>
                  </button>
                  <button type="button" onClick={() => sendCommand({ type: 'rotate', delta: -Math.PI / 12 })}>
                    <Rotate size={14} />
                    <span>Rotate right</span>
                  </button>
                  <button type="button" onClick={() => sendCommand({ type: 'zoom', factor: 0.86 })}>
                    <Plus size={14} />
                    <span>Zoom in</span>
                  </button>
                  <button type="button" onClick={() => sendCommand({ type: 'zoom', factor: 1.16 })}>
                    <Minus size={14} />
                    <span>Zoom out</span>
                  </button>
                </div>
                <div className="viewer-panel__row">
                  <button
                    type="button"
                    className="viewer-panel__inline-btn"
                    onClick={() => sendCommand({ type: 'reset' })}
                  >
                    <Rotate size={13} />
                    Reset camera
                  </button>
                  <button
                    type="button"
                    className="viewer-panel__inline-btn"
                    onClick={toggleFullscreen}
                    aria-pressed={fullscreen}
                  >
                    <Expand size={13} />
                    {fullscreen ? 'Exit full screen' : 'Full screen'}
                  </button>
                </div>
                {isMobile && (
                  <button
                    type="button"
                    className={`viewer-panel__inline-btn viewer-panel__touch${touchEnabled ? ' is-active' : ''}`}
                    onClick={() => setTouchEnabled((value) => !value)}
                    aria-pressed={touchEnabled}
                  >
                    <Cube size={13} />
                    {touchEnabled ? 'Touch exploration enabled' : 'Enable touch exploration'}
                  </button>
                )}
              </div>
            )}

            {tab === 'materials' && (
              <div
                className="viewer-panel__content"
                role="tabpanel"
                id="viewer-panel-materials"
                aria-labelledby="viewer-tab-materials"
              >
                <div className="finish-grid" role="group" aria-label="Material finishes">
                  {finishes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`finish${finish === item.id ? ' is-active' : ''}`}
                      onClick={() => setFinish(item.id)}
                      aria-pressed={finish === item.id}
                    >
                      <span
                        className="finish__swatch"
                        style={{
                          background: `linear-gradient(135deg, ${item.swatch}, ${item.swatchSecondary})`,
                        }}
                        aria-hidden="true"
                      />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
                <div className="material-note">
                  <span className="meta">Selected finish</span>
                  <h3>{activeFinish.name}</h3>
                  <p>{activeFinish.description}</p>
                  <dl>
                    <div>
                      <dt>Origin</dt>
                      <dd>{activeFinish.origin}</dd>
                    </div>
                    <div>
                      <dt>Applied to</dt>
                      <dd>{activeFinish.appliesTo}</dd>
                    </div>
                  </dl>
                </div>
                <p className="viewer-panel__note">
                  Finish selections update the model’s stone, timber, concrete, glass and metal
                  surfaces. Colours are indicative and vary with lighting and screen calibration.
                </p>
              </div>
            )}
          </aside>

          <div className="viewer__footer">
            <div className="viewer__chips" aria-label="Architectural highlights">
              {visibleHotspots.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={hotspotId === item.id ? 'is-active' : ''}
                  onClick={() => selectHotspot(hotspotId === item.id ? null : item.id)}
                  aria-pressed={hotspotId === item.id}
                >
                  <span aria-hidden="true">{hotspots.findIndex((h) => h.id === item.id) + 1}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <span className="viewer__disclaimer">
              Representative prototype · Illustrative only
            </span>
          </div>

          {hotspot && (
            <aside className="hotspot-card" aria-live="polite" aria-label={`${hotspot.title} details`}>
              <button
                type="button"
                className="hotspot-card__close"
                onClick={() => setHotspotId(null)}
                aria-label="Close hotspot details"
              >
                <Close size={15} />
              </button>
              <span className="eyebrow">{hotspot.eyebrow}</span>
              <h2>{hotspot.title}</h2>
              <p>{hotspot.description}</p>
              <ul className="hotspot-card__facts">
                {hotspot.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
              <div className="hotspot-card__actions">
                <button
                  type="button"
                  className="btn btn--small btn--gold"
                  onClick={() => setPreset(HOTSPOT_PRESET[hotspot.id] ?? 'front')}
                >
                  Focus view
                  <Compass size={13} />
                </button>
                <Link to="/residences/vanguard-residence-coastal" className="link-arrow">
                  The residence
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </aside>
          )}
        </>
      )}

      <Modal
        open={planOpen && Boolean(floor)}
        onClose={() => setPlanOpen(false)}
        title={floor ? `${floor.name} — ${floor.area} m²` : 'Floor plan'}
        wide
      >
        {floor && (
          <div className="plan-modal">
            <img src={floor.planImage} alt={`Illustrative architectural plan of the ${floor.name.toLowerCase()}.`} />
            <div className="plan-modal__copy">
              <span className="meta">
                {floor.index} · {floor.level}
              </span>
              <p>{floor.details}</p>
              <ul>
                {floor.rooms.map((room) => (
                  <li key={room}>{room}</li>
                ))}
              </ul>
              <p className="plan-modal__note">
                Illustrative demonstration drawing, not a measured survey. Plans, areas and room
                arrangements are indicative and subject to design development.
              </p>
              <button type="button" className="btn btn--solid btn--small" onClick={() => setPlanOpen(false)}>
                Close plan
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
