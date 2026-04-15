/** Redimensionnement via le service Storyblok (sans Next Image). */
export function storyblokImageSrc(
  filename: string | undefined | null,
  width: number
): string {
  if (!filename) return "";
  if (!filename.includes("storyblok.com")) return filename;
  try {
    const u = new URL(filename);
    const path = u.pathname.replace(/^\//, "");
    return `https://img2.storyblok.com/filters:format(webp):quality(75):${width}x0/${path}`;
  } catch {
    return filename;
  }
}
