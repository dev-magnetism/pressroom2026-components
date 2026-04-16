import { cn } from "@/lib/cn";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import useEmblaCarousel from "embla-carousel-react";
import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Diaporama.module.css";

/** Même sélecteur que `BlockImagesSlider` / `CoverItem` (Richard Mille) pour les tweens GSAP. */
const SLIDE_IMAGE_WRAPPER = "storyblok-image-wrapper";

function useVideoMobileBreakpoint() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return isMobile;
}

export type DiaporamaItem = {
  /** Identifiant stable (équivalent `_uid` Storyblok). */
  id: string;
  /** Image (slide photo, ou poster / vignette si `videoUrl` est défini). */
  imageUrl?: string;
  imageAlt?: string;
  /** Si défini : slide vidéo (équivalent `media_item` Storyblok avec vidéo). */
  videoUrl?: string;
  videoUrlMobile?: string;
};

export type DiaporamaLabels = {
  prev: string;
  next: string;
};

export type DiaporamaProps = {
  items: DiaporamaItem[];
  /** Storyblok `full_width` (défaut `true`) — `false` : largeur max centrée. */
  fullWidth?: boolean;
  /** Storyblok `preview` — colonne de miniatures à droite (md+). */
  preview?: boolean;
  /** Équivalent locale RTL (`direction` Embla + animations). */
  dir?: "ltr" | "rtl";
  className?: string;
  /** Défaut 10 000 ms (autoplay entre slides). */
  autoplayDelayMs?: number;
  /** Seuil IntersectionObserver (défaut 0.5). */
  visibilityThreshold?: number;
  labels?: Partial<DiaporamaLabels>;
  /** Slide actif au montage (défaut 0), clampé sur la longueur de `items`. */
  initialSlideIndex?: number;
};

