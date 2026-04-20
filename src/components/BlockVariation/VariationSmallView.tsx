import { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { CustomButton } from "@/components/ui/CustomButton";
import { cn } from "@/lib/cn";
import { getMediaUrl } from "@/lib/sliderImageMedia";
import styles from "./BlockVariation.module.css";
import type { VariationElement } from "./BlockVariation";

type VariationSmallViewProps = {
  variations: VariationElement[];
  selectedVariationIndex: number;
  setSelectedVariationIndex: (index: number) => void;
  setViewType: (type: "big" | "small") => void;
  rtl?: boolean;
  viewMoreLabel: string;
};

export default function VariationSmallView({
  variations,
  selectedVariationIndex,
  setSelectedVariationIndex,
  setViewType,
  rtl = false,
  viewMoreLabel,
}: VariationSmallViewProps) {
  const mainImageRef = useRef<HTMLDivElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    containScroll: false,
    direction: rtl ? "rtl" : "ltr",
    breakpoints: {
      "(min-width: 768px)": {
        active: false,
      },
    },
  });

  useEffect(() => {
    return () => {
      emblaApi?.destroy();
    };
  }, [emblaApi]);

  const animateImageTransition = (newVariationIndex: number) => {
    if (!mainImageRef.current) return;
    const currentImageWrapper = mainImageRef.current.querySelector(
      `[data-variation-index="${selectedVariationIndex}"]`
    ) as HTMLElement | null;
    const newImageWrapper = mainImageRef.current.querySelector(
      `[data-variation-index="${newVariationIndex}"]`
    ) as HTMLElement | null;

    if (!currentImageWrapper || !newImageWrapper) return;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set([currentImageWrapper, newImageWrapper], { clearProps: "all" });
      },
    });

    gsap.set(newImageWrapper, { opacity: 0, scale: 1.05 });
    tl.to(
      currentImageWrapper,
      { opacity: 0, scale: 0.95, duration: 0.4, ease: "power2.easeOut" },
      0
    );
    tl.to(
      newImageWrapper,
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.easeOut" },
      0.1
    );
  };

  const handleChangeSelectedVariation = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const index = Number(event.currentTarget.dataset.index);
    if (!Number.isInteger(index)) return;
    if (index !== selectedVariationIndex) {
      setSelectedVariationIndex(index);
      animateImageTransition(index);
    }
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  return (
    <>
      <div className="v-small-view">
        <div className={cn(styles.embla, "relative z-2 md:pl-32 pl-0")}>
          <div className="embla__viewport overflow-hidden" ref={emblaRef}>
            <div className={styles.embla__container}>
              {variations.map((item, index) => (
                <div
                  className={cn(
                    styles.thumbnail__slide,
                    "relative overflow-hidden p-5 border group md:w-160 lg:w-[170px] transition-all duration-300",
                    selectedVariationIndex === index
                      ? "border-primary-black"
                      : "border-transparent hover:border-primary-black/20"
                  )}
                  key={`variation-thumb-${index}`}
                >
                  <button
                    data-index={index}
                    onClick={handleChangeSelectedVariation}
                    className="flex flex-col text-left align-top w-full cursor-pointer aspect-[150/115] md:aspect-[150/120] relative bg-white text-primary-black transition-all duration-300"
                  >
                    <div className="p-6">
                      <p className="text-11 opacity-50 font-mono block variation-name uppercase">
                        {item.name}
                      </p>
                      <p className="variation-subtitle">{item.subtitle}</p>
                    </div>
                    <div className="relative flex-1 h-[70%] w-full overflow-hidden">
                      <img
                        src={
                          getMediaUrl(item.thumbnail?.filename) ||
                          getMediaUrl(item.image?.filename) ||
                          ""
                        }
                        alt={item.thumbnail?.alt || item.image?.alt || ""}
                        width={150}
                        height={115}
                        className="h-full w-full object-cover transition-all duration-700 ease-out"
                        sizes="(max-width: 768px) 50vw, 20vw"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none mt-16 md:mt-0 w-full h-[50vh] md:h-[70vh] relative md:absolute left-0 bottom-0 z-1"
          ref={mainImageRef}
        >
          {variations.map((element, index) => (
            <div
              key={`variation-main-${index}`}
              data-variation-index={index}
              className={cn(
                "absolute inset-0",
                selectedVariationIndex === index
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              )}
            >
              <img
                src={getMediaUrl(element.image?.filename) || ""}
                alt={element.image?.alt || ""}
                className="object-cover bottom-0 md:object-contain h-full w-full"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`button-mobile-${selectedVariationIndex}`}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="absolute bottom-40 left-1/2 -translate-x-1/2 md:relative md:bottom-0 md:translate-x-0 md:hidden z-20"
        >
          <CustomButton
            variant="main"
            visual="black"
            className="flex gap-16 items-center p-12 text-[14px] uppercase"
            onClick={() => setViewType("big")}
          >
            {viewMoreLabel}
          </CustomButton>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
