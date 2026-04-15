import BlockQuote from "@/components/BlockQuote/BlockQuote";

const QUOTE_TEXT =
  "Since his early days in karting, I have closely followed Charles’ progress. Noted for his times, and his speedy qualifiers, the driver attracted my attention and enthusiasm, immediately convincing the brand to support his budding talent.";

export function BlockQuoteDemo() {
  return (
    <div className="w-full bg-neutral-100">
      <BlockQuote quote={QUOTE_TEXT} signature="Richard Mille" />
    </div>
  );
}
