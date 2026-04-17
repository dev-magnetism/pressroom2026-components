import BlockBloc from "@/components/BlockBloc/BlockBloc";

/** URL média directe (décodée du paramètre `url` du lien Next Image). */
const IMAGE =
  "https://media.richardmille.com/wp-content/uploads/2022/09/22120100/baseplate34.jpg";

/** Même MP4 que `BlockVideoDemo` — `videoUrl` / `videoUrlMobile` → `VideoPlayer` (richardmille.com). */
const VIDEO_URL =
  "https://media.richardmille.com/wp-content/uploads/2024/10/07152243/MCLarenXRM_NeuralOverdrive_LONG_1_1.mp4.mp4";

export function BlockBlocDemo() {
  return (
    <div className="w-full">
      {/* Props : … ; textColumns?: 1 | 2 (défaut 2) ; textLeft? ; textRight? */}
      <BlockBloc
        subtitle="Partnership"
        title="Charles Leclerc"
        imageUrl={IMAGE}
        imageAlt="Baseplate"
        textColumns={2}
        textLeft="Since his early days in karting, the driver attracted attention through raw pace and consistency in qualifying — a profile that matched the brand’s pursuit of performance."
        textRight="The collaboration extends beyond visibility: it reflects shared values of precision, resilience, and the constant drive to refine every detail under pressure."
      />

      <BlockBloc
        subtitle="Partnership"
        title="Une colonne (texte centré)"
        imageUrl={IMAGE}
        imageAlt="Baseplate"
        textColumns={1}
        textLeft="Avec `textColumns={1}`, le bloc texte est une seule colonne centrée. On peut n’utiliser que `textLeft`, ou les deux champs : ils s’affichent l’un sous l’autre, toujours centrés."
        textRight="Deuxième paragraphe optionnel en mode une colonne."
      />

      <BlockBloc
        subtitle="Partnership"
        title="Vidéo à la place de l’image"
        videoUrl={VIDEO_URL}
        videoUrlMobile={VIDEO_URL}
        textColumns={2}
        textLeft="Bloc média en vidéo : `videoUrl` (desktop) et optionnellement `videoUrlMobile` (≤768px). Pas besoin de `imageUrl`."
        textRight="Le chargement de la vidéo est différé jusqu’à l’entrée dans le viewport (IntersectionObserver), comme sur le site principal."
      />
    </div>
  );
}
