"use client";

import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

function Card({ hover = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "bg-canvas-card border border-border-muted rounded-[12px] p-5",
        hover &&
          "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-border-muted",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, type CardProps };
