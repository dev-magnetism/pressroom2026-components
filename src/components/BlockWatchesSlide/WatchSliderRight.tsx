import { cn } from "@/lib/cn";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo } from "react";
import styles from "./BlockWatchesSlide.module.css";
import WatchItem from "./WatchItem";
import { type WatchesSlideItem, watchesSlideItemKey } from "./types";
import { watchSlideCrossfadeProps } from "./watchesSlideMotion";

type WatchSliderRightProps = {
  title: string;
  allSlides: WatchesSlideItem[];
  activeIndex: number;
  onSelectSlide: (index: number) => void;
  rtl?: boolean;
};

export function WatchSliderRight({
  title,
  allSlides,
  activeIndex,
  onSelectSlide,
  rtl = false,
}: WatchSliderRightProps) {
  const [emblaRightRef, emblaRightApi] = useEmblaCarousel(
    {
      loop: true,
      startIndex: 0,
      direction: rtl ? "rtl" : "ltr",
    },
    []
  );

  const activeItem = useMemo(
    () => allSlides[activeIndex],
    [allSlides, activeIndex]
  );

  const previewItem = useMemo(
    () => allSlides[activeIndex],
    [allSlides, activeIndex]
  );

  const slideLegend = activeItem?.models_label?.trim() ?? "";

  const handleHoverSlide = (index: number) => {
    if (index === activeIndex) return;
    onSelectSlide(index);
  };

  useEffect(() => {
    emblaRightApi?.scrollTo(activeIndex, true);
  }, [emblaRightApi, activeIndex]);

  useEffect(() => {
    return () => {
      emblaRightApi?.destroy();
    };
  }, [emblaRightApi]);

  return (
    <div className="absolute top-0 right-0 w-[50%] h-full bg-white z-[2]">
      <div className="w-full h-full relative p-32 flex flex-col justify-center items-center">
        <div className="absolute top-32 left-32 w-1/2">
          <h2 className="headline-medium uppercase font-light text-primary-black">
            {title}
          </h2>
        </div>
        <div className="absolute bottom-32 left-32 max-w-[min(40rem,94%)] pr-16">
          <div className="grid h-[6.4rem] overflow-hidden">
            <AnimatePresence mode="sync" initial={false}>
              {activeItem ? (
                <motion.p
                  key={watchesSlideItemKey(activeItem, activeIndex)}
                  className={cn(
                    "col-start-1 row-start-1 label-large font-light uppercase text-primary-black leading-relaxed transition-opacity duration-300",
                    slideLegend ? "opacity-100" : "opacity-0"
                  )}
                  {...watchSlideCrossfadeProps}
                >
                  {slideLegend || "\u00A0"}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <div className="aspect-[329/400] w-[50%] relative lg:max-w-[360px]">
          <AnimatePresence mode="sync" initial={false}>
            {previewItem ? (
              <motion.div
                className="absolute inset-0 flex min-h-0 w-full"
                key={`preview-${activeIndex}`}
                {...watchSlideCrossfadeProps}
              >
                <WatchItem
                  blok={previewItem}
                  withTitle={false}
                  fillImage
                  theme="light"
                  isLink={false}
                  className="h-full min-h-0 w-full"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div
          className="absolute inset-y-0 right-32 w-[15%] md:w-[12%] lg:w-[15%] md:min-w-[72px] max-w-[100px] flex flex-col justify-center items-stretch pointer-events-auto"
        >
          <div
            className={cn(
              styles.emblaRight,
              "embla__viewport overflow-hidden w-full max-h-[min(85vh,calc(100%-4rem))] md:max-h-[min(90vh,100%)] overflow-y-auto"
            )}
            ref={emblaRightRef}
          >
            <div className={styles.emblaRight__container}>
              {allSlides.map((item, index) => (
                <button
                  type="button"
                  key={watchesSlideItemKey(item, index)}
                  className={cn(
                    styles.emblaRight__slide,
                    "relative block w-full border-0 bg-transparent p-0 text-left cursor-pointer"
                  )}
                  data-id={index}
                  aria-label={`${item.name} — slide ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onMouseEnter={() => handleHoverSlide(index)}
                  onClick={event => {
                    event.preventDefault();
                  }}
                >
                  <div
                    className={cn(
                      "absolute top-0 left-0 w-full h-full z-10 pointer-events-none transition-opacity duration-300",
                      index === activeIndex ? "opacity-0" : "opacity-40"
                    )}
                    style={{
                      background:
                        "linear-gradient(211deg, rgba(234, 234, 234, 0.20) 1.82%, #EAEAEA 99%), #FFF",
                      backdropFilter: "blur(2.2px)",
                    }}
                  />
                  <WatchItem blok={item} theme="light" isLink={false} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchSliderRight;
