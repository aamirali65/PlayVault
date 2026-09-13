"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={[
            "w-full h-10 px-3 bg-canvas-card border border-border-muted rounded-[12px] text-sm text-text-primary",
            "placeholder:text-text-disabled transition-all duration-200",
            "focus:outline-none focus:border-border-focus focus:shadow-[0_0_0_2px_rgba(0,245,160,0.15)]",
            error && "border-danger",
            className,
          ].join(" ")}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };
