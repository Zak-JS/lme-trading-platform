import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { MetalIcon } from "@/components/ui/MetalIcon";
import { DataCell } from "@/components/ui/DataCell";
import { X, AlertTriangle, Check, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  usePricesQuery,
  usePendingOrdersQuery,
  useCancelOrderMutation,
} from "../api";
import type { Trade } from "@lme/shared";

type FlowState = "idle" | "confirming" | "canceling" | "success";

function PendingOrderRow({
  order,
  onCancel,
  currentPrice,
}: {
  order: Trade;
  onCancel: (id: string) => void;
  currentPrice: number;
}) {
  const [flowState, setFlowState] = useState<FlowState>("idle");

  const handleInitiateCancel = () => setFlowState("confirming");
  const handleAbortCancel = () => setFlowState("idle");

  const handleConfirmCancel = () => {
    setFlowState("canceling");
    onCancel(order.id);
  };

  const limitPrice = order.limitPrice ?? 0;
  const percentAway =
    currentPrice > 0
      ? (Math.abs(limitPrice - currentPrice) / currentPrice) * 100
      : 0;

  const timeStr = new Date(order.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border-b border-border/50 last:border-0">
      <div
        className={cn(
          "p-4 transition-colors",
          flowState === "idle" ? "hover:bg-muted/20" : "bg-muted/10",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Metal, Side, Time */}
          <div className="flex items-center gap-3">
            <MetalIcon symbol={order.symbol} size="md" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{order.symbol}</span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    order.side === "BUY"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-amber-500/15 text-amber-400",
                  )}
                >
                  {order.side}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeStr}
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="font-medium text-foreground">
                  {order.quantity} Lots
                </span>
                <span>@</span>
                <DataCell
                  value={limitPrice}
                  format="price"
                  className="font-medium text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Middle: Current Price & Status */}
          <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
              Current Price
            </div>
            <DataCell
              value={currentPrice}
              format="price"
              className="font-medium text-sm"
            />
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {percentAway.toFixed(2)}% away
            </div>
          </div>

          {/* Right: Action */}
          <div className="flex items-center justify-end min-w-[90px]">
            {flowState === "idle" && (
              <button
                onClick={handleInitiateCancel}
                className="text-xs font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Cancel Flow Area */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            flowState !== "idle" ? "max-h-48 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="pt-4 mt-4 border-t border-border/40">
            {flowState === "confirming" && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/30 rounded-md p-3 border border-border/50 gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="bg-amber-500/10 p-1.5 rounded-full shrink-0 mt-0.5 sm:mt-0">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-sm text-foreground leading-snug">
                    Cancel order to{" "}
                    <span className="font-semibold">
                      {order.side} {order.quantity} {order.symbol}
                    </span>{" "}
                    @ ${limitPrice.toLocaleString()}?
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleAbortCancel}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-medium border border-border/60 text-muted-foreground hover:bg-muted/20 transition-colors"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Confirm Cancel
                  </button>
                </div>
              </div>
            )}

            {flowState === "canceling" && (
              <div className="flex items-center justify-center py-3 gap-3">
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                <p className="text-sm text-muted-foreground font-medium">
                  Canceling order...
                </p>
              </div>
            )}

            {flowState === "success" && (
              <div className="flex items-center justify-center py-3 gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-emerald-500">
                  Order Canceled
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PendingOrders() {
  const { data: pricesData } = usePricesQuery();
  const { data: pendingData } = usePendingOrdersQuery();
  const cancelOrder = useCancelOrderMutation();

  const prices = pricesData?.prices ?? [];
  const orders = pendingData?.orders ?? [];

  const getCurrentPrice = (symbol: string): number => {
    const price = prices.find((p) => p.symbol === symbol);
    return price?.price ?? 0;
  };

  const handleCancel = (orderId: string) => {
    cancelOrder.mutate(orderId);
  };

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border/60">
        <h2 className="font-semibold text-base flex items-center gap-2">
          Pending Orders
          <span className="text-muted-foreground text-sm font-normal">
            ({orders.length})
          </span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
            <Clock className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-medium">No pending orders</p>
          </div>
        ) : (
          orders.map((order: Trade) => (
            <PendingOrderRow
              key={order.id}
              order={order}
              onCancel={handleCancel}
              currentPrice={getCurrentPrice(order.symbol)}
            />
          ))
        )}
      </div>
    </Card>
  );
}
