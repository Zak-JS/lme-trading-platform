import {
  METALS,
  type MetalPrice,
  type MetalSymbol,
  type PriceDirection,
} from "@lme/shared";

const HISTORY_LENGTH = 20;

interface PriceState {
  symbol: MetalSymbol;
  name: string;
  price: number;
  previousPrice: number;
  previousClose: number;
  high: number;
  low: number;
  volume: number;
  updatedAt: Date;
  priceHistory: number[];
}

class PriceService {
  private prices: Map<MetalSymbol, PriceState> = new Map();
  private listeners: Set<(price: MetalPrice) => void> = new Set();

  constructor() {
    this.initializePrices();
  }

  private initializePrices() {
    // Base volumes per metal (lots traded per day)
    const baseVolumes: Record<string, number> = {
      CU: 45000,
      AL: 38000,
      ZN: 28000,
      NI: 18000,
      PB: 12000,
      SN: 8000,
    };

    for (const metal of METALS) {
      const basePrice = metal.basePrice;
      // Generate initial price history with realistic variance
      const priceHistory = this.generateInitialHistory(basePrice);
      this.prices.set(metal.symbol as MetalSymbol, {
        symbol: metal.symbol as MetalSymbol,
        name: metal.name,
        price: basePrice,
        previousPrice: basePrice,
        previousClose: basePrice,
        high: basePrice,
        low: basePrice,
        volume: baseVolumes[metal.symbol] ?? 10000,
        updatedAt: new Date(),
        priceHistory,
      });
    }
  }

  getAllPrices(): MetalPrice[] {
    return Array.from(this.prices.values()).map((state) =>
      this.toMetalPrice(state),
    );
  }

  getPrice(symbol: MetalSymbol): MetalPrice | null {
    const state = this.prices.get(symbol);
    return state ? this.toMetalPrice(state) : null;
  }

  private generateInitialHistory(basePrice: number): number[] {
    const history: number[] = [];
    let currentPrice = basePrice;
    for (let i = 0; i < HISTORY_LENGTH; i++) {
      const change = currentPrice * (Math.random() * 0.03 - 0.015);
      currentPrice += change;
      history.push(Math.round(currentPrice * 100) / 100);
    }
    // Ensure last point is the actual current price
    history[history.length - 1] = basePrice;
    return history;
  }

  private getDirection(state: PriceState): PriceDirection {
    if (state.price > state.previousPrice) return "up";
    if (state.price < state.previousPrice) return "down";
    return "neutral";
  }

  private toMetalPrice(state: PriceState): MetalPrice {
    const change = state.price - state.previousClose;
    const changePercent = (change / state.previousClose) * 100;

    return {
      symbol: state.symbol,
      name: state.name,
      price: Math.round(state.price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      high: Math.round(state.high * 100) / 100,
      low: Math.round(state.low * 100) / 100,
      previousClose: Math.round(state.previousClose * 100) / 100,
      volume: state.volume,
      updatedAt: state.updatedAt.toISOString(),
      priceHistory: state.priceHistory,
      direction: this.getDirection(state),
    };
  }

  simulatePriceMovement() {
    for (const [_symbol, state] of this.prices) {
      const volatility = state.previousClose * 0.001; // 0.1% per tick
      const change = (Math.random() - 0.5) * 2 * volatility;

      // Track previous price before updating for direction calculation
      state.previousPrice = state.price;
      state.price = state.price + change;
      state.high = Math.max(state.high, state.price);
      state.low = Math.min(state.low, state.price);
      state.updatedAt = new Date();

      // Update price history - shift out oldest, add new price
      state.priceHistory = [
        ...state.priceHistory.slice(1),
        Math.round(state.price * 100) / 100,
      ];

      const metalPrice = this.toMetalPrice(state);
      this.notifyListeners(metalPrice);
    }
  }

  onPriceUpdate(listener: (price: MetalPrice) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(price: MetalPrice) {
    for (const listener of this.listeners) {
      listener(price);
    }
  }

  startSimulation(intervalMs: number = 1000) {
    return setInterval(() => this.simulatePriceMovement(), intervalMs);
  }

  getCurrentPrice(symbol: MetalSymbol): number {
    return this.prices.get(symbol)?.price ?? 0;
  }
}

export const priceService = new PriceService();
