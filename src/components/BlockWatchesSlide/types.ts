/** Entrée slide unifiée (produit ou lien custom), comme après normalisation côté RM. */
export type WatchesSlideItem = {
  _uid: string;
  full_slug: string;
  content: {
    _uid: string;
    name: string;
    subtitle?: string;
    product_image?: { filename?: string; alt?: string };
    /** Variante page produit Storyblok */
    hero?: { subhead?: string }[];
  };
};
