import { query } from '../db/client';

export class TicketService {
  async createTicket(userId: string | null, data: any) {
    const result = await query(
      `INSERT INTO tickets (user_id, email, category, subject, body, priority, related_poem_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, data.email, data.category, data.subject, data.body, data.priority || 'normal', data.relatedPoemId || null]
    );
    return result.rows[0];
  }

  async getTickets(params: { userId?: string, status?: string, limit?: number, cursor?: string }) {
    let queryText = `SELECT * FROM tickets WHERE 1=1`;
    const queryParams: any[] = [];
    let idx = 1;

    if (params.userId) {
      queryText += ` AND user_id = $${idx++}`;
      queryParams.push(params.userId);
    }
    if (params.status) {
      queryText += ` AND status = $${idx++}`;
      queryParams.push(params.status);
    }
    if (params.cursor) {
      queryText += ` AND id < $${idx++}`;
      queryParams.push(params.cursor);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${idx}`;
    queryParams.push(params.limit || 20);

    const result = await query(queryText, queryParams);
    return result.rows;
  }

  async getTicket(id: string, requesterId?: string, requesterRole?: string) {
    const result = await query(`SELECT * FROM tickets WHERE id = $1`, [id]);
    const ticket = result.rows[0];
    
    if (!ticket) return null;
    
    if (requesterRole !== 'admin' && ticket.user_id !== requesterId) {
      throw new Error('Forbidden');
    }

    const messages = await query(`
      SELECT tm.*, u.username, u.avatar_url 
      FROM ticket_messages tm 
      LEFT JOIN users u ON tm.sender_id = u.id 
      WHERE tm.ticket_id = $1 
      ORDER BY tm.created_at ASC
    `, [id]);
    
    ticket.messages = messages.rows;
    return ticket;
  }

  async addMessage(ticketId: string, senderId: string, senderRole: string, body: string) {
    // Verify ticket exists
    const ticket = await query(`SELECT id FROM tickets WHERE id = $1`, [ticketId]);
    if (!ticket.rows[0]) throw new Error('Ticket not found');

    const result = await query(
      `INSERT INTO ticket_messages (ticket_id, sender_id, sender_role, body)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [ticketId, senderId, senderRole, body]
    );
    
    await query(`UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [ticketId]);
    return result.rows[0];
  }
}
