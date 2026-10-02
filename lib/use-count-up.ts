"use client";

import { useEffect, useRef, useState } from "react";

const COUNT_MS = 900; // --duration-count
const MIN_ANIMATED_CHANGE_M = 10; // smaller changes just update

// Close to the ease-out token, cubic-bezier(0.16, 1, 0.3, 1).
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Counts from the previous value to `target` over --duration-count.
 * Jumps straight there for tiny changes, the first value, and reduced motion.
 */
export function useCountUp(target: number | null): number | null {
  const [value, setValue] = useState(target);
  const shown = useRef(target);

  useEffect(() => {
    const from = shown.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      target === null ||
      from === null ||
      reduceMotion ||
      Math.abs(target - from) < MIN_ANIMATED_CHANGE_M
    ) {
      shown.current = target;
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      const next = from + (target - from) * easeOut(t);
      shown.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}
