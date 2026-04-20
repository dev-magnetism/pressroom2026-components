import BlockWatchesSlide from "@/components/BlockWatchesSlide/BlockWatchesSlide";
import type { WatchesSlideItem } from "@/components/BlockWatchesSlide/types";

const IMG_SLIDER =
  "https://staging-media.richardmille.com/f/337605/2880x1800/90e3e80b5b/images_slider.png";
const IMG_HERO_TEXT =
  "https://staging-media.richardmille.com/f/337605/2880x1800/44b1c091b1/hero-text.png";
const IMG_SAPPHIRE =
  "https://staging-media.richardmille.com/f/337605/1582x1120/2bd2a4d69f/rm_sapphire_components_controls_03.png";

const IMG_RM88 =
  "https://staging-media.richardmille.com/f/337605/1780x1378/7385feb474/rm_88_smiley_6h.png";
const IMG_BASEPLATE =
  "https://media.richardmille.com/wp-content/uploads/2022/09/22120100/baseplate34.jpg";

const IMG_RM75_6H =
  "https://staging-media.richardmille.com/f/337605/3000x2322/fd95b9d123/rm_75-01_blue_sapphire_6h.png";
const IMG_RM75_CLOSE =
  "https://staging-media.richardmille.com/f/337605/2532x1960/a24e96a17e/rm_75-01_blue_sapphire_close_up.png";

const IMG_DIDIER =
  "https://staging-media.richardmille.com/f/337605/1538x860/98f02803cd/didier1.jpg";
const IMG_LMC2 =
  "https://bo.richardmille.com/wp-content/uploads/2025/06/30LMC2.jpg";
const IMG_LMC3 =
  "https://bo.richardmille.com/wp-content/uploads/2025/06/30LMC3.jpg";

const BG = IMG_SLIDER;

/** 5 slides → layout desktop `WatchSliderRight` (&gt; 4). Chaque slide : `hero_image` ≠ `product_image`. */
const SLIDES: WatchesSlideItem[] = [
  {
    name: "RM 40-01",
    subtitle: "Automatic",
    hero_image: { filename: IMG_RM75_6H, alt: "RM 75-01 — 6h" },
    product_image: { filename: IMG_BASEPLATE, alt: "Baseplate" },
    models_label:
      "Ligne automatique — mouvement autochargeur, finition squelette et boîtiers aux formes organiques pensés pour le quotidien comme pour les pièces de collection.",
  },
  {
    name: "RM 67-02",
    subtitle: "Extra flat",
    hero_image: { filename: IMG_SLIDER, alt: "Slider" },
    product_image: { filename: IMG_RM88, alt: "RM 88" },
    models_label:
      "Famille extra-plate — profil minimal au poignet, ergonomie affinée et lisibilité soignée sur des cadrans aux volumes réduits, sans compromis sur la robustesse.",
  },
  {
    name: "RM 72-01",
    subtitle: "Lifestyle",
    hero_image: { filename: IMG_HERO_TEXT, alt: "Hero texte" },
    product_image: { filename: IMG_SAPPHIRE, alt: "Composants saphir" },
    /* pas de models_label → pas de légende */
  },
  {
    name: "RM 35-03",
    subtitle: "Rafael Nadal",
    hero_image: { filename: IMG_DIDIER, alt: "Le Mans Classic" },
    product_image: { filename: IMG_RM75_CLOSE, alt: "RM 75 gros plan" },
    models_label:
      "Éditions Nadal — calibres résistants aux chocs extrêmes, matériaux de haute performance et design affirmé pour suivre le rythme le plus exigeant sur le court.",
  },
  {
    name: "RM 88",
    subtitle: "Smiley",
    hero_image: { filename: IMG_LMC2, alt: "Le Mans Classic 2" },
    product_image: { filename: IMG_LMC3, alt: "Le Mans Classic 3" },
    models_label:
      "Capsule limitée — série courte, détails graphiques iconiques et finitions exclusives qui marquent une parenthèse créative au sein de la collection permanente.",
  },
];

export function BlockWatchesSlideDemo() {
  return (
    <div className="w-full">
      <BlockWatchesSlide
        keyPrefix="demo-watches-slide"
        slides={SLIDES}
        title="Collection"
      />
      <BlockWatchesSlide
        backgroundUrl={BG}
        heroImagePerSlide={false} // Si `false`, une seule image : `backgroundUrl` (inchangée au changement de slide).
        keyPrefix="demo-watches-slide-fixed-hero"
        slides={SLIDES}
        title="Grande image fixe"
      />
    </div>
  );
}
