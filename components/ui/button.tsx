"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-canvas font-semibold hover:shadow-[0_0_20px_rgba(0,245,160,0.3)] active:scale-[0.97]",
  secondary:
    "bg-transparent border border-secondary text-secondary hover:bg-secondary/10 active:scale-[0.97]",
  danger:
    "bg-danger text-white font-semibold hover:brightness-110 active:scale-[0.97]",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary active:bg-white/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-[6px]",
  md: "h-10 px-5 text-sm gap-2 rounded-[12px]",
  lg: "h-12 px-7 text-base gap-2.5 rounded-[12px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none",
          "disabled:opacity-40 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
