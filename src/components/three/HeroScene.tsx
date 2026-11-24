import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useUi';
import { LightingRig } from './Lighting';
import { ReadySignal, SceneBoundary } from './SceneUtils';
import { Villa, type Quality } from './Villa';
import { detectQuality } from './webgl';

function HeroCamera({ reducedMotion }: { reducedMotion: boolean }) {
  const camera = useThree((state) => state.camera);
  const target = useMemo(() => new THREE.Vector3(0.6, 4.35, 0), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const started = useRef(false);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    if (reducedMotion) {
      if (!started.current) {
        camera.position.set(15.5, 7.6, 27.5);
        camera.lookAt(target);
        started.current = true;
      }
      return;
    }
    const angle = 0.5 + Math.sin(elapsed * 0.045) * 0.055;
    const radius = 30 + Math.sin(elapsed * 0.032) * 1.1;
    desired.set(
      Math.sin(angle) * radius + state.pointer.x * 1.5,
      7.5 + Math.sin(elapsed * 0.06) * 0.26 + state.pointer.y * 0.45,
      Math.cos(angle) * radius,
    );
    if (!started.current) {
      camera.position.copy(desired);
      started.current = true;
    } else {
      camera.position.lerp(desired, 1 - Math.exp(-1.15 * Math.min(delta, 0.1)));
    }
    camera.lookAt(target);
  });

  return null;
}

interface HeroSceneProps {
  onReady: () => void;
  active: boolean;
}

export function HeroScene({ onReady, active }: HeroSceneProps) {
  const quality = useMemo<Quality>(() => detectQuality(), []);
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  return (
    <SceneBoundary fallback={null}>
      <Canvas
        shadows={quality === 'high'}
        dpr={[1, quality === 'high' ? 1.55 : 1.2]}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [15.5, 7.6, 27.5], fov: 36, near: 0.1, far: 1200 }}
        gl={{ antialias: quality === 'high', alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.03;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        aria-label="Cinematic three-dimensional view of the Vanguard coastal villa at sunset"
      >
        <Suspense fallback={null}>
          <LightingRig mode="sunset" quality={quality} />
          <Villa
            finish="limestone"
            mode="sunset"
            quality={quality}
            showHotspots={false}
          />
          <HeroCamera reducedMotion={reducedMotion} />
          <ReadySignal
            onReady={() => {
              if (ready) return;
              setReady(true);
              onReady();
            }}
          />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}
