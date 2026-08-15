import { FastifyInstance } from 'fastify';
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
}