import { cn } from "@/lib/cn";
import { getMediaUrl } from "@/lib/sliderImageMedia";
import { useMemo, useState } from "react";
import WatchSliderBottom from "./WatchSliderBottom";
import WatchSliderRight from "./WatchSliderRight";
import type { WatchesSlideItem } from "./types";

export type { WatchesSlideItem } from "./types";

export type BlockWatchesSlideProps = {
  title: string;
  slides: WatchesSlideItem[];
  /** Image de fond (URL absolue ou `/…` depuis `public`). */
  backgroundUrl?: string;
  backgroundAlt?: string;
  /** Libellé à côté du nombre de modèles (desktop &gt; 4 slides). */
  modelsLabel?: string;
  rtl?: boolean;
  /** Préfixe stable pour les clés React (optionnel). */
  keyPrefix?: string;
  className?: string;
};

export function BlockWatchesSlide({
  title,
  slides,
  backgroundUrl,
  backgroundAlt = "",
  modelsLabel = "models",
  rtl = false,
  keyPrefix = "watches-slide",
  className,
}: BlockWatchesSlideProps) {
  const [currentIndex, setCurrentIndex] = useState(1);

  const allSlides = useMemo(() => slides ?? [], [slides]);

  const bgSrc = backgroundUrl ? (getMediaUrl(backgroundUrl) ?? backgroundUrl) : "";

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
        {bgSrc ? (
          <img
            src={bgSrc}
            alt={backgroundAlt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      {allSlides.length > 0 ? (
        <>
          <div className="hidden md:block">
            {allSlides.length > 4 ? (
              <WatchSliderRight
                title={title}
                allSlides={allSlides}
                setCurrentIndex={setCurrentIndex}
                modelsLabel={modelsLabel}
                rtl={rtl}
              />
            ) : (
              <WatchSliderBottom
                title={title}
                keyPrefix={keyPrefix}
                allSlides={allSlides}
                setCurrentIndex={setCurrentIndex}
                currentIndex={currentIndex}
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
            setCurrentIndex={setCurrentIndex}
            currentIndex={currentIndex}
            rtl={rtl}
          />
        </>
      ) : null}
    </section>
  );
}

export default BlockWatchesSlide;
