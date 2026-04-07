import type { MetalSymbol } from "../constants/metals";

export type TradeSide = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT";
export type TradeStatus = "PENDING" | "FILLED" | "REJECTED" | "CANCELLED";
export type PositionSide = "LONG" | "SHORT";

export interface Position {
  id: string;
  symbol: MetalSymbol;
  side: PositionSide;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  id: string;
  symbol: MetalSymbol;
  side: TradeSide;
  orderType: OrderType;
  quantity: number;
  price: number;
  limitPrice: number | null;
  total: number;
  status: TradeStatus;
  executedAt: string | null;
  createdAt: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  positionCount: number;
  allocation: {
    symbol: MetalSymbol;
    value: number;
    percentage: number;
  }[];
}
