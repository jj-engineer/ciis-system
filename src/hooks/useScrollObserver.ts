import { useEffect } from 'react';

/**
 * useScrollObserver
 * Attaches an IntersectionObserver to all elements matching the selector.
 * As the user scrolls down the page, elements animate smoothly into view
 * and stay visible permanently (unobserved upon reveal) for rock-solid stability and zero layout thrashing.
 */
export function useScrollObserver(
  selector = '.scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right',
  deps: any[] = []
) {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll(selector).forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Unobserve once revealed on scroll down so it stays permanently stable
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px', // Triggers cleanly as user scrolls down
        threshold: 0.05
      }
    );

    // Observe all matching elements
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      // If element is already visible or above fold, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, deps);
}


