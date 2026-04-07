import type { ICellRendererParams } from "ag-grid-community";
import { DataCell } from "@/components/ui/DataCell";
import type { ExtendedMetalPrice } from "./types";

export function BidCellRenderer(
  params: ICellRendererParams<ExtendedMetalPrice>,
) {
  const data = params.data;
  if (!data) return null;
  const spread = data.ask - data.price;
  return (
    <div className="flex flex-col items-end justify-center h-full">
      <DataCell
        value={data.price}
        format="price"
        className="font-medium text-[15px]"
      />
      <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
        {spread.toFixed(2)}
      </span>
    </div>
  );
}
