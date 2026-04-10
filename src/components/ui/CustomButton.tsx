import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "outline";
type Visual = "white";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  variant?: Variant;
  visual?: Visual;
  className?: string;
};

const styles: Record<Variant, Record<Visual, string>> = {
  outline: {
    white:
      "cursor-pointer px-4 label-large font-rm-mono uppercase rounded-[2px] leading-normal text-white border border-white/20 hover:bg-white/10",
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
        <p className="leading-none pb-[1px]">{children}</p>
      </button>
    );
  }
);

CustomButton.displayName = "CustomButton";
