import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import styles from "./TitleText.module.css";

export type TitleTextLayout = "horizontal" | "vertical";

export type TitleTextProps = {
  /** Colonne gauche — optionnel si seul le texte suffit. */
  title?: string;
  /** Sous-titre : sous le titre en `horizontal`, au-dessus du titre en `vertical` (24px, gap 16px avec le titre). */
  subtitle?: string;
  /** Colonne droite — paragraphes séparés par des sauts de ligne (comme `BlockTextImage` `description`). */
  text: string;
  /** Fond de la section (couleur CSS). Défaut : blanc. */
  backgroundColor?: string;
  /** Couleur du texte (titre, sous-titre, corps). Défaut : `primary-black`. */
  textColor?: string;
  /** Image sous le texte : `px-20` sur mobile (comme le texte) ; à partir de `md`, 40px de marge latérale ; ratio 1360/545 sur `md+`. */
  bottomImageUrl?: string;
  bottomImageAlt?: string;
  /**
   * `horizontal` (défaut) : titre à gauche, texte à droite.
   * `vertical` : sous-titre puis titre, puis texte (centrés) ; corps limité à 780px de large.
   */
  layout?: TitleTextLayout;
  className?: string;
};

export function TitleText({
  title,
  subtitle,
  text,
  backgroundColor,
  textColor,
  bottomImageUrl,
  bottomImageAlt = "",
  layout = "horizontal",
  className,
}: TitleTextProps) {
  const paragraphs = text
    .trim()
    .split(/\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  const bodyTypographyProps = textColor
    ? { style: { color: textColor } as const }
    : { color: "primary-black" as const };
  const headingStyle = textColor ? ({ color: textColor } as const) : undefined;

  const titleTrim = title?.trim();
  const subtitleTrim = subtitle?.trim();
  const hasHead = Boolean(titleTrim || subtitleTrim);
  const bottomImageTrim = bottomImageUrl?.trim();
  const isVertical = layout === "vertical";

  const bodyTypography = (
    <Typography
      as="div"
      variant="body-medium-edito"
      {...bodyTypographyProps}
      weight="regular"
    >
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </Typography>
  );

  return (
    <section
      style={{
        ...(backgroundColor ? { backgroundColor } : {}),
      }}
      className={cn(
        "s-title-text w-full py-128",
        !backgroundColor && "bg-white",
        !textColor && "text-primary-black",
        className
      )}
    >
      <div className="px-20 md:px-32">
        {isVertical ? (
          <div className="flex flex-col items-center gap-40 md:gap-48">
            {hasHead ? (
              <div className={cn(styles.head, styles.headVertical, "w-full")}>
                {subtitleTrim ? (
                  <p className={styles.subtitle} style={headingStyle}>
                    {subtitleTrim}
                  </p>
                ) : null}
                {titleTrim ? (
                  <h2 className={styles.title} style={headingStyle}>
                    {titleTrim}
                  </h2>
                ) : null}
              </div>
            ) : null}
            <div
              className={cn(
                "body-medium-edito w-full max-w-[780px] text-center opacity-80",
                styles.description
              )}
            >
              {bodyTypography}
            </div>
          </div>
        ) : hasHead ? (
          <div className="grid grid-cols-12">
            <div className="col-span-12 mb-40 md:mb-0 md:col-span-6 md:pr-[32px] md:flex md:items-start md:justify-center">
              <div className={cn(styles.head, "px-0 md:px-[116px] md:mx-auto")}>
                {titleTrim ? (
                  <h2 className={styles.title} style={headingStyle}>
                    {titleTrim}
                  </h2>
                ) : null}
                {subtitleTrim ? (
                  <p className={styles.subtitle} style={headingStyle}>
                    {subtitleTrim}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 md:pl-[32px]">
              <div
                className={cn(
                  "body-medium-edito lg:w-5/6 opacity-80",
                  styles.description
                )}
              >
                {bodyTypography}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "body-medium-edito lg:w-5/6 opacity-80",
              styles.description
            )}
          >
            {bodyTypography}
          </div>
        )}
      </div>
      {bottomImageTrim ? (
        <div className="mt-[56px] w-full px-20 md:px-[40px]">
          <div className="w-full overflow-hidden md:aspect-[1360/545]">
            <img
              src={bottomImageTrim}
              alt={bottomImageAlt}
              className="h-auto w-full md:h-full md:object-cover"
              loading="lazy"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default TitleText;
