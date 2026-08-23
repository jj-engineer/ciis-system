import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  durationMs?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  durationMs = 1200,
  suffix = '',
  prefix = '',
  className = ''
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCurrentValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            observer.disconnect();

            // Smooth cubic ease-out count up
            const startTime = performance.now();
            const step = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / durationMs, 1);
              // Cubic ease out curve
              const easedProgress = 1 - Math.pow(1 - progress, 3);
              const val = Math.round(easedProgress * target);
              setCurrentValue(val);

              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                setCurrentValue(target);
              }
            };
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target, durationMs, hasAnimated]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}{currentValue}{suffix}
    </span>
  );
};
