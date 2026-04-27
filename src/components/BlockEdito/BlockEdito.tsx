import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { IntroImageHorizontal } from "./IntroImageHorizontal";
import { IntroImageSquare } from "./IntroImageSquare";
import { IntroImageVertical } from "./IntroImageVertical";
import { IntroImageWide } from "./IntroImageWide";
import type { BlockEditoProps } from "./types";

/**
 * Bloc édito (équivalent Storyblok `block_edito`) : texte + image,
 * quatre variantes de grille (`imageType`) et alignement (`imagePosition`).
 * Autonome : pas de `@storyblok/react`, médias passés en `imageUrl` / `imageAlt`.
 */
export function BlockEdito({
  imageType,
  imagePosition = "left",
  title,
  subtitle,
  content,
  imageUrl,
  imageAlt,
  backgroundColor,
  textColor,
  className,
}: BlockEditoProps) {
  const Layout = useMemo(() => {
    switch (imageType) {
      case "wide":
        return IntroImageWide;
      case "square":
        return IntroImageSquare;
      case "horizontal":
        return IntroImageHorizontal;
      case "vertical":
      default:
        return IntroImageVertical;
    }
  }, [imageType]);

  return (
    <section
      style={{
        ...(backgroundColor ? { backgroundColor } : {}),
        ...(textColor ? { color: textColor } : {}),
      }}
      className={cn(
        "s-blok-edito px-20 md:px-32 w-full",
        !backgroundColor && "bg-white",
        !textColor && "text-primary-black",
        imageType,
        className
      )}
    >
      <Layout
        imagePosition={imagePosition}
        title={title}
        subtitle={subtitle}
        content={content}
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        textColor={textColor}
      />
    </section>
  );
}

export type { BlockEditoImagePosition, BlockEditoImageType, BlockEditoProps } from "./types";
