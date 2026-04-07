import { FastifyInstance } from "fastify";
import { positionService } from "../services/index.js";

export async function positionsRoutes(fastify: FastifyInstance) {
  fastify.get("/api/positions", async () => {
    const positions = await positionService.getAllPositions();
    return { positions };
  });

  fastify.get("/api/portfolio", async () => {
    const summary = await positionService.getPortfolioSummary();
    return summary;
  });
}
