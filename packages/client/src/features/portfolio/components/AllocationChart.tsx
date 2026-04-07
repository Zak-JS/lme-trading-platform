import { useState } from "react";
import type { PortfolioSummary } from "@lme/shared";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AllocationChartProps {
  allocation: PortfolioSummary["allocation"];
}

const COLORS: Record<string, string> = {
  CU: "#f97316",
  AL: "#94a3b8",
  ZN: "#a1a1aa",
  NI: "#10b981",
  PB: "#78716c",
  SN: "#d97706",
};

const DONUT_SIZE = 200;
const STROKE_WIDTH = 28;
const RADIUS = (DONUT_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function AllocationChart({ allocation }: AllocationChartProps) {
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  if (allocation.length === 0) {
    return (
      <Card className="p-6 flex h-64 items-center justify-center text-muted-foreground">
        No positions to display
      </Card>
    );
  }

  const totalValue = allocation.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Portfolio Allocation</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Distribution across LME metals by value
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* SVG Donut Chart */}
        <div className="relative flex-shrink-0">
          <svg
            width={DONUT_SIZE}
            height={DONUT_SIZE}
            viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
          >
            {allocation.map((item) => {
              const strokeDash = (item.percentage / 100) * CIRCUMFERENCE;
              const strokeGap = CIRCUMFERENCE - strokeDash;
              const offset =
                -((cumulativePercent / 100) * CIRCUMFERENCE) -
                CIRCUMFERENCE * 0.25;
              cumulativePercent += item.percentage;

              const isHovered = hoveredSymbol === item.symbol;
              const isOtherHovered =
                hoveredSymbol !== null && hoveredSymbol !== item.symbol;

              return (
                <circle
                  key={item.symbol}
                  cx={DONUT_SIZE / 2}
                  cy={DONUT_SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={COLORS[item.symbol] || "#3b82f6"}
                  strokeWidth={isHovered ? STROKE_WIDTH + 4 : STROKE_WIDTH}
                  strokeDasharray={`${strokeDash} ${strokeGap}`}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                  className="transition-all duration-200"
                  style={{ opacity: isOtherHovered ? 0.3 : 1 }}
                  onMouseEnter={() => setHoveredSymbol(item.symbol)}
                  onMouseLeave={() => setHoveredSymbol(null)}
                />
              );
            })}
          </svg>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-xl font-bold font-mono tabular-nums">
              ${(totalValue / 1000000).toFixed(2)}M
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {allocation.map((item) => {
            const isHovered = hoveredSymbol === item.symbol;
            return (
              <div
                key={item.symbol}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors cursor-default",
                  isHovered ? "bg-muted/80" : "hover:bg-muted/40",
                )}
                onMouseEnter={() => setHoveredSymbol(item.symbol)}
                onMouseLeave={() => setHoveredSymbol(null)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[item.symbol] || "#3b82f6" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{item.symbol}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono tabular-nums text-muted-foreground">
                      {formatPrice(item.value)}
                    </span>
                    <span className="text-xs font-mono tabular-nums font-medium">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
