import { useState } from "react";
import type { TradeSide, OrderType } from "@lme/shared";
import { getMetalName } from "@lme/shared";
import { useExecuteTradeMutation } from "../api";
import { usePriceUpdates } from "../hooks/usePriceUpdates";
import { useTradingStore } from "../stores/tradingStore";
import { MetalIcon } from "@/components/ui/MetalIcon";
import { Card } from "@/components/ui/Card";
import { DataCell } from "@/components/ui/DataCell";
import { cn } from "@/lib/utils";
import { Loader2, Minus, Plus } from "lucide-react";

const PRESETS = [1, 5, 10, 25, 50, 100];

export function TradePanel() {
  const { selectedSymbol } = useTradingStore();
  const { pricesMap } = usePriceUpdates();

  const currentPrice = pricesMap.get(selectedSymbol)?.price || 0;
  const metalName = getMetalName(selectedSymbol);
  const [side, setSide] = useState<TradeSide>("BUY");
  const [orderType, setOrderType] = useState<OrderType>("MARKET");
  const [quantity, setQuantity] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<string>(currentPrice.toString());
  const executeTrade = useExecuteTradeMutation();

  const price =
    orderType === "MARKET" ? currentPrice : parseFloat(limitPrice) || 0;
  const estimatedTotal = quantity * price;
  const isBuy = side === "BUY";

  const clamp = (v: number) => Math.min(100, Math.max(1, v));
  const increment = () => setQuantity(clamp(quantity + 1));
  const decrement = () => setQuantity(clamp(quantity - 1));

  const handleQtyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") return;
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) setQuantity(clamp(parsed));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymbol) return;

    try {
      await executeTrade.mutateAsync({
        symbol: selectedSymbol,
        side,
        orderType,
        quantity,
        limitPrice: orderType === "LIMIT" ? parseFloat(limitPrice) : undefined,
      });
      setQuantity(1);
    } catch (error) {
      console.error("Trade failed:", error);
    }
  };

  if (!selectedSymbol) {
    return (
      <Card className="p-6">
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          Select a metal to trade
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      {/* Metal Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MetalIcon symbol={selectedSymbol} size="lg" />
            <div>
              <h2 className="text-lg font-bold tracking-tight">{metalName}</h2>
              <div className="text-xs text-muted-foreground">
                {selectedSymbol}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
              Current Price
            </div>
            <DataCell
              value={currentPrice}
              format="price"
              className="text-2xl font-bold text-foreground"
            />
          </div>
        </div>
      </div>

      {/* BUY / SELL Tabs */}
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => setSide("BUY")}
          className={cn(
            "relative py-3 text-sm font-bold transition-all border-b-2",
            isBuy
              ? "text-emerald-400 border-b-emerald-400 bg-emerald-500/[0.06]"
              : "text-muted-foreground border-b-transparent hover:text-foreground hover:bg-muted/30",
          )}
        >
          BUY
        </button>
        <button
          type="button"
          onClick={() => setSide("SELL")}
          className={cn(
            "relative py-3 text-sm font-bold transition-all border-b-2",
            !isBuy
              ? "text-amber-400 border-b-amber-400 bg-amber-500/[0.06]"
              : "text-muted-foreground border-b-transparent hover:text-foreground hover:bg-muted/30",
          )}
        >
          SELL
        </button>
      </div>

      {/* Form Area — tinted by active side */}
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex-1 overflow-auto transition-colors",
          isBuy ? "bg-emerald-500/[0.02]" : "bg-amber-500/[0.02]",
        )}
      >
        <div className="p-5 space-y-5">
          {/* Order Type */}
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              Order Type
            </label>
            <div className="flex rounded-md bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => setOrderType("MARKET")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-sm transition-colors",
                  orderType === "MARKET"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Market
              </button>
              <button
                type="button"
                onClick={() => setOrderType("LIMIT")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-sm transition-colors",
                  orderType === "LIMIT"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Limit
              </button>
            </div>
          </div>

          {/* Limit Price */}
          {orderType === "LIMIT" && (
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Limit Price (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                required
                className="h-10 w-full rounded-md border border-border/60 bg-muted/20 px-3 text-right text-sm font-mono tabular-nums text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              />
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              Quantity (Lots)
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= 1}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantity}
                  onChange={handleQtyInput}
                  className="h-10 w-full rounded-md border border-border/60 bg-muted/20 text-center text-lg font-bold font-mono tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/50 font-medium pointer-events-none uppercase tracking-wider">
                  Lots
                </span>
              </div>
              <button
                type="button"
                onClick={increment}
                disabled={quantity >= 100}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Presets */}
            <div className="mt-2 grid grid-cols-6 gap-0 rounded-md overflow-hidden border border-border/40">
              {PRESETS.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setQuantity(clamp(p))}
                  className={cn(
                    "py-1.5 text-xs font-medium font-mono tabular-nums transition-colors",
                    i < PRESETS.length - 1 && "border-r border-border/40",
                    quantity === p
                      ? cn(
                          "text-white",
                          isBuy
                            ? "bg-emerald-500/30 text-emerald-300"
                            : "bg-amber-500/30 text-amber-300",
                        )
                      : "bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg bg-muted/30 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">Quantity</span>
              <span className="text-right font-mono tabular-nums font-medium">
                {quantity} Lots
              </span>
              <span className="text-muted-foreground">Price</span>
              <div className="text-right">
                <DataCell
                  value={price}
                  format="price"
                  className="font-medium text-foreground"
                />
                {orderType === "LIMIT" && (
                  <span className="ml-1.5 text-[10px] text-muted-foreground">
                    (Limit)
                  </span>
                )}
              </div>
            </div>
            <div className="border-t border-border/50" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Estimated Total
              </span>
              <DataCell
                value={estimatedTotal}
                format="price"
                className="text-xl font-bold text-foreground"
              />
            </div>
          </div>

          {/* Execute Button */}
          <button
            type="submit"
            disabled={executeTrade.isPending}
            className={cn(
              "w-full h-12 rounded-md text-base font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2",
              isBuy
                ? "bg-emerald-500 hover:bg-emerald-500/90 shadow-lg shadow-emerald-500/20 disabled:bg-emerald-500/50"
                : "bg-amber-500 hover:bg-amber-500/90 shadow-lg shadow-amber-500/20 disabled:bg-amber-500/50",
            )}
          >
            {executeTrade.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                {isBuy ? "Buy" : "Sell"} {quantity} {selectedSymbol} @{" "}
                {orderType === "MARKET"
                  ? "Market"
                  : `$${parseFloat(limitPrice).toLocaleString()}`}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 text-[10px] text-muted-foreground/60 space-y-0.5">
        <p>Trading hours: 01:00 – 19:00 London Time</p>
        <p>Lot size: 25 tonnes (except Ni/Sn: 6t, Co/Mo: 1t)</p>
      </div>
    </Card>
  );
}
