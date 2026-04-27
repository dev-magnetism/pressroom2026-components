export type BlockEditoImageType =
  | "vertical"
  | "wide"
  | "square"
  | "horizontal";

export type BlockEditoImagePosition = "left" | "right" | "center";

export type BlockEditoProps = {
  /** Variante de grille (équivalent Storyblok `image_type`). */
  imageType: BlockEditoImageType;
  /** Alignement / inversion (équivalent `image_position`). */
  imagePosition?: BlockEditoImagePosition;
  title?: string;
  subtitle?: string;
  /** Texte principal ; les `\n` deviennent des sauts de ligne. */
  content?: string;
  /** Image principale (remplace le média Storyblok). */
  imageUrl?: string;
  imageAlt?: string;
  /** Couleur de fond de la section (valeur CSS). */
  backgroundColor?: string;
  /** Couleur de texte du bloc (valeur CSS). */
  textColor?: string;
  className?: string;
};
