import { memo } from "react";
import type { MetalPrice } from "@lme/shared";
import { MetalIcon } from "@/components/ui/MetalIcon";
import { PriceChange } from "@/components/ui/PriceChange";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceCardProps {
  price: MetalPrice;
  isSelected?: boolean;
  onClick?: () => void;
  flashDirection?: "up" | "down" | "neutral";
}

export const PriceCard = memo(function PriceCard({
  price,
  isSelected,
  onClick,
  flashDirection = "neutral",
}: PriceCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all",
        "hover:border-primary/50 hover:bg-accent/50",
        isSelected && "border-primary bg-accent",
        flashDirection === "up" && "animate-flash-green",
        flashDirection === "down" && "animate-flash-red",
      )}
    >
      <div className="flex items-center gap-3">
        <MetalIcon symbol={price.symbol} />
        <div>
          <div className="font-medium">{price.name}</div>
          <div className="text-xs text-muted-foreground">{price.symbol}</div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-lg font-semibold tabular-nums">
          {formatPrice(price.price)}
        </div>
        <PriceChange
          change={price.change}
          changePercent={price.changePercent}
        />
      </div>
    </button>
  );
});
