import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import styles from "./TextColumns.module.css";

export type TextColumnItemData = {
  id?: string;
  title?: string;
  /** Texte brut ; paragraphes séparés par une ligne vide. */
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
          {item.title.trim()}
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
          {plain.split(/\n\n+/).map((block, i) => (
            <p key={i} className="m-0">
              {block}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
