"use client";

import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

function Card({ hover = false, glow = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "bg-canvas-card border border-border rounded-[16px] p-5 relative overflow-hidden",
        hover && "gaming-card",
        glow && "border-gold/20 shadow-[0_0_30px_rgba(255,209,92,0.08)]",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, type CardProps };
