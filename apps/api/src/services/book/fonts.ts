export interface FontInfo {
  name: string;
  displayNameUr: string;
  displayNameEn: string;
  style: 'nastaliq' | 'naskh';
  filename: string;
  isBuiltin: boolean;
}

export const BUILTIN_FONTS: FontInfo[] = [
  { name: 'Jameel Noori Nastaleeq', displayNameUr: 'جمیل نوری نستعلیق', displayNameEn: 'Jameel Noori Nastaleeq', style: 'nastaliq', filename: 'JameelNooriNastaleeq.ttf', isBuiltin: true },
  { name: 'Noto Nastaliq Urdu', displayNameUr: 'نوٹو نستعلیق اردو', displayNameEn: 'Noto Nastaliq Urdu', style: 'nastaliq', filename: 'NotoNastaliqUrdu.ttf', isBuiltin: true },
  { name: 'Mehr Nastaliq Web', displayNameUr: 'مہر نستعلیق', displayNameEn: 'Mehr Nastaliq Web', style: 'nastaliq', filename: 'MehrNastaliqWeb.ttf', isBuiltin: true },
  { name: 'Fajer Noori Nastalique', displayNameUr: 'فجر نوری نستعلیق', displayNameEn: 'Fajer Noori Nastalique', style: 'nastaliq', filename: 'FajerNooriNastalique.ttf', isBuiltin: true },
  { name: 'Nafees Nastaleeq', displayNameUr: 'نفیس نستعلیق', displayNameEn: 'Nafees Nastaleeq', style: 'nastaliq', filename: 'NafeesNastaleeq.ttf', isBuiltin: true },
  { name: 'Alvi Nastaleeq', displayNameUr: 'علوی نستعلیق', displayNameEn: 'Alvi Nastaleeq', style: 'nastaliq', filename: 'AlviNastaleeq.ttf', isBuiltin: true },
  { name: 'Noto Naskh Arabic', displayNameUr: 'نوٹو نسخ', displayNameEn: 'Noto Naskh Arabic', style: 'naskh', filename: 'NotoNaskhArabic.ttf', isBuiltin: true },
];

export function getAvailableFonts(): FontInfo[] {
  return BUILTIN_FONTS;
}
