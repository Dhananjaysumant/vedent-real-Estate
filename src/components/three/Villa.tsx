import { Html, MeshReflectorMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  hotspots,
  type FloorId,
  type Hotspot,
  type LightingMode,
  type MaterialId,
} from '../../data/properties';
import { useVillaMaterials, type VillaMaterialSet } from './useVillaMaterials';

export type Quality = 'high' | 'low';

interface VillaProps {
  finish: MaterialId;
  mode: LightingMode;
  quality?: Quality;
  selectedFloor?: FloorId | null;
  exploded?: boolean;
  activeHotspot?: string | null;
  onHotspot?: (id: string) => void;
  showHotspots?: boolean;
}

const FLOOR_OFFSET = 2.35;
const LEVELS: { id: FloorId; base: number; highlight: [number, number, number]; size: [number, number, number] }[] = [
  { id: 'ground', base: 0.7, highlight: [-1.2, 0.72, 0], size: [12.8, 0.04, 8.8] },
  { id: 'first', base: 4.18, highlight: [3, 4.2, 0], size: [10.9, 0.04, 7.7] },
  { id: 'second', base: 7.4, highlight: [4.2, 7.42, 0], size: [6.9, 0.04, 6.5] },
  { id: 'rooftop', base: 10.21, highlight: [4.2, 10.23, 0], size: [7.7, 0.04, 7.3] },
];

/* ————————————————————————————————————————————————————————————
   Reusable pieces
   ———————————————————————————————————————————————————————————— */

function HotspotMarker({
  hotspot,
  active,
  onSelect,
  dimmed,
}: {
  hotspot: Hotspot;
  active: boolean;
  onSelect?: (id: string) => void;
  dimmed?: boolean;
}) {
  return (
    <group position={hotspot.position}>
      <mesh>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color="#cdb78f" toneMapped={false} />
      </mesh>
      <Html center zIndexRange={[40, 10]} style={{ pointerEvents: 'none' }}>
        <button
          type="button"
          className={`hotspot3d${active ? ' is-active' : ''}${dimmed ? ' is-dimmed' : ''}`}
          onClick={() => onSelect?.(hotspot.id)}
          aria-label={`${hotspot.label} — show details`}
          aria-pressed={active}
          style={{ pointerEvents: 'auto' }}
        >
          <span className="hotspot3d__dot" aria-hidden="true" />
          <span className="hotspot3d__label">{hotspot.label}</span>
        </button>
      </Html>
    </group>
  );
}

function FloorTag({ label, index, y }: { label: string; index: string; y: number }) {
  return (
    <Html position={[-8.9, y, 4.4]} center zIndexRange={[20, 5]} style={{ pointerEvents: 'none' }}>
      <span className="floor-tag">
        <b>{index}</b> {label}
      </span>
    </Html>
  );
}

function FloorOutline({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  const geometry = useMemo(() => {
    const box = new THREE.BoxGeometry(...size);
    const edges = new THREE.EdgesGeometry(box);
    box.dispose();
    return edges;
  }, [size]);

  return (
    <lineSegments geometry={geometry} position={position}>
      <lineBasicMaterial color="#d3ba8e" transparent opacity={0.9} toneMapped={false} />
    </lineSegments>
  );
}

function Lamps({ mode, quality = 'high' }: { mode: LightingMode; quality?: Quality }) {
  const refs = useRef<(THREE.PointLight | null)[]>([]);
  const targets = { day: 2, sunset: 26, night: 46 };
  useFrame((_, delta) => {
    for (const lamp of refs.current) {
      if (!lamp) continue;
      lamp.intensity = THREE.MathUtils.damp(lamp.intensity, targets[mode], 2.4, delta);
    }
  });
  return (
    <>
      <pointLight
        ref={(el) => {
          refs.current[0] = el;
        }}
        position={[-2.6, 2.8, 0.6]}
        color="#ffc286"
        distance={11}
        decay={2}
        intensity={2}
      />
      <pointLight
        ref={(el) => {
          refs.current[1] = el;
        }}
        position={[4.6, 5.9, 0.4]}
        color="#ffc286"
        distance={10}
        decay={2}
        intensity={2}
      />
      <pointLight
        ref={(el) => {
          refs.current[2] = el;
        }}
        position={[4.4, 9.1, 0.2]}
        color="#ffcf9c"
        distance={9}
        decay={2}
        intensity={2}
      />
      {quality === 'high' && (
        <pointLight
          position={[3.4, 11.9, 1.2]}
          color="#ffcf9c"
          distance={8}
          decay={2}
          intensity={targets[mode] * 0.55}
        />
      )}
    </>
  );
}

/* ————————————————————————————————————————————————————————————
   Interior / furniture
   ———————————————————————————————————————————————————————————— */

function Sofa({
  m,
  position,
  rotation = 0,
  width = 3.4,
}: {
  m: VillaMaterialSet;
  position: [number, number, number];
  rotation?: number;
  width?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow material={m.fabric}>
        <boxGeometry args={[width, 0.34, 1.0]} />
      </mesh>
      <mesh position={[0, 0.55, -0.42]} castShadow material={m.fabric}>
        <boxGeometry args={[width, 0.6, 0.24]} />
      </mesh>
      <mesh position={[-width / 2 + 0.13, 0.42, 0]} castShadow material={m.fabric}>
        <boxGeometry args={[0.26, 0.58, 1.0]} />
      </mesh>
      <mesh position={[width / 2 - 0.13, 0.42, 0]} castShadow material={m.fabric}>
        <boxGeometry args={[0.26, 0.58, 1.0]} />
      </mesh>
      <mesh position={[-width / 4, 0.4, 0.02]} material={m.white}>
        <boxGeometry args={[0.55, 0.12, 0.82]} />
      </mesh>
      <mesh position={[width / 4, 0.4, 0.02]} material={m.white}>
        <boxGeometry args={[0.55, 0.12, 0.82]} />
      </mesh>
      <mesh position={[width / 4, 0.6, -0.3]} rotation={[0.2, 0, 0]} material={m.leather}>
        <boxGeometry args={[0.4, 0.4, 0.14]} />
      </mesh>
    </group>
  );
}

function Armchair({ m, position, rotation = 0 }: { m: VillaMaterialSet; position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.22, 0]} castShadow material={m.fabric}>
        <boxGeometry args={[0.95, 0.36, 0.95]} />
      </mesh>
      <mesh position={[0, 0.56, -0.38]} castShadow material={m.fabric}>
        <boxGeometry args={[0.95, 0.64, 0.2]} />
      </mesh>
      <mesh position={[-0.42, 0.44, 0]} material={m.leather}>
        <boxGeometry args={[0.13, 0.5, 0.9]} />
      </mesh>
      <mesh position={[0.42, 0.44, 0]} material={m.leather}>
        <boxGeometry args={[0.13, 0.5, 0.9]} />
      </mesh>
    </group>
  );
}

