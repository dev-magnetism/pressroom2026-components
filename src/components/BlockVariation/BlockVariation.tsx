import { useMemo, useState, type ReactNode } from "react";
import { Typography } from "@/components/ui/Typography";
import { CustomButton } from "@/components/ui/CustomButton";
import { cn } from "@/lib/cn";
import VariationSmallView from "./VariationSmallView";
import VariationBigView from "./VariationBigView";

export type VariationAsset = {
  id?: string;
  filename?: string;
  alt?: string;
};

export type VariationElement = {
  id: string;
  name: string;
  subtitle?: string;
  variationName?: string;
  variation_name?: string;
  image?: VariationAsset;
  thumbnail?: VariationAsset;
  gallery?: VariationAsset[];
};

export type BlockVariationLabels = {
  viewMore: string;
  back: string;
  prev: string;
  next: string;
};

export type BlockVariationProps = {
  surtitle?: string;
  variations: VariationElement[];
  initialVariationId?: string;
  labels?: Partial<BlockVariationLabels>;
  rtl?: boolean;
  className?: string;
};

const DEFAULT_LABELS: BlockVariationLabels = {
  viewMore: "view more",
  back: "Back",
  prev: "Previous",
  next: "Next",
};

export function VariationButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled: boolean;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-8 text-12 uppercase font-rm-mono text-primary-black rounded-[2px] border border-black/25 hover:bg-white/40 hover:backdrop-blur-sm px-4 cursor-pointer",
        className
      )}
    >
      {children}
    </button>
  );
}

export default function BlockVariation({
  surtitle,
  variations,
  initialVariationId,
  labels,
  rtl = false,
  className,
}: BlockVariationProps) {
  const mergedLabels = { ...DEFAULT_LABELS, ...labels };
  const [viewType, setViewType] = useState<"big" | "small">("small");
  const [selectedVariation, setSelectedVariation] = useState<string | null>(
    initialVariationId ?? variations[0]?.id ?? null
  );

  const selectedVariationElement = useMemo(
    () => variations.find(item => item.id === selectedVariation) ?? variations[0],
    [variations, selectedVariation]
  );
  const selectedVariationLabel =
    selectedVariationElement?.variationName ??
    selectedVariationElement?.variation_name;

  if (!variations.length) return null;

  return (
    <section
      className={cn(
        "s-block-variation w-full pt-16 md:pt-48 bg-grey overflow-hidden relative",
        viewType === "small" ? "md:min-h-[94dvh]" : "md:min-h-fit",
        className
      )}
    >
      <div className="md:px-32 mb-32 px-20 text-primary-black z-10">
        <div className="flex flex-col items-center gap-12 max-w-[80%] md:max-w-[600px] mx-auto">
          {surtitle ? (
            <Typography
              variant="label-large"
              className="uppercase pb-3"
              color="primary-black"
              as="h2"
            >
              {surtitle}
            </Typography>
          ) : null}

          <Typography
            variant="title-medium"
            color="primary-black"
            className={cn(
              "uppercase text-center -mt-1",
              selectedVariationLabel ? "mb-0" : "mb-4"
            )}
          >
            {selectedVariationElement?.name}
          </Typography>

          {selectedVariationLabel ? (
            <Typography
              variant="body-medium"
              color="primary-black"
              className="uppercase text-center mb-5 -mt-8"
            >
              {selectedVariationLabel}
            </Typography>
          ) : null}

          <CustomButton
            variant="main"
            visual="black"
            className={cn(
              "hidden gap-16 items-center pt-8 pb-10 z-1 px-12 text-[14px] uppercase md:flex pointer-events-auto",
              viewType === "small" ? "" : "opacity-0 pointer-events-none"
            )}
            onClick={() => setViewType("big")}
          >
            {mergedLabels.viewMore}
          </CustomButton>

          <VariationButton
            onClick={() => setViewType("small")}
            disabled={false}
            className={cn(
              "absolute top-24 left-32 z-10",
              viewType === "big" ? "" : "opacity-0"
            )}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path
                d="M2.50869 3.56H7.70469V4.412H2.52069L4.17669 6.008L4.65669 6.488L4.05669 7.076L0.984688 3.98L4.05669 0.883999L4.65669 1.472L4.17669 1.952L2.50869 3.56Z"
                fill="black"
              />
            </svg>
            <span>{mergedLabels.back}</span>
          </VariationButton>
        </div>
      </div>

      {viewType === "small" ? (
        <VariationSmallView
          variations={variations}
          selectedVariation={selectedVariation}
          setSelectedVariation={setSelectedVariation}
          setViewType={setViewType}
          rtl={rtl}
          viewMoreLabel={mergedLabels.viewMore}
        />
      ) : (
        <VariationBigView
          variations={variations}
          selectedVariation={selectedVariation}
          rtl={rtl}
          prevLabel={mergedLabels.prev}
          nextLabel={mergedLabels.next}
        />
      )}
    </section>
  );
}
