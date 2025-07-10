import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgres://postgres.ktbfuijzvgbzfoodraza:wb7P51mATjWuK8t1@aws-0-us-east-1.pooler.supabase.com:5432/postgres",
    ssl: { rejectUnauthorized: false }
  },
  verbose: true,
  strict: true,
}) 