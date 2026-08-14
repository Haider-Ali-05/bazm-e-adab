import { FastifyInstance } from 'fastify';
import { SearchService } from '../services/search.service';

export default async function (fastify: FastifyInstance) {
  const searchService = new SearchService();

  fastify.get('/', async (request, reply) => {
    const { q, genre, scriptType, poet, limit, offset } = request.query as any;
    
    try {
      const filters = { genre, scriptType, poet };
      const result = await searchService.search(
        q || '', 
        filters, 
        limit ? parseInt(limit) : 20, 
        offset ? parseInt(offset) : 0
      );
      return reply.send(result);
    } catch (e: any) {
      request.log.error(e);
      return reply.status(500).send({ error: 'Search failed', code: 'SEARCH_FAILED' });
    }
  });

  // Admin endpoint to init index
  fastify.post('/init', async (request, reply) => {
    try {
      await searchService.initIndex();
      return reply.send({ success: true });
    } catch (e: any) {
      request.log.error(e);
      return reply.status(500).send({ error: 'Failed to initialize index' });
    }
  });
}
