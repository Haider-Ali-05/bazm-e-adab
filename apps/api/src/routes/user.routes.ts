import { FastifyInstance } from 'fastify';
import { UserService } from '../services/user.service';
import { authenticate } from '../middleware/auth';

export default async function (fastify: FastifyInstance) {
  const userService = new UserService();

  fastify.get('/users/:id', async (request, reply) => {
    const { id } = request.params as any;
    
    let requesterId = undefined;
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'super_secret_key_change_me') as any;
        requesterId = decoded.id;
      } catch (e) {}
    }

    const profile = await userService.getProfile(id, requesterId);
    if (!profile) return reply.status(404).send({ error: 'User not found', code: 'NOT_FOUND' });
    return reply.send(profile);
  });

  fastify.put('/users/me', { preHandler: [authenticate] }, async (request, reply) => {
    const result = await userService.updateProfile(request.user!.id, request.body);
    return reply.send(result);
  });

  fastify.get('/users/:id/poems', async (request, reply) => {
    const { id } = request.params as any;
    const { cursor, limit } = request.query as any;
    const poems = await userService.getUserPoems(id, limit ? parseInt(limit) : 20, cursor);
    return reply.send(poems);
  });

  fastify.get('/users/:id/followers', async (request, reply) => {
    const { id } = request.params as any;
    const { cursor, limit } = request.query as any;
    const followers = await userService.getFollowers(id, limit ? parseInt(limit) : 20, cursor);
    return reply.send(followers);
  });

  fastify.get('/users/:id/following', async (request, reply) => {
    const { id } = request.params as any;
    const { cursor, limit } = request.query as any;
    const following = await userService.getFollowing(id, limit ? parseInt(limit) : 20, cursor);
    return reply.send(following);
  });
}
