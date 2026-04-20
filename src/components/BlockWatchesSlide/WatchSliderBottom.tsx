import { cn } from "@/lib/cn";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect } from "react";
import styles from "./BlockWatchesSlide.module.css";
import WatchItem from "./WatchItem";
import { type WatchesSlideItem, watchesSlideItemKey } from "./types";
import { watchSlideCrossfadeProps } from "./watchesSlideMotion";

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type WatchSliderBottomProps = {
  title: string;
  keyPrefix: string;
  className?: string;
  theme?: "light" | "dark";
  allSlides: WatchesSlideItem[];
  activeIndex: number;
  onSelectSlide: (index: number) => void;
  interactionMode?: "hover" | "click";
  rtl?: boolean;
};

export function WatchSliderBottom({
  title,
  keyPrefix,
  className,
  theme = "dark",
  allSlides,
  activeIndex,
  onSelectSlide,
  interactionMode = "click",
  rtl = false,
}: WatchSliderBottomProps) {
  const [emblaBottomRef, emblaBottomApi] = useEmblaCarousel({
    loop: true,
    startIndex: 0,
    active: allSlides.length > 1,
    direction: rtl ? "rtl" : "ltr",
    /** Le survol ne fait que défiler la piste ; seul clic / flèches changent la slide active (grande image). */
    watchDrag: false,
  });

  const activeSlide = allSlides[activeIndex];
  const legendPrimary = activeSlide?.models_label?.trim() ?? "";

  const goTo = useCallback(
    (index: number) => {
      const len = allSlides.length;
      if (len === 0) return;
      const i = ((index % len) + len) % len;
      emblaBottomApi?.scrollTo(i);
      onSelectSlide(i);
    },
    [allSlides.length, emblaBottomApi, onSelectSlide]
  );

  const handleNext = () => goTo(activeIndex + 1);
  const handlePrevious = () => goTo(activeIndex - 1);
  const isHoverMode = interactionMode === "hover";

  useEffect(() => {
    if (!emblaBottomApi) return;
    if (emblaBottomApi.selectedScrollSnap() !== activeIndex) {
      emblaBottomApi.scrollTo(activeIndex);
    }
  }, [activeIndex, emblaBottomApi]);

  useEffect(() => {
    return () => {
      emblaBottomApi?.destroy();
    };
  }, [emblaBottomApi]);

  const arrowClass =
    theme === "light" ? "text-primary-black" : "text-white";

  return (
    <div className={cn("absolute bottom-0 left-0 w-full z-[2]", className)}>
      <div className="w-full px-0 md:px-32 pb-20 md:pb-48 grid grid-cols-12 gap-20">
        <div className="col-span-6 md:col-span-6 flex-col justify-end hidden md:flex gap-12 max-w-[min(56rem,96%)]">
          <span
            className={cn(
              "label-large uppercase font-light",
              theme === "light" ? "text-primary-black/60" : "text-white/50"
            )}
          >
            {title}
          </span>
          <div className="grid h-[6.4rem] overflow-hidden">
            <AnimatePresence mode="sync" initial={false}>
              {activeSlide ? (
                <motion.p
                  key={`legend-primary-${keyPrefix}-${watchesSlideItemKey(activeSlide, activeIndex)}`}
                  className={cn(
                    "col-start-1 row-start-1 body-medium-edito font-light leading-snug transition-opacity duration-300",
                    theme === "light"
                      ? "text-primary-black/90"
                      : "text-white/90",
                    legendPrimary ? "opacity-100" : "opacity-0"
                  )}
                  {...watchSlideCrossfadeProps}
                >
                  {legendPrimary || "\u00A0"}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <div className="md:col-span-3 col-span-12 md:col-start-10 flex flex-col gap-12">
          <div
            className={cn(
              "md:hidden flex max-w-[min(40rem,100%)] flex-col",
              theme === "light" ? "text-primary-black" : "text-white"
            )}
          >
            <div className="grid h-[6.4rem] overflow-hidden">
              <AnimatePresence mode="sync" initial={false}>
                {activeSlide ? (
                  <motion.p
                    key={`m-legend-${keyPrefix}-${watchesSlideItemKey(activeSlide, activeIndex)}`}
                    className={cn(
                      "col-start-1 row-start-1 body-medium-edito font-light leading-snug",
                      legendPrimary ? "opacity-90" : "opacity-0"
                    )}
                    {...watchSlideCrossfadeProps}
                  >
                    {legendPrimary || "\u00A0"}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center w-full",
              allSlides.length > 1 ? "justify-end" : ""
            )}
          >
            {allSlides.length > 1 ? (
              <div className="flex gap-24">
                <button
                  type="button"
                  className="cursor-pointer group"
                  onClick={isHoverMode ? undefined : handlePrevious}
                  aria-label="Précédent"
                  disabled={isHoverMode}
                >
                  <ArrowLeft
                    className={cn(
                      "group-hover:scale-110 transition-all duration-300",
                      arrowClass
                    )}
                  />
                </button>
                <button
                  type="button"
                  className="cursor-pointer group"
                  onClick={isHoverMode ? undefined : handleNext}
                  aria-label="Suivant"
                  disabled={isHoverMode}
                >
                  <ArrowRight
                    className={cn(
                      "group-hover:scale-110 transition-all duration-300",
                      arrowClass
                    )}
                  />
                </button>
              </div>
            ) : null}
          </div>
          <div
            className={styles.emblaBottom}
            ref={emblaBottomRef}
            onMouseLeave={() => {
              if (!isHoverMode) return;
              if (!emblaBottomApi) return;
              emblaBottomApi.scrollTo(activeIndex);
            }}
          >
            <div className={styles.emblaBottom__container}>
              {allSlides.map((item, index) => (
                <div
                  className={styles.emblaBottom__slide}
                  key={watchesSlideItemKey(item, index)}
                >
                  <button
                    type="button"
                    className="w-full border-0 bg-transparent p-0 text-left cursor-pointer"
                    aria-label={`${item.name} — slide ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    onMouseEnter={() => {
                      if (!isHoverMode) return;
                      goTo(index);
                    }}
                    onClick={() => {
                      if (isHoverMode) return;
                      goTo(index);
                    }}
                  >
                    <WatchItem
                      blok={item}
                      withTitle={false}
                      fillImage
                      theme={theme}
                      isLink={false}
                      className="aspect-[350/400] h-full min-h-0 md:h-auto md:aspect-[329/400]"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchSliderBottom;
