import { FastifyInstance } from 'fastify';
import { pricesRoutes } from './prices';
import { positionsRoutes } from './positions';
import { tradesRoutes } from './trades';

export async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(pricesRoutes);
  await fastify.register(positionsRoutes);
  await fastify.register(tradesRoutes);
}
