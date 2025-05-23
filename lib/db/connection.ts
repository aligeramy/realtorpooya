import 'server-only';
import { Pool } from 'pg';

// Parse the connection URL to extract host
const connectionString = process.env.DATABASE_URL || '';
const parseConnectionString = (url: string) => {
  const pattern = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = url.match(pattern);
  
  if (match) {
    return {
      user: match[1],
      password: match[2],
      host: match[3],
      port: parseInt(match[4]),
      database: match[5]
    };
  }
  
  throw new Error('Invalid database URL format');
};

// Parse connection details
const connectionDetails = connectionString 
  ? parseConnectionString(connectionString)
  : {
      host: '198.251.68.5',
      port: 5432,
      database: 'listings',
      user: 'pooya',
      password: 'hR72fW9nTqZxB3dMvgKpY1CsJeULoXNb'
    };

// Create a connection pool
const pool = new Pool({
  host: connectionDetails.host,
  port: connectionDetails.port,
  database: connectionDetails.database,
  user: connectionDetails.user,
  password: connectionDetails.password,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Close queries after 10 seconds
});

// Test the connection
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getClient() {
  return await pool.connect();
}

export default pool; 