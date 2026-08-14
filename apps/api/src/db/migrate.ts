import { pool } from './client';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const sqlPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migration successful');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration failed', e);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
