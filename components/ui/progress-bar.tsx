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
            <span className="text-sm font-medium text-text-primary">{label}</span>
          )}
          {showPercentage && (
            <span className="text-xs text-text-muted tabular-nums">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export { ProgressBar, type ProgressBarProps };
