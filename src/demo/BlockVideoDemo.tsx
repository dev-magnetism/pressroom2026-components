import BlockVideo from "@/components/BlockVideo/BlockVideo";

const VIDEO_URL = "/video-test.mp4";

export function BlockVideoDemo() {
  return (
    <div className="w-full">
      <BlockVideo
        videoUrl={VIDEO_URL}
        videoUrlMobile={VIDEO_URL}
        eagerLoad
      />
    </div>
  );
}
