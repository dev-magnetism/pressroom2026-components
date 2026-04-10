/**
 * Résout un lien Storyblok ou une chaîne vers `{ url, target }` (aligné sur richardmille).
 */
export function getLinkUrl(link: unknown | string | undefined): {
  url: string;
  target: string;
} {
  let urlHref = "";
  let target = "";

  if (!link) return { url: "/", target: "" };

  if (typeof link === "string") {
    urlHref = link;
  } else if (
    link &&
    typeof link === "object" &&
    "story" in link &&
    (link as { story?: { full_slug?: string } }).story
  ) {
    urlHref = `/${(link as { story: { full_slug: string } }).story.full_slug}`;
  } else if (
    link &&
    typeof link === "object" &&
    "url" in link &&
    (link as { url?: string }).url
  ) {
    const l = link as { url: string; target?: string; cached_url?: string };
    urlHref = l.url;
    target = l.target || "";
  } else if (
    link &&
    typeof link === "object" &&
    "cached_url" in link &&
    (link as { cached_url?: string }).cached_url
  ) {
    const l = link as { cached_url: string; target?: string };
    urlHref = `/${l.cached_url}`;
    target = l.target || "";
  } else {
    urlHref = "";
  }

  if (urlHref && typeof urlHref === "string") {
    if (urlHref.includes("home")) {
      urlHref = urlHref.replace("home", "");
    } else if (urlHref.includes("/home") || urlHref.includes("/accueil")) {
      urlHref = urlHref.replace("/home", "").replace("/accueil", "");
    }
    if (urlHref.length > 1 && urlHref.endsWith("/")) {
      urlHref = urlHref.slice(0, -1);
    }
  }

  if (urlHref.startsWith("//")) {
    urlHref = urlHref.slice(1);
  }

  if (/^\/?zh-hans/.test(urlHref)) {
    urlHref = urlHref.replace("zh-hans", "cn");
  }

  return { url: urlHref, target };
}
