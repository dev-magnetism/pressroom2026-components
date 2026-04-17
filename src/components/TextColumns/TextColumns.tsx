import { Typography } from "@/components/ui/Typography";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useMax768 } from "@/hooks/useMax768";
import { cn } from "@/lib/cn";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import styles from "./TextColumns.module.css";
import { TextColumnItem, type TextColumnItemData } from "./TextColumnItem";

export type { TextColumnItemData } from "./TextColumnItem";

export type TextColumnsProps = {
  items: TextColumnItemData[];
  /** Ligne fine au-dessus du titre (ex. contexte produit). */
  subtitle?: string;
  /** Afficher la ligne `subtitle` (défaut : `true` si `subtitle` est non vide). */
  showSubtitle?: boolean;
  title?: string;
  /** Couleur de fond (défaut : fond gris `grey` du design system). */
  backgroundColor?: string;
  /** Couleur du texte (défaut : `#161616` via `--tc-fg`). Bordures et navigation suivent cette teinte. */
  textColor?: string;
  /** Embla en RTL (barre de progression + sens du carrousel). */
  rtl?: boolean;
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

const autoplayDelay = 7000;

export function TextColumns({
  items,
  subtitle,
  showSubtitle = true,
  title,
  backgroundColor,
  textColor,
  rtl = false,
  className,
}: TextColumnsProps) {
  const slides = useMemo(
    () =>
      items.filter(
        it =>
          it.title?.trim() ||
          it.description?.trim() ||
          it.descriptionHtml?.trim()
      ),
    [items]
  );

  const totalSlides = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const isNarrow = useMax768();
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.5 });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      direction: rtl ? "rtl" : "ltr",
      breakpoints: {
        "(min-width: 768px)": {
          active: totalSlides < 4 ? false : true,
        },
      },
    },
    [WheelGesturesPlugin()]
  );

  const handleProgressComplete = useCallback(() => {
    if (!emblaApi) return;

    const currentIndex = emblaApi.selectedScrollSnap();
    const isOnLastSlide = totalSlides > 0 && currentIndex === totalSlides - 1;

    if (isOnLastSlide) {
      emblaApi.scrollTo(0);
    } else {
      emblaApi.scrollNext();
    }
  }, [emblaApi, totalSlides]);

  const handleSlideChange = useCallback(() => {
    if (!emblaApi) return;
    const selectedIndex = emblaApi.selectedScrollSnap();
    setActiveIndex(prev => (prev === selectedIndex ? prev : selectedIndex));
  }, [emblaApi]);

  const handleNavigationClick = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const isProgressActive =
    (isNarrow && isVisible) || (!isNarrow && totalSlides > 3);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", handleSlideChange);
    return () => {
      emblaApi.off("select", handleSlideChange);
    };
  }, [emblaApi, handleSlideChange]);

  if (totalSlides === 0) return null;

  const subtitleTrim = subtitle?.trim();

  const sectionStyle: CSSProperties | undefined =
    backgroundColor != null || textColor != null
      ? ({
          ...(backgroundColor != null && { backgroundColor }),
          ...(textColor != null && { "--tc-fg": textColor }),
        } as CSSProperties)
      : undefined;

  return (
    <section
      ref={elementRef}
      style={sectionStyle}
      className={cn(
        "s-text-columns w-full px-32 py-48 md:py-128",
        styles.surface,
        !backgroundColor && "bg-grey",
        className
      )}
    >
      <div className="flex flex-col gap-16">
        {showSubtitle !== false && subtitleTrim ? (
          <Typography
            variant="label-large"
            weight="light"
            className={cn("font-rm-mono uppercase", styles.headerEyebrow)}
          >
            {subtitleTrim}
          </Typography>
        ) : null}
        {title?.trim() ? (
          <Typography
            variant="title-large-medium"
            className={cn("uppercase", styles.headerTitle)}
          >
            {title.trim()}
          </Typography>
        ) : null}
      </div>
      <div
        className={cn(
          "-mx-32 mt-20 md:mt-64",
          totalSlides > 3 ? "cursor-grab active:cursor-grabbing" : ""
        )}
      >
        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.embla__container}>
            {slides.map((item, index) => (
              <div
                className={styles.embla__slide}
                key={item.id ?? `${item.title ?? "slide"}-${index}`}
              >
                <TextColumnItem item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {totalSlides > 1 ? (
        <div className="text-center">
          <div
            className={cn(
              styles.navigation_container,
              "inline-flex",
              totalSlides < 4 ? "md:hidden" : ""
            )}
          >
            {slides.map((item, index) => (
              <div
                key={item.id ?? `nav-${index}`}
                className={cn(
                  styles.navigation_item,
                  activeIndex === index && styles.active
                )}
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
        </div>
      ) : null}
    </section>
  );
}

export default TextColumns;
