import * as mammoth from 'mammoth';

export interface ParsedDocument {
  lines: string[];
  title: string | null;
  rawText: string;
  lineCount: number;
  warnings: string[];
}

/**
 * Parses raw text into a Structured format suitable for poem detection.
 */
export function parseRawText(text: string): ParsedDocument {
  const rawLines = text.split(/\r?\n/);
  const lines: string[] = [];
  
  for (const line of rawLines) {
    const trimmed = line.trim();
    if (trimmed !== '') {
      lines.push(trimmed);
    } else if (lines.length > 0 && lines[lines.length - 1] !== '') {
      lines.push(''); // Preserve empty line as separator
    }
  }

  // Remove trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  // Detect title - simple heuristic: First line if isolated, or separate from verses
  let title: string | null = null;
  if (lines.length >= 3 && lines[1] === '') {
    title = lines[0];
    lines.splice(0, 2); // Remove title and separator
  }

  return {
    lines,
    title,
    rawText: text,
    lineCount: lines.filter(l => l.length > 0).length,
    warnings: [],
  };
}

/**
 * Parses a DOCX buffer into a ParsedDocument
 */
export async function parseDocx(buffer: Buffer): Promise<ParsedDocument> {
  const warnings: string[] = [];
  
  try {
    const result = await mammoth.extractRawText({ buffer });
    
    if (result.messages && result.messages.length > 0) {
      warnings.push(...result.messages.map(m => m.message));
    }
    
    const text = result.value;
    
    // Check for weird unicode replacement characters that indicate garbled encoding
    if (text.includes('\ufffd')) {
      warnings.push('Document contains garbled characters (Unicode replacement characters found).');
    }
    
    const parsed = parseRawText(text);
    parsed.warnings.push(...warnings);
    
    if (parsed.lineCount < 2) {
      parsed.warnings.push('Document contains less than 2 lines. May not be a valid poem.');
    }
    
    return parsed;
  } catch (err: any) {
    warnings.push(`Mammoth extraction failed: ${err.message}. Ensure it is a valid DOCX.`);
    // Return empty fallback
    return {
      lines: [],
      title: null,
      rawText: '',
      lineCount: 0,
      warnings
    };
  }
}
