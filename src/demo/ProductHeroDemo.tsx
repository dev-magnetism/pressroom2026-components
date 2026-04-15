import { ProductHero } from "@/components/ProductHero/ProductHero";

/** Média RM (équivalent décodé du lien /_next/image …w=1920… du build Netlify). */
const PRODUCT_HERO_IMAGE =
  "https://staging-media.richardmille.com/f/337605/1780x1378/7385feb474/rm_88_smiley_6h.png";

export function ProductHeroDemo() {
  return (
    <div className="w-full bg-neutral-200">
      <ProductHero
        title="RM 67-01"
        subhead="Automatic extra-flat"
        backgroundColorFrom="#5c1a1a"
        imageFilename={PRODUCT_HERO_IMAGE}
        imageAlt="RM 88 Smiley"
        imageMobileFilename={PRODUCT_HERO_IMAGE}
        imageMobileAlt="RM 88 Smiley"
      />
    </div>
  );
}
