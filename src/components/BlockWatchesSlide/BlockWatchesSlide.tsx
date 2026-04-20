import { cn } from "@/lib/cn";
import { getMediaUrl } from "@/lib/sliderImageMedia";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import WatchSliderBottom from "./WatchSliderBottom";
import WatchSliderRight from "./WatchSliderRight";
import { type WatchesSlideItem, watchesSlideItemKey } from "./types";
import { watchSlideCrossfadeProps } from "./watchesSlideMotion";

export type { WatchesSlideItem } from "./types";

export type BlockWatchesSlideProps = {
  title: string;
  slides: WatchesSlideItem[];
  /** Image de fond / grande image gauche unique si `heroImagePerSlide={false}` (URL absolue ou `/…`). */
  backgroundUrl?: string;
  backgroundAlt?: string;
  /**
   * Si `true` (défaut), la grande image gauche suit la slide (`hero_image` ou à défaut `product_image`).
   * Si `false`, une seule image : `backgroundUrl` (inchangée au changement de slide).
   */
  heroImagePerSlide?: boolean;
  rtl?: boolean;
  /** Préfixe stable pour les clés React (optionnel). */
  keyPrefix?: string;
  className?: string;
};

function getSlideHeroAsset(slide: WatchesSlideItem | undefined) {
  if (!slide) return undefined;
  const h = slide.hero_image;
  const p = slide.product_image;
  if (h?.filename) return h;
  if (p?.filename) return p;
  return undefined;
}

export function BlockWatchesSlide({
  title,
  slides,
  backgroundUrl,
  backgroundAlt = "",
  heroImagePerSlide = true,
  rtl = false,
  keyPrefix = "watches-slide",
  className,
}: BlockWatchesSlideProps) {
  const allSlides = useMemo(() => slides ?? [], [slides]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(i => Math.min(i, Math.max(0, allSlides.length - 1)));
  }, [allSlides.length]);

  const activeSlide = allSlides[activeIndex];
  const bgSrc = backgroundUrl ? (getMediaUrl(backgroundUrl) ?? backgroundUrl) : "";

  const perSlideAsset = heroImagePerSlide
    ? getSlideHeroAsset(activeSlide)
    : undefined;
  const leftSrc = perSlideAsset?.filename
    ? (getMediaUrl(perSlideAsset.filename) ?? perSlideAsset.filename)
    : bgSrc;
  const leftAlt =
    perSlideAsset?.alt ??
    activeSlide?.product_image?.alt ??
    backgroundAlt;

  return (
    <section
      className={cn(
        "relative w-full aspect-[393/844] md:aspect-[16/9] md-h-screen-stable md-max-h-screen-stable",
        className
      )}
    >
      <div
        className="absolute inset-0 z-[1] w-full h-full hidden md:block"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 55%, rgba(0, 0, 0, 0.60) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)",
        }}
      />
      <div className="md:hidden block absolute top-32 left-16 z-10 max-w-xl">
        <h2 className="headline-medium uppercase font-light text-white">{title}</h2>
      </div>
      <div className="relative md:absolute inset-0 w-full aspect-[393/460] md:aspect-auto md:h-full md:max-h-none">
        <div
          className="md:hidden block absolute top-0 left-0 z-[9] w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 55%, rgba(0, 0, 0, 0.60) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        {leftSrc ? (
          <div className="absolute inset-0">
            {heroImagePerSlide ? (
              <AnimatePresence mode="sync" initial={false}>
                <motion.img
                  key={
                    activeSlide
                      ? watchesSlideItemKey(activeSlide, activeIndex)
                      : `hero-${activeIndex}-${leftSrc}`
                  }
                  src={leftSrc}
                  alt={leftAlt}
                  className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                  loading="lazy"
                  decoding="async"
                  {...watchSlideCrossfadeProps}
                />
              </AnimatePresence>
            ) : (
              <img
                src={leftSrc}
                alt={leftAlt}
                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        ) : null}
      </div>
      {allSlides.length > 0 ? (
        <>
          <div className="hidden md:block">
            {allSlides.length > 4 ? (
              <WatchSliderRight
                title={title}
                allSlides={allSlides}
                activeIndex={activeIndex}
                onSelectSlide={setActiveIndex}
                rtl={rtl}
              />
            ) : (
              <WatchSliderBottom
                title={title}
                keyPrefix={keyPrefix}
                allSlides={allSlides}
                activeIndex={activeIndex}
                onSelectSlide={setActiveIndex}
                interactionMode="hover"
                rtl={rtl}
              />
            )}
          </div>
          <WatchSliderBottom
            title={title}
            keyPrefix={keyPrefix}
            className="md:hidden block !relative px-20 mt-20 md:mt-64"
            theme="light"
            allSlides={allSlides}
            activeIndex={activeIndex}
            onSelectSlide={setActiveIndex}
            interactionMode="click"
            rtl={rtl}
          />
        </>
      ) : null}
    </section>
  );
}

export default BlockWatchesSlide;
