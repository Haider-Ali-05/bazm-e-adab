import { FastifyInstance } from 'fastify';
import { CopyrightService } from '../services/copyright.service';
import analyticsRoutes from './analytics.routes';

export default async function (fastify: FastifyInstance) {
    fastify.register(analyticsRoutes, { prefix: '/analytics' });

    fastify.get('/copyright-reports', async (request, reply) => {
        const reports = await CopyrightService.getReports();
        return reply.send(reports);
    });

    fastify.post('/copyright-reports/:id/status', async (request, reply) => {
        const { status } = request.body as any;
        const { id } = request.params as any;
        const result = await CopyrightService.updateReportStatus(Number(id), status);
        return reply.send(result);
    });
}