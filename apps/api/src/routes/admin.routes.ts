import { Router } from 'express';
import { CopyrightService } from '../services/copyright.service';
import { analyticsRoutes } from './analytics.routes';

export const adminRoutes = Router();

adminRoutes.use('/analytics', analyticsRoutes);

adminRoutes.get('/copyright-reports', async (req, res) => {
    const reports = await CopyrightService.getReports();
    res.json(reports);
});

adminRoutes.post('/copyright-reports/:id/status', async (req, res) => {
    const { status } = req.body;
    const result = await CopyrightService.updateReportStatus(Number(req.params.id), status);
    res.json(result);
});
