import { useIsMobile } from "@/hooks/useIsMobile";
import MouseHelper from "@/lib/MouseHelper";
import { cn } from "@/lib/cn";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

export type VideoPlayerLabels = {
  play: string;
  pause: string;
  toggleAudio?: string;
};

export type VideoPlayerProps = {
  videoUrl: string;
  className?: string;
  autoPlay?: boolean;
  hideControls?: boolean;
  loop?: boolean;
  muted?: boolean;
  grayscale?: boolean;
  onEnded?: () => void;
  onDurationChange?: (duration: number) => void;
  hideElements?: boolean;
  controls?: boolean;
  showPlayButton?: boolean;
  showTimeline?: boolean;
  showAudioWaveform?: boolean;
  subtitlesUrl?: string;
  hideControlsOnHover?: boolean;
  initialTime?: number;
  videoClassName?: string;
  labels?: VideoPlayerLabels;
};

const DEFAULT_LABELS: VideoPlayerLabels = {
  play: "PLAY",
  pause: "PAUSE",
  toggleAudio: "Toggle audio",
};

const createInitialDefaultPolyline = (): string => {
  const svgWidth = 70;
  const svgHeight = 10;
  const dataLength = 32;
  const points = Array.from({ length: dataLength }, (_, index) => {
    const x = (index / (dataLength - 1)) * svgWidth;
    const baseY = svgHeight / 2;
    const variation = Math.sin(index * 0.2) * 0.5;
    const y = baseY + variation;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
  return points;
};

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={cn(
        "w-24 h-24 min-w-[24px] min-h-[24px] shrink-0",
        className
      )}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path fill="currentColor" d="m14.133 12-4.266 2.463V9.537z" />
    </svg>
  );
}

function PauseGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={cn(
        "w-24 h-24 min-w-[24px] min-h-[24px] shrink-0",
        className
      )}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path fill="currentColor" d="M7 10h3v5H7zM14 10h3v5h-3z" />
    </svg>
  );
}

