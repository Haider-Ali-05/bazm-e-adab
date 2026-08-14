import { query } from '../db/client';

export class UserService {
  async getProfile(userId: string, requesterId?: string) {
    const result = await query(`
      SELECT u.id, u.username, u.display_name, u.bio, u.avatar_url, u.education, u.metadata, u.role, u.created_at,
             (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as followers_count,
             (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
             (SELECT COUNT(*) FROM poems WHERE author_id = u.id) as poems_count,
             $2::uuid IS NOT NULL AND EXISTS(SELECT 1 FROM follows WHERE follower_id = $2 AND following_id = u.id) as is_followed
      FROM users u WHERE u.id = $1
    `, [userId, requesterId || null]);
    return result.rows[0];
  }

  async updateProfile(userId: string, data: any) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;
    
    if (data.displayName !== undefined) { fields.push(`display_name = $${idx++}`); values.push(data.displayName); }
    if (data.bio !== undefined) { fields.push(`bio = $${idx++}`); values.push(data.bio); }
    if (data.avatarUrl !== undefined) { fields.push(`avatar_url = $${idx++}`); values.push(data.avatarUrl); }
    if (data.education !== undefined) { fields.push(`education = $${idx++}`); values.push(data.education ? JSON.stringify(data.education) : null); }
    if (data.metadata !== undefined) { fields.push(`metadata = $${idx++}`); values.push(data.metadata ? JSON.stringify(data.metadata) : null); }
    
    if (fields.length === 0) return this.getProfile(userId);
    
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);
    
    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, username, display_name, bio, avatar_url, education, metadata`,
      values
    );
    return result.rows[0];
  }

  async getFollowers(userId: string, limit: number = 20, cursor?: string) {
    let queryText = `
      SELECT u.id, u.username, u.display_name, u.avatar_url, f.created_at
      FROM follows f
      JOIN users u ON f.follower_id = u.id
      WHERE f.following_id = $1
    `;
    const params: any[] = [userId];
    if (cursor) {
      queryText += ` AND f.created_at < $2`;
      params.push(cursor);
    }
    queryText += ` ORDER BY f.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const result = await query(queryText, params);
    return result.rows;
  }

  async getFollowing(userId: string, limit: number = 20, cursor?: string) {
    let queryText = `
      SELECT u.id, u.username, u.display_name, u.avatar_url, f.created_at
      FROM follows f
      JOIN users u ON f.following_id = u.id
      WHERE f.follower_id = $1
    `;
    const params: any[] = [userId];
    if (cursor) {
      queryText += ` AND f.created_at < $2`;
      params.push(cursor);
    }
    queryText += ` ORDER BY f.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const result = await query(queryText, params);
    return result.rows;
  }
}
