import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { BookFormatter } from '../services/book/formatter';
import { TEMPLATES } from '../services/book/templates';
import { getAvailableFonts } from '../services/book/fonts';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { FontSanitizer } from '../services/book/font-sanitizer';

const formatter = new BookFormatter();

export default async function bookRoutes(server: FastifyInstance) {
  // Public routes for config
  server.get('/templates', async () => {
    return Object.values(TEMPLATES);
  });

  server.get('/fonts', async () => {
    return getAvailableFonts();
  });

  // Protected routes
  server.post('/fonts', { preValidation: [authenticate] }, async (request, reply) => {
    // Assume fastify-multipart is used
    const data = await (request as any).file();
    if (!data) {
      return reply.status(400).send({ error: 'No font file uploaded.' });
    }

    const tempPath = path.join(os.tmpdir(), data.filename);
    const buffer = await data.toBuffer();
    await fs.writeFile(tempPath, buffer);

    const destDir = path.join(process.cwd(), 'uploads', 'fonts');
    const result = await FontSanitizer.sanitize(tempPath, data.filename, data.mimetype, destDir);
    
    await fs.unlink(tempPath).catch(() => {});

    if (!result.success) {
      return reply.status(400).send({ error: result.error });
    }

    return reply.status(200).send({
      message: 'Font uploaded and sanitized successfully.',
      fontFamily: result.fontFamily,
      safePath: result.safePath
    });
  });
  server.post('/', { preValidation: [authenticate] }, async (request, reply) => {
    // Note: Assuming fastify-multipart is configured for file uploads in a full app.
    // For this implementation, we will accept a JSON payload with sourceText for simplicity.
    const schema = z.object({
      title: z.string(),
      poetName: z.string().optional(),
      templateId: z.string().default('modern'),
      fontName: z.string().optional(),
      fontSize: z.number().optional(),
      sourceText: z.string()
    });

    const body = schema.parse(request.body);

    const template = TEMPLATES[body.templateId];
    if (template?.isPremium && !(request.user as any)?.isPremium) {
      return reply.status(403).send({ error: 'This template requires a premium subscription.' });
    }

    const result = await formatter.formatBook({
      userId: request.user!.id,
      title: body.title,
      poetName: body.poetName,
      templateId: body.templateId,
      fontName: body.fontName,
      fontSize: body.fontSize,
      sourceType: 'text',
      sourceText: body.sourceText
    });

    return reply.status(201).send(result);
  });

  server.get('/', { preValidation: [authenticate] }, async (request) => {
    const limit = (request.query as any).limit ? parseInt((request.query as any).limit) : 20;
    return await formatter.getUserBooks(request.user!.id, limit);
  });

  server.get('/:id', { preValidation: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const book = await formatter.getBook(id, request.user!.id);
      return book;
    } catch (error) {
      return reply.status(404).send({ error: 'Book not found' });
    }
  });

  server.get('/:id/download', { preValidation: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const book = await formatter.getBook(id, request.user!.id);
      if (!book.pdf_url) return reply.status(404).send({ error: 'PDF not generated yet' });
      
      const buffer = await fs.readFile(book.pdf_url);
      reply.header('Content-Type', 'application/pdf');
      reply.header('Content-Disposition', `attachment; filename="${book.title}.pdf"`);
      return reply.send(buffer);
    } catch (error) {
      return reply.status(404).send({ error: 'Book or PDF not found' });
    }
  });

  server.delete('/:id', { preValidation: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await formatter.deleteBook(id, request.user!.id);
    return reply.status(204).send();
  });
}
