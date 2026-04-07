import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { tradingKeys } from "./keys";
import type { PricesResponse, TradesResponse, Trade } from "@lme/shared";

export const usePricesQuery = () => {
  return useQuery({
    queryKey: tradingKeys.prices(),
    queryFn: async () => {
      const { data } = await apiClient.get<PricesResponse>("/prices");
      return data;
    },
    refetchInterval: 5000,
  });
};

export const useTradesQuery = () => {
  return useQuery({
    queryKey: tradingKeys.trades(),
    queryFn: async () => {
      const { data } = await apiClient.get<TradesResponse>("/trades");
      return data;
    },
  });
};

export const usePendingOrdersQuery = () => {
  return useQuery({
    queryKey: tradingKeys.pendingOrders(),
    queryFn: async () => {
      const { data } = await apiClient.get<{ orders: Trade[] }>(
        "/orders/pending",
      );
      return data;
    },
    refetchInterval: 5000,
  });
};
