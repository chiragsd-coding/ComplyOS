import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;

/**
 * Returns a Neon serverless Postgres client, lazily initialized from
 * `process.env.DATABASE_URL`. Throws if the env var is not set when a
 * query is first attempted.
 *
 * Usage (async tagged template literals):
 *   const rows = await sql()`SELECT * FROM users WHERE id = ${id}`;
 *   await sql()`INSERT INTO users (id, email) VALUES (${id}, ${email})`;
 */
export function sql() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set");
    }
    _sql = neon(url);
  }
  return _sql;
}

/**
 * Initializes the database schema. Creates all tables if they don't
 * already exist. Safe to call on every cold start.
 */
export async function initSchema(): Promise<void> {
  await sql()`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      company_name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql()`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql()`
    CREATE TABLE IF NOT EXISTS compliance_tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('GST','TDS','PF','ESIC','ROC','IT','ISO')),
      due_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','completed','overdue')),
      reminder_enabled INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql()`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      file_type TEXT NOT NULL CHECK(file_type IN ('invoice','contract','gst','pan','purchase_order','salary_slip')),
      extracted_data TEXT DEFAULT '{}',
      upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status TEXT NOT NULL DEFAULT 'processed'
    )
  `;

  await sql()`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vendor_name TEXT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unpaid' CHECK(status IN ('paid','unpaid','overdue')),
      invoice_date TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
