import { StructuredPoem } from './verse-detector';
import { AlignedCouplet } from './kashida-aligner';
import { BookTemplate } from './templates';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const execFileAsync = promisify(execFile);

export interface TypstGenerationResult {
  typstMarkup: string;
  outputPath: string | null;
  pageCount: number;
}

export function generateTypstMarkup(
  poem: StructuredPoem,
  alignedCouplets: AlignedCouplet[],
  template: BookTemplate,
  options: {
    fontName: string;
    poetName?: string;
    bookTitle: string;
    includeTableOfContents?: boolean;
  }
): string {
  let markup = `
#set page(
  width: ${template.page.widthMm}mm,
  height: ${template.page.heightMm}mm,
  margin: (top: ${template.margins.topMm}mm, bottom: ${template.margins.bottomMm}mm, inside: ${template.margins.innerMm}mm, outside: ${template.margins.outerMm}mm),
  header: ${template.header.enabled ? `[#align(center)[#text(size: ${template.header.fontSizePt}pt)[${template.header.content || options.bookTitle}]]]` : 'none'},
  footer: ${template.footer.enabled ? `[#align(center)[#context counter(page).display()]]` : 'none'}
)

#set text(
  font: "${options.fontName}",
  size: ${template.typography.baseFontSizePt}pt,
  dir: rtl,
  lang: "ur"
)

#set par(
  leading: ${template.typography.lineHeight - 1}em,
  justify: true
)

// Title Page
#page[
  #v(1fr)
  #align(center)[
    #text(size: 36pt, weight: "bold")[${options.bookTitle}]
    ${options.poetName ? `\\n#v(1em)\\n#text(size: 20pt)[${options.poetName}]` : ''}
  ]
  #v(1fr)
]
#pagebreak()

// Bismillah
${['hamd', 'naat'].includes(poem.type) ? `#align(center)[#text(size: 24pt)[بسم اللہ الرحمٰن الرحیم]]\\n#v(2em)` : ''}

// Poem Content
`;

  for (let i = 0; i < alignedCouplets.length; i++) {
    const c = alignedCouplets[i];
    
    markup += `#align(center)[`;
    if (c.alignmentMethod === 'kashida') {
      markup += `
  #text(size: ${template.typography.baseFontSizePt * c.adjustments.fontScaleFactor}pt)[${c.misra1}]
  #v(4pt)
  #text(size: ${template.typography.baseFontSizePt * c.adjustments.fontScaleFactor}pt)[${c.misra2}]
`;
    } else {
      markup += `
  #text(size: ${template.typography.baseFontSizePt}pt)[${c.misra1}]
  #v(4pt)
  #text(size: ${template.typography.baseFontSizePt}pt)[${c.misra2}]
`;
    }
    markup += `]`;

    if (i < alignedCouplets.length - 1) {
      markup += `
#v(${template.typography.sherSpacingPt}pt)
#align(center)[#text(size: 10pt, fill: luma(150))[${template.decorations.sherSeparator}]]
#v(${template.typography.sherSpacingPt}pt)
`;
    }
  }

  return markup;
}

export async function compileTypst(typstMarkup: string, outputDir: string, bookId: string): Promise<TypstGenerationResult> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'typst-'));
  const inputPath = path.join(tmpDir, `${bookId}.typ`);
  const outputPath = path.join(outputDir, `${bookId}.pdf`);

  await fs.writeFile(inputPath, typstMarkup, 'utf8');

  try {
    // Timeout of 120s
    await execFileAsync('typst', ['compile', inputPath, outputPath], { timeout: 120000 });
    
    // Attempt basic page count estimation if PDF generated (rough heuristic for MVP)
    // A robust solution uses pdf-lib
    const pdfBuffer = await fs.readFile(outputPath);
    const pdfStr = pdfBuffer.toString('latin1');
    const matches = pdfStr.match(/\/Type\s*\/Page\b/g);
    const pageCount = matches ? matches.length : 1;

    return { typstMarkup, outputPath, pageCount };
  } catch (error) {
    // If typst isn't installed, fail gracefully and return the markup
    console.error('Typst compile failed or Typst not installed:', error);
    return { typstMarkup, outputPath: null, pageCount: 0 };
  } finally {
    // Cleanup typ file
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}
