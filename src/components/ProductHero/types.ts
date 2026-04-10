export type StoryblokAssetLike = {
  filename?: string;
  alt?: string;
};

/** Données minimales pour une « variation » de hero produit (hors Storyblok). */
export type HeroVariationData = {
  id: string;
  title: string;
  subhead: string;
  image?: StoryblokAssetLike;
  imageMobile?: StoryblokAssetLike;
  /** Couleur du dégradé radial (hex, ex. #8B0000) */
  backgroundColorFrom: string;
};
