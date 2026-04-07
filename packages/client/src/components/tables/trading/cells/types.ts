import type { MetalSymbol, MetalPrice } from "@lme/shared";

export interface ExtendedMetalPrice extends MetalPrice {
  ask: number;
}

export interface TradingGridContext {
  selectedSymbol: MetalSymbol;
}
