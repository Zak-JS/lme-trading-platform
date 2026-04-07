import type { MetalSymbol } from "../constants/metals.js";
import type { TradeSide, OrderType, Trade, Position } from "./trading.js";
import type { MetalPrice, PriceCandle } from "./metals.js";

export interface CreateTradeRequest {
  symbol: MetalSymbol;
  side: TradeSide;
  orderType: OrderType;
  quantity: number;
  limitPrice?: number;
}

export interface CreateTradeResponse {
  trade: Trade;
  updatedPosition: Position | null;
}

export interface PriceHistoryParams {
  symbol: MetalSymbol;
  interval: "1m" | "5m" | "15m" | "1h" | "1d";
  from?: string;
  to?: string;
  limit?: number;
}

export interface PriceHistoryResponse {
  symbol: MetalSymbol;
  interval: string;
  candles: PriceCandle[];
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PricesResponse {
  prices: MetalPrice[];
  updatedAt: string;
}

export interface PositionsResponse {
  positions: Position[];
}

export interface TradesResponse {
  trades: Trade[];
}
