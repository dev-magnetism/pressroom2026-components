import { useLayoutEffect, useState } from "react";

/**
 * Aligné sur richardmille : `(max-width: 475px)`.
 */
export function useIsMobile(): boolean {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 475px)");
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return matches;
}
