import { parseDocx, parseRawText } from './docx-parser';
import { detectStructure } from './verse-detector';
import { alignCouplet } from './kashida-aligner';
import { getTemplate, mergeCustomSettings } from './templates';
import { generateTypstMarkup, compileTypst } from './typst-generator';
import { query } from '../../db/client';
import * as path from 'path';
import * as os from 'os';

export class BookFormatter {
  async formatBook(input: {
    userId: string;
    title: string;
    poetName?: string;
    templateId: string;
    fontName?: string;
    fontSize?: number;
    customSettings?: any;
    sourceType: 'text' | 'docx';
    sourceText?: string;
    sourceBuffer?: Buffer;
  }) {
    // 1. Parse Source
    let parsedDoc;
    if (input.sourceType === 'docx' && input.sourceBuffer) {
      parsedDoc = await parseDocx(input.sourceBuffer);
    } else if (input.sourceType === 'text' && input.sourceText) {
      parsedDoc = parseRawText(input.sourceText);
    } else {
      throw new Error('Invalid source provided');
    }

    // 2. Detect Structure
    const structuredPoem = detectStructure(parsedDoc.lines, input.title);

    // 3. Get Template
    let template = getTemplate(input.templateId);
    if (input.customSettings) {
      template = mergeCustomSettings(template, input.customSettings);
    }
    if (input.fontSize) {
      template.typography.baseFontSizePt = input.fontSize;
    }

    // 4. Align Couplets
    const alignedCouplets = structuredPoem.couplets.map(c => alignCouplet(c.misra1, c.misra2));

    // 5. Generate Typst Markup
    const typstMarkup = generateTypstMarkup(structuredPoem, alignedCouplets, template, {
      fontName: input.fontName || 'Jameel Noori Nastaleeq',
      bookTitle: input.title,
      poetName: input.poetName
    });

    // Save initial record to DB to get UUID
    const idResult = await query(
      `INSERT INTO books (user_id, title, poet_name, template_id, font_name, font_size_pt, poem_type, couplet_count, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'processing') RETURNING id`,
      [input.userId, input.title, input.poetName || null, input.templateId, input.fontName || 'Jameel Noori Nastaleeq', 
       template.typography.baseFontSizePt, structuredPoem.type, structuredPoem.metadata.coupletCount]
    );
    const bookId = idResult.rows[0].id;

    // 6. Compile PDF
    const outputDir = path.join(os.tmpdir(), 'bazm-pdf-output');
    try {
      await require('fs/promises').mkdir(outputDir, { recursive: true });
    } catch {}
    
    const compileResult = await compileTypst(typstMarkup, outputDir, bookId);

    // 7. Update DB
    let status = compileResult.outputPath ? 'completed' : 'failed_compilation';
    await query(
      `UPDATE books SET 
         page_count = $1, 
         pdf_url = $2, 
         pdf_generated_at = NOW(), 
         status = $3, 
         updated_at = NOW()
       WHERE id = $4`,
      [compileResult.pageCount, compileResult.outputPath, status, bookId]
    );

    return { bookId, status, pageCount: compileResult.pageCount, pdfUrl: compileResult.outputPath };
  }

  async getBook(bookId: string, userId: string) {
    const res = await query('SELECT * FROM books WHERE id = $1 AND user_id = $2', [bookId, userId]);
    if (res.rows.length === 0) throw new Error('Book not found');
    return res.rows[0];
  }

  async getUserBooks(userId: string, limit: number = 20) {
    const res = await query('SELECT * FROM books WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2', [userId, limit]);
    return res.rows;
  }

  async deleteBook(bookId: string, userId: string) {
    await query('DELETE FROM books WHERE id = $1 AND user_id = $2', [bookId, userId]);
  }
}