function Bed({ m, position }: { m: VillaMaterialSet; position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]} castShadow material={m.fabric}>
        <boxGeometry args={[2.25, 0.4, 2.15]} />
      </mesh>
      <mesh position={[0, 0.53, 0.06]} material={m.white}>
        <boxGeometry args={[2.1, 0.12, 1.95]} />
      </mesh>
      <mesh position={[0, 0.66, -0.62]} material={m.fabric}>
        <boxGeometry args={[1.9, 0.3, 1.0]} />
      </mesh>
      <mesh position={[0, 0.62, -1.02]} castShadow material={m.timber}>
        <boxGeometry args={[2.4, 1.05, 0.1]} />
      </mesh>
      <mesh position={[-0.75, 0.42, -1.0]} material={m.leather}>
        <boxGeometry args={[0.55, 0.36, 0.42]} />
      </mesh>
      <mesh position={[0.75, 0.42, -1.0]} material={m.leather}>
        <boxGeometry args={[0.55, 0.36, 0.42]} />
      </mesh>
      <mesh position={[-1.35, 0.54, -0.4]} material={m.darkWood}>
        <boxGeometry args={[0.3, 0.36, 0.5]} />
      </mesh>
      <mesh position={[1.35, 0.54, -0.4]} material={m.darkWood}>
        <boxGeometry args={[0.3, 0.36, 0.5]} />
      </mesh>
    </group>
  );
}

