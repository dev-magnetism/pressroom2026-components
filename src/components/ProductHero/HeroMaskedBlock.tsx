import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * Remplace MaskedElementAnimation + SplitText du site : révélation type « ligne »
 * sans GSAP premium (comportement proche pour la démo).
 */
export function HeroMaskedBlock({
  children,
  className,
  childClassName,
  delay = 0,
  duration = 1.2,
}: {
  children: ReactNode;
  className?: string;
  childClassName?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div className={cn("w-fit overflow-hidden", className)}>
      <motion.div
        className={cn(childClassName)}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay,
          duration,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
