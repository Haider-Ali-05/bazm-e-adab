import { FastifyInstance } from 'fastify';
import { SocialService } from '../services/social.service';
import { authenticate } from '../middleware/auth';

export default async function (fastify: FastifyInstance) {
  const socialService = new SocialService();

  fastify.post('/poems/:id/like', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const result = await socialService.toggleLike(request.user!.id, id);
    return reply.send(result);
  });

  fastify.post('/poems/:id/save', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const result = await socialService.toggleSave(request.user!.id, id);
    return reply.send(result);
  });

  fastify.post('/poems/:id/comment', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const data = request.body as { body: string, parentId?: string };
    if (!data.body) return reply.status(400).send({ error: 'Comment body required' });
    
    const result = await socialService.addComment(request.user!.id, id, data);
    return reply.send(result);
  });

  fastify.get('/poems/:id/comments', async (request, reply) => {
    const { id } = request.params as any;
    const result = await socialService.getComments(id);
    return reply.send(result);
  });

  fastify.post('/users/:id/follow', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    try {
      const result = await socialService.toggleFollow(request.user!.id, id);
      return reply.send(result);
    } catch (e: any) {
      return reply.status(400).send({ error: e.message, code: 'FOLLOW_FAILED' });
    }
  });
}