function DiningSet({ m, position }: { m: VillaMaterialSet; position: [number, number, number] }) {
  const chairs = useMemo(
    () => [
      [-0.8, 0.72],
      [0, 0.72],
      [0.8, 0.72],
      [-0.8, -0.72],
      [0, -0.72],
      [0.8, -0.72],
    ],
    [],
  );
  return (
    <group position={position}>
      <mesh position={[0, 0.74, 0]} castShadow material={m.darkWood}>
        <boxGeometry args={[2.5, 0.07, 1.05]} />
      </mesh>
      <mesh position={[-1.05, 0.37, 0]} material={m.timber}>
        <boxGeometry args={[0.08, 0.72, 0.8]} />
      </mesh>
      <mesh position={[1.05, 0.37, 0]} material={m.timber}>
        <boxGeometry args={[0.08, 0.72, 0.8]} />
      </mesh>
      {chairs.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.28, 0]} material={m.leather}>
            <boxGeometry args={[0.44, 0.09, 0.44]} />
          </mesh>
          <mesh position={[0, 0.52, z > 0 ? 0.2 : -0.2]} material={m.leather}>
            <boxGeometry args={[0.42, 0.46, 0.06]} />
          </mesh>
          <mesh position={[0, 0.14, 0]} material={m.metal}>
            <boxGeometry args={[0.32, 0.28, 0.32]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function LoungeChairs({ m, position }: { m: VillaMaterialSet; position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1.7].map((offset) => (
        <group key={offset} position={[offset, 0, 0]}>
          <mesh position={[0, 0.26, 0]} castShadow material={m.fabric}>
            <boxGeometry args={[0.72, 0.16, 1.7]} />
          </mesh>
          <mesh position={[0, 0.5, -0.6]} rotation={[-0.5, 0, 0]} material={m.fabric}>
            <boxGeometry args={[0.72, 0.12, 0.75]} />
          </mesh>
          <mesh position={[0, 0.12, 0]} material={m.darkWood}>
            <boxGeometry args={[0.6, 0.22, 1.4]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Plant({ m, position, scale = 1 }: { m: VillaMaterialSet; position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow material={m.darkWood}>
        <cylinderGeometry args={[0.26, 0.2, 0.44, 12]} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow material={m.trunk}>
        <cylinderGeometry args={[0.04, 0.06, 1.0, 6]} />
      </mesh>
      <mesh position={[0.1, 1.5, 0]} castShadow material={m.foliage}>
        <icosahedronGeometry args={[0.52, 1]} />
      </mesh>
      <mesh position={[-0.22, 1.25, 0.12]} castShadow material={m.foliageLight}>
        <icosahedronGeometry args={[0.34, 1]} />
      </mesh>
    </group>
  );
}

function Pendant({ m, position, scale = 1 }: { m: VillaMaterialSet; position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.4, 0]} material={m.metal}>
        <cylinderGeometry args={[0.012, 0.012, 0.8, 4]} />
      </mesh>
      <mesh position={[0, 0, 0]} material={m.metal}>
        <coneGeometry args={[0.24, 0.2, 18, 1, true]} />
      </mesh>
      <mesh position={[0, -0.08, 0]} material={m.glow}>
        <sphereGeometry args={[0.09, 10, 10]} />
      </mesh>
    </group>
  );
}

/* ————————————————————————————————————————————————————————————
   Landscape
   ———————————————————————————————————————————————————————————— */

function Trees({ m, quality }: { m: VillaMaterialSet; quality: Quality }) {
  const olive = useRef<THREE.InstancedMesh>(null);
  const cypress = useRef<THREE.InstancedMesh>(null);
  const trunks = useRef<THREE.InstancedMesh>(null);

  const olives = useMemo(
    () => [
      [-19, -10, 1.05],
      [-24, -3, 0.9],
      [-17.5, 4, 1.15],
      [-22, 11, 0.85],
      [-14, -18, 1.0],
      [-7, -15, 0.9],
      [13, -14, 1.05],
      [19, -7, 0.8],
      [21, 3, 1.1],
      [17, 12, 0.9],
      [24, 18, 0.85],
      [-27, 20, 1.0],
      [-11, 22, 0.8],
      [11, 23, 0.9],
      [30, -16, 0.95],
      [-31, -18, 1.05],
    ],
    [],
  );
  const cypresses = useMemo(
    () => [
      [-12.5, -7.2, 1.0],
      [-13.4, -4.4, 0.85],
      [9.8, -7.4, 0.95],
      [15.5, -3.2, 0.8],
      [-16, 15, 0.9],
    ],
    [],
  );

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const oliveMesh = olive.current;
    const trunkMesh = trunks.current;
    const cypressMesh = cypress.current;
    if (!oliveMesh) return;
    olives.forEach(([x, z, scale], i) => {
      dummy.position.set(x, 2.1 * scale, z);
      dummy.rotation.set(0, i * 1.7, 0);
      dummy.scale.set(scale * 1.35, scale * 0.9, scale * 1.35);
      dummy.updateMatrix();
      oliveMesh.setMatrixAt(i, dummy.matrix);
      if (trunkMesh) {
        dummy.position.set(x, 0.9 * scale, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        trunkMesh.setMatrixAt(i, dummy.matrix);
      }
    });
    if (trunkMesh) trunkMesh.instanceMatrix.needsUpdate = true;
    if (cypressMesh) {
      cypresses.forEach(([x, z, scale], i) => {
        dummy.position.set(x, 3.1 * scale, z);
        dummy.rotation.set(0, i * 2.1, 0);
        dummy.scale.set(scale * 0.9, scale * 2.3, scale * 0.9);
        dummy.updateMatrix();
        cypressMesh.setMatrixAt(i, dummy.matrix);
      });
      cypressMesh.instanceMatrix.needsUpdate = true;
    }
    oliveMesh.instanceMatrix.needsUpdate = true;
  }, [olives, cypresses]);

  return (
    <>
      <instancedMesh
        ref={olive}
        args={[undefined, undefined, olives.length]}
        castShadow={quality === 'high'}
        receiveShadow
        material={m.foliage}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[1.7, 1]} />
      </instancedMesh>
      <instancedMesh
        ref={cypress}
        args={[undefined, undefined, cypresses.length]}
        castShadow={quality === 'high'}
        material={m.foliageLight}
        frustumCulled={false}
      >
        <coneGeometry args={[0.8, 2.6, 7]} />
      </instancedMesh>
      <instancedMesh ref={trunks} args={[undefined, undefined, olives.length]} castShadow={quality === 'high'} material={m.trunk}>
        <cylinderGeometry args={[0.12, 0.2, 1.8, 6]} />
      </instancedMesh>
    </>
  );
}

function Shrubs({ m }: { m: VillaMaterialSet }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const positions = useMemo(() => {
    const result: [number, number, number][] = [];
    for (let i = 0; i < 26; i += 1) {
      const angle = (i / 26) * Math.PI * 2;
      const radius = 15 + (i % 5) * 2.6;
      result.push([Math.cos(angle) * radius, 0.28 + (i % 3) * 0.08, Math.sin(angle) * radius - 1]);
    }
    return result;
  }, []);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    positions.forEach((p, i) => {
      if (!ref.current) return;
      dummy.position.set(...p);
      dummy.rotation.set(0, i, 0);
      dummy.scale.set(0.7 + (i % 4) * 0.18, 0.4 + (i % 3) * 0.1, 0.7 + (i % 5) * 0.12);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, positions.length]} castShadow receiveShadow material={m.foliage}>
      <icosahedronGeometry args={[1, 1]} />
    </instancedMesh>
  );
}

function Pool({ m, quality }: { m: VillaMaterialSet; quality: Quality }) {
  return (
    <group>
      <mesh position={[8.2, 0.1, 10.2]} material={m.stoneDark}>
        <boxGeometry args={[9.3, 0.5, 7.3]} />
      </mesh>
      <mesh position={[8.2, 0.415, 10.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.9, 6.9]} />
        {quality === 'high' ? (
          <MeshReflectorMaterial
            resolution={512}
            blur={[280, 80]}
            mixBlur={1.2}
            mixStrength={2.4}
            depthScale={1.2}
            minDepthThreshold={0.3}
            maxDepthThreshold={1.4}
            color="#1e3836"
            metalness={0.55}
            roughness={0.28}
            mirror={0.8}
            envMapIntensity={1.2}
          />
        ) : (
          <primitive object={m.water} attach="material" />
        )}
      </mesh>
      <group position={[8.2, 0.42, 10.2]}>
        <mesh position={[0, 0, 3.57]} material={m.stone}>
          <boxGeometry args={[9.7, 0.1, 0.34]} />
        </mesh>
        <mesh position={[0, 0, -3.57]} material={m.stone}>
          <boxGeometry args={[9.7, 0.1, 0.34]} />
        </mesh>
        <mesh position={[4.57, 0, 0]} material={m.stone}>
          <boxGeometry args={[0.34, 0.1, 7.3]} />
        </mesh>
        <mesh position={[-4.57, 0, 0]} material={m.stone}>
          <boxGeometry args={[0.34, 0.1, 7.3]} />
        </mesh>
      </group>
      <mesh position={[8.2, 0.33, 7.15]} material={m.stoneDark}>
        <boxGeometry args={[8.6, 0.14, 0.55]} />
      </mesh>
      <mesh position={[12.2, 0.46, 10.2]} material={m.glow}>
        <boxGeometry args={[0.16, 0.02, 4.8]} />
      </mesh>
      <LoungeChairs m={m} position={[1.1, 0.38, 11.2]} />
    </group>
  );
}

function Garage({ m }: { m: VillaMaterialSet }) {
  return (
    <group>
      <mesh position={[-10.4, 1.85, 5.6]} castShadow receiveShadow material={m.stoneDark}>
        <boxGeometry args={[5.4, 3.0, 6.2]} />
      </mesh>
      <mesh position={[-10.4, 3.4, 5.6]} material={m.lawn}>
        <boxGeometry args={[5.6, 0.16, 6.4]} />
      </mesh>
      <mesh position={[-10.4, 1.82, 8.68]} material={m.darkWood}>
        <boxGeometry args={[4.7, 2.6, 0.1]} />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[-12.55 + i * 0.48, 1.82, 8.75]} material={m.metal}>
          <boxGeometry args={[0.1, 2.5, 0.05]} />
        </mesh>
      ))}
      <mesh position={[-10.4, 3.64, 8.9]} material={m.timber}>
        <boxGeometry args={[5.8, 0.12, 0.4]} />
      </mesh>
      <Plant m={m} position={[-13.1, 3.5, 4.2]} scale={0.7} />
      <Plant m={m} position={[-13.1, 3.5, 6.9]} scale={0.75} />
    </group>
  );
}

