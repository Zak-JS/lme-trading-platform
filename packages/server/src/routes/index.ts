import { FastifyInstance } from "fastify";
import { pricesRoutes } from "./prices.js";
import { positionsRoutes } from "./positions.js";
import { tradesRoutes } from "./trades.js";

export async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(pricesRoutes);
  await fastify.register(positionsRoutes);
  await fastify.register(tradesRoutes);
}
