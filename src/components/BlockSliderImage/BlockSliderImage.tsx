import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { renderTextWithLineBreaks } from "@/lib/textLineBreaks";
import {
  extractImageDimensions,
  getFocalePercentages,
  getMediaUrl,
  isImageLandscape,
  isImagePortrait,
  type SliderImageAsset,
} from "@/lib/sliderImageMedia";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  memo,
  type CSSProperties,
} from "react";
import styles from "./BlockSliderImage.module.css";

export type BlockSliderImageProps = {
  /** Fond de la section (couleur CSS). Défaut : `bg-primary-black`. */
  backgroundColor?: string;
  /** Couleur du texte du bloc (hors captions). */
  textColor?: string;
  subtitle?: string;
  title: string;
  /** HTML (comme RichText rendu côté serveur). */
  description?: string;
  images: SliderImageAsset[];
  /** `auto` : ratio selon fichier ; `default` : slides 4/5. */
  imagesSize?: "auto" | "default";
  /** Simule une locale RTL (Embla + barre de progression). */
  rtl?: boolean;
  /** Clé stable pour le contenu texte mémorisé. */
  contentId?: string;
  className?: string;
};

const ProgressBar = memo(
  ({
    isActive,
    autoplayDelay,
    onComplete,
  }: {
    isActive: boolean;
    autoplayDelay: number;
    onComplete: () => void;
  }) => {
    useEffect(() => {
      if (!isActive) return;
      const timer = window.setTimeout(() => {
        onComplete();
      }, autoplayDelay);
      return () => {
        window.clearTimeout(timer);
      };
    }, [isActive, autoplayDelay, onComplete]);

    return (
      <div
        className={`${styles.progress_bar} ${isActive ? styles.progress_bar__active : ""}`}
        style={
          isActive
            ? ({
                ["--autoplay-duration" as string]: `${autoplayDelay}ms`,
              } as CSSProperties)
            : undefined
        }
      />
    );
  }
);

ProgressBar.displayName = "ProgressBar";

