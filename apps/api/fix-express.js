const fs = require('fs');

fs.writeFileSync('src/routes/admin.routes.ts', `import { FastifyInstance } from 'fastify';
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
}`);

fs.writeFileSync('src/routes/poem.routes.ts', `import { FastifyInstance } from 'fastify';
import { runPlagiarismEngine } from '../services/plagiarism/engine';

export default async function (fastify: FastifyInstance) {
    fastify.post('/', async (request, reply) => {
        const { text, authorId } = request.body as any;
        
        const report = await runPlagiarismEngine(text);
        
        if (report.isPlagiarized) {
            return reply.status(403).send({ error: 'Plagiarism detected', report });
        }
        
        return reply.send({ success: true, poem: { text, authorId, simhash: report.simhash } });
    });
}`);

fs.writeFileSync('src/routes/analytics.routes.ts', `import { FastifyInstance } from 'fastify';
import { analyticsService } from '../services/analytics.service';
import { requireAdmin } from '../middleware/auth';

export default async function (fastify: FastifyInstance) {
    fastify.get('/', { preHandler: [requireAdmin] }, async (request, reply) => {
        try {
            const metrics = await analyticsService.getMetrics();
            return reply.send(metrics);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            return reply.status(500).send({ error: 'Failed to fetch analytics metrics' });
        }
    });
}`);

fs.writeFileSync('src/server.ts', `import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';

import adminRoutes from './routes/admin.routes';
import poemRoutes from './routes/poem.routes';
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/book.routes';
import searchRoutes from './routes/search.routes';
import socialRoutes from './routes/social.routes';
import ticketRoutes from './routes/ticket.routes';
import userRoutes from './routes/user.routes';

const app = Fastify({ logger: true });

app.register(cors, {
    origin: '*',
    credentials: true
});
app.register(cookie);
app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
});

app.register(adminRoutes, { prefix: '/api/admin' });
app.register(poemRoutes, { prefix: '/api/poems' });
app.register(authRoutes, { prefix: '/api/auth' });
app.register(bookRoutes, { prefix: '/api/books' });
app.register(searchRoutes, { prefix: '/api/search' });
app.register(socialRoutes, { prefix: '/api/social' });
app.register(ticketRoutes, { prefix: '/api/tickets' });
app.register(userRoutes, { prefix: '/api/users' });

export default app;

if (require.main === module) {
    app.listen({ port: 3000, host: '0.0.0.0' }, () => {
        console.log('Fastify server running on port 3000');
    });
}
`);

fs.writeFileSync('api/index.ts', `import app from '../src/server';
export default async (req: any, res: any) => {
    await app.ready();
    app.server.emit('request', req, res);
};
`);
