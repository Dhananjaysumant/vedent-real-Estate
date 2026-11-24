import { useFrame } from '@react-three/fiber';
import { Component, useEffect, useRef, type ReactNode } from 'react';

export function ReadySignal({ onReady }: { onReady: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady();
  });
  return null;
}

export class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    if (import.meta.env.DEV) {
      // Surfaced in development only; the public fallback stays friendly.
      console.warn('3D scene failed to render:', error.message);
    }
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export function useDocumentVisible() {
  const visibleRef = useRef(!document.hidden);
  const listeners = useRef(new Set<() => void>());
  useEffect(() => {
    const onChange = () => {
      visibleRef.current = !document.hidden;
      listeners.current.forEach((listener) => listener());
    };
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return visibleRef;
}
