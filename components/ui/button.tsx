"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "play" | "primary" | "secondary" | "danger" | "ghost" | "gold" | "outline" | "cyan" | "spin";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  play: [
    "bg-gradient-to-b from-[#FFE566] via-[#FFD15C] to-[#E8B820]",
    "text-[#1A1200] font-black uppercase tracking-wider",
    "border-2 border-[#FFE566]/50",
    "shadow-[0_6px_0_0_#B89420,0_8px_0_0_#8B6914,0_10px_30px_rgba(255,209,92,0.4),inset_0_2px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.1)]",
    "hover:shadow-[0_7px_0_0_#B89420,0_9px_0_0_#8B6914,0_12px_40px_rgba(255,209,92,0.55),inset_0_2px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.1)]",
    "hover:translate-y-[-2px] hover:brightness-110",
    "active:shadow-[0_2px_0_0_#B89420,0_3px_0_0_#8B6914,0_4px_15px_rgba(255,209,92,0.3),inset_0_2px_4px_rgba(0,0,0,0.15)]",
    "active:translate-y-[2px] active:brightness-95",
    "text-shadow-[0_1px_0_rgba(255,255,255,0.3)]",
  ].join(" "),
  gold: [
    "bg-gradient-to-b from-[#FFE566] via-[#FFD15C] to-[#E8B820]",
    "text-[#1A1200] font-black uppercase tracking-wider",
    "border-2 border-[#FFE566]/50",
    "shadow-[0_5px_0_0_#B89420,0_7px_0_0_#8B6914,0_8px_25px_rgba(255,209,92,0.35),inset_0_2px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.1)]",
    "hover:shadow-[0_6px_0_0_#B89420,0_8px_0_0_#8B6914,0_10px_35px_rgba(255,209,92,0.5),inset_0_2px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.1)]",
    "hover:translate-y-[-1px] hover:brightness-110",
    "active:shadow-[0_2px_0_0_#B89420,0_3px_0_0_#8B6914,0_4px_15px_rgba(255,209,92,0.25),inset_0_2px_4px_rgba(0,0,0,0.15)]",
    "active:translate-y-[2px] active:brightness-95",
    "text-shadow-[0_1px_0_rgba(255,255,255,0.3)]",
  ].join(" "),
  spin: [
    "bg-gradient-to-b from-[#FF6B35] via-[#FF5722] to-[#D84315]",
    "text-white font-black uppercase tracking-wider",
    "border-2 border-[#FF8A65]/50",
    "shadow-[0_6px_0_0_#BF360C,0_8px_0_0_#8B2500,0_10px_30px_rgba(255,87,34,0.4),inset_0_2px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.15)]",
    "hover:shadow-[0_7px_0_0_#BF360C,0_9px_0_0_#8B2500,0_12px_40px_rgba(255,87,34,0.55),inset_0_2px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.15)]",
    "hover:translate-y-[-2px] hover:brightness-110",
    "active:shadow-[0_2px_0_0_#BF360C,0_3px_0_0_#8B2500,0_4px_15px_rgba(255,87,34,0.3),inset_0_2px_4px_rgba(0,0,0,0.2)]",
    "active:translate-y-[2px] active:brightness-95",
    "text-shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
  ].join(" "),
  primary: [
    "bg-gradient-to-b from-[#FFE566] via-[#FFD15C] to-[#E8B820]",
    "text-[#1A1200] font-black uppercase tracking-wider",
    "border-2 border-[#FFE566]/50",
    "shadow-[0_4px_0_0_#B89420,0_6px_20px_rgba(255,209,92,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]",
    "hover:shadow-[0_5px_0_0_#B89420,0_8px_30px_rgba(255,209,92,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]",
    "hover:translate-y-[-1px] hover:brightness-110",
    "active:shadow-[0_1px_0_0_#B89420,0_2px_10px_rgba(255,209,92,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]",
    "active:translate-y-[1px]",
    "text-shadow-[0_1px_0_rgba(255,255,255,0.3)]",
  ].join(" "),
  secondary: [
    "bg-gradient-to-b from-[#333340] to-[#252530]",
    "text-text-primary font-bold uppercase tracking-wide",
    "border-2 border-[#444455]/60",
    "shadow-[0_4px_0_0_#1A1A24,0_6px_15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
    "hover:from-[#3A3A48] hover:to-[#2C2C38]",
    "hover:shadow-[0_5px_0_0_#1A1A24,0_8px_25px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
    "hover:translate-y-[-1px]",
    "active:shadow-[0_1px_0_0_#1A1A24,0_2px_8px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.15)]",
    "active:translate-y-[1px]",
  ].join(" "),
  danger: [
    "bg-gradient-to-b from-[#FF6B7A] via-[#F43F5E] to-[#DC2626]",
    "text-white font-black uppercase tracking-wider",
    "border-2 border-[#FF8A97]/40",
    "shadow-[0_5px_0_0_#9F1239,0_7px_0_0_#7F1030,0_8px_25px_rgba(244,63,94,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]",
    "hover:shadow-[0_6px_0_0_#9F1239,0_8px_0_0_#7F1030,0_10px_35px_rgba(244,63,94,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]",
    "hover:translate-y-[-1px] hover:brightness-110",
    "active:shadow-[0_2px_0_0_#9F1239,0_3px_0_0_#7F1030,0_4px_15px_rgba(244,63,94,0.25),inset_0_2px_4px_rgba(0,0,0,0.15)]",
    "active:translate-y-[1px]",
    "text-shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
  ].join(" "),
  ghost: [
    "bg-transparent text-text-secondary font-bold uppercase tracking-wide",
    "border-2 border-transparent",
    "hover:text-text-primary hover:bg-white/5 hover:border-white/10",
    "active:bg-white/8 active:translate-y-[1px]",
  ].join(" "),
  outline: [
    "bg-transparent border-2 border-gold/50 text-gold font-black uppercase tracking-wider",
    "shadow-[0_0_15px_rgba(255,209,92,0.1),inset_0_1px_0_rgba(255,209,92,0.1)]",
    "hover:bg-gold/10 hover:border-gold/70",
    "hover:shadow-[0_0_25px_rgba(255,209,92,0.2),inset_0_1px_0_rgba(255,209,92,0.15)]",
    "hover:translate-y-[-1px]",
    "active:bg-gold/15 active:translate-y-[1px]",
    "active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]",
  ].join(" "),
  cyan: [
    "bg-gradient-to-b from-[#67E8F9] via-[#22D3EE] to-[#0891B2]",
    "text-[#0A1A20] font-black uppercase tracking-wider",
    "border-2 border-[#67E8F9]/40",
    "shadow-[0_5px_0_0_#0E7490,0_7px_0_0_#065068,0_8px_25px_rgba(34,211,238,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]",
    "hover:shadow-[0_6px_0_0_#0E7490,0_8px_0_0_#065068,0_10px_35px_rgba(34,211,238,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]",
    "hover:translate-y-[-1px] hover:brightness-110",
    "active:shadow-[0_2px_0_0_#0E7490,0_3px_0_0_#065068,0_4px_15px_rgba(34,211,238,0.25),inset_0_2px_4px_rgba(0,0,0,0.1)]",
    "active:translate-y-[1px]",
    "text-shadow-[0_1px_0_rgba(255,255,255,0.3)]",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs gap-1.5 rounded-[8px]",
  md: "h-11 px-6 text-sm gap-2 rounded-[10px]",
  lg: "h-13 px-8 text-base gap-2.5 rounded-[12px]",
  xl: "h-15 px-10 text-lg gap-3 rounded-[14px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "play", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none",
          "disabled:opacity-40 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-none",
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
