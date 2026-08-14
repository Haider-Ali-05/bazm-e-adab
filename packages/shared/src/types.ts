// ============================================
// Bazm-e-Adab — Shared TypeScript Types
// ============================================

import type {
  Genre,
  ScriptType,
  UserRole,
  PoemStatus,
  TicketCategory,
  TicketStatus,
  TicketPriority,
} from './constants';

// ─── User ────────────────────────────────────

export interface UserEducation {
  degree?: string;
  institution?: string;
  year?: number;
}

export interface UserMetadata {
  city?: string;
  country?: string;
  preferred_language?: 'ur' | 'en';
  genres?: Genre[];
  strikes?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  education: UserEducation;
  metadata: UserMetadata;
  role: UserRole;
  is_verified: boolean;
  email_verified: boolean;
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
  updated_at: string;
}

export type UserPublic = Omit<User, 'email' | 'email_verified' | 'status'>;

export interface UserProfile extends UserPublic {
  follower_count: number;
  following_count: number;
  poem_count: number;
  is_following?: boolean; // only when viewed by an authenticated user
}

// ─── Poem ────────────────────────────────────

export interface Poem {
  id: string;
  author_id: string;
  title: string;
  body: string;
  body_normalized: string;
  script_type: ScriptType;
  genre: Genre | null;
  tags: string[];
  status: PoemStatus;
  plagiarism_score: number | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  save_count: number;
  created_at: string;
  updated_at: string;
}

export interface PoemWithAuthor extends Poem {
  author: UserPublic;
  is_liked?: boolean;
  is_saved?: boolean;
}

// ─── Comment ─────────────────────────────────

export interface Comment {
  id: string;
  user_id: string;
  poem_id: string;
  parent_id: string | null;
  body: string;
  status: 'visible' | 'hidden' | 'flagged';
  created_at: string;
  user: UserPublic;
  replies?: Comment[];
}

// ─── Ticket ──────────────────────────────────

export interface Ticket {
  id: string;
  user_id: string | null;
  email: string;
  category: TicketCategory;
  subject: string;
  body: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to: string | null;
  related_poem_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string | null;
  sender_role: 'user' | 'admin';
  body: string;
  created_at: string;
}

// ─── API Responses ───────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  cursor: string | null;
  has_more: boolean;
  total?: number;
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, string[]>;
}

export interface AuthTokens {
  access_token: string;
  user: UserPublic;
}

export interface SearchResult {
  hits: PoemWithAuthor[];
  query: string;
  processing_time_ms: number;
  estimated_total_hits: number;
  facet_distribution?: {
    genre?: Record<string, number>;
    script_type?: Record<string, number>;
  };
}
