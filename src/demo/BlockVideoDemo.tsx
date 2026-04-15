import BlockVideo from "@/components/BlockVideo/BlockVideo";

const VIDEO_URL =
  "https://media.richardmille.com/wp-content/uploads/2024/10/07152243/MCLarenXRM_NeuralOverdrive_LONG_1_1.mp4.mp4";

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
