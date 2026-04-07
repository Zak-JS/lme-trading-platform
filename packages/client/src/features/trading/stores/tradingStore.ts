import { create } from "zustand";
import type { MetalSymbol } from "@lme/shared";

interface TradingState {
  selectedSymbol: MetalSymbol;
  setSelectedSymbol: (symbol: MetalSymbol) => void;
}

export const useTradingStore = create<TradingState>((set) => ({
  selectedSymbol: "CU",
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
}));
