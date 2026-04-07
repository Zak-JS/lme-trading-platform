import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/api/client";
import { portfolioKeys } from "./keys";
import { tradingKeys } from "@/features/trading/api/keys";
import type {
  CreateTradeRequest,
  CreateTradeResponse,
  Position,
  MetalSymbol,
} from "@lme/shared";

interface ClosePositionParams {
  position: Position;
}

export const useClosePositionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ position }: ClosePositionParams) => {
      // To close: LONG → SELL, SHORT → BUY
      const side = position.side || (position.quantity > 0 ? "LONG" : "SHORT");
      const closeTrade: CreateTradeRequest = {
        symbol: position.symbol as MetalSymbol,
        side: side === "LONG" ? "SELL" : "BUY",
        orderType: "MARKET",
        quantity: Math.abs(position.quantity),
      };

      const { data } = await apiClient.post<CreateTradeResponse>(
        "/trades",
        closeTrade,
      );
      return { ...data, closedPosition: position };
    },
    onSuccess: (data) => {
      const { closedPosition } = data;
      toast.success("Position Closed", {
        description: `Closed ${closedPosition.quantity} ${closedPosition.symbol} ${closedPosition.side} position`,
      });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.positions() });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.summary() });
      queryClient.invalidateQueries({ queryKey: tradingKeys.trades() });
    },
    onError: (error) => {
      toast.error("Close Position Failed", {
        description:
          error instanceof Error ? error.message : "Could not close position",
      });
    },
  });
};
