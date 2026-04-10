import BlockTextImage from "@/components/BlockTextImage/BlockTextImage";

const IMG_A =
  "https://media.richardmille.com/wp-content/uploads/2022/09/22120100/baseplate34.jpg";
const IMG_B =
  "https://staging-media.richardmille.com/f/337605/1780x1378/7385feb474/rm_88_smiley_6h.png";

const DESC =
  "The baseplate anchors the movement architecture: stiffness, alignment, and finishing tolerances are defined here, before any complication layers are assembled.\n\nEach surface is machined and inspected to preserve the mechanical integrity required under dynamic loads.";

export function BlockTextImageDemo() {
  return (
    <div className="w-full bg-neutral-100">
      {/* Texte à gauche, image à droite (image_left = false) */}
      <BlockTextImage
        imageLeft={false}
        title="Mechanical foundation"
        description={DESC}
        bigImageUrl={IMG_A}
        bigImageAlt="Baseplate"
      />

      {/* Inverse : image à gauche, texte à droite (image_left = true) */}
      <BlockTextImage
        imageLeft
        title="Product presence"
        description="A dedicated visual language supports the technical narrative: contrast, proportion, and material rhythm are tuned for clarity on every viewport size.\n\nThe composition balances density and breathing room so the object remains legible at a glance."
        bigImageUrl={IMG_B}
        bigImageAlt="RM"
      />
    </div>
  );
}
