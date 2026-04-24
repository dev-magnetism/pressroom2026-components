import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { Typography } from "@/components/ui/Typography";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/cn";
import { renderTextWithLineBreaks } from "@/lib/textLineBreaks";
import { useEffect, useMemo, useRef, useState } from "react";

export type BlockBlocProps = {
  subtitle?: string;
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
  videoUrl?: string;
  videoUrlMobile?: string;
  /** `2` : deux colonnes côte à côte (défaut). `1` : une colonne, texte centré. */
  textColumns?: 1 | 2;
  textLeft?: string;
  textRight?: string;
  className?: string;
};

export function BlockBloc({
  subtitle,
  title,
  imageUrl,
  imageAlt = "",
  videoUrl,
  videoUrlMobile,
  textColumns = 2,
  textLeft,
  textRight,
  className,
}: BlockBlocProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldLoadVideoRef = useRef(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  /** Même breakpoint que richardmille (`useIsMobile`, max-width 475px). */
  const isMobile = useIsMobile();

  const isVideo = Boolean(videoUrl || videoUrlMobile);

  const videoSrc = useMemo(() => {
    if (!isVideo) return "";
    if (isMobile && videoUrlMobile) return videoUrlMobile;
    return videoUrl ?? "";
  }, [isVideo, isMobile, videoUrl, videoUrlMobile]);

  /** Chargement vidéo différé (perf), pas d’animation visuelle au scroll. */
  useEffect(() => {
    if (!isVideo) return;
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !shouldLoadVideoRef.current) {
            shouldLoadVideoRef.current = true;
            setShouldLoadVideo(true);
          }
        });
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVideo]);

  const showImage = Boolean(imageUrl) && !isVideo;
  const showVideo = isVideo && shouldLoadVideo && videoSrc;

  const hasTextLeft = Boolean(textLeft?.trim());
  const hasTextRight = Boolean(textRight?.trim());
  const hasText = hasTextLeft || hasTextRight;
  const isSingleTextColumn = textColumns === 1;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "s-block-bloc bg-white px-20 md:px-32 w-full py-80 md:py-128 text-primary-black",
        className
      )}
    >
      <div className="grid grid-cols-12 gap-16 md:gap-20">
        <div className="col-span-full md:col-span-full 2xl:col-span-8 2xl:col-start-3">
          {title?.trim() ? (
            <Typography
              variant="title-medium"
              className="!text-[48px] uppercase text-center font-light text-primary-black mx-auto"
              as="h2"
            >
              {renderTextWithLineBreaks(title)}
            </Typography>
          ) : null}
          {subtitle?.trim() ? (
            <span
              className={cn(
                "block text-center uppercase text-[24px] font-light leading-[120%] tracking-[-0.24px] font-rm-mono text-primary-black",
                title?.trim() && "mt-[20px]"
              )}
            >
              {renderTextWithLineBreaks(subtitle)}
            </span>
          ) : null}
        </div>

        {(showImage || isVideo) && (
          <div className="col-span-12 md:col-span-8 md:col-start-3 my-44">
            {isVideo ? (
              showVideo ? (
                <VideoPlayer
                  videoUrl={videoSrc}
                  autoPlay={false}
                  loop={true}
                  muted={true}
                  controls={true}
                  showTimeline={true}
                  showAudioWaveform={true}
                  className="w-full aspect-[353/600] md:aspect-[910/511]"
                  videoClassName="h-full"
                />
              ) : (
                <div
                  className="w-full aspect-[353/600] md:aspect-[910/511] bg-grey"
                  aria-hidden
                />
              )
            ) : (
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full aspect-[353/600] md:aspect-[910/374] object-cover"
                loading="lazy"
              />
            )}
          </div>
        )}

        {hasText ? (
          <div className="col-span-12 md:col-span-8 md:col-start-3 2xl:col-span-6 2xl:col-start-4">
            {isSingleTextColumn ? (
              <div className="mx-auto flex w-full max-w-[500px] flex-col items-center gap-16 text-center md:gap-20">
                {hasTextLeft ? (
                  <Typography
                    as="div"
                    variant="body-medium-edito"
                    color="primary-black"
                    className="opacity-80"
                    weight="regular"
                  >
                    {renderTextWithLineBreaks(textLeft ?? "")}
                  </Typography>
                ) : null}
                {hasTextRight ? (
                  <Typography
                    as="div"
                    variant="body-medium-edito"
                    color="primary-black"
                    className="opacity-80"
                    weight="regular"
                  >
                    {renderTextWithLineBreaks(textRight ?? "")}
                  </Typography>
                ) : null}
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-16 md:gap-20">
                {hasTextLeft ? (
                  <div className="col-span-12 md:col-span-6">
                    <Typography
                      as="div"
                      variant="body-medium-edito"
                      color="primary-black"
                      className="opacity-80"
                      weight="regular"
                    >
                      {renderTextWithLineBreaks(textLeft ?? "")}
                    </Typography>
                  </div>
                ) : null}
                {hasTextRight ? (
                  <div className="col-span-12 md:col-span-6">
                    <Typography
                      as="div"
                      variant="body-medium-edito"
                      color="primary-black"
                      className="opacity-80"
                      weight="regular"
                    >
                      {renderTextWithLineBreaks(textRight ?? "")}
                    </Typography>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default BlockBloc;
