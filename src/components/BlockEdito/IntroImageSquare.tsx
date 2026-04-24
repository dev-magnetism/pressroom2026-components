import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { renderTextWithLineBreaks } from "@/lib/textLineBreaks";
import type { BlockEditoProps } from "./types";
import { EditoReveal } from "./EditoReveal";

export function IntroImageSquare({
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
    <div className="intro-image-square grid grid-cols-6 md:grid-cols-12 gap-16 gap-y-0 md:gap-y-20 md:gap-20 py-64 md:py-96">
      <div className="col-span-full md:col-span-10 col-start-0 md:col-start-2 gap-16 md:gap-20 grid grid-cols-6 md:grid-cols-10 md:pt-80 items-end">
        {imageUrl ? (
          <div
            className={cn(
              "md:col-span-4 md:pr-50 col-span-4 col-start-0 md:pt-44 pt-48 md:order-1 order-2",
              imagePosition === "right" &&
                "col-start-3 md:col-start-7 md:order-2 md:pr-0 md:pl-50"
            )}
          >
            <div className="w-full aspect-[400/400]">
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
            "col-span-full md:ml-0 md:col-span-5 col-start-0 md:col-start-6 md:order-2 order-1",
            imagePosition === "right" && "md:col-start-2 md:order-1"
          )}
        >
          {title?.trim() ? (
            <EditoReveal
              tag="h2"
              delay={0.3}
              duration={0.6}
              from={{ y: 24, opacity: 0 }}
              className={cn(
                "title-xlarge-medium uppercase text-primary-black pb-2",
                imagePosition === "right" &&
                  "text-right ml-auto md:text-left md:ml-0"
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
                imagePosition === "right" &&
                  "ml-auto text-right md:ml-0 md:text-left"
              )}
            >
              {subtitle.trim()}
            </EditoReveal>
          ) : null}

          {content?.trim() ? (
            <EditoReveal
              delay={0.3}
              duration={0.6}
              from={{ y: "100%", opacity: 0 }}
              className={cn(
                "text-primary-black/70 body-medium-edito mt-48 md:mt-96 ml-auto w-5/6 md:w-full md:ml-0 lg:w-4/5",
                imagePosition === "right" && "ml-0"
              )}
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