function Site({ m, quality }: { m: VillaMaterialSet; quality: Quality }) {
  return (
    <group>
      {/* lawn plateau */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.lawn}>
        <circleGeometry args={[130, 64]} />
      </mesh>
      {/* ocean and distant land */}
      <mesh position={[0, -2.4, -190]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[900, 520]} />
        <meshStandardMaterial color="#4e6667" roughness={0.18} metalness={0.5} envMapIntensity={1.1} />
      </mesh>
      <mesh position={[-85, -10, -150]} material={m.foliage}>
        <sphereGeometry args={[62, 20, 12]} />
      </mesh>
      <mesh position={[40, -16, -185]} material={m.foliageLight}>
        <sphereGeometry args={[85, 20, 12]} />
      </mesh>
      <mesh position={[150, -12, -120]} material={m.foliage}>
        <sphereGeometry args={[70, 20, 12]} />
      </mesh>

      {/* plinth */}
      <mesh position={[0, 0.19, 3.2]} receiveShadow castShadow material={m.stone}>
        <boxGeometry args={[28, 0.38, 24.6]} />
      </mesh>
      <mesh position={[0, 0.385, 3.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.paving}>
        <planeGeometry args={[27.9, 24.5]} />
      </mesh>

      {/* driveway + arrival */}
      <mesh position={[-21, 0.02, 13]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.gravel}>
        <planeGeometry args={[16, 20]} />
      </mesh>
      <mesh position={[-16, 0.4, 9]} material={m.stone} receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.06, 1.6]} />
      </mesh>

      <Pool m={m} quality={quality} />
      <Garage m={m} />
      <Trees m={m} quality={quality} />
      <Shrubs m={m} />

      {/* garden path */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-7.4 - i * 1.1, 0.41, -8.4 - i * 0.9]} rotation={[0, i * 0.12, 0]} receiveShadow material={m.stone}>
          <boxGeometry args={[1.3, 0.04, 0.9]} />
        </mesh>
      ))}

      {/* low garden wall */}
      <mesh position={[-11.6, 0.65, -4.4]} castShadow receiveShadow material={m.stoneDark}>
        <boxGeometry args={[0.4, 0.55, 9]} />
      </mesh>
      <mesh position={[-8.2, 0.65, -8.8]} castShadow receiveShadow material={m.stoneDark}>
        <boxGeometry args={[7, 0.55, 0.4]} />
      </mesh>

      {/* landscape lights */}
      {[
        [-13, 0.6, 11],
        [13.4, 0.6, 5.6],
        [3.2, 0.5, 15.2],
        [-7.5, 0.5, -8.4],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} material={m.glow}>
          <sphereGeometry args={[0.09, 8, 8]} />
        </mesh>
      ))}
    </group>
  );
}

/* ————————————————————————————————————————————————————————————
   Villa floors
   ———————————————————————————————————————————————————————————— */

