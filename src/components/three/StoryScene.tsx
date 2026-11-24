import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { LightingMode } from '../../data/properties';
import { LightingRig } from './Lighting';
import { ReadySignal, SceneBoundary } from './SceneUtils';
import { Villa, type Quality } from './Villa';
import { detectQuality } from './webgl';

const POSITIONS = [
  new THREE.Vector3(26, 13, 34),
  new THREE.Vector3(12, 5.5, 17),
  new THREE.Vector3(1.5, 2.15, 9.5),
  new THREE.Vector3(-19, 5.5, 6),
  new THREE.Vector3(22, 11, 32),
];

const TARGETS = [
  new THREE.Vector3(0, 4.2, 0),
  new THREE.Vector3(1, 5.2, 0),
  new THREE.Vector3(-2.5, 1.95, -1.5),
  new THREE.Vector3(0.5, 4.1, 0),
  new THREE.Vector3(1, 4.3, 0),
];

const positionCurve = new THREE.CatmullRomCurve3(POSITIONS, false, 'catmullrom', 0.12);
const targetCurve = new THREE.CatmullRomCurve3(TARGETS, false, 'catmullrom', 0.12);

function StoryCamera({
  progress,
  reducedMotion,
}: {
  progress: React.RefObject<number>;
  reducedMotion: boolean;
}) {
  const camera = useThree((state) => state.camera);
  const smoothed = useRef(0);
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const targetProgress = reducedMotion ? 0.92 : progress.current;
    smoothed.current = THREE.MathUtils.damp(smoothed.current, targetProgress, 3.2, delta);
    const t = THREE.MathUtils.clamp(smoothed.current, 0, 1);
    const eased = t * t * (3 - 2 * t);
    positionCurve.getPoint(eased, desired);
    targetCurve.getPoint(eased, lookAt);

    const aspect = state.size.width / state.size.height;
    if (aspect < 1.1) {
      desired.sub(lookAt).multiplyScalar(THREE.MathUtils.lerp(1.0, 1.45, (1.1 - aspect) / 1.1));
      desired.add(lookAt);
    }
    camera.position.lerp(desired, 1 - Math.exp(-6 * Math.min(delta, 0.1)));
    camera.lookAt(lookAt);
  });

  return null;
}

const MODES: LightingMode[] = ['day', 'day', 'sunset', 'sunset', 'night'];

interface StorySceneProps {
  progress: React.RefObject<number>;
  chapter: number;
  active: boolean;
}

export function StoryScene({ progress, chapter, active }: StorySceneProps) {
  const quality = useMemo<Quality>(() => detectQuality(), []);
  const mode = MODES[Math.min(chapter, MODES.length - 1)] ?? 'sunset';

  return (
    <SceneBoundary fallback={null}>
      <Canvas
        shadows={quality === 'high'}
        dpr={[1, quality === 'high' ? 1.5 : 1.2]}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [26, 13, 34], fov: 38, near: 0.1, far: 1200 }}
        gl={{ antialias: quality === 'high', alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.02;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        aria-label="Scroll-driven cinematic three-dimensional tour of the Vanguard villa"
      >
        <Suspense fallback={null}>
          <LightingRig mode={mode} quality={quality} />
          <Villa finish="limestone" mode={mode} quality={quality} showHotspots={false} />
          <StoryCamera progress={progress} reducedMotion={false} />
          <ReadySignal onReady={() => undefined} />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}
