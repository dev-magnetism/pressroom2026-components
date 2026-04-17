import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import styles from "./KeyFigures.module.css";

export type KeyFigureItem = {
  /** Sous-titre (12px, mono, gris clair). */
  subtitle: string;
  /** Chiffre marquant (128px, mono, noir). */
  figure: string;
  /** Description (13px, mono, noir). */
  description: string;
};

export type KeyFiguresProps = {
  /** 1 à 4 entrées ; au-delà, seules les 4 premières sont affichées. */
  items: KeyFigureItem[];
  className?: string;
  /** Quand `true`, supprime le padding vertical haut de la section (utile pour enchaîner plusieurs blocs). */
  omitPaddingTop?: boolean;
  /** Couleur de fond (CSS : `#fff`, `rgb()`, `var(--token)`, etc.). */
  backgroundColor?: string;
  /** Couleur du texte (chiffre + description + teinte du sous-titre, avec opacité réduite sur le sous-titre). */
  textColor?: string;
};

const MAX_ITEMS = 4;

export function KeyFigures({
  items,
  className,
  omitPaddingTop = false,
  backgroundColor,
  textColor,
}: KeyFiguresProps) {
  const slice = items.slice(0, MAX_ITEMS).filter(
    item =>
      item.subtitle?.trim() ||
      item.figure?.trim() ||
      item.description?.trim()
  );

  if (slice.length === 0) return null;

  const count = slice.length;
  const gridCols =
    count === 1
      ? "grid-cols-1"
      : count === 2
        ? "grid-cols-1 md:grid-cols-2"
        : count === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  const gridWrap =
    count === 1
      ? "mx-auto w-full max-w-[min(100%,36rem)] sm:max-w-[min(100%,44rem)]"
      : count === 2
        ? "mx-auto w-full max-w-[min(100%,90rem)] md:max-w-[min(100%,110rem)]"
        : count === 3
          ? "mx-auto w-full max-w-[min(100%,112rem)] lg:max-w-[min(100%,2200px)]"
          : "mx-auto w-full max-w-[min(100%,120rem)] lg:max-w-[min(100%,2800px)]";

  /** Sous `sm` (820px) : ~6rem entre lignes ; à partir de md : ~200px ; 4 colonnes : gap-x un peu plus serré en lg pour libérer la largeur utile. */
  const gridGap =
    count === 4
      ? "gap-x-10 gap-y-60 sm:gap-x-12 sm:gap-y-36 md:gap-x-[200px] md:gap-y-[200px] lg:gap-x-[160px] lg:gap-y-[200px]"
      : "gap-x-10 gap-y-60 sm:gap-x-12 sm:gap-y-36 md:gap-x-[200px] md:gap-y-[200px]";

  const sectionPadding = omitPaddingTop
    ? "px-10 pt-0 pb-60 sm:px-12 sm:pb-36 md:px-32 md:pt-0 md:pb-[102px]"
    : "px-10 py-60 sm:px-12 sm:py-36 md:px-32 md:py-[102px]";

  const surfaceStyle: CSSProperties | undefined =
    backgroundColor != null || textColor != null
      ? ({
          ...(backgroundColor != null && { "--kf-bg": backgroundColor }),
          ...(textColor != null && { "--kf-fg": textColor }),
        } as CSSProperties)
      : undefined;

  return (
    <section
      className={cn(
        "s-key-figures w-full overflow-x-hidden",
        styles.root,
        sectionPadding,
        className
      )}
      style={surfaceStyle}
    >
      <div className={cn(gridWrap, "grid min-w-0", gridGap, gridCols)}>
        {slice.map((item, index) => (
          <article key={`${item.figure}-${index}`} className={styles.item}>
            {item.subtitle?.trim() ? (
              <p className={styles.subtitle}>{item.subtitle.trim()}</p>
            ) : null}
            {item.figure?.trim() ? (
              <p className={styles.figure}>{item.figure.trim()}</p>
            ) : null}
            {item.description?.trim() ? (
              <p className={styles.description}>{item.description.trim()}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export default KeyFigures;