function GroundFloor({ m }: { m: VillaMaterialSet }) {
  const clad = m.stone;
  const mullions = useMemo(() => [-5.6, -3.7, -1.8, 0.1, 2.0, 3.9], []);
  const sideMullions = useMemo(() => [-2.9, -1.2, 0.5, 2.2], []);

  return (
    <group>
      {/* floor slab */}
      <mesh position={[-1.2, 0.55, 0]} castShadow receiveShadow material={m.stone}>
        <boxGeometry args={[12.6, 0.3, 8.6]} />
      </mesh>
      <mesh position={[-1.2, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.darkWood}>
        <planeGeometry args={[12.2, 8.2]} />
      </mesh>
      {/* back + west walls */}
      <mesh position={[-1.2, 2.15, -4.05]} castShadow receiveShadow material={clad}>
        <boxGeometry args={[12.6, 2.9, 0.32]} />
      </mesh>
      <mesh position={[-7.35, 2.15, 0]} castShadow receiveShadow material={clad}>
        <boxGeometry args={[0.36, 2.9, 8.4]} />
      </mesh>
      <mesh position={[-7.35, 3.9, 0]} castShadow material={clad}>
        <boxGeometry args={[0.5, 1.6, 8.6]} />
      </mesh>
      {/* roof / canopy */}
      <mesh position={[-0.9, 3.75, 0.2]} castShadow receiveShadow material={clad}>
        <boxGeometry args={[13.8, 0.3, 9.8]} />
      </mesh>
      <mesh position={[-0.9, 3.57, 4.6]} material={m.timber}>
        <boxGeometry args={[13.6, 0.09, 0.9]} />
      </mesh>
      {/* glass facades */}
      <mesh position={[-1.2, 2.15, 4.02]} material={m.glass}>
        <boxGeometry args={[12.2, 2.86, 0.05]} />
      </mesh>
      <mesh position={[4.68, 2.15, 0]} material={m.glass}>
        <boxGeometry args={[0.05, 2.86, 7.9]} />
      </mesh>
      {/* mullions */}
      {mullions.map((x) => (
        <mesh key={x} position={[x, 2.15, 4.08]} castShadow material={m.metal}>
          <boxGeometry args={[0.055, 2.92, 0.11]} />
        </mesh>
      ))}
      {sideMullions.map((z) => (
        <mesh key={z} position={[4.74, 2.15, z]} castShadow material={m.metal}>
          <boxGeometry args={[0.11, 2.92, 0.055]} />
        </mesh>
      ))}
      <mesh position={[-1.2, 3.52, 4.08]} material={m.metal}>
        <boxGeometry args={[12.3, 0.08, 0.13]} />
      </mesh>
      <mesh position={[-1.2, 0.76, 4.08]} material={m.metal}>
        <boxGeometry args={[12.3, 0.08, 0.13]} />
      </mesh>
      <mesh position={[4.74, 3.52, 0]} material={m.metal}>
        <boxGeometry args={[0.13, 0.08, 7.9]} />
      </mesh>

      {/* interior — living */}
      <mesh position={[-3, 0.735, 1.9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.fabric}>
        <planeGeometry args={[5.4, 3.9]} />
      </mesh>
      <Sofa m={m} position={[-3.1, 0.72, 0.9]} />
      <mesh position={[-3.1, 1.14, 2.35]} castShadow material={m.marble}>
        <boxGeometry args={[2.2, 0.08, 1.05]} />
      </mesh>
      <mesh position={[-3.1, 0.9, 2.35]} material={m.stoneDark}>
        <boxGeometry args={[1.4, 0.4, 0.6]} />
      </mesh>
      <Armchair m={m} position={[-0.6, 0.72, 2.0]} rotation={-1.1} />
      <Armchair m={m} position={[-5.4, 0.72, 2.2]} rotation={0.8} />
      <Plant m={m} position={[-6.2, 0.72, 3.2]} scale={0.95} />
      <Pendant m={m} position={[-3.1, 3.05, 1.5]} />
      {/* artwork on stone wall */}
      <mesh position={[-7.15, 2.0, -1.4]} rotation={[0, Math.PI / 2, 0]} material={m.art}>
        <boxGeometry args={[2.2, 1.35, 0.05]} />
      </mesh>

      {/* interior — kitchen */}
      <mesh position={[2.55, 0.72, -1.25]} castShadow material={m.darkWood}>
        <boxGeometry args={[2.95, 0.86, 1.15]} />
      </mesh>
      <mesh position={[2.55, 1.18, -1.25]} castShadow material={m.marble}>
        <boxGeometry args={[3.1, 0.09, 1.28]} />
      </mesh>
      <mesh position={[1.6, 1.24, -1.4]} material={m.metal}>
        <boxGeometry args={[0.55, 0.04, 0.4]} />
      </mesh>
      {[-0.2, 1.1, 2.4].map((x) => (
        <group key={x} position={[x, 0.72, -0.2]}>
          <mesh position={[0, 0.5, 0]} material={m.leather}>
            <cylinderGeometry args={[0.2, 0.2, 0.09, 14]} />
          </mesh>
          <mesh position={[0, 0.25, 0]} material={m.metal}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
          </mesh>
        </group>
      ))}
      <mesh position={[2.55, 0.72, -3.55]} castShadow material={m.darkWood}>
        <boxGeometry args={[4.4, 0.85, 0.65]} />
      </mesh>
      <mesh position={[2.55, 1.18, -3.55]} material={m.marble}>
        <boxGeometry args={[4.5, 0.07, 0.72]} />
      </mesh>
      <mesh position={[2.55, 2.9, -3.8]} castShadow material={m.timber}>
        <boxGeometry args={[4.4, 0.8, 0.3]} />
      </mesh>
      <mesh position={[0.35, 2.15, -2.95]} castShadow material={m.timber}>
        <boxGeometry args={[0.12, 2.9, 1.9]} />
      </mesh>
      {/* dining */}
      <DiningSet m={m} position={[2.3, 0.72, 1.6]} />
      <Pendant m={m} position={[2.3, 2.95, 1.6]} scale={0.9} />

      {/* stairs */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-6.05, 0.86 + i * 0.19, -1.0 - i * 0.26]} castShadow material={m.timber}>
          <boxGeometry args={[1.5, 0.1, 0.3]} />
        </mesh>
      ))}
      <mesh position={[-6.85, 2.2, -2.0]} material={m.metal}>
        <boxGeometry args={[0.04, 3.0, 2.3]} />
      </mesh>

      {/* warm ceiling strips */}
      {[-4.6, -2.7, -0.8, 1.1, 3.0].map((x) => (
        <mesh key={x} position={[x, 3.56, 2.9]} material={m.glow}>
          <boxGeometry args={[1.4, 0.02, 0.08]} />
        </mesh>
      ))}
      <GroundLevelWindowGlow m={m} />
    </group>
  );
}

function GroundLevelWindowGlow({ m }: { m: VillaMaterialSet }) {
  return (
    <mesh position={[-1.2, 2.5, 3.96]} material={m.glow}>
      <planeGeometry args={[11.6, 1.1]} />
    </mesh>
  );
}

