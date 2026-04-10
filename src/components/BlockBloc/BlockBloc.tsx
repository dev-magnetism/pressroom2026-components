import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { useEffect, useMemo, useRef, useState } from "react";

export type BlockBlocProps = {
  subtitle?: string;
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
  videoUrl?: string;
  videoUrlMobile?: string;
  textLeft?: string;
  textRight?: string;
  className?: string;
};

function useIsNarrowMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return isMobile;
}

export function BlockBloc({
  subtitle,
  title,
  imageUrl,
  imageAlt = "",
  videoUrl,
  videoUrlMobile,
  textLeft,
  textRight,
  className,
}: BlockBlocProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldLoadVideoRef = useRef(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  const isMobile = useIsNarrowMobile();

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

  return (
    <section
      ref={sectionRef}
      className={cn(
        "s-block-bloc bg-white px-20 md:px-32 w-full py-80 md:py-128 text-primary-black",
        className
      )}
    >
      <div className="grid grid-cols-12 gap-16 md:gap-20">
        {subtitle?.trim() ? (
          <span className="col-span-12 text-center mx-auto uppercase text-12 font-rm-mono text-primary-black">
            {subtitle}
          </span>
        ) : null}

        <div className="col-span-full md:col-span-full 2xl:col-span-8 2xl:col-start-3">
          {title?.trim() ? (
            <Typography
              variant="title-medium"
              className="uppercase text-center font-light text-primary-black mx-auto pb-3"
              as="h2"
            >
              {title}
            </Typography>
          ) : null}
        </div>

        {(showImage || isVideo) && (
          <div className="col-span-12 md:col-span-8 md:col-start-3 my-44">
            {isVideo ? (
              showVideo ? (
                <video
                  className="w-full aspect-[353/600] md:aspect-[910/511] object-cover"
                  src={videoSrc}
                  controls
                  muted
                  loop
                  playsInline
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

        <div className="col-span-12 md:col-span-8 md:col-start-3 2xl:col-span-6 2xl:col-start-4">
          <div className="grid grid-cols-12 gap-16 md:gap-20">
            {textLeft?.trim() ? (
              <div className="col-span-12 md:col-span-6">
                <Typography
                  as="div"
                  variant="body-medium-edito"
                  color="primary-black"
                  className="opacity-80"
                  weight="regular"
                >
                  {textLeft}
                </Typography>
              </div>
            ) : null}
            {textRight?.trim() ? (
              <div className="col-span-12 md:col-span-6">
                <Typography
                  as="div"
                  variant="body-medium-edito"
                  color="primary-black"
                  className="opacity-80"
                  weight="regular"
                >
                  {textRight}
                </Typography>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlockBloc;
