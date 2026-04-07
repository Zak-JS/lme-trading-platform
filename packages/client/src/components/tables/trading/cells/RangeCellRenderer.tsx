import type { ICellRendererParams } from "ag-grid-community";
import { RangeBar } from "./RangeBar";
import type { ExtendedMetalPrice } from "./types";

export function RangeCellRenderer(
  params: ICellRendererParams<ExtendedMetalPrice>,
) {
  const data = params.data;
  if (!data) return null;
  return (
    <div className="flex items-center justify-center h-full">
      <RangeBar current={data.price} low={data.low} high={data.high} />
    </div>
  );
}
