/** Utilise l’URL Storyblok telle quelle (pas d’optimisation Next Image). */
export function mediaUrl(filename: string | undefined | null): string | undefined {
  if (!filename) return undefined;
  return filename;
}
