import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:translate-y-[1px]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-[#b8402c] to-[#8f2718] text-[#fdf6e7] border border-[#6f1d12] shadow-[0_6px_16px_-8px_rgba(120,32,20,0.9)] hover:from-[#c14a34] hover:to-[#9a2c1c]",
        outline:
          "border border-[#8a6f45]/60 bg-[#fbf4e4]/70 text-ink hover:bg-[#f5e8cd] hover:border-[#8a6f45]",
        ghost: "text-ink-soft hover:bg-[#e8dcc4]/70 hover:text-ink",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3 text-xs",
        lg: "h-14 px-8 text-base tracking-[0.3em]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
