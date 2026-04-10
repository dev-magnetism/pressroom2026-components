import BlockBloc from "@/components/BlockBloc/BlockBloc";

/** URL média directe (décodée du paramètre `url` du lien Next Image). */
const IMAGE =
  "https://media.richardmille.com/wp-content/uploads/2022/09/22120100/baseplate34.jpg";

export function BlockBlocDemo() {
  return (
    <div className="w-full bg-neutral-100">
      <BlockBloc
        subtitle="Partnership"
        title="Charles Leclerc"
        imageUrl={IMAGE}
        imageAlt="Baseplate"
        textLeft="Since his early days in karting, the driver attracted attention through raw pace and consistency in qualifying — a profile that matched the brand’s pursuit of performance."
        textRight="The collaboration extends beyond visibility: it reflects shared values of precision, resilience, and the constant drive to refine every detail under pressure."
      />
    </div>
  );
}
