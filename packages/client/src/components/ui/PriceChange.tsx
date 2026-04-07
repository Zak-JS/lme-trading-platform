import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataCell } from "./DataCell";

interface PriceChangeProps {
  change: number;
  changePercent: number;
  className?: string;
}

export function PriceChange({
  change,
  changePercent,
  className,
}: PriceChangeProps) {
  const isPositive = change >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Icon
        className={cn(
          "h-4 w-4",
          isPositive ? "text-emerald-500" : "text-red-500",
        )}
      />
      <div className="flex flex-col items-end">
        <DataCell
          value={change}
          format="price"
          showSign
          className="text-sm font-medium"
        />
        <DataCell
          value={changePercent}
          format="percent"
          showSign
          className="text-xs opacity-80"
        />
      </div>
    </div>
  );
}
