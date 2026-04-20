import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/cn";
import { getMediaUrl } from "@/lib/sliderImageMedia";
import styles from "./BlockVariation.module.css";
import { VariationButton, type VariationElement } from "./BlockVariation";

type VariationBigViewProps = {
  variations: VariationElement[];
  selectedVariationIndex: number;
  rtl?: boolean;
  prevLabel: string;
  nextLabel: string;
};

export default function VariationBigView({
  variations,
  selectedVariationIndex,
  rtl = false,
  prevLabel,
  nextLabel,
}: VariationBigViewProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: 0,
    direction: rtl ? "rtl" : "ltr",
  });

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0, true);
  }, [selectedVariationIndex, emblaApi, variations]);

  const currentVariation = variations[selectedVariationIndex] ?? variations[0];
  const galleryCount = currentVariation?.gallery?.length ?? 0;
  const hasGallery = galleryCount > 1;
  const canScroll = (currentVariation?.gallery?.length ?? 0) > 1;

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    return () => {
      emblaApi?.destroy();
    };
  }, [emblaApi]);

  return (
    <div className="v-big-view relative">
      {hasGallery ? (
        <div className={styles.embla_big} ref={emblaRef}>
          <div className={cn(styles.embla_big__container, "h-[70vh]")}>
            {currentVariation?.gallery?.map((media, index) => (
              <div
                key={`variation-big-view-${index}`}
                className={styles.embla_big__slide}
              >
                <div className="w-full aspect-[393/506] md:aspect-[890/689] relative h-full">
                  <img
                    src={getMediaUrl(media.filename) || ""}
                    alt={media.alt || ""}
                    className="object-cover bottom-0 md:object-contain h-full w-full"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-1/2 mx-auto aspect-[393/506] md:aspect-[890/689] relative md:h-[70vh]">
          <img
            src={
              getMediaUrl(currentVariation?.gallery?.[0]?.filename) ||
              getMediaUrl(currentVariation?.image?.filename) ||
              ""
            }
            alt={
              currentVariation?.gallery?.[0]?.alt ||
              currentVariation?.image?.alt ||
              ""
            }
            className="object-cover bottom-0 md:object-contain h-full w-full"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <VariationButton
        className={cn(
          "absolute left-32 top-1/2 -translate-y-1/2 z-10",
          !hasGallery ? "opacity-50 cursor-not-allowed" : ""
        )}
        onClick={scrollPrev}
        disabled={!canScroll}
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path
            d="M2.50869 3.56H7.70469V4.412H2.52069L4.17669 6.008L4.65669 6.488L4.05669 7.076L0.984688 3.98L4.05669 0.883999L4.65669 1.472L4.17669 1.952L2.50869 3.56Z"
            fill="black"
          />
        </svg>
        <span>{prevLabel}</span>
      </VariationButton>

      <VariationButton
        className={cn(
          "absolute right-32 top-1/2 -translate-y-1/2 z-10",
          !hasGallery ? "opacity-50 cursor-not-allowed" : ""
        )}
        onClick={scrollNext}
        disabled={!canScroll}
      >
        <span>{nextLabel}</span>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path
            d="M5.49131 4.44L0.295312 4.44L0.295312 3.588L5.47931 3.588L3.82331 1.992L3.34331 1.512L3.94331 0.924L7.01531 4.02L3.94331 7.116L3.34331 6.528L3.82331 6.048L5.49131 4.44Z"
            fill="black"
          />
        </svg>
      </VariationButton>
    </div>
  );
}
