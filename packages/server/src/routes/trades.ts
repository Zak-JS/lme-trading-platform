import { FastifyInstance } from "fastify";
import { tradeService } from "../services";
import { createTradeSchema } from "@lme/shared";

export async function tradesRoutes(fastify: FastifyInstance) {
  fastify.get("/api/trades", async () => {
    const trades = await tradeService.getRecentTrades(50);
    return { trades };
  });

  fastify.get("/api/orders/pending", async () => {
    const orders = await tradeService.getPendingOrders();
    return { orders };
  });

  fastify.delete<{ Params: { id: string } }>(
    "/api/orders/:id",
    async (request, reply) => {
      const { id } = request.params;
      const cancelledOrder = await tradeService.cancelOrder(id);

      if (!cancelledOrder) {
        return reply
          .status(404)
          .send({ message: "Order not found or already executed" });
      }

      return { order: cancelledOrder };
    },
  );

  fastify.post<{ Body: unknown }>("/api/trades", async (request, reply) => {
    const parseResult = createTradeSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Invalid trade request",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    try {
      const result = await tradeService.executeTrade(parseResult.data);
      return reply.status(201).send(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Trade execution failed";
      return reply.status(500).send({ message });
    }
  });
}
