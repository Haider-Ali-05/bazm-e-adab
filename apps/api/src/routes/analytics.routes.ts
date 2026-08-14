import { Router } from 'express';
import { analyticsService } from '../services/analytics.service';

export const analyticsRoutes = Router();

// Mock requireAdmin for express since auth.ts is fastify but server is express
const requireAdmin = (req: any, res: any, next: any) => {
    // Basic mock logic, replace with actual express auth later
    next();
};

analyticsRoutes.get('/', requireAdmin, async (req, res) => {
    try {
        const metrics = await analyticsService.getMetrics();
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics metrics' });
    }
});
