import { useState } from "react";
import type { Position } from "@lme/shared";
import { Card } from "@/components/ui/Card";
import { MetalIcon } from "@/components/ui/MetalIcon";
import { DataCell } from "@/components/ui/DataCell";
import {
  TrendingUp,
  TrendingDown,
  X,
  Loader2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClosePositionMutation } from "../api";

interface PositionCardProps {
  position: Position;
}

type FlowState = "idle" | "confirming" | "closing" | "success" | "error";

export function PositionCard({ position }: PositionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const closePosition = useClosePositionMutation();
  const isPositive = position.unrealizedPnL >= 0;
  const PnLIcon = isPositive ? TrendingUp : TrendingDown;
  // Use side from backend if available, fallback to quantity-based logic
  const side = position.side || (position.quantity > 0 ? "LONG" : "SHORT");

  const handleInitiateClose = () => setFlowState("confirming");
  const handleCancelClose = () => setFlowState("idle");

  const handleConfirmClose = () => {
    setFlowState("closing");
    closePosition.mutate(
      { position },
      {
        onSuccess: () => {
          setFlowState("success");
          // Reset after showing success
          setTimeout(() => setFlowState("idle"), 2000);
        },
        onError: () => {
          setFlowState("error");
        },
      },
    );
  };

  return (
    <Card
      className={cn(
        "p-5 transition-all hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5",
        flowState === "confirming" &&
          "border-amber-500/40 shadow-lg shadow-amber-500/5",
        flowState === "success" &&
          "border-emerald-500/40 shadow-lg shadow-emerald-500/5",
        flowState === "error" && "border-red-500/40 shadow-lg shadow-red-500/5",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => flowState === "idle" && setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <MetalIcon symbol={position.symbol} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{position.symbol}</h3>
              <span
                className={cn(
                  "inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium h-4",
                  side === "LONG"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-amber-500/15 text-amber-400",
                )}
              >
                {side}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{position.symbol}</p>
          </div>
        </div>

        {/* P&L Container */}
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-right",
            isPositive ? "bg-emerald-500/10" : "bg-red-500/10",
          )}
        >
          <div className="flex items-center justify-end gap-1.5">
            <PnLIcon
              className={cn(
                "h-3.5 w-3.5",
                isPositive ? "text-emerald-500" : "text-red-500",
              )}
            />
            <DataCell
              value={position.unrealizedPnL}
              format="price"
              showSign
              className="font-bold text-base"
            />
          </div>
          <DataCell
            value={position.unrealizedPnLPercent}
            format="percent"
            showSign
            className="text-xs"
          />
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Quantity
          </p>
          <p className="font-mono font-medium text-sm">
            {Math.abs(position.quantity)} Lots
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Avg Entry
          </p>
          <DataCell
            value={position.avgCost}
            format="price"
            className="font-medium text-sm"
          />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Current
          </p>
          <DataCell
            value={position.currentPrice}
            format="price"
            className="font-medium text-sm"
          />
        </div>
      </div>

      {/* Close Position Flow - Always rendered, animated via CSS */}
      <div
        className={cn(
          "mt-4 border-t overflow-hidden transition-all duration-300 ease-out",
          flowState === "confirming" && "border-amber-500/40",
          flowState === "success" && "border-emerald-500/40",
          flowState === "error" && "border-red-500/40",
          flowState === "idle" && "border-border/30",
          // Animate height and opacity based on visibility
          isHovered || flowState !== "idle"
            ? "max-h-96 opacity-100 pt-4"
            : "max-h-0 opacity-0 pt-0 border-transparent",
        )}
      >
        {/* Idle State - Show close button */}
        {flowState === "idle" && (
          <button
            onClick={handleInitiateClose}
            className="w-full py-2 rounded-md text-xs font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            Close Position
          </button>
        )}

        {/* Confirming State - Show confirmation panel */}
        {flowState === "confirming" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
              <div className="flex items-start gap-3 mb-3">
                <div className="mt-0.5 bg-amber-500/10 p-1.5 rounded-full shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground leading-snug mb-2">
                    Close{" "}
                    <span className="font-semibold">
                      {Math.abs(position.quantity)} lots {position.symbol}{" "}
                      {side}
                    </span>{" "}
                    at market price ~${position.currentPrice.toLocaleString()}
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-card rounded px-2.5 py-1.5 border border-border/50">
                    <span>Realized P&L:</span>
                    <span
                      className={cn(
                        "font-bold",
                        isPositive ? "text-emerald-500" : "text-red-500",
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {position.unrealizedPnL.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider font-medium">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancelClose}
                className="flex-1 py-2 rounded-md text-xs font-medium border border-border/60 text-muted-foreground hover:bg-muted/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClose}
                className="flex-1 py-2 rounded-md text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Confirm Close
              </button>
            </div>
          </div>
        )}

        {/* Closing State - Loading */}
        {flowState === "closing" && (
          <div className="flex flex-col items-center justify-center py-6 animate-in fade-in duration-200">
            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin mb-3" />
            <p className="text-sm text-muted-foreground font-medium">
              Closing position...
            </p>
          </div>
        )}

        {/* Success State */}
        {flowState === "success" && (
          <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-emerald-500 mb-1">
              Position Closed
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Locked in:</span>
              <span
                className={cn(
                  "font-bold",
                  isPositive ? "text-emerald-500" : "text-red-500",
                )}
              >
                {isPositive ? "+" : ""}
                {position.unrealizedPnL.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {flowState === "error" && (
          <div className="flex flex-col items-center justify-center py-4 animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-sm font-semibold text-red-500 mb-3">
              Failed to close position
            </p>
            <div className="flex gap-2 w-full">
              <button
                onClick={handleCancelClose}
                className="flex-1 py-2 rounded-md text-xs font-medium border border-border/60 text-muted-foreground hover:bg-muted/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClose}
                className="flex-1 py-2 rounded-md text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
