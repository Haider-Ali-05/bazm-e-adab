import { FastifyInstance } from 'fastify';
import { analyticsService } from '../services/analytics.service';
import { authenticate, requireRole } from '../middleware/auth';

export default async function (fastify: FastifyInstance) {
    const requireAdmin = requireRole('admin');
    fastify.get('/', { preHandler: [authenticate, requireAdmin] }, async (request, reply) => {
        try {
            const metrics = await analyticsService.getMetrics();
            return reply.send(metrics);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            return reply.status(500).send({ error: 'Failed to fetch analytics metrics' });
        }
    });
}