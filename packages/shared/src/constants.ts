// ============================================
// Bazm-e-Adab — Shared Constants
// ============================================

export const GENRES = [
  'ghazal',
  'nazm',
  'hamd',
  'naat',
  'marsiya',
  'rubai',
  'qataat',
  'other',
] as const;

export const GENRE_LABELS: Record<Genre, { ur: string; en: string }> = {
  ghazal: { ur: 'غزل', en: 'Ghazal' },
  nazm: { ur: 'نظم', en: 'Nazm' },
  hamd: { ur: 'حمد', en: 'Hamd' },
  naat: { ur: 'نعت', en: 'Naat' },
  marsiya: { ur: 'مرثیہ', en: 'Marsiya' },
  rubai: { ur: 'رباعی', en: 'Rubai' },
  qataat: { ur: 'قطعات', en: 'Qataat' },
  other: { ur: 'دیگر', en: 'Other' },
};

export type Genre = (typeof GENRES)[number];

export const SCRIPT_TYPES = ['urdu_rasmulkhat', 'roman_urdu'] as const;
export type ScriptType = (typeof SCRIPT_TYPES)[number];

export const SCRIPT_TYPE_LABELS: Record<ScriptType, { ur: string; en: string }> = {
  urdu_rasmulkhat: { ur: 'اردو رسم الخط', en: 'Urdu Script' },
  roman_urdu: { ur: 'رومن اردو', en: 'Roman Urdu' },
};

export const USER_ROLES = ['poet', 'moderator', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const POEM_STATUSES = ['pending', 'published', 'flagged', 'removed'] as const;
export type PoemStatus = (typeof POEM_STATUSES)[number];

export const TICKET_CATEGORIES = ['general', 'copyright', 'bug', 'abuse'] as const;
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export const TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'closed'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

// Limits
export const MAX_TITLE_LENGTH = 500;
export const MAX_POEM_BODY_LENGTH = 50000;
export const MAX_COMMENT_LENGTH = 2000;
export const MAX_BIO_LENGTH = 1000;
export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 50;
