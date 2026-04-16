import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "outline";
type Visual = "white";
type MainVariant = "main";
type MainVisual = "black";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  variant?: Variant | MainVariant;
  visual?: Visual | MainVisual;
  className?: string;
};

const styles: Record<Variant | MainVariant, Record<Visual | MainVisual, string>> = {
  outline: {
    white:
      "cursor-pointer px-4 label-large font-rm-mono uppercase rounded-[2px] leading-normal text-white border border-white/20 hover:bg-white/10",
    black: "",
  },
  main: {
    black:
      "cursor-pointer bg-black text-white gap-16 items-center pt-8 pb-10 px-12 text-[14px] uppercase flex hover:bg-white hover:text-black transition-colors duration-300 border border-black",
    white: "",
  },
};

export const CustomButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "outline", visual = "white", className, children, ...props }, ref) => {
    const variantStyles = styles[variant][visual];
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "block w-fit items-center transition-colors duration-300 cursor-pointer",
          variantStyles,
          className
        )}
        {...props}
      >
        {variant === "main" ? (
          <>
            <div className="w-[3px] h-[3px] bg-current md:translate-y-[0.5px]" />
            <span className="leading-none uppercase">{children}</span>
          </>
        ) : (
          <p className="leading-none pb-[1px]">{children}</p>
        )}
      </button>
    );
  }
);

CustomButton.displayName = "CustomButton";
