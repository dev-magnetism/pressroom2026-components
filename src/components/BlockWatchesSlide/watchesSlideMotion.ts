/** Crossfade aligné sur la prévisualisation centrale (`WatchSliderRight`). */
export const WATCH_SLIDE_CROSSFADE_TRANSITION = {
  duration: 0.6,
  ease: "easeInOut" as const,
};

export const watchSlideCrossfadeProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: WATCH_SLIDE_CROSSFADE_TRANSITION,
} as const;
