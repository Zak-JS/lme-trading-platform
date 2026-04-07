import { PriceTable } from "./components/PriceTable";
import { TradePanel } from "./components/TradePanel";
import { RecentTrades } from "./components/RecentTrades";
import { PendingOrders } from "./components/PendingOrders";

export function TradingPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[calc(100vh-8rem)]">
      <div className="lg:col-span-8 flex flex-col gap-6 h-full">
        <div className="flex-1 min-h-[400px]">
          <PriceTable />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <RecentTrades />
          <PendingOrders />
        </div>
      </div>
      <div className="lg:col-span-4 h-full">
        <TradePanel />
      </div>
    </div>
  );
}
