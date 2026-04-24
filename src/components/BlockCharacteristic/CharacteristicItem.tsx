import { cn } from "@/lib/cn";
import { renderTextWithLineBreaks } from "@/lib/textLineBreaks";
import styles from "./BlockCharacteristic.module.css";

export type CharacteristicItemData = {
  title: string;
  /** Liste de contenus du groupe (format attendu pour la démo standalone). */
  contentItems?: string[];
  /** Texte simple; ignoré si descriptionHtml est fourni. */
  description?: string;
  /** HTML optionnel pour reproduire un contenu riche type CMS. */
  descriptionHtml?: string;
  full?: boolean;
};

type CharacteristicItemProps = {
  item: CharacteristicItemData;
  className?: string;
};

const CharacteristicItem: React.FC<CharacteristicItemProps> = ({
  item,
  className,
}) => {
  return (
    <div
      data-characteristic-item
      className={cn(item.full ? "col-span-full" : "", className)}
    >
      <div className="w-full">
        <span className="label-large font-bold uppercase inline-block mb-16">
          {renderTextWithLineBreaks(item.title)}
        </span>
      </div>

      {item.contentItems && item.contentItems.length > 0 ? (
        <div
          className={cn(
            "label-large !normal-case font-[400] font-rm-mono text-primary-black/50",
            styles.richText
          )}
        >
          <ul>
            {item.contentItems.map((contentItem, index) => (
              <li key={`${item.title}-${index}`}>
                {renderTextWithLineBreaks(contentItem)}
              </li>
            ))}
          </ul>
        </div>
      ) : item.descriptionHtml ? (
        <div
          className={cn(
            "label-large !normal-case font-[400] font-rm-mono text-primary-black/50",
            styles.richText
          )}
          dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
        />
      ) : item.description ? (
        <p
          className={cn(
            "label-large !normal-case font-[400] font-rm-mono text-primary-black/50",
            styles.richText
          )}
        >
          {renderTextWithLineBreaks(item.description)}
        </p>
      ) : null}
    </div>
  );
};

export default CharacteristicItem;
