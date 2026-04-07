import type { MetalSymbol } from "../constants/metals";

export type PriceDirection = "up" | "down" | "neutral";

export interface MetalPrice {
  symbol: MetalSymbol;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  updatedAt: string;
  priceHistory: number[];
  direction: PriceDirection;
}

export interface PriceCandle {
  symbol: MetalSymbol;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}
