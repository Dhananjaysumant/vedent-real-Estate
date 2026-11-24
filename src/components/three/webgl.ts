export function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (!gl) return false;
    const loseContext = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    loseContext?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function detectQuality(): 'high' | 'low' {
  if (typeof window === 'undefined') return 'high';
  try {
    const requested = new URLSearchParams(window.location.search).get('quality');
    if (requested === 'low' || requested === 'high') return requested;
  } catch {
    /* Ignore malformed URLs and fall through to capability detection. */
  }
  const smallScreen = window.matchMedia('(max-width: 900px)').matches;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  const fewCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return smallScreen || lowMemory || (coarse && fewCores) ? 'low' : 'high';
}
