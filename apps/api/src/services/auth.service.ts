import { query } from '../db/client';
import { redis } from '../db/redis';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
const signupSchema: any = null;
const loginSchema: any = null;

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = 7 * 24 * 60 * 60; // 7 days in seconds

export class AuthService {
  async signup(data: any) {
    // Validate
    if (signupSchema) {
      signupSchema.parse(data);
    }

    const { username, email, password, displayName, education, metadata } = data;

    // Check existing
    const existing = await query(`SELECT 1 FROM users WHERE email = $1 OR username = $2`, [email, username]);
    if (existing.rows.length > 0) {
      throw new Error('Email or username already exists');
    }

    const hash = await argon2.hash(password, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4
    });
    
    const result = await query(
      `INSERT INTO users (username, email, password_hash, display_name, education, metadata) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, display_name, role, is_verified, email_verified, status`,
      [username, email, hash, displayName || null, education ? JSON.stringify(education) : null, metadata ? JSON.stringify(metadata) : null]
    );
    
    const user = result.rows[0];
    const verifyToken = jwt.sign({ id: user.id, email: user.email, type: 'verify_email' }, JWT_SECRET, { expiresIn: '24h' });
    
    return { user, verifyToken }; // Note: normally verifyToken is sent via email
  }

  async login(data: any) {
    if (loginSchema) {
      loginSchema.parse(data);
    }

    const { email, password } = data;
    const result = await query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];
    
    if (!user) throw new Error('Invalid credentials');
    if (user.status !== 'active') throw new Error('Account is not active');
    
    const valid = await argon2.verify(user.password_hash, password);
    if (!valid) throw new Error('Invalid credentials');
    
    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = crypto.randomBytes(40).toString('hex');
    
    await redis.setex(`refresh_token:${refreshToken}`, REFRESH_EXPIRES_IN, user.id);
    
    return { 
      token, 
      refreshToken, 
      user: { id: user.id, username: user.username, email: user.email, role: user.role, display_name: user.display_name } 
    };
  }

  async refreshToken(oldRefreshToken: string) {
    const userId = await redis.get(`refresh_token:${oldRefreshToken}`);
    if (!userId) throw new Error('Invalid or expired refresh token');

    const result = await query(`SELECT id, username, role FROM users WHERE id = $1 AND status = 'active'`, [userId]);
    const user = result.rows[0];
    if (!user) throw new Error('User not found or inactive');

    await redis.del(`refresh_token:${oldRefreshToken}`);

    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = crypto.randomBytes(40).toString('hex');
    
    await redis.setex(`refresh_token:${refreshToken}`, REFRESH_EXPIRES_IN, user.id);

    return { token, refreshToken };
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      await redis.del(`refresh_token:${refreshToken}`);
    }
    return { success: true };
  }

  async forgotPassword(email: string) {
    const result = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];
    if (!user) return { message: 'If that email is registered, a password reset link will be sent.' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    await query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt.toISOString()]
    );

    // Normally email the plain resetToken
    return { message: 'If that email is registered, a password reset link will be sent.', _devToken: resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const result = await query(
      `SELECT id, user_id FROM password_reset_tokens WHERE token_hash = $1 AND used = false AND expires_at > CURRENT_TIMESTAMP`,
      [tokenHash]
    );
    const resetRecord = result.rows[0];
    if (!resetRecord) throw new Error('Invalid or expired reset token');

    const hash = await argon2.hash(newPassword, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4
    });

    await query('BEGIN');
    try {
      await query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [hash, resetRecord.user_id]);
      await query(`UPDATE password_reset_tokens SET used = true WHERE id = $1`, [resetRecord.id]);
      await query('COMMIT');
    } catch (e) {
      await query('ROLLBACK');
      throw e;
    }

    // In a real app we might want to delete all user sessions from redis here
    return { success: true };
  }

  async verifyEmail(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.type !== 'verify_email') throw new Error('Invalid token type');
      
      await query(`UPDATE users SET email_verified = true WHERE id = $1`, [decoded.id]);
      return { success: true };
    } catch (e) {
      throw new Error('Invalid or expired verification token');
    }
  }
}
