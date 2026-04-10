import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/cn";
import { useEffect, useMemo, useRef, useState } from "react";

export type BlockVideoProps = {
  /** Source principale (desktop / fallback mobile). */
  videoUrl: string;
  /** Optionnel : variante mobile (comme Storyblok `video_mobile`). */
  videoUrlMobile?: string;
  /**
   * Si true, monte le lecteur tout de suite (sans attendre l’entrée dans le viewport).
   * Sinon le bloc reste noir tant qu’on n’a pas scrollé jusqu’au composant (lazy load).
   */
  eagerLoad?: boolean;
  className?: string;
};

/**
 * Bloc vidéo plein écran : chargement paresseux à l’entrée dans le viewport,
 * lecture automatique lorsque ~70 % du bloc est visible (comme le site RM).
 */
export function BlockVideo({
  videoUrl,
  videoUrlMobile,
  eagerLoad = false,
  className,
}: BlockVideoProps) {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(eagerLoad);
  const shouldLoadVideoRef = useRef(eagerLoad);

  const resolvedUrl = useMemo(() => {
    if (isMobile) {
      if (videoUrlMobile) return videoUrlMobile;
      return videoUrl;
    }
    return videoUrl;
  }, [isMobile, videoUrl, videoUrlMobile]);

  useEffect(() => {
    if (eagerLoad) return;
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
      { root: null, rootMargin: "400px", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [eagerLoad]);

  useEffect(() => {
    if (!shouldLoadVideo) return;
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
          setShouldAutoPlay(true);
        } else {
          setShouldAutoPlay(false);
        }
      },
      { threshold: 0.7, rootMargin: "0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoadVideo]);

  return (
    <section ref={sectionRef} className={cn("block-video", className)}>
      {shouldLoadVideo && resolvedUrl ? (
        <VideoPlayer
          videoUrl={resolvedUrl}
          autoPlay={shouldAutoPlay}
          loop
          muted
          controls
          showTimeline
          showAudioWaveform
          className=""
          videoClassName="h-screen-stable"
        />
      ) : (
        <div className="bg-primary-black h-screen min-h-dvh w-full" />
      )}
    </section>
  );
}

export default BlockVideo;
