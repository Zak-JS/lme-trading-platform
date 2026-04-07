import type { ICellRendererParams } from "ag-grid-community";
import { PriceChange } from "@/components/ui/PriceChange";
import type { ExtendedMetalPrice } from "./types";

export function ChangeCellRenderer(
  params: ICellRendererParams<ExtendedMetalPrice>,
) {
  const data = params.data;
  if (!data) return null;
  return (
    <div className="flex items-center justify-end h-full">
      <PriceChange
        change={data.change}
        changePercent={data.changePercent}
        className="justify-end"
      />
    </div>
  );
}