function FirstFloor({ m, finish }: { m: VillaMaterialSet; finish: MaterialId }) {
  const clad = finish === 'oak' ? m.timber : finish === 'concrete' ? m.concrete : m.stone;
  const mullions = useMemo(() => [-1.7, 0.4, 2.5, 4.6, 6.7], []);

  return (
    <group>
      <mesh position={[3, 4.04, 0]} castShadow receiveShadow material={m.stone}>
        <boxGeometry args={[10.9, 0.28, 7.6]} />
      </mesh>
      <mesh position={[3, 4.19, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.darkWood}>
        <planeGeometry args={[10.5, 7.2]} />
      </mesh>
      {/* walls */}
      <mesh position={[3, 5.55, -3.62]} castShadow receiveShadow material={m.timber}>
        <boxGeometry args={[10.9, 2.9, 0.3]} />
      </mesh>
      <mesh position={[-2.25, 5.55, 0]} castShadow receiveShadow material={m.stone}>
        <boxGeometry args={[0.34, 2.9, 7.5]} />
      </mesh>
      <mesh position={[3, 5.55, 3.58]} material={m.glass}>
        <boxGeometry args={[10.6, 2.86, 0.05]} />
      </mesh>
      {mullions.map((x) => (
        <mesh key={x} position={[x, 5.55, 3.64]} castShadow material={m.metal}>
          <boxGeometry args={[0.055, 2.92, 0.11]} />
        </mesh>
      ))}
      <mesh position={[3, 6.94, 3.64]} material={m.metal}>
        <boxGeometry args={[10.7, 0.08, 0.13]} />
      </mesh>
      <mesh position={[3, 4.2, 3.64]} material={m.metal}>
        <boxGeometry args={[10.7, 0.08, 0.13]} />
      </mesh>
      {/* timber screen east */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[8.2, 5.55, -3.35 + i * 0.35]} castShadow material={m.timber}>
          <boxGeometry args={[0.12, 2.9, 0.16]} />
        </mesh>
      ))}
      <mesh position={[8.24, 5.55, 0]} material={m.stoneDark}>
        <boxGeometry args={[0.2, 2.9, 0.18]} />
      </mesh>
      {/* roof terrace */}
      <mesh position={[3, 6.98, 0.1]} castShadow receiveShadow material={clad}>
        <boxGeometry args={[11.6, 0.28, 8.4]} />
      </mesh>
      <mesh position={[3, 7.13, 0.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.paving}>
        <planeGeometry args={[11.4, 8.0]} />
      </mesh>
      {/* glass balustrade at terrace edge */}
      <mesh position={[3, 7.68, 4.25]} material={m.glass}>
        <boxGeometry args={[11.2, 1.0, 0.035]} />
      </mesh>
      <mesh position={[8.63, 7.68, 0.1]} material={m.glass}>
        <boxGeometry args={[0.035, 1.0, 8.1]} />
      </mesh>
      {[-2.5, 0.5, 3.5, 6.4, 8.55].map((x) => (
        <mesh key={x} position={[x, 7.68, 4.25]} material={m.metal}>
          <boxGeometry args={[0.05, 1.05, 0.05]} />
        </mesh>
      ))}

      {/* bedroom suite */}
      <mesh position={[0.1, 4.205, 0.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.fabric}>
        <planeGeometry args={[4.4, 4.2]} />
      </mesh>
      <Bed m={m} position={[0.2, 4.2, 1.2]} />
      <Armchair m={m} position={[-1.5, 4.2, -0.9]} rotation={1.4} />
      <Plant m={m} position={[1.4, 4.2, -2.4]} scale={0.8} />
      <mesh position={[2.6, 5.55, -0.4]} material={m.glass}>
        <boxGeometry args={[0.04, 2.3, 1.8]} />
      </mesh>
      <mesh position={[2.6, 5.55, -0.4]} material={m.metal}>
        <boxGeometry args={[0.06, 2.3, 0.05]} />
      </mesh>

      {/* family room */}
      <Sofa m={m} position={[5.75, 4.2, 0.1]} width={2.8} />
      <mesh position={[5.75, 4.6, 1.25]} castShadow material={m.marble}>
        <boxGeometry args={[1.7, 0.06, 0.8]} />
      </mesh>
      <mesh position={[5.75, 4.4, 1.25]} material={m.metal}>
        <boxGeometry args={[1.1, 0.35, 0.45]} />
      </mesh>
      <mesh position={[6.9, 5.3, -3.3]} material={m.art}>
        <boxGeometry args={[1.8, 1.0, 0.06]} />
      </mesh>
      <mesh position={[6.9, 4.6, -3.3]} material={m.timber}>
        <boxGeometry args={[2.4, 0.5, 0.5]} />
      </mesh>
      {/* artwork */}
      <mesh position={[-2.05, 5.5, -1.2]} rotation={[0, Math.PI / 2, 0]} material={m.art}>
        <boxGeometry args={[1.9, 1.2, 0.05]} />
      </mesh>
    </group>
  );
}

