import { query } from '../db/client';

export class SocialService {
  async toggleLike(userId: string, poemId: string) {
    const check = await query(`SELECT 1 FROM likes WHERE user_id = $1 AND poem_id = $2`, [userId, poemId]);
    if (check.rows.length > 0) {
      await query(`DELETE FROM likes WHERE user_id = $1 AND poem_id = $2`, [userId, poemId]);
      const res = await query(`UPDATE poems SET like_count = GREATEST(like_count - 1, 0) WHERE id = $1 RETURNING like_count`, [poemId]);
      return { liked: false, like_count: res.rows[0].like_count };
    } else {
      await query(`INSERT INTO likes (user_id, poem_id) VALUES ($1, $2)`, [userId, poemId]);
      const res = await query(`UPDATE poems SET like_count = like_count + 1 WHERE id = $1 RETURNING like_count`, [poemId]);
      return { liked: true, like_count: res.rows[0].like_count };
    }
  }

  async toggleSave(userId: string, poemId: string) {
    const check = await query(`SELECT 1 FROM saves WHERE user_id = $1 AND poem_id = $2`, [userId, poemId]);
    if (check.rows.length > 0) {
      await query(`DELETE FROM saves WHERE user_id = $1 AND poem_id = $2`, [userId, poemId]);
      const res = await query(`UPDATE poems SET save_count = GREATEST(save_count - 1, 0) WHERE id = $1 RETURNING save_count`, [poemId]);
      return { saved: false, save_count: res.rows[0].save_count };
    } else {
      await query(`INSERT INTO saves (user_id, poem_id) VALUES ($1, $2)`, [userId, poemId]);
      const res = await query(`UPDATE poems SET save_count = save_count + 1 WHERE id = $1 RETURNING save_count`, [poemId]);
      return { saved: true, save_count: res.rows[0].save_count };
    }
  }

  async toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new Error('Cannot follow yourself');
    
    const check = await query(`SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2`, [followerId, followingId]);
    if (check.rows.length > 0) {
      await query(`DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`, [followerId, followingId]);
      return { followed: false };
    } else {
      await query(`INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)`, [followerId, followingId]);
      return { followed: true };
    }
  }

  async addComment(userId: string, poemId: string, data: { body: string, parentId?: string }) {
    const result = await query(
      `INSERT INTO comments (user_id, poem_id, parent_id, body) VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, poemId, data.parentId || null, data.body]
    );
    await query(`UPDATE poems SET comment_count = comment_count + 1 WHERE id = $1`, [poemId]);
    
    const commentWithUser = await query(`
      SELECT c.*, u.username, u.display_name, u.avatar_url 
      FROM comments c JOIN users u ON c.user_id = u.id 
      WHERE c.id = $1
    `, [result.rows[0].id]);
    
    return commentWithUser.rows[0];
  }

  async getComments(poemId: string) {
    const result = await query(`
      SELECT c.*, u.username, u.display_name, u.avatar_url 
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.poem_id = $1 
      ORDER BY c.created_at ASC
    `, [poemId]);
    
    // Build tree
    const comments = result.rows;
    const commentMap = new Map();
    const roots: any[] = [];
    
    comments.forEach(c => {
      c.replies = [];
      commentMap.set(c.id, c);
    });
    
    comments.forEach(c => {
      if (c.parent_id) {
        const parent = commentMap.get(c.parent_id);
        if (parent) {
          parent.replies.push(c);
        } else {
          roots.push(c); // fallback if parent missing
        }
      } else {
        roots.push(c);
      }
    });
    
    return roots;
  }
}
