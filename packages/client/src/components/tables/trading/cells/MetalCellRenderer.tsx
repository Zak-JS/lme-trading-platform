import type { ICellRendererParams } from "ag-grid-community";
import { MetalIcon } from "@/components/ui/MetalIcon";
import { cn } from "@/lib/utils";
import type { ExtendedMetalPrice, TradingGridContext } from "./types";

export function MetalCellRenderer(
  params: ICellRendererParams<ExtendedMetalPrice>,
) {
  const data = params.data;
  if (!data) return null;
  const ctx = params.context as TradingGridContext;
  const isSelected = ctx.selectedSymbol === data.symbol;
  return (
    <div className="flex items-center gap-3 h-full">
      <MetalIcon
        symbol={data.symbol}
        size="sm"
        className={cn(
          isSelected &&
            "ring-2 ring-primary/30 ring-offset-1 ring-offset-background",
        )}
      />
      <div>
        <div
          className={cn(
            "font-semibold text-sm",
            isSelected ? "text-primary" : "text-foreground",
          )}
        >
          {data.symbol}
        </div>
        <span className="text-[10px] text-muted-foreground">{data.name}</span>
      </div>
    </div>
  );
}