function SecondFloor({ m, finish }: { m: VillaMaterialSet; finish: MaterialId }) {
  const clad = finish === 'oak' ? m.timber : finish === 'concrete' ? m.concrete : m.stone;
  const mullions = useMemo(() => [2.0, 3.7, 5.4, 7.0], []);
  return (
    <group>
      <mesh position={[4.2, 7.26, 0]} castShadow receiveShadow material={m.stone}>
        <boxGeometry args={[6.7, 0.28, 6.3]} />
      </mesh>
      <mesh position={[4.2, 7.41, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.darkWood}>
        <planeGeometry args={[6.3, 5.9]} />
      </mesh>
      <mesh position={[4.2, 8.65, -3.02]} castShadow receiveShadow material={m.timber}>
        <boxGeometry args={[6.7, 2.7, 0.28]} />
      </mesh>
      <mesh position={[1.02, 8.65, 0]} castShadow receiveShadow material={clad}>
        <boxGeometry args={[0.34, 2.7, 6.1]} />
      </mesh>
      <mesh position={[4.2, 8.65, 3.02]} material={m.glass}>
        <boxGeometry args={[6.3, 2.66, 0.05]} />
      </mesh>
      {mullions.map((x) => (
        <mesh key={x} position={[x, 8.65, 3.08]} castShadow material={m.metal}>
          <boxGeometry args={[0.05, 2.72, 0.1]} />
        </mesh>
      ))}
      <mesh position={[4.2, 9.94, 3.08]} material={m.metal}>
        <boxGeometry args={[6.4, 0.07, 0.12]} />
      </mesh>
      <mesh position={[4.2, 7.42, 3.08]} material={m.metal}>
        <boxGeometry args={[6.4, 0.07, 0.12]} />
      </mesh>
      {/* east glass */}
      <mesh position={[7.48, 8.65, 0]} material={m.glass}>
        <boxGeometry args={[0.05, 2.66, 5.9]} />
      </mesh>
      {[-2.1, -0.5, 1.1, 2.7].map((z) => (
        <mesh key={z} position={[7.54, 8.65, z]} material={m.metal}>
          <boxGeometry args={[0.1, 2.72, 0.05]} />
        </mesh>
      ))}
      {/* roof */}
      <mesh position={[4.2, 10.05, 0]} castShadow receiveShadow material={clad}>
        <boxGeometry args={[7.6, 0.3, 7.2]} />
      </mesh>
      <mesh position={[4.2, 10.21, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.paving}>
        <planeGeometry args={[7.4, 7.0]} />
      </mesh>
      {/* interior */}
      <mesh position={[5.7, 7.42, -0.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.fabric}>
        <planeGeometry args={[2.4, 2.6]} />
      </mesh>
      <Sofa m={m} position={[4.6, 7.41, -1.7]} width={2.2} />
      <Armchair m={m} position={[6.4, 7.41, -0.7]} rotation={-1.3} />
      <mesh position={[4.6, 7.9, -0.2]} castShadow material={m.marble}>
        <boxGeometry args={[1.6, 0.06, 0.8]} />
      </mesh>
      <mesh position={[3.2, 8.4, -2.95]} material={m.timber}>
        <boxGeometry args={[2.6, 0.1, 0.34]} />
      </mesh>
      <mesh position={[3.2, 8.0, -2.95]} material={m.timber}>
        <boxGeometry args={[2.6, 0.1, 0.34]} />
      </mesh>
      {[2.3, 2.9, 3.5, 4.1].map((x) => (
        <mesh key={x} position={[x, 8.2, -2.9]} material={m.art}>
          <boxGeometry args={[0.12, 0.36, 0.22]} />
        </mesh>
      ))}
      <mesh position={[1.25, 8.3, -1.4]} rotation={[0, Math.PI / 2, 0]} material={m.art}>
        <boxGeometry args={[1.7, 1.05, 0.05]} />
      </mesh>
      <Plant m={m} position={[2.0, 7.41, 2.0]} scale={0.85} />
      <mesh position={[4.2, 7.45, 2.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.fabric}>
        <planeGeometry args={[3.4, 2.2]} />
      </mesh>
      <mesh position={[4.2, 7.9, 2.4]} castShadow material={m.timber}>
        <boxGeometry args={[2.0, 0.06, 0.7]} />
      </mesh>
    </group>
  );
}

function Rooftop({ m }: { m: VillaMaterialSet }) {
  const slat = useRef<THREE.InstancedMesh>(null);
  const count = 24;

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i += 1) {
      if (!slat.current) continue;
      dummy.position.set(1.4 + i * 0.265, 12.85, 0);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      slat.current.setMatrixAt(i, dummy.matrix);
    }
    if (slat.current) slat.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      {/* balustrade */}
      <mesh position={[4.2, 10.72, 3.52]} material={m.glass}>
        <boxGeometry args={[7.2, 0.95, 0.035]} />
      </mesh>
      <mesh position={[4.2, 10.72, -3.52]} material={m.glass}>
        <boxGeometry args={[7.2, 0.95, 0.035]} />
      </mesh>
      <mesh position={[0.82, 10.72, 0]} material={m.glass}>
        <boxGeometry args={[0.035, 0.95, 6.9]} />
      </mesh>
      <mesh position={[7.58, 10.72, 0]} material={m.glass}>
        <boxGeometry args={[0.035, 0.95, 6.9]} />
      </mesh>
      {[0.82, 2.5, 4.2, 5.9, 7.55].map((x) => (
        <mesh key={x} position={[x, 10.7, 3.52]} material={m.metal}>
          <boxGeometry args={[0.05, 1.0, 0.05]} />
        </mesh>
      ))}
      {/* pergola */}
      {[
        [1.5, -2.6],
        [1.5, 2.6],
        [7.0, -2.6],
        [7.0, 2.6],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 11.5, z]} castShadow material={m.timber}>
          <boxGeometry args={[0.13, 2.75, 0.13]} />
        </mesh>
      ))}
      <mesh position={[4.25, 12.86, -2.6]} castShadow material={m.timber}>
        <boxGeometry args={[5.7, 0.14, 0.14]} />
      </mesh>
      <mesh position={[4.25, 12.86, 2.6]} castShadow material={m.timber}>
        <boxGeometry args={[5.7, 0.14, 0.14]} />
      </mesh>
      <instancedMesh ref={slat} args={[undefined, undefined, count]} castShadow material={m.timber}>
        <boxGeometry args={[0.07, 0.09, 5.4]} />
      </instancedMesh>
      {/* outdoor kitchen */}
      <mesh position={[2.6, 10.62, 2.3]} castShadow material={m.stoneDark}>
        <boxGeometry args={[2.5, 0.82, 0.72]} />
      </mesh>
      <mesh position={[2.6, 11.06, 2.3]} material={m.marble}>
        <boxGeometry args={[2.6, 0.07, 0.78]} />
      </mesh>
      <mesh position={[3.35, 11.12, 2.3]} material={m.metal}>
        <boxGeometry args={[0.55, 0.04, 0.5]} />
      </mesh>
      {/* dining */}
      <mesh position={[4.9, 10.98, 0.4]} castShadow material={m.timber}>
        <boxGeometry args={[2.2, 0.08, 0.95]} />
      </mesh>
      <mesh position={[4.9, 10.55, 0.4]} material={m.metal}>
        <boxGeometry args={[0.5, 0.8, 0.14]} />
      </mesh>
      {[-0.8, 0, 0.8].map((x) => (
        <group key={x}>
          <mesh position={[4.9 + x, 10.85, 1.05]} material={m.leather}>
            <boxGeometry args={[0.44, 0.08, 0.4]} />
          </mesh>
          <mesh position={[4.9 + x, 11.05, 1.24]} material={m.leather}>
            <boxGeometry args={[0.42, 0.44, 0.05]} />
          </mesh>
          <mesh position={[4.9 + x, 10.85, -0.25]} material={m.leather}>
            <boxGeometry args={[0.44, 0.08, 0.4]} />
          </mesh>
          <mesh position={[4.9 + x, 11.05, -0.44]} material={m.leather}>
            <boxGeometry args={[0.42, 0.44, 0.05]} />
          </mesh>
        </group>
      ))}
      {/* plunge pool */}
      <mesh position={[6.35, 10.38, -1.9]} material={m.stoneDark}>
        <boxGeometry args={[2.3, 0.4, 1.6]} />
      </mesh>
      <mesh position={[6.35, 10.43, -1.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.05, 1.35]} />
        <primitive object={m.water} attach="material" />
      </mesh>
      <mesh position={[6.35, 10.57, -2.7]} material={m.stone}>
        <boxGeometry args={[2.4, 0.09, 0.16]} />
      </mesh>
      {/* planters */}
      {[
        [1.35, 3.1],
        [7.0, 3.0],
        [1.35, -3.0],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 10.2, z]}>
          <mesh position={[0, 0.3, 0]} castShadow material={m.stoneDark}>
            <boxGeometry args={[1.0, 0.5, 1.0]} />
          </mesh>
          <mesh position={[0, 0.85, 0]} castShadow material={m.foliage}>
            <icosahedronGeometry args={[0.55, 1]} />
          </mesh>
        </group>
      ))}
      {/* lighting */}
      <mesh position={[1.5, 12.2, -2.45]} material={m.glow}>
        <boxGeometry args={[0.06, 0.06, 0.3]} />
      </mesh>
      <mesh position={[7.0, 12.2, 2.45]} material={m.glow}>
        <boxGeometry args={[0.06, 0.06, 0.3]} />
      </mesh>
    </group>
  );
}

