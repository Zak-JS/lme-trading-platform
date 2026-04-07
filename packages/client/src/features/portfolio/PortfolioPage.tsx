import { usePositionsQuery, usePortfolioSummaryQuery } from "./api";
import { PositionCard } from "./components/PositionCard";
import { PortfolioSummaryCard } from "./components/PortfolioSummaryCard";
import { AllocationChart } from "./components/AllocationChart";
import { PendingOrders } from "@/features/trading/components/PendingOrders";

export function PortfolioPage() {
  const { data: positionsData, isLoading: positionsLoading } =
    usePositionsQuery();
  const { data: summaryData, isLoading: summaryLoading } =
    usePortfolioSummaryQuery();

  const isLoading = positionsLoading || summaryLoading;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading portfolio...
      </div>
    );
  }

  const positions = positionsData?.positions || [];
  const summary = summaryData || {
    totalValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    positionCount: 0,
    allocation: [],
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Portfolio Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your positions and allocation across LME metals
        </p>
      </div>

      {/* Summary Cards */}
      <PortfolioSummaryCard summary={summary} />

      {/* Positions + Allocation — 2 column on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Positions */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div>
            <h2 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
              Open Positions
            </h2>
            <p className="text-lg font-semibold leading-tight">
              Active trades across {positions.length} metals
            </p>
          </div>
          {positions.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-muted-foreground rounded-lg border bg-card">
              No positions yet. Start trading!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {positions.map((position) => (
                <PositionCard key={position.id} position={position} />
              ))}
            </div>
          )}
        </div>

        {/* Allocation & Pending Orders */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
                Allocation
              </h2>
              <p className="text-lg font-semibold leading-tight">
                Portfolio distribution by metal
              </p>
            </div>
            <AllocationChart allocation={summary.allocation} />
          </div>

          {/* Pending Orders */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
                Pending Orders
              </h2>
              <p className="text-lg font-semibold leading-tight">
                Limit orders awaiting execution
              </p>
            </div>
            <PendingOrders />
          </div>
        </div>
      </div>
    </div>
  );
}
