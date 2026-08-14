import express from 'express';
import { adminRoutes } from './routes/admin.routes';
import { poemRoutes } from './routes/poem.routes';

const app = express();
app.use(express.json());

app.use('/api/admin', adminRoutes);
// Cache-Control middleware for public routes
app.use('/api/poems', (req, res, next) => {
    if (req.method === 'GET') {
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    }
    next();
}, poemRoutes);

export default app;

if (require.main === module) {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}