/* ————————————————————————————————————————————————————————————
   Animated floor group + root
   ———————————————————————————————————————————————————————————— */

function FloorGroup({
  index,
  selected,
  exploded,
  children,
}: {
  index: number;
  selected?: FloorId | null;
  exploded?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = exploded ? index * FLOOR_OFFSET + (selected ? 0.32 : 0) : 0;
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, target, 3.2, delta);
  });
  return <group ref={ref}>{children}</group>;
}

export function Villa({
  finish,
  mode,
  quality = 'high',
  selectedFloor = null,
  exploded = false,
  activeHotspot = null,
  onHotspot,
  showHotspots = true,
}: VillaProps) {
  const m = useVillaMaterials(finish);

  useFrame((_, delta) => {
    const target = mode === 'day' ? 0.16 : mode === 'sunset' ? 0.5 : 0.92;
    m.glow.opacity = THREE.MathUtils.damp(m.glow.opacity, target, 2.2, delta);
  });

  const visibleHotspots = hotspots.filter((h) => !selectedFloor || h.floor === selectedFloor);

  return (
    <group>
      <Site m={m} quality={quality} />
      <Lamps mode={mode} quality={quality} />
      {LEVELS.map((level, index) => {
        const isSelected = selectedFloor === level.id;
        return (
          <FloorGroup key={level.id} index={index} selected={selectedFloor} exploded={exploded}>
            {level.id === 'ground' && <GroundFloor m={m} />}
            {level.id === 'first' && <FirstFloor m={m} finish={finish} />}
            {level.id === 'second' && <SecondFloor m={m} finish={finish} />}
            {level.id === 'rooftop' && <Rooftop m={m} />}
            {exploded && (
              <>
                <FloorOutline position={level.highlight} size={level.size} />
                <FloorTag
                  label={level.id === 'rooftop' ? 'Rooftop Terrace' : level.id === 'ground' ? 'Ground Floor' : level.id === 'first' ? 'First Floor' : 'Second Floor'}
                  index={String(index + 1).padStart(2, '0')}
                  y={level.highlight[1] + 0.7}
                />
                {isSelected && (
                  <mesh position={level.highlight} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[level.size[0], level.size[2]]} />
                    <meshBasicMaterial color="#b79a6a" transparent opacity={0.055} depthWrite={false} toneMapped={false} />
                  </mesh>
                )}
              </>
            )}
            {showHotspots &&
              visibleHotspots
                .filter((h) => h.floor === level.id)
                .map((hotspot) => (
                  <HotspotMarker
                    key={hotspot.id}
                    hotspot={hotspot}
                    active={activeHotspot === hotspot.id}
                    onSelect={onHotspot}
                  />
                ))}
          </FloorGroup>
        );
      })}
    </group>
  );
}
