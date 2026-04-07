export const tradingKeys = {
  all: ["trading"] as const,
  prices: () => [...tradingKeys.all, "prices"] as const,
  trades: () => [...tradingKeys.all, "trades"] as const,
  trade: (id: string) => [...tradingKeys.trades(), id] as const,
  pendingOrders: () => [...tradingKeys.all, "pendingOrders"] as const,
};
