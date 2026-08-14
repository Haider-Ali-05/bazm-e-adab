import { query } from '../db/client';
import { normalizeUrduText, detectScriptType } from '../utils/urdu-normalizer';

export class PoemService {
  async createPoem(userId: string, data: any) {
    const normalizedBody = normalizeUrduText(data.body);
    const scriptType = data.scriptType || detectScriptType(normalizedBody);
    
    const result = await query(
      `INSERT INTO poems (author_id, title, body, body_normalized, script_type, genre, tags, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, data.title, data.body, normalizedBody, scriptType, data.genre, data.tags || [], data.status || 'published']
    );
    return result.rows[0];
  }

  async getPoem(id: string, requesterId?: string) {
    const result = await query(`
      SELECT p.*, 
             u.username as author_username, u.display_name as author_display_name, u.avatar_url as author_avatar,
             $2::uuid IS NOT NULL AND EXISTS(SELECT 1 FROM likes WHERE user_id = $2 AND poem_id = p.id) as is_liked,
             $2::uuid IS NOT NULL AND EXISTS(SELECT 1 FROM saves WHERE user_id = $2 AND poem_id = p.id) as is_saved
      FROM poems p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = $1
    `, [id, requesterId || null]);
    
    const poem = result.rows[0];
    if (poem) {
      await query(`UPDATE poems SET view_count = view_count + 1 WHERE id = $1`, [id]);
    }
    return poem;
  }

  async getFeed(params: { cursor?: string; limit?: number; genre?: string; scriptType?: string }) {
    const limit = params.limit || 20;
    
    let queryText = `
      SELECT p.*, u.username as author_username, u.display_name as author_display_name, u.avatar_url as author_avatar,
        (p.like_count * 1.0 + p.comment_count * 2.0 + p.save_count * 1.5) / POWER(EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600 + 2, 1.5) as score
      FROM poems p
      JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published'
    `;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.genre) {
      queryText += ` AND p.genre = $${paramIndex++}`;
      queryParams.push(params.genre);
    }
    
    if (params.scriptType) {
      queryText += ` AND p.script_type = $${paramIndex++}`;
      queryParams.push(params.scriptType);
    }

    if (params.cursor) {
      queryText += ` AND p.id < $${paramIndex++}`;
      queryParams.push(params.cursor);
    }
    
    queryText += ` ORDER BY score DESC, p.created_at DESC LIMIT $${paramIndex}`;
    queryParams.push(limit);
    
    const result = await query(queryText, queryParams);
    return result.rows;
  }

  async updatePoem(userId: string, id: string, data: any) {
    // Verify ownership
    const check = await query(`SELECT author_id FROM poems WHERE id = $1`, [id]);
    if (!check.rows[0] || check.rows[0].author_id !== userId) {
      throw new Error('Forbidden');
    }

    const normalizedBody = data.body ? normalizeUrduText(data.body) : undefined;
    
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;
    
    if (data.title) { fields.push(`title = $${idx++}`); values.push(data.title); }
    if (data.body) { 
      fields.push(`body = $${idx++}`); values.push(data.body); 
      fields.push(`body_normalized = $${idx++}`); values.push(normalizedBody);
      if (!data.scriptType) {
        fields.push(`script_type = $${idx++}`); values.push(detectScriptType(normalizedBody!));
      }
    }
    if (data.scriptType) { fields.push(`script_type = $${idx++}`); values.push(data.scriptType); }
    if (data.genre) { fields.push(`genre = $${idx++}`); values.push(data.genre); }
    if (data.tags) { fields.push(`tags = $${idx++}`); values.push(data.tags); }
    if (data.status) { fields.push(`status = $${idx++}`); values.push(data.status); }
    
    if (fields.length === 0) return this.getPoem(id);
    
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    
    const result = await query(
      `UPDATE poems SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async deletePoem(userId: string, id: string) {
    const check = await query(`SELECT author_id FROM poems WHERE id = $1`, [id]);
    if (!check.rows[0] || check.rows[0].author_id !== userId) {
      throw new Error('Forbidden');
    }
    await query(`DELETE FROM poems WHERE id = $1`, [id]);
    return { success: true };
  }

  async getUserPoems(authorId: string, limit: number = 20, cursor?: string) {
    let queryText = `SELECT * FROM poems WHERE author_id = $1`;
    const params: any[] = [authorId];
    if (cursor) {
      queryText += ` AND id < $2`;
      params.push(cursor);
    }
    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const result = await query(queryText, params);
    return result.rows;
  }
}
