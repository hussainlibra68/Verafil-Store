import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';
import * as schema from './schema.ts';

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: Pool | undefined;
}

// Function to create or retrieve the connection pool.
export const createPool = () => {
  if (!global._postgresPool) {
    const config: PoolConfig = {
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : 5432,
      max: 10,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 15000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 5000,
    };

    global._postgresPool = new Pool(config);

    // Prevent unhandled pool-level errors from crashing the application
    global._postgresPool.on('error', (err) => {
      console.warn('Recovered from idle SQL pool client notice:', err.message);
    });
  }
  return global._postgresPool;
};

// Create or retrieve the pool instance.
export const pool = createPool();

// Initialize Drizzle with the pool and schema.
export const db = drizzle(pool, { schema });

/**
 * Execute a DB query with automatic retry on transient connection drops (e.g. idle disconnects, scale-to-zero wakeups)
 */
export async function withDbRetry<T>(operation: () => Promise<T>, retries = 2): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (err: any) {
      attempt++;
      const errMsg = String(err?.message || err?.cause?.message || err || '');
      const isConnectionIssue = 
        errMsg.includes('Connection terminated') ||
        errMsg.includes('ECONNRESET') ||
        errMsg.includes('ETIMEDOUT') ||
        errMsg.includes('connection error') ||
        errMsg.includes('closed') ||
        errMsg.includes('socket has been ended');

      if (attempt <= retries && isConnectionIssue) {
        console.warn(`[Cloud SQL] Connection interrupted, auto-reconnecting (attempt ${attempt}/${retries})...`);
        await new Promise(r => setTimeout(r, 350 * attempt));
        continue;
      }
      throw err;
    }
  }
}
