import Fastify from 'fastify';
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
