import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { MaterialId } from '../../data/properties';
import {
  createConcreteTexture,
  createGravelTexture,
  createGrassTexture,
  createPavingTexture,
  createStoneTexture,
  createWoodTexture,
} from './proceduralTextures';

export interface VillaMaterialSet {
  stone: THREE.MeshStandardMaterial;
  stoneDark: THREE.MeshStandardMaterial;
  paving: THREE.MeshStandardMaterial;
  timber: THREE.MeshStandardMaterial;
  concrete: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  metal: THREE.MeshStandardMaterial;
  water: THREE.MeshPhysicalMaterial;
  lawn: THREE.MeshStandardMaterial;
  gravel: THREE.MeshStandardMaterial;
  fabric: THREE.MeshStandardMaterial;
  leather: THREE.MeshStandardMaterial;
  marble: THREE.MeshStandardMaterial;
  darkWood: THREE.MeshStandardMaterial;
  foliage: THREE.MeshStandardMaterial;
  foliageLight: THREE.MeshStandardMaterial;
  trunk: THREE.MeshStandardMaterial;
  glow: THREE.MeshBasicMaterial;
  art: THREE.MeshStandardMaterial;
  white: THREE.MeshStandardMaterial;
  textures: THREE.Texture[];
}

export function useVillaMaterials(finish: MaterialId): VillaMaterialSet {
  const materials = useMemo(() => {
    const travertine = finish === 'travertine';
    const stoneMap = createStoneTexture(
      travertine ? '#d9cdb5' : '#d3c8b3',
      travertine ? '#b8a787' : '#ab9c82',
      travertine ? 17 : 7,
      true,
    );
    const pavingMap = createPavingTexture(
      travertine ? '#d2c4ab' : '#c8bca7',
      travertine ? '#ab9b80' : '#a2937a',
      23,
    );
    const timberMap = createWoodTexture('#a4764c', '#6e4a2b', '#c79a6a', 31);
    const concreteMap = createConcreteTexture(43);
    const grassMap = createGrassTexture(47);
    const gravelMap = createGravelTexture(53);

    const stone = new THREE.MeshStandardMaterial({
      map: stoneMap,
      color: '#ffffff',
      roughness: 0.88,
      metalness: 0.02,
    });
    const stoneDark = new THREE.MeshStandardMaterial({
      map: stoneMap,
      color: '#b7ad9b',
      roughness: 0.92,
      metalness: 0.01,
    });
    const paving = new THREE.MeshStandardMaterial({
      map: pavingMap,
      color: '#ffffff',
      roughness: 0.9,
      metalness: 0.01,
    });
    const timber = new THREE.MeshStandardMaterial({
      map: timberMap,
      color: finish === 'oak' ? '#d9ab7a' : '#c49a6c',
      roughness: 0.58,
      metalness: 0.02,
    });
    const concrete = new THREE.MeshStandardMaterial({
      map: concreteMap,
      color: '#cfcdc6',
      roughness: 0.85,
      metalness: 0.02,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: finish === 'glass' ? '#8db3b2' : '#a9beba',
      roughness: finish === 'glass' ? 0.04 : 0.09,
      metalness: 0.12,
      transparent: true,
      opacity: finish === 'glass' ? 0.36 : 0.27,
      side: THREE.DoubleSide,
      depthWrite: false,
      envMapIntensity: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    });
    const metal = new THREE.MeshStandardMaterial({
      color: finish === 'metal' ? '#30322e' : '#6d5a42',
      roughness: 0.36,
      metalness: 0.88,
    });
    const water = new THREE.MeshPhysicalMaterial({
      color: '#1b3c3b',
      roughness: 0.06,
      metalness: 0.45,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 1.8,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    });
    const lawn = new THREE.MeshStandardMaterial({
      map: grassMap,
      color: '#9aa37d',
      roughness: 1,
      metalness: 0,
    });
    const gravel = new THREE.MeshStandardMaterial({
      map: gravelMap,
      color: '#ffffff',
      roughness: 1,
      metalness: 0,
    });
    const fabric = new THREE.MeshStandardMaterial({ color: '#ddd2be', roughness: 0.95 });
    const leather = new THREE.MeshStandardMaterial({ color: '#7d5c3e', roughness: 0.7 });
    const marble = new THREE.MeshStandardMaterial({
      map: stoneMap,
      color: '#f0e8d8',
      roughness: 0.35,
      metalness: 0.05,
    });
    const darkWood = new THREE.MeshStandardMaterial({ color: '#4a3524', roughness: 0.65 });
    const foliage = new THREE.MeshStandardMaterial({ color: '#4e5f45', roughness: 0.95 });
    const foliageLight = new THREE.MeshStandardMaterial({ color: '#697a56', roughness: 0.95 });
    const trunk = new THREE.MeshStandardMaterial({ color: '#57483a', roughness: 1 });
    const glow = new THREE.MeshBasicMaterial({
      color: '#ffc17a',
      transparent: true,
      opacity: 0.12,
      toneMapped: false,
      depthWrite: false,
    });
    const art = new THREE.MeshStandardMaterial({ color: '#b8a58a', roughness: 0.9 });
    const white = new THREE.MeshStandardMaterial({ color: '#eee8db', roughness: 0.8 });

    return {
      stone,
      stoneDark,
      paving,
      timber,
      concrete,
      glass,
      metal,
      water,
      lawn,
      gravel,
      fabric,
      leather,
      marble,
      darkWood,
      foliage,
      foliageLight,
      trunk,
      glow,
      art,
      white,
      textures: [stoneMap, pavingMap, timberMap, concreteMap, grassMap, gravelMap],
    } satisfies VillaMaterialSet;
  }, [finish]);

  useEffect(() => {
    return () => {
      for (const value of Object.values(materials)) {
        if (value instanceof THREE.Material) value.dispose();
        else if (value instanceof THREE.Texture) value.dispose();
      }
      for (const texture of materials.textures) texture.dispose();
    };
  }, [materials]);

  return materials;
}
