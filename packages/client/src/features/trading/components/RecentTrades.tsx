import { useTradesQuery } from "../api";
import { Card } from "@/components/ui/Card";
import { DataCell } from "@/components/ui/DataCell";
import { formatTimestamp } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function RecentTrades() {
  const { data, isLoading } = useTradesQuery();

  if (isLoading) {
    return (
      <Card className="flex flex-col h-full overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border/60">
          <h3 className="text-sm font-semibold">Recent Market Trades</h3>
        </div>
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          Loading trades...
        </div>
      </Card>
    );
  }

  const trades = data?.trades || [];

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border/60">
        <h3 className="text-sm font-semibold">Recent Market Trades</h3>
      </div>

      {trades.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
          No trades yet
        </div>
      ) : (
        <div className="overflow-auto flex-1">
          <table className="w-full text-xs text-left">
            <thead className="bg-card sticky top-0">
              <tr>
                <th className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Time
                </th>
                <th className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Metal
                </th>
                <th className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Side
                </th>
                <th className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium text-right">
                  Qty
                </th>
                <th className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium text-right">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {trades.slice(0, 10).map((trade) => (
                <tr
                  key={trade.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-2 text-muted-foreground font-mono">
                    {trade.executedAt
                      ? formatTimestamp(trade.executedAt)
                      : "--:--:--"}
                  </td>
                  <td className="px-4 py-2 font-semibold">{trade.symbol}</td>
                  <td className="px-4 py-2">
                    <span
                      className={cn(
                        "inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium",
                        trade.side === "BUY"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400",
                      )}
                    >
                      {trade.side}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    {trade.quantity}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <DataCell value={trade.price} format="price" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
