import { Router } from 'express';
import { runPlagiarismEngine } from '../services/plagiarism/engine';

export const poemRoutes = Router();

poemRoutes.post('/', async (req, res) => {
    const { text, authorId } = req.body;
    
    // Run plagiarism check
    const report = await runPlagiarismEngine(text);
    
    if (report.isPlagiarized) {
        return res.status(403).json({ error: 'Plagiarism detected', report });
    }
    
    // Mock save
    res.json({ success: true, poem: { text, authorId, simhash: report.simhash } });
});
