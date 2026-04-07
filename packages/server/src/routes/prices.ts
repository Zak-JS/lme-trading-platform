import { FastifyInstance } from 'fastify';
import { priceService } from '../services';
import { metalSymbolSchema } from '@lme/shared';

export async function pricesRoutes(fastify: FastifyInstance) {
  fastify.get('/api/prices', async () => {
    const prices = priceService.getAllPrices();
    return {
      prices,
      updatedAt: new Date().toISOString(),
    };
  });

  fastify.get<{ Params: { symbol: string } }>('/api/prices/:symbol', async (request, reply) => {
    const parseResult = metalSymbolSchema.safeParse(request.params.symbol);
    
    if (!parseResult.success) {
      return reply.status(400).send({ 
        message: 'Invalid metal symbol',
        validSymbols: ['CU', 'AL', 'ZN', 'PB', 'NI', 'SN'],
      });
    }

    const price = priceService.getPrice(parseResult.data);
    
    if (!price) {
      return reply.status(404).send({ message: 'Price not found' });
    }

    return price;
  });
}
