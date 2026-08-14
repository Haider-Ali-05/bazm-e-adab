import { FastifyInstance } from 'fastify';
import { TicketService } from '../services/ticket.service';
import { authenticate, requireRole } from '../middleware/auth';

export default async function (fastify: FastifyInstance) {
  const ticketService = new TicketService();

  fastify.post('/', async (request, reply) => {
    let userId = null;
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'super_secret_key_change_me') as any;
        userId = decoded.id;
      } catch (e) {}
    }
    
    if (!request.body || !(request.body as any).email) {
      return reply.status(400).send({ error: 'Email is required' });
    }

    const result = await ticketService.createTicket(userId, request.body);
    return reply.send(result);
  });

  fastify.get('/', { preHandler: [authenticate, requireRole('admin')] }, async (request, reply) => {
    const { status, limit, cursor } = request.query as any;
    const result = await ticketService.getTickets({
      status,
      limit: limit ? parseInt(limit) : 20,
      cursor
    });
    return reply.send(result);
  });

  fastify.get('/my', { preHandler: [authenticate] }, async (request, reply) => {
    const { status, limit, cursor } = request.query as any;
    const result = await ticketService.getTickets({
      userId: request.user!.id,
      status,
      limit: limit ? parseInt(limit) : 20,
      cursor
    });
    return reply.send(result);
  });

  fastify.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    try {
      const result = await ticketService.getTicket(id, request.user!.id, request.user!.role);
      if (!result) return reply.status(404).send({ error: 'Not found' });
      return reply.send(result);
    } catch (e: any) {
      if (e.message === 'Forbidden') return reply.status(403).send({ error: 'Forbidden' });
      throw e;
    }
  });

  fastify.post('/:id/messages', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as any;
    const { body } = request.body as any;
    if (!body) return reply.status(400).send({ error: 'Message body required' });

    try {
      // Basic check if user can reply
      await ticketService.getTicket(id, request.user!.id, request.user!.role);
      
      const result = await ticketService.addMessage(id, request.user!.id, request.user!.role, body);
      return reply.send(result);
    } catch (e: any) {
      if (e.message === 'Forbidden') return reply.status(403).send({ error: 'Forbidden' });
      return reply.status(400).send({ error: e.message });
    }
  });
}
