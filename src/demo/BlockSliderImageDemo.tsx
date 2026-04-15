import BlockSliderImage from "@/components/BlockSliderImage/BlockSliderImage";

const SLIDES = [
  {
    filename:
      "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fstaging-media.richardmille.com%2Ff%2F337605%2F1538x860%2F98f02803cd%2Fdidier1.jpg&w=1200&q=75",
    alt: "RM 30-01 Le Mans Classic — visuel 1",
    caption: "Case study",
    captionColor: "black" as const,
  },
  {
    filename:
      "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fbo.richardmille.com%2Fwp-content%2Fuploads%2F2025%2F06%2F30LMC2.jpg&w=2048&q=75",
    alt: "RM 30-01 Le Mans Classic — visuel 2",
    caption: "Movement details",
    captionColor: "white" as const,
  },
  {
    filename:
      "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fbo.richardmille.com%2Fwp-content%2Fuploads%2F2025%2F06%2F30LMC3.jpg&w=2048&q=75",
    alt: "RM 30-01 Le Mans Classic — visuel 3",
    caption: "Final assembly",
    captionColor: "white" as const,
  },
];

const DESCRIPTION =
  "<p>The RM 30-01 Le Mans Classic proudly wears its racing spirit inside and out, just like the classic racing event honours the centenary old iconic race.</p>";

export function BlockSliderImageDemo() {
  return (
    <div className="w-full">
      {/* Props BlockSliderImage: title*; images* (SliderImageAsset[] avec filename?, alt?, focus?, caption?, captionColor? "black" | "white"); backgroundColor?; textColor?; subtitle?; description? (HTML); imagesSize? ("auto" | "default", défaut "default"); rtl? (défaut false); contentId? (défaut "block-slider-image"); className?. */}
      <BlockSliderImage
        backgroundColor="#111111"
        textColor="#F5F5F5"
        subtitle=""
        title="A shared passion on the track"
        description={DESCRIPTION}
        images={SLIDES}
        imagesSize="auto" // "auto" pour conserver le ratio des images ; "default" pour ratio 
        contentId="demo-slider-lmc"
      />
    </div>
  );
}
