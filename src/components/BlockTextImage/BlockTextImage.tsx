import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import styles from "./BlockTextImage.module.css";

export type BlockTextImageLayout = "top" | "center" | "bottom";

export type BlockTextImageProps = {
  /** Fond de la section (couleur CSS). Défaut : blanc. */
  backgroundColor?: string;
  /** Couleur du texte (titre + corps). Défaut : `primary-black` (noir typo du site). */
  textColor?: string;
  /** `true` : image à gauche, texte à droite. `false` : texte à gauche, image à droite (comme Storyblok `image_left`). */
  imageLeft: boolean;
  title?: string;
  /** Texte principal (plusieurs paragraphes séparés par des sauts de ligne possibles). */
  description: string;
  bigImageUrl: string;
  bigImageAlt?: string;
  littleImageUrl?: string;
  littleImageAlt?: string;
  layout?: BlockTextImageLayout;
  className?: string;
};

export function BlockTextImage({
  backgroundColor,
  textColor,
  imageLeft,
  title,
  description,
  bigImageUrl,
  bigImageAlt = "",
  littleImageUrl,
  littleImageAlt = "",
  layout = "bottom",
  className,
}: BlockTextImageProps) {
  const isImageLeft = imageLeft;
  const titleTypographyProps = textColor
    ? { style: { color: textColor } as const }
    : { color: "primary-black" as const };
  const bodyTypographyProps = textColor
    ? { style: { color: textColor } as const }
    : { color: "primary-black" as const };

  const paragraphs = description
    .trim()
    .split(/\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <section
      style={backgroundColor ? { backgroundColor } : undefined}
      className={cn(
        "s-blok-text-image w-full h-full py-48 min-h-[700px] md:h-[96vh] lg:h-[94vh] overflow-hidden relative",
        !backgroundColor && "bg-white",
        !textColor && "text-primary-black",
        `layout-${layout}`,
        `image-${isImageLeft ? "left" : "right"}`,
        className
      )}
    >
      <div />
      <div className="grid grid-cols-12 h-full">
        <div
          className={`col-span-12 md:col-span-6 h-full relative overflow-hidden px-20 ${isImageLeft ? "order-1 md:pr-0 md:pl-32" : "order-2 md:pl-0 md:pr-32"}`}
        >
          <div className="w-full h-full overflow-hidden">
            <div className="w-full h-full aspect-[355/600] md:aspect-[680/800]">
              <img
                src={bigImageUrl}
                alt={bigImageAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div
          className={cn(
            `col-span-12 md:col-span-6 px-20 md:px-32 md:pb-48 flex flex-col justify-between h-full items-start ${isImageLeft ? "order-2 pt-32" : "order-1 pb-40"}`,
            !isImageLeft && "md:pl-64",
            layout === "top" && "justify-start",
            layout === "center" && "justify-center",
            layout === "bottom" && "justify-end",
            littleImageUrl && "justify-between"
          )}
        >
          {title?.trim() ? (
            <Typography
              variant="title-large-medium"
              {...titleTypographyProps}
              className={cn(
                "text-start w-full",
                !littleImageUrl && "mb-24 md:mb-56"
              )}
              textTransform="uppercase"
              as="h2"
            >
              {title}
            </Typography>
          ) : (
            <span />
          )}
          {littleImageUrl ? (
            <div className="little-image aspect-[220/164] md:aspect-[348/216] w-4/6 md:w-[50%] md:my-0 my-120 mx-auto md:px-0">
              <img
                src={littleImageUrl}
                alt={littleImageAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : null}
          <div className={cn("body-medium-edito lg:w-5/6", styles.description)}>
            <Typography
              as="div"
              variant="body-medium-edito"
              {...bodyTypographyProps}
              weight="regular"
            >
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlockTextImage;
