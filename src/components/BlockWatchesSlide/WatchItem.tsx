import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { getLinkUrl } from "@/lib/links";
import { getMediaUrl } from "@/lib/sliderImageMedia";
import type { WatchesSlideItem } from "./types";

type WatchItemProps = {
  blok: WatchesSlideItem;
  withTitle?: boolean;
  className?: string;
  theme?: "dark" | "light";
  isLink?: boolean;
  /** `cover` par défaut (comme demandé pour les visuels montres). */
  imageObjectFit?: "cover" | "contain";
};

export function WatchItem({
  blok,
  withTitle = false,
  className,
  theme = "dark",
  isLink = true,
  imageObjectFit = "cover",
}: WatchItemProps) {
  const { url: href } = getLinkUrl(`/${blok.full_slug}`);

  const subtitle =
    blok.content.hero && Array.isArray(blok.content.hero)
      ? (blok.content.hero[0]?.subhead ?? blok.content.subtitle)
      : blok.content.subtitle;

  const imageAsset = blok.content.product_image;
  const imageSrc = imageAsset?.filename
    ? (getMediaUrl(imageAsset.filename) ?? "")
    : "";
  const imageAlt = imageAsset?.alt ?? "";

  const grainFilterId = `grain-watch-${String(blok.full_slug ?? blok._uid).replace(/[^a-zA-Z0-9-_]/g, "")}`;

  const cardStyle: CSSProperties =
    theme === "light"
      ? {
          background:
            "var(--Composant-Item_Card_Backgroud, radial-gradient(30.99% 40.59% at 49.01% 50.06%, rgba(22, 22, 22, 0.96) 0%, #121212 100%))",
          backdropFilter: "blur(10px)",
        }
      : {
          background: "rgba(37,37,37,0.40)",
          backdropFilter: "blur(10px)",
        };

  const grainSvg = (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      aria-hidden
    >
      <defs>
        <filter
          id={grainFilterId}
          x="0"
          y="0"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2 2"
            stitchTiles="stitch"
            numOctaves={3}
            result="noise"
            seed={4914}
          />
          <feColorMatrix
            in="noise"
            type="luminanceToAlpha"
            result="alphaNoise"
          />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA
              type="discrete"
              tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
            />
          </feComponentTransfer>
          <feFlood floodColor="rgba(0, 0, 0, 0.2)" result="color1Flood" />
          <feComposite
            operator="in"
            in2="coloredNoise1"
            in="color1Flood"
            result="color1"
          />
          <feMerge result="grain">
            <feMergeNode in="color1" />
          </feMerge>
        </filter>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="transparent"
        filter={`url(#${grainFilterId})`}
      />
    </svg>
  );

  const titleOverlay =
    withTitle ? (
      <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col gap-8 p-16 text-white md:p-24">
        <span className="cta-large font-rm-mono">{blok.content.name}</span>
        <span className="label-small font-light uppercase text-white/50">
          {subtitle}
        </span>
      </div>
    ) : null;

  const fitClass =
    imageObjectFit === "cover" ? "object-cover" : "object-contain";

  const inner = withTitle ? (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className={cn("h-full w-full", fitClass)}
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      {grainSvg}
      {titleOverlay}
    </>
  ) : (
    <>
      <div
        className={cn(
          "relative w-full overflow-hidden",
          isLink ? "aspect-[320/312] md:aspect-[297/312]" : "aspect-[72/88]"
        )}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className={cn(
              "absolute inset-0 h-full w-full min-h-0",
              fitClass
            )}
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      {grainSvg}
    </>
  );

  const shellClass = cn(
    "relative w-full overflow-hidden",
    withTitle && "h-full min-h-0",
    !withTitle && "flex flex-col",
    className
  );

  const shellStyle: CSSProperties | undefined = withTitle
    ? undefined
    : cardStyle;

  if (isLink) {
    return (
      <a href={href} className={shellClass} style={shellStyle}>
        {inner}
      </a>
    );
  }

  return (
    <div className={shellClass} style={shellStyle}>
      {inner}
    </div>
  );
}

export default WatchItem;
