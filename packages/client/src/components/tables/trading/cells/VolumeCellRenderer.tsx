import type { ICellRendererParams } from "ag-grid-community";
import type { ExtendedMetalPrice } from "./types";

export function VolumeCellRenderer(
  params: ICellRendererParams<ExtendedMetalPrice>,
) {
  const data = params.data;
  if (!data) return null;
  return (
    <div className="flex items-center justify-end h-full font-mono tabular-nums text-sm text-muted-foreground">
      {new Intl.NumberFormat().format(data.volume)}
    </div>
  );
}
