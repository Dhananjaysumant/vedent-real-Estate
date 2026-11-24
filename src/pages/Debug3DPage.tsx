import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

function Box() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#b79a6a" />
    </mesh>
  );
}

export function Debug3DPage() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#151715' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 3, 4]} />
        <Box />
      </Canvas>
    </div>
  );
}
