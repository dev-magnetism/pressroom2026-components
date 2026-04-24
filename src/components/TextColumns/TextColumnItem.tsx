import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { renderTextWithLineBreaks } from "@/lib/textLineBreaks";
import styles from "./TextColumns.module.css";

export type TextColumnItemData = {
  id?: string;
  title?: string;
  /** Texte brut ; les sauts de ligne (`\n`) sont rendus en `<br />`. */
  description?: string;
  /** HTML optionnel (contenu CMS de confiance). */
  descriptionHtml?: string;
};

type TextColumnItemProps = {
  item: TextColumnItemData;
  className?: string;
};

export function TextColumnItem({ item, className }: TextColumnItemProps) {
  const html = item.descriptionHtml?.trim();
  const plain = item.description?.trim();

  return (
    <div className={cn(styles.container, className)}>
      {item.title?.trim() ? (
        <Typography
          as="h3"
          variant="title-xsmall"
          className={styles.cardTitle}
        >
          {renderTextWithLineBreaks(item.title.trim())}
        </Typography>
      ) : null}
      {html ? (
        <div
          className={cn(
            "body-medium font-rm-mono [&_p]:m-0",
            styles.cardBody
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : plain ? (
        <div
          className={cn(
            "body-medium font-rm-mono space-y-12",
            styles.cardBody
          )}
        >
          {renderTextWithLineBreaks(plain)}
        </div>
      ) : null}
    </div>
  );
}
