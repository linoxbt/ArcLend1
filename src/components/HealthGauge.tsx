import { cn } from "@/lib/utils";

interface HealthGaugeProps {
  value: number;
  size?: "sm" | "md" | "lg";
}

export function HealthGauge({ value, size = "md" }: HealthGaugeProps) {
  const clamped = Math.min(value, 5);
  const percent = (clamped / 5) * 100;
  const getColor = () => {
    if (value >= 2) return "text-success";
    if (value >= 1.2) return "text-warning";
    return "text-danger";
  };
  const getBgColor = () => {
    if (value >= 2) return "bg-success";
    if (value >= 1.2) return "bg-warning";
    return "bg-danger";
  };

  const sizeClasses = {
    sm: "h-1.5 w-24",
    md: "h-2 w-32",
    lg: "h-3 w-48",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={cn("overflow-hidden rounded-full bg-muted", sizeClasses[size])}>
        <div className={cn("h-full rounded-full transition-all", getBgColor())} style={{ width: `${percent}%` }} />
      </div>
      <span className={cn("font-mono text-sm font-bold", getColor())}>
        {value >= 100 ? "∞" : value.toFixed(2)}
      </span>
    </div>
  );
}
