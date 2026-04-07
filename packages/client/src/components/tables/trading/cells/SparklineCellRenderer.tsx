import type { ICellRendererParams } from "ag-grid-community";
import { Sparkline } from "./Sparkline";
import type { ExtendedMetalPrice } from "./types";

export function SparklineCellRenderer(
  params: ICellRendererParams<ExtendedMetalPrice>,
) {
  const data = params.data;
  if (!data) return null;
  return (
    <div className="flex items-center justify-center h-full">
      <Sparkline data={data.priceHistory} isPositive={data.change >= 0} />
    </div>
  );
}
