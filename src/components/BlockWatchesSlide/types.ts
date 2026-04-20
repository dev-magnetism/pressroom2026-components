/**
 * Slide pour `BlockWatchesSlide` (structure plate).
 * `_uid` / `full_slug` optionnels (ex. presse sans CTA ni routage Storyblok).
 * Pour une entrée Storyblok imbriquée, normaliser en aplatissant `content` côté intégration.
 */
export type WatchesSlideItem = {
  _uid?: string;
  full_slug?: string;
  name: string;
  subtitle?: string;
  /** Petite image (miniature / carte). */
  product_image?: { filename?: string; alt?: string };
  /**
   * Grande image demi-écran gauche quand `heroImagePerSlide` est activé.
   * Si absent : repli sur `product_image`.
   */
  hero_image?: { filename?: string; alt?: string };
  /** Variante page produit Storyblok */
  hero?: { subhead?: string }[];
  /** Légende (panneau blanc, colonne texte, etc.). Si absent ou vide : rien n’est affiché. */
  models_label?: string;
};

/** Clé stable pour React / motion (repli si pas d’`_uid`). */
export function watchesSlideItemKey(
  item: WatchesSlideItem,
  index: number
): string {
  return item._uid ?? `slide-${index}-${item.name.replace(/\s+/g, "-")}`;
}
