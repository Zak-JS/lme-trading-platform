import type { PortfolioSummary } from "@lme/shared";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  Briefcase,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface PortfolioSummaryCardProps {
  summary: PortfolioSummary;
}

export function PortfolioSummaryCard({ summary }: PortfolioSummaryCardProps) {
  const isPositive = summary.totalPnL >= 0;
  const PnLArrow = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Hero: Total Value */}
      <Card className="relative p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Total Value
          </p>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/40">
            <DollarSign className="h-4 w-4 text-foreground/70" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-3xl font-bold font-mono tabular-nums">
            {formatPrice(summary.totalValue)}
          </div>
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${isPositive ? "text-emerald-500" : "text-red-500"}`}
          >
            <PnLArrow className="h-3 w-3" />
            <span>
              {isPositive ? "+" : ""}
              {formatPrice(summary.totalPnL)} vs yesterday
            </span>
          </div>
        </div>
      </Card>

      {/* Day P&L */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Day P&L
          </p>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${isPositive ? "bg-emerald-500/10" : "bg-red-500/10"}`}
          >
            <TrendingUp
              className={`h-4 w-4 ${isPositive ? "text-emerald-500" : "text-red-500"}`}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold font-mono tabular-nums">
            {formatPrice(summary.totalPnL)}
          </div>
          <p
            className={`text-xs font-medium ${isPositive ? "text-emerald-500" : "text-red-500"}`}
          >
            {isPositive ? "+" : ""}
            {summary.totalPnLPercent.toFixed(2)}%
          </p>
        </div>
      </Card>

      {/* Open Positions */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Open Positions
          </p>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/40">
            <Briefcase className="h-4 w-4 text-foreground/70" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold font-mono tabular-nums">
            {summary.positionCount}
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Open positions
          </p>
        </div>
      </Card>

      {/* Margin Used */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Margin Used
          </p>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/40">
            <Percent className="h-4 w-4 text-foreground/70" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold font-mono tabular-nums">62.5%</div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-muted/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-foreground/30"
              style={{ width: "62.5%" }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
