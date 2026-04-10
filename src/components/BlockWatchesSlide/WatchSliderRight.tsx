import { cn } from "@/lib/cn";
import { getLinkUrl } from "@/lib/links";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import styles from "./BlockWatchesSlide.module.css";
import WatchItem from "./WatchItem";
import type { WatchesSlideItem } from "./types";

type WatchSliderRightProps = {
  title: string;
  allSlides: WatchesSlideItem[];
  setCurrentIndex: (index: number) => void;
  modelsLabel: string;
  rtl?: boolean;
};

export function WatchSliderRight({
  title,
  allSlides,
  setCurrentIndex,
  modelsLabel,
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

  const [selectedItem, setSelectedItem] = useState<WatchesSlideItem | undefined>(
    allSlides[0]
  );

  const handleOnMouseEnter = (index: number) => {
    if (emblaRightApi) {
      emblaRightApi.scrollTo(index);
      setSelectedItem(allSlides[index]);
      setCurrentIndex(index + 1);
    }
  };

  useEffect(() => {
    return () => {
      emblaRightApi?.destroy();
    };
  }, [emblaRightApi]);

  return (
    <div className="absolute top-0 right-0 w-[50%] h-full bg-white z-[2]">
      <div className="w-full h-full relative p-32 flex flex-col justify-center items-center">
        <div className="absolute top-32 left-32 w-1/3">
          <h2 className="headline-medium uppercase font-light text-primary-black">
            {title}
          </h2>
        </div>
        <div className="absolute bottom-32 left-32 w-1/3">
          <span className="label-large font-light uppercase text-primary-black">
            {allSlides.length
              ? allSlides.length > 9
                ? allSlides.length
                : `0${allSlides.length}`
              : ""}{" "}
            {modelsLabel}
          </span>
        </div>
        <div className="aspect-[329/400] w-[50%] relative lg:max-w-[360px]">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                className="absolute inset-0 flex min-h-0 w-full"
                key={selectedItem.content._uid}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <WatchItem
                  blok={selectedItem}
                  withTitle
                  theme="light"
                  className="h-full min-h-0 w-full"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="absolute inset-y-0 right-32 w-[15%] md:w-[12%] lg:w-[15%] md:min-w-[72px] max-w-[100px] flex flex-col justify-center items-stretch pointer-events-auto">
          <div
            className={cn(
              styles.emblaRight,
              "embla__viewport overflow-hidden w-full max-h-[min(85vh,calc(100%-4rem))] md:max-h-[min(90vh,100%)] overflow-y-auto"
            )}
            ref={emblaRightRef}
          >
            <div className={styles.emblaRight__container}>
              {allSlides.map((item, index) => {
                const { url: href } = getLinkUrl(`/${item.full_slug}`);
                return (
                  <a
                    href={href}
                    key={item.content._uid}
                    className={cn(styles.emblaRight__slide, "relative block")}
                    data-id={index}
                    onMouseEnter={() => handleOnMouseEnter(index)}
                  >
                    <div
                      className="absolute top-0 left-0 w-full h-full z-10 group transition-all duration-300"
                      style={
                        selectedItem?.content._uid !== item.content._uid
                          ? {
                              background:
                                "linear-gradient(211deg, rgba(234, 234, 234, 0.20) 1.82%, #EAEAEA 99%), #FFF",
                              opacity: 0.4,
                              backdropFilter: "blur(2.2px)",
                            }
                          : {}
                      }
                    />
                    <WatchItem blok={item} theme="light" isLink={false} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchSliderRight;
