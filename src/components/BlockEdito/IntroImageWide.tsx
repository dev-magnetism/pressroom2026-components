import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { renderTextWithLineBreaks } from "@/lib/textLineBreaks";
import type { BlockEditoProps } from "./types";
import { EditoReveal } from "./EditoReveal";

export function IntroImageWide({
  imagePosition = "left",
  title,
  subtitle,
  content,
  imageUrl,
  imageAlt = "",
  textColor,
}: Pick<
  BlockEditoProps,
  | "imagePosition"
  | "title"
  | "subtitle"
  | "content"
  | "imageUrl"
  | "imageAlt"
  | "textColor"
>) {
  const headingStyle = textColor ? ({ color: textColor } as const) : undefined;
  const bodyTypographyProps = textColor
    ? ({ style: { color: textColor } } as const)
    : ({ color: "primary-black" } as const);

  return (
    <div
      className={cn(
        "intro-image-wide grid grid-cols-6 md:grid-cols-12 gap-16 gap-y-0 md:gap-y-20 md:gap-20 py-40 md:py-96",
        imagePosition && `position-${imagePosition}`
      )}
    >
      <div
        className={cn(
          "mb-40 col-span-full pr-16 md:px-0 md:col-span-10 md:col-start-2",
          imagePosition === "center"
            ? "px-0"
            : imagePosition === "right"
              ? "pr-48"
              : "pl-48"
        )}
      >
        {title?.trim() ? (
          <EditoReveal
            tag="h2"
            delay={0.3}
            duration={0.6}
            from={{ y: 24, opacity: 0 }}
            className={cn(
              "headline-large-medium uppercase w-full pb-2 break-words",
              !textColor && "text-primary-black",
              imagePosition === "center"
                ? "text-center md:text-center"
                : imagePosition === "right"
                  ? "text-right"
                  : "text-left"
            )}
            style={headingStyle}
            childClassName="pb-3"
          >
            {title.trim()}
          </EditoReveal>
        ) : null}
        {subtitle?.trim() ? (
          <EditoReveal
            delay={0.3}
            duration={0.6}
            from={{ y: 16, opacity: 0 }}
            className={cn(
              "mt-4 title-xsmall uppercase",
              !textColor && "text-primary-black",
              imagePosition === "right" && "text-right ml-auto",
              imagePosition === "center" && "text-center mx-auto"
            )}
            style={headingStyle}
          >
            {subtitle.trim()}
          </EditoReveal>
        ) : null}
      </div>
      {imageUrl ? (
        <div className="col-span-full md:col-span-8 md:col-start-3 order-3 md:order-2 mt-48 md:mt-0">
          <div className="w-full aspect-[353/162] md:aspect-[718/326]">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      ) : null}
      {content?.trim() ? (
        <EditoReveal
          delay={0.3}
          duration={0.6}
          from={{ y: "100%", opacity: 0 }}
          className={cn(
            "body-medium-edito opacity-70 col-span-full pr-16 md:px-0 md:col-span-4 md:col-start-6 mt-8 md:mt-36 order-2 md:order-3",
            !textColor && "text-primary-black",
            imagePosition === "right"
              ? "pr-48 md:col-start-4 md:col-span-5 text-right md:text-left"
              : imagePosition === "center"
                ? "md:col-span-6 md:col-start-4 lg:w-3/4 lg:mx-auto text-center px-0"
                : "pl-48"
          )}
          style={textColor ? ({ color: textColor } as const) : undefined}
        >
          <Typography variant="body-medium-edito" {...bodyTypographyProps}>
            {renderTextWithLineBreaks(content.trim())}
          </Typography>
        </EditoReveal>
      ) : null}
    </div>
  );
}
