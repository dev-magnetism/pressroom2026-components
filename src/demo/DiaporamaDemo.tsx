import Diaporama from "@/components/Diaporama/Diaporama";

const IMG_SLIDER =
  "https://staging-media.richardmille.com/f/337605/2880x1800/90e3e80b5b/images_slider.png";
const IMG_HERO =
  "https://staging-media.richardmille.com/f/337605/2880x1800/44b1c091b1/hero-text.png";
const IMG_SAPPHIRE =
  "https://staging-media.richardmille.com/f/337605/1582x1120/2bd2a4d69f/rm_sapphire_components_controls_03.png";

/** Même fichier que `BlockVideoDemo`. */
const VIDEO_RM =
  "https://media.richardmille.com/wp-content/uploads/2024/10/07152243/MCLarenXRM_NeuralOverdrive_LONG_1_1.mp4.mp4";

const ITEMS = [
  { id: "slide-1", imageUrl: IMG_SLIDER, imageAlt: "Slider" },
  {
    id: "slide-2",
    imageUrl: IMG_HERO,
    imageAlt: "McLaren × Richard Mille",
    videoUrl: VIDEO_RM,
    videoUrlMobile: VIDEO_RM,
  },
  { id: "slide-3", imageUrl: IMG_SAPPHIRE, imageAlt: "Sapphire controls" },
];

export function DiaporamaDemo() {
  return (
    <>
      <Diaporama
        items={ITEMS}
        fullWidth
        preview
        labels={{ prev: "Précédent", next: "Suivant" }}
      />
      <Diaporama
        items={ITEMS}
        fullWidth={false}
        preview={false}
        autoplayDelayMs={6000}
      />
    </>
  );
}
