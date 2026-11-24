import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { LightingMode } from '../../data/properties';
import { createEnvironmentTexture } from './proceduralTextures';

interface ModeConfig {
  background: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  sunColor: string;
  sunIntensity: number;
  sunDirection: [number, number, number];
  ambient: number;
  hemi: number;
  hemiSky: string;
  hemiGround: string;
  skyTop: string;
  skyHorizon: string;
  skyBottom: string;
  skySun: string;
  skySunIntensity: number;
  skySharp: number;
  haze: number;
  stars: number;
  landscape: number;
}

const CONFIG: Record<LightingMode, ModeConfig> = {
  day: {
    background: '#bccdd0',
    fog: '#c6d3d3',
    fogNear: 70,
    fogFar: 260,
    sunColor: '#fff4dd',
    sunIntensity: 3.1,
    sunDirection: [26, 34, 20],
    ambient: 0.32,
    hemi: 0.55,
    hemiSky: '#cfe1ea',
    hemiGround: '#89886f',
    skyTop: '#4f7d9f',
    skyHorizon: '#dfe5da',
    skyBottom: '#7f8472',
    skySun: '#fff1cf',
    skySunIntensity: 1.0,
    skySharp: 1200,
    haze: 0.5,
    stars: 0,
    landscape: 0.6,
  },
  sunset: {
    background: '#dcb593',
    fog: '#d3ac8b',
    fogNear: 55,
    fogFar: 225,
    sunColor: '#ffb36b',
    sunIntensity: 2.85,
    sunDirection: [38, 7, 20],
    ambient: 0.2,
    hemi: 0.3,
    hemiSky: '#e9c3a0',
    hemiGround: '#5e5142',
    skyTop: '#33415b',
    skyHorizon: '#f2b684',
    skyBottom: '#5f5548',
    skySun: '#ffb266',
    skySunIntensity: 1.5,
    skySharp: 380,
    haze: 0.85,
    stars: 0.18,
    landscape: 9,
  },
  night: {
    background: '#05080d',
    fog: '#080d16',
    fogNear: 42,
    fogFar: 180,
    sunColor: '#8fa9d6',
    sunIntensity: 0.5,
    sunDirection: [-18, 26, -24],
    ambient: 0.085,
    hemi: 0.12,
    hemiSky: '#2a3b57',
    hemiGround: '#0d100d',
    skyTop: '#02040a',
    skyHorizon: '#111c30',
    skyBottom: '#050807',
    skySun: '#b9c9e9',
    skySunIntensity: 0.7,
    skySharp: 700,
    haze: 0.16,
    stars: 0.85,
    landscape: 22,
  },
};

const vertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uBottom;
  uniform vec3 uSunColor;
  uniform vec3 uSunDirection;
  uniform float uSunIntensity;
  uniform float uSunSharp;
  uniform float uHaze;
  varying vec3 vWorldPosition;

  void main() {
    vec3 dir = normalize(vWorldPosition - cameraPosition);
    float h = dir.y;
    vec3 color = mix(uHorizon, uTop, smoothstep(0.0, 0.58, h));
    color = mix(uBottom, color, smoothstep(-0.1, 0.015, h));
    float sunDot = max(dot(dir, normalize(uSunDirection)), 0.0);
    color += uSunColor * pow(sunDot, uSunSharp) * uSunIntensity * 0.4;
    color += uSunColor * smoothstep(0.9993, 0.9999, sunDot) * uSunIntensity * 2.2;
    color += uHorizon * uHaze * pow(1.0 - abs(h), 22.0) * 0.3;
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function SkyDome({ mode }: { mode: LightingMode }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const target = CONFIG[mode];
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(target.skyTop) },
      uHorizon: { value: new THREE.Color(target.skyHorizon) },
      uBottom: { value: new THREE.Color(target.skyBottom) },
      uSunColor: { value: new THREE.Color(target.skySun) },
      uSunDirection: { value: new THREE.Vector3(...target.sunDirection).normalize() },
      uSunIntensity: { value: target.skySunIntensity },
      uSunSharp: { value: target.skySharp },
      uHaze: { value: target.haze },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const targetSun = useMemo(() => new THREE.Vector3(...target.sunDirection).normalize(), [target]);
  const targetColors = useMemo(
    () => ({
      top: new THREE.Color(target.skyTop),
      horizon: new THREE.Color(target.skyHorizon),
      bottom: new THREE.Color(target.skyBottom),
      sun: new THREE.Color(target.skySun),
    }),
    [target],
  );

  useFrame((_, delta) => {
    const uniformsRef = materialRef.current?.uniforms;
    if (!uniformsRef) return;
    const damp = THREE.MathUtils.damp;
    (uniformsRef.uTop.value as THREE.Color).lerp(targetColors.top, 1 - Math.exp(-2.2 * delta));
    (uniformsRef.uHorizon.value as THREE.Color).lerp(
      targetColors.horizon,
      1 - Math.exp(-2.2 * delta),
    );
    (uniformsRef.uBottom.value as THREE.Color).lerp(
      targetColors.bottom,
      1 - Math.exp(-2.2 * delta),
    );
    (uniformsRef.uSunColor.value as THREE.Color).lerp(
      targetColors.sun,
      1 - Math.exp(-2.2 * delta),
    );
    (uniformsRef.uSunDirection.value as THREE.Vector3).lerp(
      targetSun,
      1 - Math.exp(-1.8 * delta),
    );
    uniformsRef.uSunIntensity.value = damp(
      uniformsRef.uSunIntensity.value,
      target.skySunIntensity,
      2.2,
      delta,
    );
    uniformsRef.uSunSharp.value = damp(uniformsRef.uSunSharp.value, target.skySharp, 2.2, delta);
    uniformsRef.uHaze.value = damp(uniformsRef.uHaze.value, target.haze, 2.2, delta);
  });

  return (
    <mesh scale={520} frustumCulled={false}>
      <sphereGeometry args={[1, 32, 20]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

function StarField({ mode }: { mode: LightingMode }) {
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const count = 900;
    const array = new Float32Array(count * 3);
    let seed = 4919;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < count; i += 1) {
      const theta = random() * Math.PI * 2;
      const y = 0.06 + random() * 0.94;
      const radius = Math.sqrt(1 - y * y);
      array[i * 3] = Math.cos(theta) * radius * 420;
      array[i * 3 + 1] = y * 420;
      array[i * 3 + 2] = Math.sin(theta) * radius * 420;
    }
    return array;
  }, []);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    const target = CONFIG[mode].stars;
    materialRef.current.opacity = THREE.MathUtils.damp(
      materialRef.current.opacity,
      target,
      1.8,
      delta,
    );
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#dbe6f2"
        size={1.3}
        sizeAttenuation={false}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

export function LightingRig({ mode, quality = 'high' }: { mode: LightingMode; quality?: 'high' | 'low' }) {
  const scene = useThree((state) => state.scene);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const landscapeRefs = useRef<(THREE.PointLight | null)[]>([]);
  const envRef = useRef<THREE.Texture | null>(null);
  const config = CONFIG[mode];

  const targetSunPosition = useMemo(
    () => new THREE.Vector3(...config.sunDirection).normalize().multiplyScalar(75),
    [config.sunDirection],
  );
  const targetSunColor = useMemo(() => new THREE.Color(config.sunColor), [config.sunColor]);
  const targetBackground = useMemo(() => new THREE.Color(config.background), [config.background]);
  const targetFog = useMemo(() => new THREE.Color(config.fog), [config.fog]);
  const targetHemiSky = useMemo(() => new THREE.Color(config.hemiSky), [config.hemiSky]);
  const targetHemiGround = useMemo(() => new THREE.Color(config.hemiGround), [config.hemiGround]);

  const fog = useMemo(() => new THREE.Fog(config.fog, config.fogNear, config.fogFar), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scene.background = new THREE.Color(config.background);
    scene.fog = fog;
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene, fog, config.background]);

  useEffect(() => {
    const texture = createEnvironmentTexture(mode);
    scene.environment = texture;
    if (envRef.current) envRef.current.dispose();
    envRef.current = texture;
    return () => {
      texture.dispose();
      if (scene.environment === texture) scene.environment = null;
    };
  }, [mode, scene]);

  useFrame((_, delta) => {
    const damping = 2.1;
    const sun = sunRef.current;
    if (sun) {
      sun.position.lerp(targetSunPosition, 1 - Math.exp(-damping * delta));
      sun.color.lerp(targetSunColor, 1 - Math.exp(-damping * delta));
      sun.intensity = THREE.MathUtils.damp(sun.intensity, config.sunIntensity, damping, delta);
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.damp(
        ambientRef.current.intensity,
        config.ambient,
        damping,
        delta,
      );
    }
    if (hemiRef.current) {
      hemiRef.current.intensity = THREE.MathUtils.damp(
        hemiRef.current.intensity,
        config.hemi,
        damping,
        delta,
      );
      hemiRef.current.color.lerp(targetHemiSky, 1 - Math.exp(-damping * delta));
      hemiRef.current.groundColor.lerp(targetHemiGround, 1 - Math.exp(-damping * delta));
    }
    for (const light of landscapeRefs.current) {
      if (!light) continue;
      light.intensity = THREE.MathUtils.damp(light.intensity, config.landscape, damping, delta);
    }
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(targetBackground, 1 - Math.exp(-damping * delta));
    }
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.lerp(targetFog, 1 - Math.exp(-damping * delta));
      scene.fog.near = THREE.MathUtils.damp(scene.fog.near, config.fogNear, damping, delta);
      scene.fog.far = THREE.MathUtils.damp(scene.fog.far, config.fogFar, damping, delta);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={config.ambient} />
      <hemisphereLight
        ref={hemiRef}
        color={config.hemiSky}
        groundColor={config.hemiGround}
        intensity={config.hemi}
      />
      <directionalLight
        ref={sunRef}
        position={[26, 34, 20]}
        color={config.sunColor}
        intensity={config.sunIntensity}
        castShadow
        shadow-mapSize-width={quality === 'high' ? 2048 : 1024}
        shadow-mapSize-height={quality === 'high' ? 2048 : 1024}
        shadow-camera-near={1}
        shadow-camera-far={190}
        shadow-camera-left={-42}
        shadow-camera-right={42}
        shadow-camera-top={38}
        shadow-camera-bottom={-32}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
      />
      <SkyDome mode={mode} />
      <StarField mode={mode} />
      {/* pool, garden and arrival landscape lighting */}
      {[
        [12.4, 0.9, 10.8],
        [-11.5, 0.9, 10.4],
        [-7.5, 0.8, -8.2],
      ].map((position, index) => (
        <pointLight
          key={index}
          ref={(el) => {
            landscapeRefs.current[index] = el;
          }}
          position={position as [number, number, number]}
          color="#ffc98f"
          distance={14}
          decay={2}
          intensity={0}
        />
      ))}
    </>
  );
}
