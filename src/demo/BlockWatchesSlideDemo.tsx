import BlockWatchesSlide from "@/components/BlockWatchesSlide/BlockWatchesSlide";
import type { WatchesSlideItem } from "@/components/BlockWatchesSlide/types";

const BG =
  "https://staging-media.richardmille.com/f/337605/1780x1378/7385feb474/rm_88_smiley_6h.png";

const IMG_WATCH =
  "https://staging-media.richardmille.com/f/337605/1780x1378/7385feb474/rm_88_smiley_6h.png";
const IMG_ALT =
  "https://media.richardmille.com/wp-content/uploads/2022/09/22120100/baseplate34.jpg";

/** 5 slides → layout desktop `WatchSliderRight` (&gt; 4), comme le site. */
const SLIDES: WatchesSlideItem[] = [
  {
    _uid: "s1",
    full_slug: "watches/model-01",
    content: {
      _uid: "c1",
      name: "RM 40-01",
      subtitle: "Automatic",
      product_image: { filename: IMG_WATCH, alt: "" },
    },
  },
  {
    _uid: "s2",
    full_slug: "watches/model-02",
    content: {
      _uid: "c2",
      name: "RM 67-02",
      subtitle: "Extra flat",
      product_image: { filename: IMG_ALT, alt: "" },
    },
  },
  {
    _uid: "s3",
    full_slug: "watches/model-03",
    content: {
      _uid: "c3",
      name: "RM 72-01",
      subtitle: "Lifestyle",
      product_image: { filename: IMG_WATCH, alt: "" },
    },
  },
  {
    _uid: "s4",
    full_slug: "watches/model-04",
    content: {
      _uid: "c4",
      name: "RM 35-03",
      subtitle: "Rafael Nadal",
      product_image: { filename: IMG_ALT, alt: "" },
    },
  },
  {
    _uid: "s5",
    full_slug: "watches/model-05",
    content: {
      _uid: "c5",
      name: "RM 88",
      subtitle: "Smiley",
      product_image: { filename: IMG_WATCH, alt: "" },
    },
  },
];

export function BlockWatchesSlideDemo() {
  return (
    <div className="w-full bg-primary-black">
      <BlockWatchesSlide
        title="Collection"
        slides={SLIDES}
        backgroundUrl={BG}
        backgroundAlt=""
        modelsLabel="models"
        keyPrefix="demo-watches-slide"
      />
    </div>
  );
}
