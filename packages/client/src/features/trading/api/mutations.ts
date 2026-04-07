import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/api/client";
import { tradingKeys } from "./keys";
import { portfolioKeys } from "@/features/portfolio/api/keys";
import type {
  CreateTradeRequest,
  CreateTradeResponse,
  Trade,
} from "@lme/shared";

export const useExecuteTradeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trade: CreateTradeRequest) => {
      const { data } = await apiClient.post<CreateTradeResponse>(
        "/trades",
        trade,
      );
      return data;
    },
    onSuccess: (data) => {
      const { trade } = data;
      const isPending = trade.status === "PENDING";

      if (isPending) {
        toast.info("Limit Order Placed", {
          description: `${trade.side} ${trade.quantity} ${trade.symbol} @ $${trade.limitPrice?.toLocaleString()}`,
        });
      } else {
        toast.success("Trade Executed", {
          description: `${trade.side} ${trade.quantity} ${trade.symbol} @ $${trade.price.toLocaleString()}`,
        });
      }

      queryClient.invalidateQueries({ queryKey: tradingKeys.trades() });
      queryClient.invalidateQueries({ queryKey: tradingKeys.pendingOrders() });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.positions() });
    },
    onError: (error) => {
      toast.error("Trade Failed", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    },
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.delete<{ order: Trade }>(
        `/orders/${orderId}`,
      );
      return data;
    },
    onSuccess: (data) => {
      const { order } = data;
      toast.success("Order Cancelled", {
        description: `${order.side} ${order.quantity} ${order.symbol} order has been cancelled`,
      });
      queryClient.invalidateQueries({ queryKey: tradingKeys.pendingOrders() });
      queryClient.invalidateQueries({ queryKey: tradingKeys.trades() });
    },
    onError: (error) => {
      toast.error("Cancel Failed", {
        description:
          error instanceof Error ? error.message : "Could not cancel order",
      });
    },
  });
};