export function VideoPlayer({
  videoUrl,
  className = "",
  autoPlay = false,
  showPlayButton = true,
  loop = true,
  muted = true,
  hideElements = false,
  controls: showControls = true,
  grayscale = false,
  onEnded,
  onDurationChange,
  showTimeline = true,
  showAudioWaveform = true,
  subtitlesUrl: _subtitlesUrl,
  hideControls: _hideControls = false,
  hideControlsOnHover = false,
  initialTime,
  videoClassName,
  labels: labelsProp,
}: VideoPlayerProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const playPauseButtonRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(muted);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);
  const hasTriggeredOnEnded = useRef(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const polylineRef = useRef<SVGPolylineElement | null>(null);
  const isIntersectingRef = useRef(false);
  const [polyPoints] = useState<string>(() => createInitialDefaultPolyline());

  const initAudioAnalyser = async () => {
    if (!videoRef.current || audioContextRef.current) return;

    try {
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const gainNode = audioCtx.createGain();

      const source = audioCtx.createMediaElementSource(videoRef.current);

      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.5;

      source.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      gainNode.gain.value = 0;

      videoRef.current.muted = false;

      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      gainNodeRef.current = gainNode;
      sourceRef.current = source;
    } catch {
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
    }
  };

  const analyzeAudio = useCallback(() => {
    if (
      !analyserRef.current ||
      !audioContextRef.current ||
      !videoRef.current ||
      videoRef.current.paused ||
      audioContextRef.current.state !== "running"
    ) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
      return;
    }
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const maxValue = Math.max(...dataArray);
    const hasAudioData = maxValue > 0;

    const createPolylinePoints = (audioData: Uint8Array): string => {
      const svgWidth = 70;
      const svgHeight = 10;
      const dataLength = 32;
      const audioArray = Array.from(audioData);
      const sortedValues = [...audioArray].sort((a, b) => a - b);
      const lowThresholdIndex = Math.floor(sortedValues.length * 0.4);
      const lowThreshold = sortedValues[lowThresholdIndex];
      const filteredData = audioArray
        .filter(value => value > lowThreshold)
        .slice(0, dataLength);
      const relevantData = [...filteredData];
      while (relevantData.length < dataLength) relevantData.push(0);
      const sliceSize = 8;
      const slices: number[][] = [];
      for (let i = 0; i < relevantData.length; i += sliceSize) {
        slices.push(relevantData.slice(i, i + sliceSize));
      }
      const rearrangedData: number[] = [];
      const sliceOrder = [3, 2, 0, 1];
      for (const sliceIndex of sliceOrder) {
        if (slices[sliceIndex]) rearrangedData.push(...slices[sliceIndex]);
      }
      return rearrangedData
        .map((value, index) => {
          const clampedValue = Math.max(0, Math.min(256, value));
          const normalizedValue = clampedValue / 256;
          const x = (index / (dataLength - 1)) * svgWidth;
          const y = svgHeight - normalizedValue * svgHeight;
          return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(" ");
    };

    const newPoints = hasAudioData
      ? createPolylinePoints(dataArray)
      : createInitialDefaultPolyline();
    if (polylineRef.current) {
      polylineRef.current.setAttribute("points", newPoints);
    }
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current && !isNaN(videoRef.current.currentTime)) {
      const newTime = videoRef.current.currentTime;
      const videoDuration = videoRef.current.duration;
      setCurrentTime(newTime);

      if (
        videoDuration &&
        !isNaN(videoDuration) &&
        !hasTriggeredOnEnded.current
      ) {
        const progress = (newTime / videoDuration) * 100;
        if (progress >= 98 && onEnded) {
          hasTriggeredOnEnded.current = true;
          onEnded();
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
      onDurationChange?.(videoRef.current.duration);
      if (initialTime !== undefined && initialTime > 0) {
        videoRef.current.currentTime = initialTime;
        setCurrentTime(initialTime);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage =
    duration > 0 && !isNaN(duration) && !isNaN(currentTime)
      ? (currentTime / duration) * 100
      : 0;

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration <= 0) return;
    e.stopPropagation();
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clickPercentage = (clickY / rect.height) * 100;
    const clamped = Math.max(0, Math.min(100, clickPercentage));
    const newTime = (clamped / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const hoverPercentage = (mouseY / rect.height) * 100;
    const clamped = Math.max(0, Math.min(100, hoverPercentage));
    setHoverTime((clamped / 100) * duration);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration <= 0) return;
    setIsDragging(true);
    e.preventDefault();
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const percentage = (mouseY / rect.height) * 100;
    const clamped = Math.max(0, Math.min(100, percentage));
    const newTime = (clamped / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlayWhenInView = () => {
      if (!videoRef.current || !isIntersectingRef.current || !autoPlay || !videoRef.current.paused)
        return;
      const v = videoRef.current;
      if (v.readyState >= 2) {
        v.play().catch(() => {});
      } else {
        const onCanPlay = () => {
          v.removeEventListener("canplay", onCanPlay);
          if (
            videoRef.current === v &&
            isIntersectingRef.current &&
            autoPlay &&
            v.paused
          ) {
            v.play().catch(() => {});
          }
        };
        v.addEventListener("canplay", onCanPlay, { once: true });
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (videoRef.current?.paused && autoPlay) tryPlayWhenInView();
        } else if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      },
      { threshold: 0.5, rootMargin: "0px" }
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      isIntersectingRef.current = false;
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close();
      }
      audioContextRef.current = null;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      const v = videoRef.current;
      if (v) v.pause();
    };
  }, [autoPlay]);

  const handleToggleMute = async () => {
    if (!videoRef.current) return;

    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (!newMutedState) {
      if (!audioContextRef.current) {
        await initAudioAnalyser();
      }

      videoRef.current.muted = false;

      if (videoRef.current.paused) {
        try {
          await videoRef.current.play();
        } catch {
          return;
        }
      }

      if (
        audioContextRef.current &&
        audioContextRef.current.state === "suspended"
      ) {
        await audioContextRef.current.resume();
      }

      if (audioContextRef.current?.state !== "running") {
        return;
      }

      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = 1;
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      analyzeAudio();
    } else {
      if (audioContextRef.current) {
      } else {
        videoRef.current.muted = true;
      }

      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = 0;
      }

      if (polylineRef.current) {
        polylineRef.current.setAttribute(
          "points",
          createInitialDefaultPolyline()
        );
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hideElements || hideControlsOnHover) return;
    if (!showControls) return;

    e.stopPropagation();
    if ((e.target as Element)?.closest(".video-player--audio")) {
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
    } else {
      void v.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  /** Suit la souris adoucie (MouseHelper) comme sur le site RM. */
  const tickPlayPausePosition = useCallback(() => {
    if (!playPauseButtonRef.current || !videoPlayerRef.current) return;
    const easeSlowX = MouseHelper.easeSlowX;
    const easeSlowY = MouseHelper.easeSlowY;
    const rect = videoPlayerRef.current.getBoundingClientRect();
    const mouseX = easeSlowX - rect.left;
    const mouseY = easeSlowY - rect.top;
    const bw = playPauseButtonRef.current.offsetWidth / 2;
    const bh = playPauseButtonRef.current.offsetHeight / 2;
    playPauseButtonRef.current.style.transform = `translate(${mouseX - bw}px, ${mouseY - bh}px)`;
  }, []);

  const handlePlayerMouseEnter = useCallback(() => {
    if (hideElements || hideControlsOnHover) return;
    if (!showControls || isMobile) return;
    if (playPauseButtonRef.current) {
      playPauseButtonRef.current.style.opacity = "1";
      gsap.ticker.add(tickPlayPausePosition);
    }
  }, [showControls, isMobile, tickPlayPausePosition, hideElements, hideControlsOnHover]);

  const handlePlayerMouseLeave = useCallback(() => {
    if (hideElements || hideControlsOnHover) return;
    if (!showControls || isMobile) return;
    if (playPauseButtonRef.current) {
      playPauseButtonRef.current.style.opacity = "0";
      gsap.ticker.remove(tickPlayPausePosition);
    }
  }, [showControls, isMobile, tickPlayPausePosition, hideElements, hideControlsOnHover]);

  useEffect(() => {
    if (isMobile) return;
    const mouseTick = () => {
      MouseHelper.tick();
    };
    gsap.ticker.add(mouseTick);
    return () => {
      gsap.ticker.remove(mouseTick);
    };
  }, [isMobile]);

  useEffect(() => {
    return () => {
      gsap.ticker.remove(tickPlayPausePosition);
    };
  }, [tickPlayPausePosition]);

  useEffect(() => {
    const el = playPauseButtonRef.current;
    if (!el || !showControls) return;
    if (isTimelineHovered) {
      el.style.opacity = "0";
    } else {
      const section = document.querySelector(".video-player");
      if (section) {
        const rect = section.getBoundingClientRect();
        const mouseX = MouseHelper.easeSlowX;
        const mouseY = MouseHelper.easeSlowY;
        if (
          mouseX >= rect.left &&
          mouseX <= rect.right &&
          mouseY >= rect.top &&
          mouseY <= rect.bottom
        ) {
          el.style.opacity = "1";
        }
      }
    }
  }, [isTimelineHovered, showControls, hideControlsOnHover, hideElements]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging || !videoRef.current || duration <= 0) return;
      const timelineElement = document.querySelector(
        ".timeline-drag-area"
      ) as HTMLDivElement;
      if (!timelineElement) return;
      const rect = timelineElement.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const percentage = (mouseY / rect.height) * 100;
      const clamped = Math.max(0, Math.min(100, percentage));
      const newTime = (clamped / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    };
    const onUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    }
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, duration]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = 0.4;
  }, []);

  useEffect(() => {
    if (initialTime !== undefined && initialTime > 0 && videoRef.current) {
      const video = videoRef.current;
      const setTime = () => {
        if (video.readyState >= 2) {
          video.currentTime = initialTime;
          setCurrentTime(initialTime);
        }
      };
      if (video.readyState >= 2) {
        setTime();
      } else {
        video.addEventListener("loadeddata", setTime, { once: true });
        return () => video.removeEventListener("loadeddata", setTime);
      }
    }
  }, [initialTime]);

  if (!videoUrl) return null;

  return (
    <div
      ref={videoPlayerRef}
      className={cn(
        "video-player max-h-dvh relative bg-primary-black",
        showControls ? "cursor-none" : "cursor-default",
        hideElements && "cursor-auto",
        className
      )}
      onMouseEnter={
        showControls && !isMobile ? handlePlayerMouseEnter : undefined
      }
      onMouseLeave={
        showControls && !isMobile ? handlePlayerMouseLeave : undefined
      }
      onClick={showControls ? handleClick : undefined}
    >
      {/* Vidéo en premier dans le DOM : les contrôles absolus se superposent au-dessus (même logique que RM, évite que la vidéo capte les clics). */}
      <video
        ref={videoRef}
        className={cn(
          "relative z-0 w-full object-cover pointer-events-none",
          videoClassName
        )}
        style={{ pointerEvents: "none" }}
        autoPlay={autoPlay}
        playsInline
        muted={isMuted}
        loop={loop}
        crossOrigin="anonymous"
        onPlay={async () => {
          setIsPlaying(true);
          hasTriggeredOnEnded.current = false;
          if (grayscale) {
            gsap.to(videoPlayerRef.current, {
              filter: "grayscale(0%)",
              duration: 0.4,
              ease: "power2.out",
            });
          }
          if (!isMuted && !audioContextRef.current) {
            await initAudioAnalyser();
            if (gainNodeRef.current) {
              gainNodeRef.current.gain.value = 1;
            }
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            analyzeAudio();
          }
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadStart={() => {}}
        onCanPlay={() => {}}
        onError={() => {}}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {showTimeline && showControls && (
        <div
          className={cn(
            "video-player--timeline flex gap-8 absolute left-12 md:left-0 md:pl-24 items-center top-1/2 -translate-y-1/2 z-[4] h-full cursor-pointer transition-opacity duration-600",
            hideElements && "opacity-0"
          )}
          onMouseEnter={() => setIsTimelineHovered(true)}
          onMouseLeave={() => {
            setHoverTime(null);
            setIsTimelineHovered(false);
          }}
        >
          <div className="flex flex-col items-center h-[27rem]">
            <div
              className={cn(
                "block md:hidden transition-opacity duration-200",
                !isMobile &&
                  (isTimelineHovered || showPlayButton === false) &&
                  "opacity-0"
              )}
            >
              {isPlaying ? <PauseGlyph /> : <PlayGlyph />}
            </div>
            <div
              className={cn(
                "timeline-drag-area w-8 h-full relative cursor-pointer flex justify-center",
                isDragging && "cursor-grabbing"
              )}
              onClick={!isDragging ? handleTimelineClick : undefined}
              onMouseMove={handleTimelineMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={() => setIsDragging(false)}
            >
              <div className="w-[1.5px] h-full bg-white/30 hover:bg-white/50 transition-colors duration-200">
                <div
                  className="w-[1.5px] bg-white absolute top-0 transition-all duration-150 ease-linear"
                  style={{ height: `${progressPercentage}%` } as CSSProperties}
                />
              </div>
              {(hoverTime !== null || isDragging) && duration > 0 && (
                <div
                  className={cn(
                    "absolute left-12 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10",
                    isDragging && "bg-white text-black"
                  )}
                  style={{
                    top: `${((hoverTime ?? currentTime) / duration) * 100}%`,
                    transform: "translateY(-50%)",
                  }}
                >
                  {formatTime(hoverTime ?? currentTime)}
                </div>
              )}
            </div>
          </div>
          <div className="text-8 font-rm-mono text-white font-medium -rotate-90 h-fit origin-center -translate-x-34">
            {formatTime(currentTime)} - {formatTime(duration)}
          </div>
        </div>
      )}

      {showAudioWaveform && showControls && (
        <button
          type="button"
          className={cn(
            "video-player--audio pointer-events-auto absolute h-full top-1/2 -translate-y-1/2 p-24 pr-12 cursor-pointer right-0 z-10 transition-opacity duration-600 w-[70px]",
            hideElements && "opacity-0 pointer-events-none"
          )}
          aria-label={labels.toggleAudio}
          onClick={e => {
            e.stopPropagation();
            void handleToggleMute();
          }}
          onMouseEnter={() => handlePlayerMouseLeave()}
          onMouseLeave={() => handlePlayerMouseEnter()}
        >
          <div className="-rotate-90">
            <svg width="70" height="10" aria-hidden>
              <polyline
                ref={polylineRef}
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                points={polyPoints}
              />
            </svg>
          </div>
        </button>
      )}

      {showControls ? (
        <div
          className={cn(
            "absolute w-full h-full top-0 left-0 pointer-events-none z-[12] transition-opacity duration-600",
            (hideElements || hideControlsOnHover) &&
              "opacity-0 pointer-events-none"
          )}
        >
          <div
            ref={playPauseButtonRef}
            className={cn(
              "w-fit hidden md:flex h-fit opacity-0 absolute left-0 top-0 pointer-events-none flex-col items-center justify-center transition-opacity duration-300",
              isTimelineHovered && "opacity-0"
            )}
          >
            {isPlaying ? (
              <PauseGlyph className="text-white" />
            ) : (
              <PlayGlyph className="text-white" />
            )}
            <span className="font-small uppercase font-rm-mono text-white font-medium">
              {isPlaying ? labels.pause : labels.play}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default VideoPlayer;