const SliderContent = memo(
  ({
    textColor,
    subtitle,
    title,
    description,
    contentId,
  }: {
    textColor?: string;
    subtitle?: string;
    title: string;
    description?: string;
    contentId: string;
  }) => (
    <div
      style={textColor ? ({ color: textColor } as CSSProperties) : undefined}
      className="grid grid-cols-12 gap-16 md:gap-20 mb-24 md:mb-64 px-20 md:px-32"
    >
      <div className="col-span-12 grid grid-cols-12 gap-16 md:gap-20">
        <div className="col-span-12 md:col-span-6">
          {subtitle ? (
            <span
              key={`slide-v2-subtitle-${contentId}`}
              className="subtitle label-large uppercase block"
            >
              {renderTextWithLineBreaks(subtitle)}
            </span>
          ) : null}
          <Typography
            key={`title-slide-v2-${contentId}`}
            variant="title-medium"
            as="h3"
            textTransform="uppercase"
            className="title"
          >
            {renderTextWithLineBreaks(title)}
          </Typography>
        </div>
        <div className="col-span-12 md:col-span-6 2xl:col-span-4">
          {description ? (
            <div
              key={`description-slide-v2-${contentId}`}
              className="body-medium-edito"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
);

SliderContent.displayName = "SliderContent";

function SlideMedia({
  src,
  alt,
  width,
  height,
  objectPosition,
  caption,
  captionColor = "white",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition: string;
  caption?: string;
  captionColor?: "black" | "white";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "200px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full relative">
      {visible ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-cover h-full w-full"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 50vw, 55vw"
          style={{ objectPosition }}
        />
      ) : (
        <div className="h-full w-full bg-black/40" />
      )}
      {caption?.trim() ? (
        <span
          className={cn(
            "absolute bottom-12 left-12 md:bottom-16 md:left-16 label-small uppercase pointer-events-none",
            captionColor === "black" ? "text-black" : "text-white"
          )}
        >
          {renderTextWithLineBreaks(caption.trim())}
        </span>
      ) : null}
    </div>
  );
}

export function BlockSliderImage({
  backgroundColor,
  textColor,
  subtitle,
  title,
  description,
  images,
  imagesSize = "default",
  rtl = false,
  contentId = "block-slider-image",
  className,
}: BlockSliderImageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isAutoSize = imagesSize === "auto";
  const allImagesPortrait =
    imagesSize === "default"
      ? images.every(image => isImagePortrait(image.filename || "") === true)
      : false;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      align: "center",
      slidesToScroll: 1,
      startIndex: 0,
      containScroll: "trimSnaps",
      direction: rtl ? "rtl" : "ltr",
      breakpoints: {
        "(min-width: 768px)": {
          dragFree: true,
          align:
            allImagesPortrait && images.length < 4
              ? (viewSize: number) => viewSize * 0.18
              : "center",
          active:
            allImagesPortrait && images.length < 4 ? false : true,
        },
      },
    },
    [WheelGesturesPlugin()]
  );

  const autoplayDelay = 7000;

  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.5,
  });

  const [canScroll, setCanScroll] = useState(false);

  const checkCanScroll = useCallback(() => {
    if (!emblaApi) return;
    const canScrollNext = emblaApi.canScrollNext();
    const canScrollPrev = emblaApi.canScrollPrev();
    const nextCanScroll = canScrollNext || canScrollPrev;
    setCanScroll(prev => (prev === nextCanScroll ? prev : nextCanScroll));
  }, [emblaApi]);

  const handleProgressComplete = useCallback(() => {
    if (!emblaApi) return;

    const currentIndex = emblaApi.selectedScrollSnap();
    const totalSlides = images.length;
    const isOnLastSlide = currentIndex === totalSlides - 1;

    if (isOnLastSlide) {
      emblaApi.scrollTo(0);
    } else {
      emblaApi.scrollNext();
    }
  }, [emblaApi, images.length]);

  const handleSlideChange = useCallback(() => {
    if (!emblaApi) return;

    const selectedIndex = emblaApi.selectedScrollSnap();
    setActiveIndex(prev => (prev === selectedIndex ? prev : selectedIndex));
  }, [emblaApi]);

  const handleNavigationClick = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  const handleDragEnd = useCallback(() => {
    if (!emblaApi) return;

    setIsDragging(false);
    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current);
    }

    snapTimeoutRef.current = setTimeout(() => {
      const scrollSnaps = emblaApi.scrollSnapList();
      const scrollProgress = emblaApi.scrollProgress();

      let closestSnapIndex = 0;
      let minDistance = Math.abs(scrollProgress - scrollSnaps[0]);

      for (let i = 1; i < scrollSnaps.length; i++) {
        const distance = Math.abs(scrollProgress - scrollSnaps[i]);
        if (distance < minDistance) {
          minDistance = distance;
          closestSnapIndex = i;
        }
      }

      emblaApi.scrollTo(closestSnapIndex);
    }, 300);
  }, [emblaApi]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = null;
    }
  }, []);

  const isProgressActive = isVisible;

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", handleSlideChange);
    emblaApi.on("resize", checkCanScroll);
    emblaApi.on("pointerUp", handleDragEnd);
    emblaApi.on("pointerDown", handleDragStart);

    checkCanScroll();

    return () => {
      emblaApi.off("select", handleSlideChange);
      emblaApi.off("resize", checkCanScroll);
      emblaApi.off("pointerUp", handleDragEnd);
      emblaApi.off("pointerDown", handleDragStart);

      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, [
    emblaApi,
    handleSlideChange,
    checkCanScroll,
    handleDragEnd,
    handleDragStart,
  ]);

  const sliderContent = useMemo(
    () => (
      <SliderContent
        textColor={textColor}
        subtitle={subtitle}
        title={title}
        description={description}
        contentId={contentId}
      />
    ),
    [textColor, subtitle, title, description, contentId]
  );

  return (
    <section
      ref={elementRef}
      style={
        backgroundColor
          ? ({ backgroundColor } as CSSProperties)
          : undefined
      }
      className={cn(
        "s-blok-slider-image w-full py-80 md:py-128",
        !backgroundColor && "bg-primary-black",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className
      )}
    >
      {sliderContent}
      <div
        className={cn(
          styles.slide_container,
          allImagesPortrait && images.length < 4
            ? styles.embla__container_noscroll
            : ""
        )}
      >
        <div className={cn(styles.embla)} ref={emblaRef}>
          <div
            className={cn(
              styles.embla__container,
              isAutoSize && allImagesPortrait && images.length < 4
                ? styles.embla__container_portrait
                : ""
            )}
          >
            {images.map((slide, index) => {
              const dimensions = extractImageDimensions(
                slide.filename || undefined
              );
              const isLandscape = isImageLandscape(slide.filename || undefined);

              const imageWidth = dimensions?.width || 791;
              const imageHeight = dimensions?.height || 560;

              const imageFocusPosition = getFocalePercentages(slide);
              const mediaUrl = getMediaUrl(slide.filename || "") || "";

              return (
                <div
                  key={`slide-${slide.filename ?? index}`}
                  className={cn(
                    styles.embla__slide,
                    isAutoSize
                      ? isLandscape
                        ? styles.embla__slide__landscape
                        : styles.embla__slide__portrait
                      : styles.embla__slide__default
                  )}
                >
                  {mediaUrl ? (
                    <SlideMedia
                      src={mediaUrl}
                      alt={slide.alt || ""}
                      width={imageWidth}
                      height={imageHeight}
                      objectPosition={`${imageFocusPosition.left}% ${imageFocusPosition.top}%`}
                      caption={slide.caption}
                      captionColor={slide.captionColor}
                    />
                  ) : (
                    <div className="h-full w-full bg-black/40" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {canScroll ? (
          <div
            className={cn(
              styles.navigation_container,
              isAutoSize
                ? allImagesPortrait && images.length < 4
                  ? styles.navigation_container_portrait
                  : ""
                : "",
              {
                "md:hidden":
                  isAutoSize &&
                  allImagesPortrait &&
                  images.length < 4,
              }
            )}
          >
            {images.map((_, index) => (
              <div
                key={index}
                className={`${styles.navigation_item} ${activeIndex === index ? styles.active : ""}`}
                onClick={() => handleNavigationClick(index)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNavigationClick(index);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                {activeIndex === index ? (
                  <ProgressBar
                    isActive={isProgressActive}
                    autoplayDelay={autoplayDelay}
                    onComplete={handleProgressComplete}
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default BlockSliderImage;
