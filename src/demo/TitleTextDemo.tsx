import TitleText from "@/components/TitleText/TitleText";

const BODY =
  "And, in-keeping with McLaren’s remit that the W1 should be a supercar that is practical to use every day, the RM 65-01 McLaren W1 is also perfect for daily use thanks to both the built-in robustness of the 480-part movement and its variable geometry winding rotor that can be adjusted to the wearer’s lifestyle.\n\nThe view through the crystal enables the grey electroplasma treatment of the grade 5 titanium baseplate to be fully appreciated, along with the black PVD and grey electroplasma treated grade 5 titanium bridges";

export function TitleTextDemo() {
  return (
    <div className="w-full">
      <TitleText
        title="RM 65-01"
        subtitle="MCLAREN W1"
        text={BODY}
        backgroundColor="#E35301"
        textColor="#ffffff"
      />
    </div>
  );
}
