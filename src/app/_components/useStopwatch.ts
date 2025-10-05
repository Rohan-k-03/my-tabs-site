"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type Stopwatch = {
  elapsedMs: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setElapsed: (ms: number) => void;
};

// A tiny, SSR-safe stopwatch hook using setInterval(1000)
export function useStopwatch(): Stopwatch {
  const [elapsedMs, setElapsedMs] = useState(0);
  const isRunningRef = useRef(false);
  const baseElapsedRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clear = () => {
    if (intervalRef.current !== null) {
      if (typeof window !== "undefined") {
        window.clearInterval(intervalRef.current);
      }
      intervalRef.current = null;
    }
  };

  const tick = useCallback(() => {
    if (!isRunningRef.current) return;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const startedAt = startedAtRef.current ?? now;
    const total = baseElapsedRef.current + (now - startedAt);
    setElapsedMs(Math.max(0, Math.floor(total)));
  }, []);

  const start = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    startedAtRef.current = now;

    if (typeof window !== "undefined") {
      clear();
      intervalRef.current = window.setInterval(tick, 1000);
      tick();
    }
  }, [tick]);

  const pause = useCallback(() => {
    if (!isRunningRef.current) return;
    isRunningRef.current = false;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const startedAt = startedAtRef.current ?? now;
    baseElapsedRef.current = baseElapsedRef.current + (now - startedAt);
    startedAtRef.current = null;
    clear();
    tick();
  }, [tick]);

  const reset = useCallback(() => {
    isRunningRef.current = false;
    baseElapsedRef.current = 0;
    startedAtRef.current = null;
    clear();
    setElapsedMs(0);
  }, []);

  const setElapsed = useCallback((ms: number) => {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const clamped = Math.max(0, Math.floor(ms));
    baseElapsedRef.current = clamped;
    // if running, re-base start time to now so ticking continues smoothly
    if (isRunningRef.current) {
      startedAtRef.current = now;
    } else {
      startedAtRef.current = null;
    }
    setElapsedMs(clamped);
  }, []);

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  return { elapsedMs, start, pause, reset, setElapsed };
}

export default useStopwatch;
