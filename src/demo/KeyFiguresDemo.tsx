import KeyFigures, {
  type KeyFigureItem,
} from "@/components/KeyFigures/KeyFigures";

/** Aligné sur `TitleTextDemo` (`backgroundColor` / `textColor`). */
const DEMO_ORANGE_BG = "#E35301";
const DEMO_ORANGE_FG = "#ffffff";

const ITEMS: KeyFigureItem[] = [
  {
    subtitle: "Movement",
    figure: "480",
    description: "Components in the calibre, assembled and regulated by hand.",
  },
  {
    subtitle: "Power reserve",
    figure: "60",
    description: "Hours of autonomy with optimized barrel architecture.",
  },
  {
    subtitle: "Frequency",
    figure: "5",
    description: "Hz — high-beat chronograph precision.",
  },
  {
    subtitle: "Chronograph",
    figure: "01",
    description: "Split-seconds mechanism engineered for clarity under stress.",
  },
];

const ITEMS_3 = ITEMS.slice(0, 3);
const ITEMS_4 = ITEMS;

export function KeyFiguresDemo() {
  return (
    <div className="w-full">
      {/* Props : items* ; className? ; omitPaddingTop? ; backgroundColor? ; textColor? */}
      <KeyFigures items={ITEMS_4} />
      <KeyFigures items={ITEMS_3} omitPaddingTop />
      <KeyFigures
        items={ITEMS_4}
        backgroundColor={DEMO_ORANGE_BG}
        textColor={DEMO_ORANGE_FG}
      />
    </div>
  );
}
