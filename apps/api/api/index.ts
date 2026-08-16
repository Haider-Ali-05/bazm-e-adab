import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ─── DB Pool ────────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

const db = (text: string, params?: any[]) => pool.query(text, params);

// ─── JWT helpers ─────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_production';

function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

function getUser(req: VercelRequest): any | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    return verifyToken(auth.split(' ')[1]);
  } catch {
    return null;
  }
}

// ─── CORS headers ────────────────────────────────────────────────────────────
function cors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// ─── Router ──────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method || 'GET';

  try {
    // ── Health ──────────────────────────────────────────────────────────────
    if (path === '/api/health' && method === 'GET') {
      return res.json({ status: 'ok', timestamp: new Date().toISOString() });
    }

    // ── Auth: Signup ─────────────────────────────────────────────────────────
    if (path === '/api/auth/signup' && method === 'POST') {
      const { username, email, password, displayName } = req.body as any;
      if (!username || !email || !password)
        return res.status(400).json({ error: 'username, email and password are required' });

      const exists = await db(
        'SELECT 1 FROM users WHERE email=$1 OR username=$2',
        [email, username]
      );
      if (exists.rowCount && exists.rowCount > 0)
        return res.status(409).json({ error: 'Email or username already taken' });

      const hash = await bcrypt.hash(password, 12);
      const result = await db(
        `INSERT INTO users (username, email, password_hash, display_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, display_name, role`,
        [username, email, hash, displayName || username]
      );
      const user = result.rows[0];
      const token = signToken({ id: user.id, role: user.role, username: user.username });
      return res.status(201).json({ token, user });
    }

    // ── Auth: Login ──────────────────────────────────────────────────────────
    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = req.body as any;
      const result = await db('SELECT * FROM users WHERE email=$1', [email]);
      const user = result.rows[0];
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

      const token = signToken({ id: user.id, role: user.role, username: user.username });
      return res.json({
        token,
        user: { id: user.id, username: user.username, email: user.email, role: user.role, display_name: user.display_name }
      });
    }

    // ── Auth: Me ─────────────────────────────────────────────────────────────
    if (path === '/api/auth/me' && method === 'GET') {
      const user = getUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const result = await db(
        'SELECT id, username, email, display_name, role, bio, avatar_url FROM users WHERE id=$1',
        [user.id]
      );
      return res.json(result.rows[0] || null);
    }

    // ── Poems: List ──────────────────────────────────────────────────────────
    if (path === '/api/poems' && method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const genre = url.searchParams.get('genre');
      const authorId = url.searchParams.get('author_id');

      let q = `SELECT p.*, u.username, u.display_name, u.avatar_url
               FROM poems p
               JOIN users u ON u.id = p.author_id
               WHERE p.status = 'published'`;
      const params: any[] = [];

      if (genre) { params.push(genre); q += ` AND p.genre = $${params.length}`; }
      if (authorId) { params.push(authorId); q += ` AND p.author_id = $${params.length}`; }

      q += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await db(q, params);
      return res.json({ poems: result.rows, total: result.rowCount });
    }

    // ── Poems: Get by ID ─────────────────────────────────────────────────────
    const poemMatch = path.match(/^\/api\/poems\/([^/]+)$/);
    if (poemMatch && method === 'GET') {
      const id = poemMatch[1];
      const result = await db(
        `SELECT p.*, u.username, u.display_name, u.avatar_url
         FROM poems p JOIN users u ON u.id = p.author_id
         WHERE p.id = $1`,
        [id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Poem not found' });
      return res.json(result.rows[0]);
    }

    // ── Poems: Create ────────────────────────────────────────────────────────
    if (path === '/api/poems' && method === 'POST') {
      const user = getUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { title, body, genre, script_type, tags } = req.body as any;
      if (!title || !body) return res.status(400).json({ error: 'title and body are required' });

      const result = await db(
        `INSERT INTO poems (title, body, genre, script_type, tags, author_id, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'published')
         RETURNING *`,
        [title, body, genre || 'ghazal', script_type || 'urdu', tags || [], user.id]
      );
      return res.status(201).json(result.rows[0]);
    }

    // ── Poems: Like / Unlike ─────────────────────────────────────────────────
    const likeMatch = path.match(/^\/api\/poems\/([^/]+)\/like$/);
    if (likeMatch) {
      const user = getUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const poemId = likeMatch[1];

      if (method === 'POST') {
        await db(
          `INSERT INTO poem_likes (user_id, poem_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [user.id, poemId]
        );
        await db(`UPDATE poems SET like_count = like_count + 1 WHERE id = $1`, [poemId]);
        return res.json({ liked: true });
      }
      if (method === 'DELETE') {
        const del = await db(
          `DELETE FROM poem_likes WHERE user_id=$1 AND poem_id=$2`,
          [user.id, poemId]
        );
        if (del.rowCount && del.rowCount > 0) {
          await db(`UPDATE poems SET like_count = GREATEST(like_count - 1, 0) WHERE id=$1`, [poemId]);
        }
        return res.json({ liked: false });
      }
    }

    // ── Users: Get profile ───────────────────────────────────────────────────
    const userMatch = path.match(/^\/api\/users\/([^/]+)$/);
    if (userMatch && method === 'GET') {
      const id = userMatch[1];
      const result = await db(
        `SELECT id, username, display_name, bio, avatar_url, role, created_at FROM users WHERE id=$1 OR username=$1`,
        [id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
      return res.json(result.rows[0]);
    }

    // ── Search ───────────────────────────────────────────────────────────────
    if (path === '/api/search' && method === 'GET') {
      const q = url.searchParams.get('q') || '';
      if (!q) return res.json({ poems: [] });
      const result = await db(
        `SELECT p.*, u.username, u.display_name
         FROM poems p JOIN users u ON u.id = p.author_id
         WHERE p.status = 'published'
           AND (p.title ILIKE $1 OR p.body ILIKE $1 OR u.username ILIKE $1)
         ORDER BY p.like_count DESC LIMIT 20`,
        [`%${q}%`]
      );
      return res.json({ poems: result.rows });
    }

    // ── 404 ──────────────────────────────────────────────────────────────────
    return res.status(404).json({ error: `Route ${method} ${path} not found` });

  } catch (err: any) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
}
