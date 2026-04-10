import { cn } from "@/lib/cn";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
import styles from "./BlockWatchesSlide.module.css";
import WatchItem from "./WatchItem";
import type { WatchesSlideItem } from "./types";

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
  setCurrentIndex: (index: number) => void;
  currentIndex: number;
  rtl?: boolean;
};

export function WatchSliderBottom({
  title,
  keyPrefix,
  className,
  theme = "dark",
  allSlides,
  setCurrentIndex,
  currentIndex,
  rtl = false,
}: WatchSliderBottomProps) {
  const [emblaBottomRef, emblaBottomApi] = useEmblaCarousel({
    loop: true,
    startIndex: 0,
    active: allSlides.length > 1,
    direction: rtl ? "rtl" : "ltr",
  });

  const handleNext = () => {
    if (emblaBottomApi) {
      emblaBottomApi.scrollNext();
      if (currentIndex === allSlides.length) {
        setCurrentIndex(1);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (emblaBottomApi) {
      emblaBottomApi.scrollPrev();
      if (currentIndex === 1) {
        setCurrentIndex(allSlides.length);
      } else {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  useEffect(() => {
    if (!emblaBottomApi) return;

    const onSelect = () => {
      const selectedIndex = emblaBottomApi.selectedScrollSnap();
      if (selectedIndex === 0) {
        setCurrentIndex(1);
      } else if (selectedIndex === allSlides.length - 1) {
        setCurrentIndex(allSlides.length);
      } else {
        setCurrentIndex(selectedIndex + 1);
      }
    };

    emblaBottomApi.on("select", onSelect);
    emblaBottomApi.on("settle", onSelect);

    return () => {
      emblaBottomApi.off("select", onSelect);
      emblaBottomApi.off("settle", onSelect);
    };
  }, [emblaBottomApi, allSlides.length, setCurrentIndex]);

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
        <div className="col-span-6 md:col-span-6 flex-col justify-end hidden md:flex">
          <h3
            className="headline-large uppercase text-white font-light"
            key={`title-watches-slide-bottom-${keyPrefix}`}
          >
            {title}
          </h3>
        </div>
        <div className="md:col-span-3 col-span-12 md:col-start-10 flex flex-col gap-12">
          <div className="flex justify-between items-center w-full">
            <span
              className={cn(
                "cta-large uppercase",
                theme === "light" ? "text-primary-black md:text-white" : "text-white"
              )}
            >
              {allSlides.length > 1
                ? `${currentIndex > 9 ? currentIndex : `0${currentIndex}`} - ${
                    allSlides.length > 9
                      ? allSlides.length
                      : `0${allSlides.length}`
                  }`
                : ""}
            </span>
            {allSlides.length > 1 ? (
              <div className="flex gap-24">
                <button
                  type="button"
                  className="cursor-pointer group"
                  onClick={handlePrevious}
                  aria-label="Précédent"
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
                  onClick={handleNext}
                  aria-label="Suivant"
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
          <div className={styles.emblaBottom} ref={emblaBottomRef}>
            <div className={styles.emblaBottom__container}>
              {allSlides.map(item => (
                <div
                  className={styles.emblaBottom__slide}
                  key={item.content._uid}
                >
                  <WatchItem
                    blok={item}
                    withTitle
                    theme={theme}
                    className="aspect-[350/400] h-full min-h-0 md:h-auto md:aspect-[329/400]"
                  />
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
