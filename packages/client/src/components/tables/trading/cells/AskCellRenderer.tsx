import type { ICellRendererParams } from "ag-grid-community";
import { DataCell } from "@/components/ui/DataCell";
import type { ExtendedMetalPrice } from "./types";

export function AskCellRenderer(
  params: ICellRendererParams<ExtendedMetalPrice>,
) {
  const data = params.data;
  if (!data) return null;
  return (
    <div className="flex items-center justify-end h-full">
      <DataCell
        value={data.ask}
        format="price"
        className="font-medium text-[15px]"
      />
    </div>
  );
}
