"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? Math.round((clamped / max) * 100) : 0;

  return (
    <div className={["flex flex-col gap-1.5 w-full", className].join(" ")}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-bold text-text-primary">{label}</span>
          )}
          {showPercentage && (
            <span className="text-xs text-gold font-extrabold tabular-nums">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="h-3 w-full overflow-hidden rounded-full bg-surface border border-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold via-gold-bright to-gold transition-all duration-700 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 shimmer-bg rounded-full" />
        </div>
      </div>
    </div>
  );
}

export { ProgressBar, type ProgressBarProps };
