import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type OuterTag = "div" | "h2";

/**
 * Remplace MaskedElementAnimation côté RM : masque vertical + entrée douce,
 * sans dépendre de GSAP / SplitText.
 */
export function EditoReveal({
  tag: outerTag = "div",
  children,
  className,
  childClassName,
  delay = 0.3,
  duration = 0.6,
  from = { y: "100%", opacity: 0 },
}: {
  tag?: OuterTag;
  children: ReactNode;
  className?: string;
  childClassName?: string;
  delay?: number;
  duration?: number;
  from?: { y?: string | number; opacity?: number };
}) {
  const inner = (
    <motion.span
      className={cn("inline-block w-full", childClassName)}
      initial={from}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.span>
  );

  if (outerTag === "h2") {
    return (
      <h2 className={cn("overflow-hidden", className)}>{inner}</h2>
    );
  }

  return <div className={cn("overflow-hidden", className)}>{inner}</div>;
}
