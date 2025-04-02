import { Pool } from 'pg';

// In serverless environments, we want to minimize connection overhead
let pool: Pool;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20, // Adjust based on your expected load
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait for a connection
    });
    
    // Handle pool errors so they don't crash the application
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }
  return pool;
}

export const db = {
  query: (text: string, params: any[] = []) => getPool().query(text, params)
};