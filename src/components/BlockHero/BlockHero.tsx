import styles from "./BlockHero.module.css";
import { Typography } from "@/components/ui/Typography";
import { HeroMaskedBlock } from "./HeroMaskedBlock";
import { CustomButton } from "@/components/ui/CustomButton";
import { cn } from "@/lib/cn";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useCallback, useEffect, useMemo, useRef, memo } from "react";
import { storyblokImageSrc } from "./storyblokImage";
import type { HeroVariationData } from "./types";

export type BlockHeroLabels = {
  characteristics: string;
};

const defaultLabels: BlockHeroLabels = {
  characteristics: "Caractéristiques",
};

const BLOCK_HERO_INTERNAL_ID = "block-hero";

export type BlockHeroProps = {
  title: string;
  subhead: string;
  /** Couleur du dégradé radial (hex, ex. #8B0000). */
  backgroundColorFrom: string;
  imageFilename?: string;
  imageAlt?: string;
  imageMobileFilename?: string;
  imageMobileAlt?: string;
  hasCharacteristics?: boolean;
  onCharacteristicsClick?: () => void;
  labels?: Partial<BlockHeroLabels>;
};

type ContentProps = {
  selected: HeroVariationData;
  hasCharacteristics: boolean;
  onCharacteristicsClick?: () => void;
  labels: BlockHeroLabels;
};

const BlockHeroContent = memo<ContentProps>(
  ({
    selected,
    onCharacteristicsClick,
    hasCharacteristics,
    labels,
  }) => {
    const mainImageRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const imageAnimated = useRef(false);

    const mobileAspectRatio = useMemo(() => {
      if (selected.imageMobile?.filename) {
        return "aspect-[393/490]";
      }
      return "aspect-[393/460]";
    }, [selected.imageMobile]);

    const mobileFilename =
      selected.imageMobile?.filename ?? selected.image?.filename ?? null;

    const desktopFilename =
      selected.image?.filename ?? selected.imageMobile?.filename ?? null;

    const imageAlt = selected.image?.alt ?? selected.imageMobile?.alt ?? "";

    const revealImage = useCallback(() => {
      if (imageAnimated.current || !mainImageRef.current) return;
      imageAnimated.current = true;
      gsap.fromTo(
        mainImageRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          delay: 0.4,
          ease: "power3.easeOut",
        }
      );
    }, []);

    useEffect(() => {
      imageAnimated.current = false;
      if (mainImageRef.current) {
        gsap.set(mainImageRef.current, { opacity: 0 });
      }
      if (imgRef.current?.complete) {
        revealImage();
      }
    }, [
      selected.title,
      selected.subhead,
      selected.backgroundColorFrom,
      selected.image?.filename,
      selected.imageMobile?.filename,
      revealImage,
    ]);

    useEffect(() => {
      if (imgRef.current?.complete) {
        revealImage();
      }
    }, [revealImage]);

    return (
      <div className="flex flex-col items-center justify-between h-full">
        <div className="flex flex-col items-center justify-center flex-1 gap-16 w-full text-center">
          <HeroMaskedBlock
            delay={0.6}
            duration={1.2}
            className={cn("xl:max-w-[80%] xl:mx-auto")}
            childClassName="pb-3"
          >
            <Typography
              variant="title-xxlarge"
              color="white"
              className="text-center"
              as="p"
            >
              {selected.title}
            </Typography>
          </HeroMaskedBlock>

          <HeroMaskedBlock delay={0.9} duration={1}>
            <Typography
              variant="label-small"
              color="white"
              textTransform="uppercase"
            >
              {selected.subhead}
            </Typography>
          </HeroMaskedBlock>

          <HeroMaskedBlock
            delay={1}
            duration={1}
            className={cn(
              "flex gap-16",
              !hasCharacteristics ? "hidden" : ""
            )}
            childClassName="flex gap-16"
          >
            {hasCharacteristics ? (
              <CustomButton
                variant="outline"
                visual="white"
                onClick={onCharacteristicsClick}
                className="mt-4"
              >
                {labels.characteristics}
              </CustomButton>
            ) : null}
          </HeroMaskedBlock>
        </div>

        <div
          className={cn(
            "relative w-full max-w-[100vw] md:max-w-[60vw] xl:max-w-[92vh]",
            "overflow-visible md:overflow-hidden",
            mobileAspectRatio,
            "md:aspect-[890/689]"
          )}
          ref={mainImageRef}
        >
          {(mobileFilename || desktopFilename) && (
            <div className="absolute inset-0 scale-130 origin-bottom md:scale-100">
              <picture>
                <source
                  media="(max-width: 768px)"
                  srcSet={
                    storyblokImageSrc(mobileFilename ?? desktopFilename, 828) ||
                    ""
                  }
                />
                <source
                  media="(min-width: 769px)"
                  srcSet={
                    storyblokImageSrc(
                      desktopFilename ?? mobileFilename,
                      1920
                    ) || ""
                  }
                />
                <img
                  ref={imgRef}
                  src={
                    storyblokImageSrc(desktopFilename ?? mobileFilename, 1200) ||
                    ""
                  }
                  alt={imageAlt}
                  className="h-full w-full object-contain object-bottom"
                  loading="eager"
                  fetchPriority="high"
                  onLoad={revealImage}
                />
              </picture>
            </div>
          )}
        </div>
      </div>
    );
  }
);

BlockHeroContent.displayName = "BlockHeroContent";

function normalizeHex(color: string): string {
  if (!color || color === "#f40000" || color === "") return "#292929";
  return color;
}

function propsToHeroData(p: BlockHeroProps): HeroVariationData {
  const {
    title,
    subhead,
    backgroundColorFrom,
    imageFilename,
    imageAlt = "",
    imageMobileFilename,
    imageMobileAlt,
  } = p;

  const image =
    imageFilename !== undefined && imageFilename !== ""
      ? { filename: imageFilename, alt: imageAlt }
      : undefined;

  const imageMobile =
    imageMobileFilename !== undefined && imageMobileFilename !== ""
      ? {
          filename: imageMobileFilename,
          alt: imageMobileAlt ?? imageAlt,
        }
      : undefined;

  return {
    id: BLOCK_HERO_INTERNAL_ID,
    title,
    subhead,
    backgroundColorFrom,
    image,
    imageMobile,
  };
}

export const BlockHero: React.FC<BlockHeroProps> = props => {
  const {
    hasCharacteristics = false,
    onCharacteristicsClick,
    labels: labelsProp,
  } = props;

  const backgroundRef = useRef<HTMLDivElement>(null);
  const labels = { ...defaultLabels, ...labelsProp };

  const selected = propsToHeroData(props);

  useGSAP(() => {
    if (!backgroundRef.current) return;
    gsap.fromTo(
      backgroundRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        delay: 0,
        ease: "power2.inOut",
      }
    );
  });

  const color70Percent = normalizeHex(selected.backgroundColorFrom) + "B3";

  return (
    <section
      className={cn(
        styles.container,
        "min-h-screen-stable md:min-h-[101vh] bg-white flex"
      )}
    >
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-[#0d0d0d] overflow-hidden"
        style={
          {
            "--background-color-from": color70Percent,
          } as React.CSSProperties
        }
      >
        <div className="product-radial-gradient absolute inset-0" />
      </div>
      <div className={cn(styles.content, "flex-1")}>
        <BlockHeroContent
          selected={selected}
          onCharacteristicsClick={onCharacteristicsClick}
          hasCharacteristics={hasCharacteristics}
          labels={labels}
        />
      </div>
    </section>
  );
};

export default BlockHero;
