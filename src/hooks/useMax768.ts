import { useLayoutEffect, useState } from "react";

/** Utilisé notamment par `TextColumns` — aligné richardmille `useIsTablet` : `(max-width: 768px)`. */
export function useMax768(): boolean {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return matches;
}
