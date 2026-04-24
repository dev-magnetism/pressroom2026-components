import { Fragment, type ReactNode } from "react";

/**
 * Remplace les retours à la ligne (`\n`, `\r\n`) par des `<br />`.
 * Le texte reste en nœuds texte (pas d’HTML injecté).
 */
export function renderTextWithLineBreaks(text: string): ReactNode {
  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {line}
    </Fragment>
  ));
}
