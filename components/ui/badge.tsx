"use client";

import { type HTMLAttributes } from "react";

type BadgeVariant = "gold" | "success" | "danger" | "muted" | "warning" | "cyan" | "purple" | "hot" | "new" | "live";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  gold: "bg-gold/15 text-gold border border-gold/25",
  success: "bg-emerald/15 text-emerald border border-emerald/25",
  danger: "bg-rose/15 text-rose border border-rose/25",
  muted: "bg-white/5 text-text-secondary border border-border",
  warning: "bg-warning/15 text-warning border border-warning/25",
  cyan: "bg-cyan/15 text-cyan border border-cyan/25",
  purple: "bg-purple/15 text-purple border border-purple/25",
  hot: "bg-gradient-to-r from-rose/20 to-orange/20 text-rose border border-rose/25",
  new: "bg-gradient-to-r from-cyan/20 to-purple/20 text-cyan border border-cyan/25",
  live: "bg-gradient-to-r from-emerald/20 to-cyan/20 text-emerald border border-emerald/25",
};

function Badge({ variant = "muted", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold rounded-[6px] uppercase tracking-wider",
        variantStyles[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps, type BadgeVariant };
