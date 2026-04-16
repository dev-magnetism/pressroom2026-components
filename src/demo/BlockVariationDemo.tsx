import BlockVariation, {
  type VariationElement,
} from "@/components/BlockVariation/BlockVariation";

const VARIATIONS: VariationElement[] = [
  {
    id: "rm-75-01-blue-sapphire",
    name: "RM 75-01 Flying Tourbillon",
    variationName: "Blue sapphire",
    subtitle: "Blue Sapphire",
    image: {
      filename:
        "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fstaging-media.richardmille.com%2Ff%2F337605%2F3000x2322%2Ffd95b9d123%2Frm_75-01_blue_sapphire_6h.png&w=3840&q=75",
      alt: "RM 75-01 Flying Tourbillon Blue Sapphire",
    },
    thumbnail: {
      filename:
        "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fstaging-media.richardmille.com%2Ff%2F337605%2F2532x1960%2Fa24e96a17e%2Frm_75-01_blue_sapphire_close_up.png&w=750&q=75",
      alt: "RM 75-01 Blue Sapphire close-up",
    },
    gallery: [
      {
        id: "rm-75-01-blue-1",
        filename:
          "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fstaging-media.richardmille.com%2Ff%2F337605%2F3000x2322%2Ffd95b9d123%2Frm_75-01_blue_sapphire_6h.png&w=3840&q=75",
        alt: "RM 75-01 Blue Sapphire - view 1",
      },
    ],
  },
  {
    id: "rm-75-01-clear-sapphire",
    name: "RM 75-01 Flying Tourbillon",
    variationName: "Clear sapphire",
    subtitle: "Clear Sapphire",
    image: {
      filename:
        "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fstaging-media.richardmille.com%2Ff%2F337605%2F3000x2322%2Ffd95b9d123%2Frm_75-01_blue_sapphire_6h.png&w=3840&q=75",
      alt: "RM 75-01 Flying Tourbillon Clear Sapphire",
    },
    thumbnail: {
      filename:
        "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fstaging-media.richardmille.com%2Ff%2F337605%2F2532x1960%2Fa24e96a17e%2Frm_75-01_blue_sapphire_close_up.png&w=750&q=75",
      alt: "RM 75-01 Clear Sapphire close-up",
    },
    gallery: [
      {
        id: "rm-75-01-clear-1",
        filename:
          "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fstaging-media.richardmille.com%2Ff%2F337605%2F3000x2322%2Ffd95b9d123%2Frm_75-01_blue_sapphire_6h.png&w=3840&q=75",
        alt: "RM 75-01 Clear Sapphire - view 1",
      },
    ],
  },
  {
    id: "rm-75-01-lilac-sapphire",
    name: "RM 75-01 Flying Tourbillon",
    variationName: "Lilac sapphire",
    subtitle: "Lilac Sapphire",
    image: {
      filename:
        "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fstaging-media.richardmille.com%2Ff%2F337605%2F3000x2322%2Ffd95b9d123%2Frm_75-01_blue_sapphire_6h.png&w=3840&q=75",
      alt: "RM 75-01 Flying Tourbillon Lilac Sapphire",
    },
    thumbnail: {
      filename:
        "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fstaging-media.richardmille.com%2Ff%2F337605%2F2532x1960%2Fa24e96a17e%2Frm_75-01_blue_sapphire_close_up.png&w=750&q=75",
      alt: "RM 75-01 Lilac Sapphire close-up",
    },
    gallery: [
      {
        id: "rm-75-01-lilac-1",
        filename:
          "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fstaging-media.richardmille.com%2Ff%2F337605%2F3000x2322%2Ffd95b9d123%2Frm_75-01_blue_sapphire_6h.png&w=3840&q=75",
        alt: "RM 75-01 Lilac Sapphire - view 1",
      },
    ],
  },
];

export function BlockVariationDemo() {
  return (
    <BlockVariation
      surtitle="Variations"
      variations={VARIATIONS}
      labels={{
        viewMore: "View more",
        back: "Back",
        prev: "Previous",
        next: "Next",
      }}
    />
  );
}
