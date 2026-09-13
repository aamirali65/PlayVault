"use client";

import { type HTMLAttributes } from "react";

type BadgeVariant = "primary" | "success" | "danger" | "muted" | "warning" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary/15 text-primary border border-primary/30",
  success: "bg-success/15 text-success border border-success/30",
  danger: "bg-danger/15 text-danger border border-danger/30",
  muted: "bg-white/5 text-text-secondary border border-border-muted",
  warning: "bg-warning/15 text-warning border border-warning/30",
  info: "bg-secondary/15 text-secondary border border-secondary/30",
};

function Badge({ variant = "muted", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-[6px] uppercase tracking-wider",
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
