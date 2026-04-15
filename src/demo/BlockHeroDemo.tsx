import { BlockHero } from "@/components/BlockHero/BlockHero";

/** Média RM (équivalent décodé du lien /_next/image …w=1920… du build Netlify). */
const BLOCK_HERO_IMAGE =
  "https://staging-media.richardmille.com/f/337605/1780x1378/7385feb474/rm_88_smiley_6h.png";

export function BlockHeroDemo() {
  return (
    <div className="w-full bg-neutral-200">
      {/* Props BlockHero: title*; subhead*; backgroundColorFrom*; imageFilename?; imageAlt?; imageMobileFilename?; imageMobileAlt?; hasCharacteristics? (défaut false); onCharacteristicsClick?; labels? ({ characteristics?: string }). */}
      <BlockHero
        title="RM 67-01"
        subhead="Automatic extra-flat"
        backgroundColorFrom="#5c1a1a"
        imageFilename={BLOCK_HERO_IMAGE}
        imageAlt="RM 88 Smiley"
        imageMobileFilename={BLOCK_HERO_IMAGE}
        imageMobileAlt="RM 88 Smiley"
      />
    </div>
  );
}
