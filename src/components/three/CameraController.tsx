import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { cameraPresets, type CameraPreset, type CameraPresetId } from '../../data/properties';

export type CameraCommand =
  | { id: number; type: 'rotate'; delta: number }
  | { id: number; type: 'zoom'; factor: number }
  | { id: number; type: 'reset' };

interface CameraControllerProps {
  preset: CameraPresetId;
  command: CameraCommand | null;
  enabled?: boolean;
  reducedMotion?: boolean;
}

function getPreset(id: CameraPresetId): CameraPreset {
  return cameraPresets.find((item) => item.id === id) ?? cameraPresets[0];
}

export function CameraController({ preset, command, enabled = true, reducedMotion = false }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const camera = useThree((state) => state.camera);
  const flyTo = useRef<{ position: THREE.Vector3; target: THREE.Vector3 } | null>(null);

  const startFly = (position: THREE.Vector3, target: THREE.Vector3) => {
    flyTo.current = {
      position: position.clone(),
      target: target.clone(),
    };
  };

  useEffect(() => {
    const presetData = getPreset(preset);
    startFly(
      new THREE.Vector3(...presetData.position),
      new THREE.Vector3(...presetData.target),
    );
  }, [preset]);

  useEffect(() => {
    if (!command) return;
    const controls = controlsRef.current;
    if (!controls) return;
    const target = controls.target.clone();
    const offset = camera.position.clone().sub(target);
    if (command.type === 'rotate') {
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), command.delta);
      startFly(target.clone().add(offset), target);
    } else if (command.type === 'zoom') {
      const length = THREE.MathUtils.clamp(offset.length() * command.factor, 9, 58);
      offset.setLength(length);
      startFly(target.clone().add(offset), target);
    } else {
      const presetData = getPreset('front');
      startFly(
        new THREE.Vector3(...presetData.position),
        new THREE.Vector3(...presetData.target),
      );
    }
  }, [command, camera]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (flyTo.current) {
      const factor = reducedMotion ? 1 : 1 - Math.exp(-4.2 * Math.min(delta, 0.1));
      camera.position.lerp(flyTo.current.position, factor);
      controls.target.lerp(flyTo.current.target, factor);
      controls.update();
      if (camera.position.distanceTo(flyTo.current.position) < 0.09) {
        camera.position.copy(flyTo.current.position);
        controls.target.copy(flyTo.current.target);
        controls.update();
        flyTo.current = null;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={enabled}
      enableDamping
      dampingFactor={0.07}
      enablePan={false}
      minDistance={8.5}
      maxDistance={60}
      minPolarAngle={0.16}
      maxPolarAngle={1.52}
      rotateSpeed={0.55}
      zoomSpeed={0.8}
      target={[1, 4.4, 0]}
      onStart={() => {
        flyTo.current = null;
      }}
    />
  );
}
