import { BlockCharacteristic } from "@/components/BlockCharacteristic/BlockCharacteristic";
import type { CharacteristicItemData } from "@/components/BlockCharacteristic/CharacteristicItem";

const ITEMS: CharacteristicItemData[] = [
  {
    title: "MOVEMENT",
    contentItems: [
      "Hand-polished bevelling",
      "Microblasted milled sections",
      "Hand-drawn or polished outer faces",
      "5N gold coatings",
    ],
  },
  {
    title: "STEEL PARTS",
    contentItems: [
      "Microblasted surfaces",
      "Satin-finished surfaces",
      "Hand-polished bevelling",
      "Hand-drawn surfaces",
    ],
  },
  {
    title: "WHEELS",
    contentItems: [
      "Circular finished faces",
      "Hand-polished bevelling",
      "Sunray finishing",
      "Rhodium-plating (before cutting the teeth)",
      "Minimal corrections applied to the wheels in order to preserve geometry and performance",
    ],
  },
];

export function BlockCharacteristicDemo() {
  return (
    <div className="w-full">
      <BlockCharacteristic
        title="CHARACTERISTICS"
        column={2} // 1, 2 ou 3
        items={ITEMS}
        disableAnimation
      />
    </div>
  );
}
