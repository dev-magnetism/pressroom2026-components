import { Typography } from "@/components/ui/Typography";
import { CustomButton } from "@/components/ui/CustomButton";
import { cn } from "@/lib/cn";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./BlockQuote.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

type BlockQuoteProps = {
  quote: string;
  signature?: string;
  titleIndent?: boolean;
  signatureColor?: "white" | "black";
  className?: string;
};

export function BlockQuote({
  quote,
  signature,
  titleIndent = false,
  signatureColor = "black",
  className,
}: BlockQuoteProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!textRef.current || !sectionRef.current) return;

    if (splitRef.current) {
      splitRef.current.revert();
      splitRef.current = null;
    }
    tweenRef.current?.scrollTrigger?.kill();
    tweenRef.current?.kill();
    tweenRef.current = null;

    const split = new SplitText(textRef.current, {
      type: "words",
      wordsClass: `${styles.line} word++`,
      tag: "span",
    });

    splitRef.current = split;

    tweenRef.current = gsap.from(split.words, {
      opacity: 0.1,
      duration: 0.9,
      stagger: 0.1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 50%",
        end: "bottom 90%",
        scrub: true,
      },
    });

    return () => {
      tweenRef.current?.scrollTrigger?.kill();
      tweenRef.current?.kill();
      tweenRef.current = null;
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
      if (sectionRef.current) {
        gsap.killTweensOf(sectionRef.current);
      }
      if (textRef.current) {
        gsap.killTweensOf(textRef.current);
      }
    };
  }, [quote]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "blok-quote bg-white px-20 md:px-32 w-full py-80 md:py-128 text-primary-black",
        className
      )}
    >
      <div className="grid grid-cols-12">
        <div className="col-span-12 col-start-1 md:col-span-8 md:col-start-3 flex flex-col">
          <div className={cn(titleIndent ? "title-indent" : "")}>
            <Typography
              ref={textRef}
              variant="title-large-small"
              className={cn(styles.text, "text-primary-black")}
              as="p"
            >
              {quote}
            </Typography>
          </div>

          {signature ? (
            <CustomButton
              variant="outline"
              className={cn(
                "mt-24 md:mt-40 flex items-center border border-primary-black/10 w-fit pointer-events-auto hover:bg-white cursor-auto",
                signatureColor === "white" ? "text-white" : "text-primary-black",
                styles.signature
              )}
            >
              {signature}
            </CustomButton>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default BlockQuote;
