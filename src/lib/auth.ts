import { createServerFn } from "@tanstack/react-start";
import * as bcrypt from "bcryptjs";
import crypto from "node:crypto";

import { sql, initSchema } from "./db";

export type User = {
  id: string;
  email: string;
  company_name: string;
};

function generateId(): string {
  return crypto.randomUUID();
}

export const signup = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const { email, password, companyName } = data as Record<string, string>;
    if (!email || !password || !companyName) {
      throw new Error("Email, password, and company name are required");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    if (!email.includes("@")) {
      throw new Error("Invalid email address");
    }
    return { email, password, companyName };
  })
  .handler(async ({ data }) => {
    await initSchema();

    const rows = await sql()`SELECT id FROM users WHERE email = ${data.email}`;
    const existing = rows[0];
    if (existing) {
      throw new Error("An account with this email already exists");
    }

    const id = generateId();
    const passwordHash = await bcrypt.hash(data.password, 10);
    await sql()`INSERT INTO users (id, email, password_hash, company_name) VALUES (${id}, ${data.email}, ${passwordHash}, ${data.companyName})`;

    // Create session
    const sessionId = generateId();
    await sql()`INSERT INTO sessions (id, user_id) VALUES (${sessionId}, ${id})`;

    return {
      token: sessionId,
      user: { id, email: data.email, company_name: data.companyName } satisfies User,
    };
  });

export const login = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const { email, password } = data as Record<string, string>;
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    return { email, password };
  })
  .handler(async ({ data }) => {
    await initSchema();

    const rows = await sql()`SELECT * FROM users WHERE email = ${data.email}`;
    const row = rows[0] as
      | { id: string; email: string; password_hash: string; company_name: string }
      | null;

    if (!row) {
      throw new Error("Invalid email or password");
    }

    const valid = await bcrypt.compare(data.password, row.password_hash);
    if (!valid) {
      throw new Error("Invalid email or password");
    }

    // Create session
    const sessionId = generateId();
    await sql()`INSERT INTO sessions (id, user_id) VALUES (${sessionId}, ${row.id})`;

    return {
      token: sessionId,
      user: { id: row.id, email: row.email, company_name: row.company_name } satisfies User,
    };
  });

export const getCurrentUser = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const { token } = data as Record<string, string>;
    return { token };
  })
  .handler(async ({ data }) => {
    if (!data.token) {
      return null;
    }
    await initSchema();

    const rows = await sql()`
      SELECT u.id, u.email, u.company_name
      FROM sessions s JOIN users u ON s.user_id = u.id
      WHERE s.id = ${data.token}
    `;
    const row = rows[0] as User | null;
    return row ?? null;
  });

export const logout = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const { token } = data as Record<string, string>;
    return { token };
  })
  .handler(async ({ data }) => {
    if (!data.token) return { success: true };
    await initSchema();
    await sql()`DELETE FROM sessions WHERE id = ${data.token}`;
    return { success: true };
  });
