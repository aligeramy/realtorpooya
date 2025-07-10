import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  connectionString: "postgres://postgres.ktbfuijzvgbzfoodraza:wb7P51mATjWuK8t1@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
})

export const db = drizzle(pool, { schema }) 