import { BlockEdito } from "@/components/BlockEdito/BlockEdito";

/** Shared test asset (Next image optimizer URL from develop preview). */
const IMG_DEMO =
  "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fstaging-media.richardmille.com%2Ff%2F337605%2F1080x1540%2F6d9c36ff02%2F63-02.jpg&w=1080&q=75";

const BODY =
  "Standalone editorial block: title, subtitle, and body as plain text (line breaks via `\\n` are preserved).\n\nEach `imageType` follows the RM grid; `imagePosition` controls left/right swap or center alignment (wide variant).";

/**
 * {@link BlockEdito} usage examples (props mirror Storyblok `block_edito`, no CMS dependency).
 */
export function BlockEditoDemo() {
  return (
    <div className="w-full bg-neutral-100">
      {/* vertical + image on the right */}
      <BlockEdito
        imageType="vertical"
        imagePosition="right"
        title="Vertical — image on the right"
        subtitle="Uppercase subtitle"
        content={BODY}
        imageUrl={IMG_DEMO}
        imageAlt="Watch movement — CRMA4 detail"
      />

      {/* wide + centered copy */}
      <BlockEdito
        imageType="wide"
        imagePosition="center"
        title="Wide — centered title"
        subtitle="Centered subtitle"
        content={BODY}
        imageUrl={IMG_DEMO}
        imageAlt="Watch movement — CRMA4 detail"
      />

      {/* square + image on the right */}
      <BlockEdito
        imageType="square"
        imagePosition="right"
        title="Square"
        subtitle="Square layout"
        content={BODY}
        imageUrl={IMG_DEMO}
        imageAlt="Watch movement — CRMA4 detail"
      />

      {/* horizontal */}
      <BlockEdito
        imageType="horizontal"
        imagePosition="left"
        title="Horizontal — long headline to exercise line breaks"
        subtitle="Subtitle"
        content={BODY}
        imageUrl={IMG_DEMO}
        imageAlt="Watch movement — CRMA4 detail"
      />

      {/* No image: text only (deferred load or missing asset) */}
      <BlockEdito
        imageType="vertical"
        title="Text only"
        content={
          "No `imageUrl`: the block stays readable with the text column only.\n\nUseful for conditional layouts in the host app."
        }
      />
    </div>
  );
}
