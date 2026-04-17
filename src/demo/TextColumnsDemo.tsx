import TextColumns, {
  type TextColumnItemData,
} from "@/components/TextColumns/TextColumns";

const ITEMS_RM43: TextColumnItemData[] = [
  {
    id: "1",
    title: "BARREL PAWL WITH PROGRESSIVE RECOIL",
    description:
      "This device permits an appreciable winding gain (around 20%), especially during the start of winding. It is also helpful in ensuring an even distribution of the mainspring’s internal tension.",
  },
  {
    id: "2",
    title: "SPLINE SCREWS IN GRADE 5 TITANIUM FOR THE BRIDGES AND CASE",
    description:
      "The design of these screws permits better control of the torque applied during assembly. These screws are therefore unaffected by physical manipulation during assembly or disassembly and age well.",
  },
  {
    id: "3",
    title:
      "WINDING-BARREL TEETH AND THIRD-WHEEL PINION WITH CENTRAL INVOLUTE PROFILE",
    description:
      "The central involute profile of the winding-barrel teeth provides an optimal pressure angle of 20°, which promotes effective rotary motion and compensates for possible variations in the operation of the going train. This, in turn, ensures excellent torque transmission and a distinct improvement",
  },
];

export function TextColumnsDemo() {
  return (
    <div className="w-full">
      {/* Props : items* ; subtitle? ; showSubtitle? ; title? ; backgroundColor? ; textColor? ; rtl? ; className? */}
      <TextColumns
        subtitle="RM 43-01 Ferrari"
        title="Other features"
        items={ITEMS_RM43}
      />
      <TextColumns
        subtitle="RM 43-01 Ferrari"
        title="Other features"
        items={ITEMS_RM43}
        backgroundColor="#E35301"
        textColor="#ffffff"
      />
    </div>
  );
}