const DEFAULT_LABELS: DiaporamaLabels = {
  prev: "Slide précédent",
  next: "Slide suivant",
};

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10 3L5 8l5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Diaporama({
  items,
  fullWidth = true,
  preview = false,
  dir = "ltr",
  className,
  autoplayDelayMs = 10_000,
  visibilityThreshold = 0.5,
  labels: labelsProp,
  initialSlideIndex = 0,
}: DiaporamaProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const isRtl = dir === "rtl";
  const isVideoMobile = useVideoMobileBreakpoint();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragDeltaXRef = useRef(0);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const slideCount = items?.length || 0;
  const isSingleItem = slideCount === 1;

  const [emblaPreviewRef, emblaPreviewApi] = useEmblaCarousel({
    loop: true,
    containScroll: false,
    direction: isRtl ? "rtl" : "ltr",
  });

  const [selectedIndex, setSelectedIndex] = useState(() =>
    slideCount > 0
      ? Math.min(Math.max(0, initialSlideIndex), slideCount - 1)
      : 0
  );

  const [videoMountByIndex, setVideoMountByIndex] = useState<
    Record<number, boolean>
  >(() => {
    const count = items?.length || 0;
    if (count === 0) return {};
    const idx = Math.min(Math.max(0, initialSlideIndex), count - 1);
    const next: Record<number, boolean> = { [idx]: true };
    if (count > 1) {
      next[(idx - 1 + count) % count] = true;
      next[(idx + 1) % count] = true;
    }
    return next;
  });

  const [posterFadeOnActiveVideo, setPosterFadeOnActiveVideo] = useState(false);
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;

  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressValueRef = useRef(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: visibilityThreshold,
  });

  useEffect(() => {
    if (!preview || !emblaPreviewApi) return;
    emblaPreviewApi.scrollTo(selectedIndex);
  }, [emblaPreviewApi, preview, selectedIndex]);

  useEffect(() => {
    if (!slideCount) return;
    setVideoMountByIndex(prev => {
      const next = { ...prev };
      next[selectedIndex] = true;
      if (slideCount > 1) {
        next[(selectedIndex - 1 + slideCount) % slideCount] = true;
        next[(selectedIndex + 1) % slideCount] = true;
      }
      return next;
    });
  }, [selectedIndex, slideCount]);

  useEffect(() => {
    setPosterFadeOnActiveVideo(false);
  }, [selectedIndex]);

  const updateProgressBar = (value: number) => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${value}%`;
    }
  };

  const getSlides = () =>
    carouselRef.current?.querySelectorAll<HTMLElement>(".banner-image");

  const resetSlideStyles = (slides: NodeListOf<HTMLElement>) => {
    slides.forEach((slide, index) => {
      gsap.killTweensOf(slide);
      gsap.set(slide, {
        clearProps: "transform",
        zIndex: index === selectedIndex ? 2 : 1,
      });

      const wrapper = slide.querySelector<HTMLElement>(
        `.${SLIDE_IMAGE_WRAPPER}`
      );
      if (wrapper) {
        gsap.killTweensOf(wrapper);
        gsap.set(wrapper, { clearProps: "transform" });
      }
    });
  };

  const animateToSlide = (targetIndex: number) => {
    if (isAnimating || !isVisible || targetIndex === selectedIndex) return;

    const allSlides = getSlides();
    if (!allSlides?.length) return;

    const currentSlide = allSlides[selectedIndex];
    const targetSlide = allSlides[targetIndex];
    if (!currentSlide || !targetSlide) return;

    const isForward =
      (selectedIndex === slideCount - 1 && targetIndex === 0) ||
      targetIndex > selectedIndex;

    stopProgress();
    progressValueRef.current = 0;
    updateProgressBar(0);
    setIsAnimating(true);

    resetSlideStyles(allSlides);
    gsap.set(targetSlide, { zIndex: 3 });
    gsap.set(currentSlide, { zIndex: 2 });

    const targetImageWrapper = targetSlide.querySelector<HTMLElement>(
      `.${SLIDE_IMAGE_WRAPPER}`
    );

    gsap.fromTo(
      targetSlide,
      { xPercent: isForward ? 100 : -100 },
      { xPercent: 0, duration: 0.75, ease: "power2.inOut" }
    );

    if (targetImageWrapper) {
      gsap.fromTo(
        targetImageWrapper,
        {
          xPercent: isForward ? -90 : 90,
          scale: 1.1,
        },
        {
          xPercent: 0,
          scale: 1,
          duration: 0.75,
          ease: "power2.inOut",
        }
      );
    }

    gsap.fromTo(
      currentSlide,
      { xPercent: 0 },
      {
        xPercent: isForward ? -10 : 10,
        duration: 0.75,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(currentSlide, { clearProps: "transform", zIndex: 1 });
          gsap.set(targetSlide, { clearProps: "transform", zIndex: 2 });
          const currentImageWrapper = currentSlide.querySelector<HTMLElement>(
            `.${SLIDE_IMAGE_WRAPPER}`
          );
          if (currentImageWrapper) {
            gsap.set(currentImageWrapper, { clearProps: "transform" });
          }

          setSelectedIndex(targetIndex);
          emblaPreviewApi?.scrollTo(targetIndex);
          setIsAnimating(false);
        },
      }
    );
  };

  const stopProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const handleNextSlide = () => {
    if (isAnimating || !isVisible) return;
    const nextIndex = selectedIndex < slideCount - 1 ? selectedIndex + 1 : 0;
    animateToSlide(nextIndex);
  };

  const handlePrevSlide = () => {
    if (isAnimating || !isVisible) return;
    const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : slideCount - 1;
    animateToSlide(prevIndex);
  };

  const startProgress = (fromPaused = false) => {
    if (!isVisible || isSingleItem) return;

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    if (!fromPaused) {
      progressValueRef.current = 0;
      updateProgressBar(0);
    }

    const step = 100 / (autoplayDelayMs / 100);
    const interval = setInterval(() => {
      if (!isVisible) {
        clearInterval(interval);
        progressIntervalRef.current = null;
        return;
      }

      progressValueRef.current += step;
      if (progressValueRef.current >= 100) {
        progressValueRef.current = 0;
        updateProgressBar(0);
        handleNextSlide();
      } else {
        updateProgressBar(progressValueRef.current);
      }
    }, 100);

    progressIntervalRef.current = interval;
  };

  useEffect(() => {
    if (isSingleItem) return;
    if (isVisible) {
      startProgress(true);
    } else {
      stopProgress();
    }
  }, [isVisible, isSingleItem]);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isSingleItem) return;
    if (isVisible) {
      startProgress();
    }
  }, [selectedIndex, isSingleItem, isVisible]);

  const handleNavigationClick = (index: number) => {
    animateToSlide(index);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isAnimating || isSingleItem || !isVisible) return;

    isDraggingRef.current = true;
    setIsDraggingState(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    dragStartXRef.current = clientX;
    dragDeltaXRef.current = 0;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current || isAnimating || isSingleItem || !isVisible)
      return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    dragDeltaXRef.current = clientX - dragStartXRef.current;
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current || isAnimating || isSingleItem || !isVisible)
      return;

    isDraggingRef.current = false;
    setIsDraggingState(false);
    const delta = dragDeltaXRef.current;
    dragDeltaXRef.current = 0;

    if (Math.abs(delta) > 20) {
      if (delta > 0) {
        handlePrevSlide();
      } else {
        handleNextSlide();
      }
    }
  };

  useEffect(() => {
    const root = carouselRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLVideoElement>("video").forEach(video => {
      const slide = video.closest("[data-diaporama-slide-index]");
      const raw = slide?.getAttribute("data-diaporama-slide-index");
      const idx = raw != null ? Number(raw) : NaN;
      if (Number.isNaN(idx)) return;
      if (idx === selectedIndex && isVisible) {
        video.play().catch(() => {});
      } else {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
    });
  }, [selectedIndex, isVisible]);

  if (!items?.length) return null;

  return (
    <section
      ref={elementRef}
      className={cn(
        "s-diaporama w-full relative overflow-hidden aspect-[393/852] md:aspect-[16/9] max-h-screen-stable",
        !fullWidth && "max-w-[1600px] mx-auto",
        className
      )}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      style={{
        cursor: !isVisible
          ? "default"
          : isSingleItem
            ? "default"
            : isDraggingState
              ? "grabbing"
              : "grab",
        userSelect: "none",
      }}
      dir={dir}
    >
      <div
        className={cn(styles.bannerImages, "pointer-events-none")}
        ref={carouselRef}
      >
        <div
          className={cn(
            "absolute w-full h-full cover-image-overlay z-[4] top-0 left-0 pointer-events-none"
          )}
          aria-hidden
        />
        {items.map((item, index) => {
          const hasVideo = Boolean(item.videoUrl?.trim());
          const videoSrc = hasVideo
            ? isVideoMobile && item.videoUrlMobile?.trim()
              ? item.videoUrlMobile.trim()
              : (item.videoUrl?.trim() ?? "")
            : "";
          const showImage = Boolean(item.imageUrl?.trim());
          const imageIsPhoto =
            showImage && !item.imageUrl?.toLowerCase().includes(".mp4");
          const mountVideo =
            Boolean(hasVideo && videoSrc.length > 0 && videoMountByIndex[index]);
          const isActiveSlide = selectedIndex === index;

          return (
            <div
              key={item.id}
              id={`slide-${index}`}
              data-diaporama-slide-index={index}
              className={cn(
                styles.bannerImage,
                selectedIndex === index ? "active" : "",
                "banner-image select-none"
              )}
              style={{
                zIndex: selectedIndex === index ? 2 : 1,
              }}
            >
              <div
                className={cn(
                  SLIDE_IMAGE_WRAPPER,
                  "relative w-full h-full overflow-hidden"
                )}
              >
                {hasVideo && videoSrc.length > 0 ? (
                  mountVideo ? (
                    <>
                      {imageIsPhoto ? (
                        <div
                          className="absolute inset-0 z-[1] transition-opacity duration-500 pointer-events-none"
                          style={{
                            opacity:
                              posterFadeOnActiveVideo && isActiveSlide ? 0 : 1,
                          }}
                          aria-hidden
                        >
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                            draggable={false}
                          />
                        </div>
                      ) : null}
                      <video
                        className="relative z-[2] h-full w-full object-cover pointer-events-none"
                        src={videoSrc}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        controlsList="nodownload"
                        disablePictureInPicture
                        onPlay={e => {
                          const slide = (
                            e.target as HTMLVideoElement
                          ).closest("[data-diaporama-slide-index]");
                          const raw = slide?.getAttribute(
                            "data-diaporama-slide-index"
                          );
                          const idx = raw != null ? Number(raw) : NaN;
                          if (
                            !Number.isNaN(idx) &&
                            idx === selectedIndexRef.current
                          ) {
                            setPosterFadeOnActiveVideo(true);
                          }
                        }}
                        onPause={e => {
                          const slide = (
                            e.target as HTMLVideoElement
                          ).closest("[data-diaporama-slide-index]");
                          const raw = slide?.getAttribute(
                            "data-diaporama-slide-index"
                          );
                          const idx = raw != null ? Number(raw) : NaN;
                          if (
                            !Number.isNaN(idx) &&
                            idx === selectedIndexRef.current
                          ) {
                            setPosterFadeOnActiveVideo(false);
                          }
                        }}
                      />
                    </>
                  ) : imageIsPhoto ? (
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt ?? ""}
                      className="h-full w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      draggable={false}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-primary-black"
                      aria-hidden
                    />
                  )
                ) : showImage ? (
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt ?? ""}
                    className="h-full w-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {!isSingleItem && (
        <div
          className={cn(
            styles.embla__navigation,
            isVisible ? "cursor-pointer" : "cursor-default"
          )}
        >
          <div
            className={cn(
              styles.embla__nav_progress,
              isVisible ? "cursor-pointer" : "cursor-default"
            )}
          >
            {items.map((item, index) => (
              <div
                key={`nav-${item.id}-${index}`}
                className={cn(
                  styles.embla__navigation_item,
                  selectedIndex === index ? styles.active : "",
                  isVisible ? "cursor-pointer" : "cursor-default"
                )}
                onClick={() => handleNavigationClick(index)}
              >
                {selectedIndex === index && (
                  <div
                    ref={progressBarRef}
                    className={styles.embla__progress_bar}
                  />
                )}
              </div>
            ))}
          </div>
          <div className={styles.embla__nav_buttons}>
            <button
              type="button"
              className={styles.embla__nav_button}
              onClick={handlePrevSlide}
              aria-label={labels.prev}
              disabled={isAnimating || !isVisible}
            >
              <ArrowLeftIcon />
            </button>
            <button
              type="button"
              className={cn(styles.embla__nav_button, "text-white")}
              onClick={handleNextSlide}
              aria-label={labels.next}
              disabled={isAnimating || !isVisible}
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      )}

      {preview && !isSingleItem && (
        <div className="absolute right-24 top-1/2 -translate-y-1/2 z-10 md:block hidden max-h-[80%]">
          <div
            className={cn(
              styles.embla__preview_container,
              "embla__viewport overflow-hidden md:gap-2"
            )}
            ref={emblaPreviewRef}
          >
            {items.map((item, index) => (
              <div
                key={`preview-${item.id}`}
                className={cn(
                  styles.embla__preview_slide,
                  "relative overflow-hidden p-5 md:w-160 group transition-all duration-300 aspect-[91/48] w-full ",
                  isVisible ? "cursor-pointer" : "cursor-default",
                  selectedIndex === index ? "" : "hover:border-primary-black/20"
                )}
                onClick={() => handleNavigationClick(index)}
              >
                {isVisible &&
                  (item.imageUrl?.trim() ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className={cn(
                        "absolute inset-0 h-full w-full object-cover transition-all duration-300 ",
                        selectedIndex !== index &&
                          "grayscale group-hover:grayscale-0"
                      )}
                      draggable={false}
                    />
                  ) : item.videoUrl?.trim() ? (
                    <div className="absolute inset-0 bg-primary-black" />
                  ) : null)}
                {selectedIndex !== index && (
                  <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Diaporama;
