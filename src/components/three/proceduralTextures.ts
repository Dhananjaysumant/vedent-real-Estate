import * as THREE from 'three';

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(size: number) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  return { canvas, ctx };
}

function toTexture(canvas: HTMLCanvasElement, repeatX: number, repeatY: number, srgb = true) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.anisotropy = 4;
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createStoneTexture(base: string, accent: string, seed = 7, horizontal = true) {
  const size = 512;
  const { canvas, ctx } = makeCanvas(size);
  const random = mulberry32(seed);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  const bands = 46;
  for (let i = 0; i < bands; i += 1) {
    const y = random() * size;
    const h = 1 + random() * 8;
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.03 + random() * 0.09;
    if (horizontal) {
      ctx.fillRect(0, y, size, h);
    } else {
      ctx.fillRect(y, 0, h, size);
    }
  }

  ctx.globalAlpha = 1;
  for (let i = 0; i < 1800; i += 1) {
    const x = random() * size;
    const y = random() * size;
    const r = random() * 1.6 + 0.25;
    ctx.fillStyle = random() > 0.5 ? accent : '#ffffff';
    ctx.globalAlpha = 0.04 + random() * 0.16;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // fine hairline fissures
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 0.7;
  for (let i = 0; i < 8; i += 1) {
    let x = random() * size;
    let y = random() * size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 5; s += 1) {
      x += (random() - 0.5) * 90;
      y += (random() - 0.5) * 24;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  return toTexture(canvas, 2.4, 2.4);
}

export function createPavingTexture(base: string, accent: string, seed = 12) {
  const size = 512;
  const { canvas, ctx } = makeCanvas(size);
  const random = mulberry32(seed);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 1800; i += 1) {
    ctx.fillStyle = random() > 0.5 ? accent : '#ffffff';
    ctx.globalAlpha = 0.03 + random() * 0.1;
    ctx.fillRect(random() * size, random() * size, random() * 4 + 1, 1);
  }

  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, size);
  ctx.stroke();
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i += 1) {
    const p = (size / 4) * i;
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  return toTexture(canvas, 7, 7);
}

export function createWoodTexture(base: string, dark: string, light: string, seed = 21) {
  const size = 512;
  const { canvas, ctx } = makeCanvas(size);
  const random = mulberry32(seed);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 120; i += 1) {
    const x = random() * size;
    const width = 1 + random() * 5;
    ctx.fillStyle = random() > 0.45 ? dark : light;
    ctx.globalAlpha = 0.05 + random() * 0.2;
    ctx.fillRect(x, 0, width, size);
  }

  ctx.globalAlpha = 0.18;
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 30; i += 1) {
    const x = random() * size;
    ctx.strokeStyle = dark;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    for (let y = 0; y < size; y += 32) {
      ctx.lineTo(x + Math.sin(y * 0.015 + i) * 3 + (random() - 0.5) * 2, y);
    }
    ctx.stroke();
  }

  // occasional knot
  for (let i = 0; i < 4; i += 1) {
    const x = random() * size;
    const y = random() * size;
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = dark;
    ctx.lineWidth = 1.2;
    for (let r = 2; r < 16; r += 3) {
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 1.7, 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;
  return toTexture(canvas, 3, 2);
}

export function createConcreteTexture(seed = 31) {
  const size = 512;
  const { canvas, ctx } = makeCanvas(size);
  const random = mulberry32(seed);
  ctx.fillStyle = '#a9a7a0';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 90; i += 1) {
    const x = random() * size;
    const y = random() * size;
    const r = 20 + random() * 80;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(60,58,52,0.07)');
    gradient.addColorStop(1, 'rgba(120,118,112,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  ctx.globalAlpha = 0.07;
  ctx.strokeStyle = '#5e5c55';
  for (let i = 0; i < 14; i += 1) {
    const y = random() * size;
    ctx.lineWidth = 1 + random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  for (let i = 0; i < 2500; i += 1) {
    ctx.fillStyle = random() > 0.5 ? '#ffffff' : '#5e5c55';
    ctx.globalAlpha = 0.035;
    ctx.fillRect(random() * size, random() * size, 1.5, 1.5);
  }
  ctx.globalAlpha = 1;
  return toTexture(canvas, 3, 3);
}

export function createGrassTexture(seed = 41) {
  const size = 512;
  const { canvas, ctx } = makeCanvas(size);
  const random = mulberry32(seed);
  ctx.fillStyle = '#5f684e';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 9000; i += 1) {
    const x = random() * size;
    const y = random() * size;
    const tone = random();
    ctx.fillStyle = tone > 0.66 ? '#717b5c' : tone > 0.33 ? '#545d44' : '#666f52';
    ctx.globalAlpha = 0.25 + random() * 0.4;
    ctx.fillRect(x, y, 1.4, 2.4 + random() * 3);
  }
  ctx.globalAlpha = 1;
  return toTexture(canvas, 22, 22);
}

export function createGravelTexture(seed = 51) {
  const size = 256;
  const { canvas, ctx } = makeCanvas(size);
  const random = mulberry32(seed);
  ctx.fillStyle = '#a49d8c';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 3200; i += 1) {
    ctx.fillStyle = random() > 0.5 ? '#c9c1ae' : '#7f7869';
    ctx.globalAlpha = 0.15 + random() * 0.4;
    const r = 0.5 + random() * 1.8;
    ctx.beginPath();
    ctx.arc(random() * size, random() * size, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  return toTexture(canvas, 8, 8);
}

export function createEnvironmentTexture(mode: 'day' | 'sunset' | 'night') {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  if (mode === 'day') {
    sky.addColorStop(0, '#6d94b4');
    sky.addColorStop(0.42, '#cfe0e4');
    sky.addColorStop(0.52, '#e7e4d8');
    sky.addColorStop(0.53, '#8b8a78');
    sky.addColorStop(1, '#5c5b4d');
  } else if (mode === 'sunset') {
    sky.addColorStop(0, '#39455d');
    sky.addColorStop(0.4, '#bb8f80');
    sky.addColorStop(0.52, '#f1c395');
    sky.addColorStop(0.53, '#6c5b48');
    sky.addColorStop(1, '#3d352b');
  } else {
    sky.addColorStop(0, '#04070f');
    sky.addColorStop(0.45, '#111b2b');
    sky.addColorStop(0.52, '#293241');
    sky.addColorStop(0.53, '#101613');
    sky.addColorStop(1, '#070a08');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // sun / moon source
  const sunX = mode === 'night' ? width * 0.28 : width * 0.68;
  const sunY = mode === 'night' ? height * 0.24 : height * 0.44;
  const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 70);
  if (mode === 'day') {
    glow.addColorStop(0, 'rgba(255,250,235,1)');
    glow.addColorStop(0.2, 'rgba(255,245,220,0.65)');
    glow.addColorStop(1, 'rgba(255,240,210,0)');
  } else if (mode === 'sunset') {
    glow.addColorStop(0, 'rgba(255,225,180,1)');
    glow.addColorStop(0.25, 'rgba(255,180,110,0.7)');
    glow.addColorStop(1, 'rgba(255,160,90,0)');
  } else {
    glow.addColorStop(0, 'rgba(230,238,255,0.9)');
    glow.addColorStop(0.3, 'rgba(160,180,220,0.35)');
    glow.addColorStop(1, 'rgba(120,150,200,0)');
  }
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
