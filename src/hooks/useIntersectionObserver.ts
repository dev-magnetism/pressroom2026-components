import { useLayoutEffect, useRef, useState } from "react";

/**
 * Détecte si l’élément référencé intersecte le viewport (seuil configurable).
 */
export function useIntersectionObserver<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<T | null>(null);

  const threshold = options.threshold ?? 0.5;
  const rootMargin = options.rootMargin ?? "0px";

  useLayoutEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([e]) => {
        setIsVisible(e.isIntersecting);
        setEntry(e);
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { elementRef, isVisible, entry };
}
