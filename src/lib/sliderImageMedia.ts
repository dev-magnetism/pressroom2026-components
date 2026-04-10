/** Métadonnées d’image type Storyblok (filename + focus optionnel). */
export type SliderImageAsset = {
  filename?: string;
  alt?: string;
  focus?: string;
};

/** Retourne l’URL telle quelle (hébergement média géré côté CMS). */
export function getMediaUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return url;
}

export function extractImageDimensions(filename: string | undefined): {
  width: number;
  height: number;
  orientation: "landscape" | "portrait" | "square";
} | null {
  if (!filename) return null;
  const dimensionRegex = /(\d+)x(\d+)/;
  const match = filename.match(dimensionRegex);
  /** Sans segment `1234x5678` dans la chaîne (ex. URL Next/Image sans WxH dans le path), on ne devine pas l’orientation. */
  if (!match) return null;
  const width = parseInt(match[1], 10);
  const height = parseInt(match[2], 10);
  if (isNaN(width) || isNaN(height) || width === 0 || height === 0)
    return null;
  let orientation: "landscape" | "portrait" | "square";
  if (width > height) orientation = "landscape";
  else if (height > width) orientation = "portrait";
  else orientation = "square";
  return { width, height, orientation };
}

export function isImageLandscape(filename: string | undefined): boolean | null {
  const dimensions = extractImageDimensions(filename);
  return dimensions ? dimensions.orientation === "landscape" : null;
}

export function isImagePortrait(filename: string | undefined): boolean | null {
  const dimensions = extractImageDimensions(filename);
  return dimensions ? dimensions.orientation === "portrait" : null;
}

export function getFocalePercentages(image: SliderImageAsset | undefined): {
  left: number;
  top: number;
} {
  if (!image) return { left: 50, top: 50 };
  let imageFocusPercentage = { left: 50, top: 50 };
  const filename = image?.filename;
  if (filename) {
    const format = filename.match(/(\d{2,4}x\d{2,4})/g);
    if (format) {
      const focus = image?.focus?.split(":")?.[0];
      if (focus && format[0] !== focus) {
        const [left, top] = focus.split("x");
        const [width, height] = format[0].split("x");
        const focusLeft =
          (parseInt(left as string, 10) / parseInt(width as string, 10)) * 100;
        const focusTop =
          (parseInt(top as string, 10) / parseInt(height as string, 10)) * 100;
        imageFocusPercentage = { left: focusLeft, top: focusTop };
      }
    }
  }
  return imageFocusPercentage;
}
