import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { renderTextWithLineBreaks } from "@/lib/textLineBreaks";
import type { BlockEditoProps } from "./types";
import { EditoReveal } from "./EditoReveal";

export function IntroImageHorizontal({
  imagePosition = "left",
  title,
  subtitle,
  content,
  imageUrl,
  imageAlt = "",
}: Pick<
  BlockEditoProps,
  "imagePosition" | "title" | "subtitle" | "content" | "imageUrl" | "imageAlt"
>) {
  return (
    <div className="intro-image-horizontal grid-container py-64 md:py-96 px-0 gap-y-0">
      <div
        className={cn(
          "order-1 md:order-1 col-span-full md:col-span-7 flex flex-col col-start-1 mb-48 md:mb-72",
          imagePosition === "right" ? "md:col-start-4" : "md:col-start-5"
        )}
      >
        {title?.trim() ? (
          <EditoReveal
            tag="h2"
            delay={0.3}
            duration={0.6}
            from={{ y: 24, opacity: 0 }}
            className={cn(
              "title-xlarge-medium headline-word-break uppercase text-primary-black pb-2",
              imagePosition === "right" && "text-right"
            )}
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
              "mt-4 title-xsmall uppercase text-primary-black",
              imagePosition === "right" && "text-right ml-auto"
            )}
          >
            {subtitle.trim()}
          </EditoReveal>
        ) : null}
      </div>
      <div className="order-2 md:order-2 gap-16 md:gap-20 col-span-full grid grid-cols-6 md:grid-cols-12">
        {imageUrl ? (
          <div
            className={cn(
              "order-2 md:order-1 col-span-full md:col-span-4 md:col-start-2 flex mt-48 md:mt-0",
              imagePosition === "right" && "md:col-start-8 md:order-2"
            )}
          >
            <div className="w-full aspect-[353/227] md:aspect-[466/300]">
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ) : null}
        <div
          className={cn(
            "order-1 md:order-2 col-span-4 col-start-3 md:col-span-5 md:col-start-7 md:py-40",
            imagePosition === "right" && "md:col-start-2 md:order-1"
          )}
        >
          {content?.trim() ? (
            <EditoReveal
              delay={0.3}
              duration={0.6}
              from={{ y: "100%", opacity: 0 }}
              className="text-primary-black/70 body-medium-edito"
            >
              <Typography variant="body-medium-edito" color="primary-black">
                {renderTextWithLineBreaks(content.trim())}
              </Typography>
            </EditoReveal>
          ) : null}
        </div>
      </div>
    </div>
  );
}
