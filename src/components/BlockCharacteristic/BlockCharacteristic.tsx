import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CharacteristicItem, { type CharacteristicItemData } from "./CharacteristicItem";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type BlockCharacteristicProps = {
  title: string;
  items: CharacteristicItemData[];
  /** 1, 2 ou 3 colonnes comme sur Richard Mille. */
  column?: 1 | 2 | 3;
  className?: string;
  disableAnimation?: boolean;
};

function getGridCols(column: 1 | 2 | 3): string {
  switch (column) {
    case 1:
      // Même écart vertical qu’en mode 2 colonnes (RM n’ajoute pas de gap en 1 col,
      // ce qui resserre les groupes empilés).
      return "grid-cols-1 gap-y-32";
    case 2:
      return "grid-cols-1 md:grid-cols-2 gap-x-56 gap-y-32";
    case 3:
      return "grid-cols-2 md:grid-cols-3 gap-x-32 md:gap-x-20 gap-y-13 md:gap-y-32";
    default:
      return "grid-cols-1 gap-y-32";
  }
}

export const BlockCharacteristic: React.FC<BlockCharacteristicProps> = ({
  title,
  items,
  column = 3,
  className,
  disableAnimation = false,
}) => {
  const itemsRef = useRef<HTMLDivElement | null>(null);

  const gridCols = useMemo(() => getGridCols(column), [column]);

  useEffect(() => {
    if (disableAnimation || !itemsRef.current) return;

    const nodes = itemsRef.current.querySelectorAll("[data-characteristic-item]");
    if (nodes.length === 0) return;

    gsap.set(nodes, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: itemsRef.current,
        start: "top 75%",
        end: "bottom 25%",
        toggleActions: "play none none none",
      },
    });

    tl.to(nodes, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "power2.out",
    });

    return () => {
      tl.kill();
    };
  }, [disableAnimation, items]);

  return (
    <section
      className={cn(
        "s-blok-characteristic-v2 bg-white text-primary-black px-32 py-64",
        className
      )}
    >
      <div className="grid grid-cols-12 gap-16 md:gap-20">
        <div className="col-span-12 md:col-span-5 bc_title">
          <div className="mb-48 md:mb-0">
            <Typography
              variant="title-medium"
              className=""
              textTransform="uppercase"
              as="h2"
            >
              {title}
            </Typography>
          </div>
        </div>

        <div
          className={cn(
            "col-span-12 md:col-span-7 flex flex-col pt:0 md:pt-24 bc_content",
            column === 1 ? "justify-start" : "justify-end"
          )}
        >
          <div
            ref={itemsRef}
            className={cn("grid bc_content_items", gridCols)}
          >
            {items.map((item, index) => (
              <CharacteristicItem key={`${item.title}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockCharacteristic;
