import TitleText from "@/components/TitleText/TitleText";

const BOTTOM_IMG =
  "https://develop--richard-mille-2025.netlify.app/_next/image?url=https%3A%2F%2Fstaging-media.richardmille.com%2Ff%2F337605%2F2000x1500%2Fb8b8afbf59%2F4101detail.jpg&w=3840&q=75";

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
        bottomImageUrl={BOTTOM_IMG}
        bottomImageAlt="Détail du mouvement RM 41-01"
      />

      <TitleText
        layout="vertical"
        title="An exceptional caliber"
        subtitle="AUTOMATIC WINDING"
        text={BODY}
      />
    </div>
  );
}
