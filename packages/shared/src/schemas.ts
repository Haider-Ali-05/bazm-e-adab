// ============================================
// Bazm-e-Adab — Zod Validation Schemas
// ============================================

import { z } from 'zod';
import {
  GENRES,
  SCRIPT_TYPES,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  MAX_TITLE_LENGTH,
  MAX_POEM_BODY_LENGTH,
  MAX_COMMENT_LENGTH,
  MAX_BIO_LENGTH,
  MAX_TAGS,
  MAX_TAG_LENGTH,
} from './constants';

// ─── Auth Schemas ────────────────────────────

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(40, 'Username must be at most 40 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim(),
  email: z.string().email('Invalid email address').max(255).trim().toLowerCase(),
  password: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .max(128, 'Password must be at most 128 characters'),
  display_name: z.string().min(1).max(100).trim().optional(),
  education: z
    .object({
      degree: z.string().max(200).optional(),
      institution: z.string().max(200).optional(),
      year: z.number().int().min(1900).max(2100).optional(),
    })
    .optional(),
  metadata: z
    .object({
      city: z.string().max(100).optional(),
      country: z.string().max(100).optional(),
      preferred_language: z.enum(['ur', 'en']).optional(),
      genres: z.array(z.enum(GENRES)).optional(),
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email().max(255).trim().toLowerCase(),
  password: z.string().min(1).max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(255).trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .max(128, 'Password must be at most 128 characters'),
});

// ─── Poem Schemas ────────────────────────────

export const createPoemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(MAX_TITLE_LENGTH).trim(),
  body: z.string().min(1, 'Poetry body is required').max(MAX_POEM_BODY_LENGTH).trim(),
  script_type: z.enum(SCRIPT_TYPES),
  genre: z.enum(GENRES).optional(),
  tags: z.array(z.string().max(MAX_TAG_LENGTH).trim()).max(MAX_TAGS).optional(),
});

export const updatePoemSchema = createPoemSchema.partial();

// ─── Comment Schemas ─────────────────────────

export const createCommentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(MAX_COMMENT_LENGTH).trim(),
  parent_id: z.string().uuid().optional(),
});

// ─── User Profile Schemas ────────────────────

export const updateProfileSchema = z.object({
  display_name: z.string().min(1).max(100).trim().optional(),
  bio: z.string().max(MAX_BIO_LENGTH).trim().optional(),
  education: z
    .object({
      degree: z.string().max(200).optional(),
      institution: z.string().max(200).optional(),
      year: z.number().int().min(1900).max(2100).optional(),
    })
    .optional(),
  metadata: z
    .object({
      city: z.string().max(100).optional(),
      country: z.string().max(100).optional(),
      preferred_language: z.enum(['ur', 'en']).optional(),
      genres: z.array(z.enum(GENRES)).optional(),
    })
    .optional(),
});

// ─── Ticket Schemas ──────────────────────────

export const createTicketSchema = z.object({
  email: z.string().email().max(255).trim(),
  category: z.enum(TICKET_CATEGORIES),
  subject: z.string().min(1).max(300).trim(),
  body: z.string().min(1).max(5000).trim(),
  related_poem_id: z.string().uuid().optional(),
  evidence_urls: z.array(z.string().url()).max(10).optional(),
  original_author: z.string().max(200).trim().optional(),
});

export const ticketMessageSchema = z.object({
  body: z.string().min(1).max(5000).trim(),
});

// ─── Search Schemas ──────────────────────────

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(500).trim(),
  genre: z.enum(GENRES).optional(),
  script: z.enum(SCRIPT_TYPES).optional(),
  poet: z.string().uuid().optional(),
  sort: z.enum(['relevance', 'newest', 'popular']).optional().default('relevance'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

// ─── Pagination Schema ──────────────────────

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

// Type exports
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreatePoemInput = z.infer<typeof createPoemSchema>;
export type UpdatePoemInput = z.infer<typeof updatePoemSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type TicketMessageInput = z.infer<typeof ticketMessageSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
