import { useMemo } from "react";
import { ProductHero } from "@/components/ProductHero/ProductHero";
import type { HeroVariationData } from "@/components/ProductHero/types";

/** Média RM (équivalent décodé du lien /_next/image …w=1920… du build Netlify). */
const PRODUCT_HERO_IMAGE =
  "https://staging-media.richardmille.com/f/337605/1780x1378/7385feb474/rm_88_smiley_6h.png";

const MOCK_VARIATIONS: HeroVariationData[] = [
  {
    id: "v1",
    title: "RM 67-01",
    subhead: "Automatic extra-flat",
    backgroundColorFrom: "#5c1a1a",
    image: {
      filename: PRODUCT_HERO_IMAGE,
      alt: "RM 88 Smiley",
    },
    imageMobile: {
      filename: PRODUCT_HERO_IMAGE,
      alt: "RM 88 Smiley",
    },
  },
  {
    id: "v2",
    title: "RM 67-01 Ti",
    subhead: "Titane — variation",
    backgroundColorFrom: "#1a3d5c",
    image: {
      filename: PRODUCT_HERO_IMAGE,
      alt: "RM 88 Smiley",
    },
  },
  {
    id: "v3",
    title: "RM 67-01 Or",
    subhead: "Or rose",
    backgroundColorFrom: "#4a3728",
    image: {
      filename: PRODUCT_HERO_IMAGE,
      alt: "RM 88 Smiley",
    },
  },
];

export function ProductHeroDemo() {
  const variations = useMemo(() => MOCK_VARIATIONS, []);

  return (
    <div className="w-full bg-neutral-200">
      <ProductHero variations={variations} />
    </div>
  );
}
