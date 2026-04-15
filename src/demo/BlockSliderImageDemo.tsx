import BlockSliderImage from "@/components/BlockSliderImage/BlockSliderImage";

const SLIDES = [
  {
    filename:
      "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fbo.richardmille.com%2Fwp-content%2Fuploads%2F2025%2F06%2F30LMC1.jpg&w=2048&q=75",
    alt: "RM 30-01 Le Mans Classic — visuel 1",
  },
  {
    filename:
      "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fbo.richardmille.com%2Fwp-content%2Fuploads%2F2025%2F06%2F30LMC2.jpg&w=2048&q=75",
    alt: "RM 30-01 Le Mans Classic — visuel 2",
  },
  {
    filename:
      "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fbo.richardmille.com%2Fwp-content%2Fuploads%2F2025%2F06%2F30LMC3.jpg&w=2048&q=75",
    alt: "RM 30-01 Le Mans Classic — visuel 3",
  },
];

const DESCRIPTION =
  "<p>The RM 30-01 Le Mans Classic proudly wears its racing spirit inside and out, just like the classic racing event honours the centenary old iconic race.</p>";

export function BlockSliderImageDemo() {
  return (
    <div className="w-full">
      {/* Props BlockSliderImage: title*; images* (SliderImageAsset[]); subtitle?; description? (HTML); imagesSize? ("auto" | "default", défaut "default"); rtl? (défaut false); contentId? (défaut "block-slider-image"); className?. */}
      <BlockSliderImage
        subtitle="RM 30-01 Le Mans Classic"
        title="A shared passion on the track"
        description={DESCRIPTION}
        images={SLIDES}
        imagesSize="auto"
        contentId="demo-slider-lmc"
      />
    </div>
  );
}
