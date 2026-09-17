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
          <label className="block text-xs font-extrabold text-text-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={[
            "w-full h-11 px-4 bg-surface border border-border rounded-[10px] text-sm text-text-primary",
            "placeholder:text-text-muted transition-all duration-200",
            "focus:outline-none focus:border-gold/50 focus:shadow-[0_0_0_3px_rgba(255,209,92,0.1)]",
            "focus:bg-surface-hover",
            error && "border-rose focus:border-rose",
            className,
          ].join(" ")}
          {...props}
        />
        {error && <p className="text-xs text-rose font-semibold">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };
