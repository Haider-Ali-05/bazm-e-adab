export interface BookTemplate {
  id: string;
  nameUr: string;
  nameEn: string;
  description: string;
  page: { widthMm: number; heightMm: number };
  margins: { topMm: number; bottomMm: number; innerMm: number; outerMm: number };
  typography: { baseFontSizePt: number; lineHeight: number; sherSpacingPt: number };
  header: { enabled: boolean; content: string; fontSizePt: number };
  footer: { enabled: boolean; content: string; style: 'arabic_numerals' | 'urdu_numerals' | 'none' };
  decorations: { sherSeparator: string; pageBorder: boolean; ornateHeader: boolean };
  isPremium?: boolean;
}

export const TEMPLATES: Record<string, BookTemplate> = {
  classical: {
    id: 'classical',
    nameUr: 'کلاسیکی',
    nameEn: 'Classical',
    description: 'Ornate borders, traditional style for divans and collected works',
    page: { widthMm: 176, heightMm: 250 },
    margins: { topMm: 22, bottomMm: 28, innerMm: 28, outerMm: 20 },
    typography: { baseFontSizePt: 18, lineHeight: 2.4, sherSpacingPt: 28 },
    header: { enabled: true, content: '', fontSizePt: 12 },
    footer: { enabled: true, content: '', style: 'urdu_numerals' },
    decorations: { sherSeparator: '✦', pageBorder: true, ornateHeader: true }
  },
  modern: {
    id: 'modern',
    nameUr: 'جدید',
    nameEn: 'Modern',
    description: 'Minimal clean design for contemporary poetry',
    page: { widthMm: 148, heightMm: 210 },
    margins: { topMm: 20, bottomMm: 25, innerMm: 22, outerMm: 18 },
    typography: { baseFontSizePt: 16, lineHeight: 2.2, sherSpacingPt: 24 },
    header: { enabled: true, content: '', fontSizePt: 10 },
    footer: { enabled: true, content: '', style: 'arabic_numerals' },
    decorations: { sherSeparator: '—', pageBorder: false, ornateHeader: false }
  },
  calligraphic: {
    id: 'calligraphic',
    nameUr: 'خوشنویسی',
    nameEn: 'Calligraphic',
    description: 'Wide margins, large font for gift and display editions',
    page: { widthMm: 210, heightMm: 297 },
    margins: { topMm: 30, bottomMm: 35, innerMm: 35, outerMm: 25 },
    typography: { baseFontSizePt: 22, lineHeight: 2.6, sherSpacingPt: 32 },
    header: { enabled: true, content: '', fontSizePt: 14 },
    footer: { enabled: true, content: '', style: 'urdu_numerals' },
    decorations: { sherSeparator: '❋', pageBorder: true, ornateHeader: true }
  },
  pocket: {
    id: 'pocket',
    nameUr: 'جیبی',
    nameEn: 'Pocket',
    description: 'Compact size for pocket-size poetry collections',
    page: { widthMm: 105, heightMm: 148 },
    margins: { topMm: 12, bottomMm: 15, innerMm: 15, outerMm: 12 },
    typography: { baseFontSizePt: 12, lineHeight: 2.0, sherSpacingPt: 18 },
    header: { enabled: false, content: '', fontSizePt: 8 },
    footer: { enabled: true, content: '', style: 'arabic_numerals' },
    decorations: { sherSeparator: '·', pageBorder: false, ornateHeader: false }
  },
  digital: {
    id: 'digital',
    nameUr: 'ڈیجیٹل',
    nameEn: 'Digital',
    description: 'Screen-optimized layout for e-books and digital reading',
    page: { widthMm: 160, heightMm: 220 },
    margins: { topMm: 18, bottomMm: 22, innerMm: 20, outerMm: 18 },
    typography: { baseFontSizePt: 16, lineHeight: 2.2, sherSpacingPt: 22 },
    header: { enabled: true, content: '', fontSizePt: 10 },
    footer: { enabled: true, content: '', style: 'arabic_numerals' },
    decorations: { sherSeparator: '◆', pageBorder: false, ornateHeader: false }
  },
  royal: {
    id: 'royal',
    nameUr: 'شاہی',
    nameEn: 'Royal',
    description: 'Premium elegant design with rich margins for royal feeling',
    page: { widthMm: 180, heightMm: 260 },
    margins: { topMm: 30, bottomMm: 30, innerMm: 30, outerMm: 25 },
    typography: { baseFontSizePt: 20, lineHeight: 2.5, sherSpacingPt: 30 },
    header: { enabled: true, content: '', fontSizePt: 12 },
    footer: { enabled: true, content: '', style: 'urdu_numerals' },
    decorations: { sherSeparator: '✧', pageBorder: true, ornateHeader: true },
    isPremium: true
  },
  vintage: {
    id: 'vintage',
    nameUr: 'قدیم',
    nameEn: 'Vintage',
    description: 'Premium classic design reminiscent of old manuscripts',
    page: { widthMm: 170, heightMm: 240 },
    margins: { topMm: 25, bottomMm: 25, innerMm: 25, outerMm: 20 },
    typography: { baseFontSizePt: 18, lineHeight: 2.4, sherSpacingPt: 28 },
    header: { enabled: true, content: '', fontSizePt: 10 },
    footer: { enabled: true, content: '', style: 'arabic_numerals' },
    decorations: { sherSeparator: '܀', pageBorder: false, ornateHeader: false },
    isPremium: true
  }
};

export function getTemplate(id: string): BookTemplate {
  return TEMPLATES[id] || TEMPLATES['modern'];
}

export function mergeCustomSettings(template: BookTemplate, custom: Partial<BookTemplate>): BookTemplate {
  return {
    ...template,
    ...custom,
    page: { ...template.page, ...custom.page },
    margins: { ...template.margins, ...custom.margins },
    typography: { ...template.typography, ...custom.typography },
    header: { ...template.header, ...custom.header },
    footer: { ...template.footer, ...custom.footer },
    decorations: { ...template.decorations, ...custom.decorations }
  };
}
