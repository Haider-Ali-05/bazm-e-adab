export function normalizeUrduText(text: string): string {
  if (!text) return text;
  
  // 1. Unicode NFC normalization
  let normalized = text.normalize('NFC');
  
  // 2. Arabic->Urdu character mapping
  normalized = normalized.replace(/ك/g, 'ک'); // Arabic Kaf to Urdu Kaf
  normalized = normalized.replace(/ي/g, 'ی'); // Arabic Yeh to Urdu Choti Yeh
  normalized = normalized.replace(/ه/g, 'ہ'); // Arabic Heh to Urdu Heh
  normalized = normalized.replace(/ى/g, 'ی'); // Alef Maksura to Urdu Yeh
  normalized = normalized.replace(/أ/g, 'ا'); // Normalize Hamza variants
  normalized = normalized.replace(/إ/g, 'ا'); // Normalize Hamza variants
  
  // 3. Whitespace and invisible character normalization
  normalized = normalized.replace(/\s+/g, ' '); // Collapse spaces
  normalized = normalized.replace(/[\u200B\u200D\uFEFF]/g, ''); // Remove ZWSP, ZWJ, BOM
  normalized = normalized.replace(/[\uE000-\uF8FF]/g, ''); // Remove Private Use Area
  // We keep ZWNJ (\u200C) as it is essential for Urdu
  
  // 4. Strip dangerous Unicode (BiDi overrides)
  normalized = normalized.replace(/[\u202A-\u202E\u2066-\u2069]/g, ''); 
  
  return normalized.trim();
}

export function detectScriptType(text: string): 'urdu' | 'roman' {
  const urduRegex = /[\u0600-\u06FF]/;
  return urduRegex.test(text) ? 'urdu' : 'roman';
}

export function getUrduStats(text: string) {
  const normalized = normalizeUrduText(text);
  const chars = normalized.length;
  const words = normalized.split(/\s+/).filter(w => w.length > 0).length;
  const lines = normalized.split(/\r\n|\r|\n/).length;
  return { chars, words, lines };
}
