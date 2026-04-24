import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { renderTextWithLineBreaks } from "@/lib/textLineBreaks";
import type { BlockEditoProps } from "./types";
import { EditoReveal } from "./EditoReveal";

export function IntroImageVertical({
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
  const isRight = imagePosition === "right";

  return (
    <div
      className={cn(
        "intro-image-vertical grid grid-cols-6 md:grid-cols-12 gap-16 md:gap-20 py-80 md:py-96",
        isRight && "is-right"
      )}
    >
      {imageUrl ? (
        <div
          className={cn(
            "order-2 md:order-1 col-span-4 md:col-span-3 md:col-start-2 md:pl-48 flex items-end mt-48 md:mt-0",
            isRight && "col-start-3 md:order-2 md:col-start-9 md:pl-0 md:pr-40"
          )}
        >
          <div className="w-full aspect-[290/413]">
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
          "order-1 md:order-2 col-span-6 md:col-span-6 md:col-start-6 2xl:col-span-4 flex flex-col justify-between md:justify-start col-start-1",
          isRight
            ? "md:order-1 md:col-start-3 2xl:col-start-3"
            : "2xl:col-start-6"
        )}
      >
        <div className="mb-40 md:mb-128">
          {title?.trim() ? (
            <EditoReveal
              tag="h2"
              delay={0.3}
              duration={0.6}
              from={{ y: 24, opacity: 0 }}
              className={cn(
                "headline-large-medium uppercase text-primary-black break-words md:break-normal w-full pb-2",
                isRight ? "md:pr-16" : ""
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
              className="mt-4 title-xsmall uppercase text-primary-black"
            >
              {subtitle.trim()}
            </EditoReveal>
          ) : null}
        </div>
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
  );
}
