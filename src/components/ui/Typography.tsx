import { createElement, forwardRef } from "react";
import { cn } from "@/lib/cn";

const VARIANTS = {
  "title-xxlarge": "title-xxlarge",
  "title-large-small": "title-large-small",
  "title-large-medium": "title-large-medium",
  "title-medium": "title-medium",
  "body-medium-edito": "body-medium-edito",
  "label-small": "label-small",
} as const;

const DEFAULT_ELEMENTS = {
  "title-xxlarge": "h2",
  "title-large-small": "h2",
  "title-large-medium": "h2",
  "title-medium": "h2",
  "body-medium-edito": "div",
  "label-small": "span",
} as const;

type VariantType = keyof typeof VARIANTS;
type ElementType =
  | "h1"
  | "h2"
  | "h3"
  | "p"
  | "span"
  | "div";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant: VariantType;
  as?: ElementType;
  weight?: "light" | "regular" | "medium" | "bold";
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "normal-case";
  color?: "black" | "white" | "primary-black" | "white-gray";
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant,
      as,
      weight = "regular",
      className,
      children,
      textTransform = "normal-case",
      color,
      ...props
    },
    ref
  ) => {
    const element = as || DEFAULT_ELEMENTS[variant];
    const variantClasses = cn(
      VARIANTS[variant],
      weight === "light" && "font-light",
      weight === "medium" && "font-medium",
      weight === "bold" && "font-bold",
      textTransform !== "normal-case" && textTransform,
      color === "black" && "text-black",
      color === "white" && "text-white",
      color === "primary-black" && "text-primary-black",
      color === "white-gray" && "text-white-gray",
      className
    );

    return createElement(element, {
      className: variantClasses,
      ref,
      ...props,
    }, children);
  }
);

Typography.displayName = "Typography";
