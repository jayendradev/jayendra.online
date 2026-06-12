import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { createHash, randomBytes, randomInt } from "crypto";
import fs from "fs";
import path from "path";
import { Pool } from "pg";

export type UserRole = "user" | "admin";

export type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
};

export type Thread = {
  id: number;
  user_id: number;
  subject: string;
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  last_message?: string;
};

export type ThreadMessage = {
  id: number;
  thread_id: number;
  sender_id: number;
  body: string;
  created_at: string;
  sender_name?: string;
  sender_role?: UserRole;
};

let sqlite: Database.Database | null = null;
let pgPool: Pool | null = null;
let pgSchemaReady: Promise<void> | null = null;

function isPlaceholderDatabaseUrl(url: string) {
  return /YOUR_USER|YOUR_PASSWORD|YOUR_HOST|your-db-host|your_db_user/i.test(
    url,
  );
}

function getDatabaseUrl(): string | undefined {
  const direct = process.env.DATABASE_URL?.trim();
  if (direct && !isPlaceholderDatabaseUrl(direct)) return direct;

  const host = process.env.POSTGRES_HOST;
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const database = process.env.POSTGRES_DB ?? "jayendraonline";
  const port = process.env.POSTGRES_PORT ?? "5432";

  if (!host || !user || !password) return undefined;

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

export function usePostgres() {
  return Boolean(getDatabaseUrl());
}

function getPgPool(): Pool {
  if (!pgPool) {
    const connectionString = getDatabaseUrl();
    if (!connectionString) {
      throw new Error("DATABASE_URL or POSTGRES_* env vars are not configured.");
    }
    pgPool = new Pool({
      connectionString,
      ssl:
        process.env.POSTGRES_SSL === "false"
          ? false
          : { rejectUnauthorized: false },
    });
  }
  return pgPool;
}

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS threads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS thread_messages (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER NOT NULL REFERENCES threads(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS login_otps (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

const SQLITE_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS threads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS thread_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id INTEGER NOT NULL REFERENCES threads(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS login_otps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

async function ensurePostgresSchema() {
  if (!pgSchemaReady) {
    pgSchemaReady = getPgPool()
      .query(SCHEMA_SQL)
      .then(() => ensureAdminUserPostgres())
      .then(() => undefined);
  }
  await pgSchemaReady;
}

function getSqlitePath(): string {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "messages.db");
}

function getSqlite(): Database.Database {
  if (!sqlite) {
    sqlite = new Database(getSqlitePath());
    sqlite.pragma("journal_mode = WAL");
    sqlite.exec(SQLITE_SCHEMA_SQL);
    ensureAdminUserSqlite();
  }
  return sqlite;
}

const SQLITE_OTP_SCHEMA = `
  CREATE TABLE IF NOT EXISTS login_otps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

async function ensureSchema() {
  if (usePostgres()) {
    await ensurePostgresSchema();
    return;
  }
  getSqlite().exec(SQLITE_OTP_SCHEMA);
}

function iso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : String(value);
}

async function ensureAdminUserPostgres() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const pool = getPgPool();
  const existing = await pool.query(`SELECT id FROM users WHERE email = $1`, [
    email.toLowerCase(),
  ]);
  if (existing.rowCount) return;

  const password_hash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')`,
    ["Admin", email.toLowerCase(), password_hash],
  );
}

function ensureAdminUserSqlite() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const db = getSqlite();
  const existing = db
    .prepare(`SELECT id FROM users WHERE email = ?`)
    .get(email.toLowerCase());
  if (existing) return;

  const password_hash = bcrypt.hashSync(password, 12);
  db.prepare(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, 'admin')`,
  ).run("Admin", email.toLowerCase(), password_hash);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<User> {
  await ensureSchema();
  const email = input.email.trim().toLowerCase();
  const password_hash = await bcrypt.hash(input.password, 12);
  const role = input.role ?? "user";

  if (usePostgres()) {
    const result = await getPgPool().query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, password_hash, role, created_at`,
      [input.name.trim(), email, password_hash, role],
    );
    const row = result.rows[0];
    return { ...row, created_at: iso(row.created_at) };
  }

  const db = getSqlite();
  const result = db
    .prepare(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, ?)`,
    )
    .run(input.name.trim(), email, password_hash, role);

  return db
    .prepare(
      `SELECT id, name, email, password_hash, role, created_at FROM users WHERE id = ?`,
    )
    .get(result.lastInsertRowid) as User;
}

export async function findOrCreateUserForOtp(
  email: string,
  name?: string,
): Promise<{ user: User; created: boolean }> {
  const existing = await findUserByEmail(email);
  if (existing) return { user: existing, created: false };

  const trimmedName = name?.trim() ?? "";
  if (trimmedName.length < 2) {
    throw new Error("NEEDS_NAME");
  }

  const user = await createUser({
    name: trimmedName,
    email,
    password: randomBytes(32).toString("hex"),
    role: "user",
  });
  return { user, created: true };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  await ensureSchema();
  const normalized = email.trim().toLowerCase();

  if (usePostgres()) {
    const result = await getPgPool().query(
      `SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1`,
      [normalized],
    );
    if (!result.rowCount) return null;
    const row = result.rows[0];
    return { ...row, created_at: iso(row.created_at) };
  }

  const row = getSqlite()
    .prepare(
      `SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ?`,
    )
    .get(normalized) as User | undefined;
  return row ?? null;
}

export async function findUserById(id: number): Promise<User | null> {
  await ensureSchema();

  if (usePostgres()) {
    const result = await getPgPool().query(
      `SELECT id, name, email, password_hash, role, created_at FROM users WHERE id = $1`,
      [id],
    );
    if (!result.rowCount) return null;
    const row = result.rows[0];
    return { ...row, created_at: iso(row.created_at) };
  }

  const row = getSqlite()
    .prepare(
      `SELECT id, name, email, password_hash, role, created_at FROM users WHERE id = ?`,
    )
    .get(id) as User | undefined;
  return row ?? null;
}

export async function verifyPassword(user: User, password: string) {
  return bcrypt.compare(password, user.password_hash);
}

export async function createThread(input: {
  userId: number;
  subject: string;
  body: string;
}): Promise<{ thread: Thread; message: ThreadMessage }> {
  await ensureSchema();

  if (usePostgres()) {
    const pool = getPgPool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const threadResult = await client.query(
        `INSERT INTO threads (user_id, subject)
         VALUES ($1, $2)
         RETURNING id, user_id, subject, status, created_at, updated_at`,
        [input.userId, input.subject.trim()],
      );
      const threadRow = threadResult.rows[0];
      const messageResult = await client.query(
        `INSERT INTO thread_messages (thread_id, sender_id, body)
         VALUES ($1, $2, $3)
         RETURNING id, thread_id, sender_id, body, created_at`,
        [threadRow.id, input.userId, input.body.trim()],
      );
      await client.query("COMMIT");
      const thread = {
        ...threadRow,
        created_at: iso(threadRow.created_at),
        updated_at: iso(threadRow.updated_at),
      };
      const message = {
        ...messageResult.rows[0],
        created_at: iso(messageResult.rows[0].created_at),
      };
      return { thread, message };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  const db = getSqlite();
  const create = db.transaction(() => {
    const threadInsert = db
      .prepare(
        `INSERT INTO threads (user_id, subject) VALUES (?, ?)`,
      )
      .run(input.userId, input.subject.trim());
    const threadId = Number(threadInsert.lastInsertRowid);
    db.prepare(
      `UPDATE threads SET updated_at = datetime('now') WHERE id = ?`,
    ).run(threadId);
    const messageInsert = db
      .prepare(
        `INSERT INTO thread_messages (thread_id, sender_id, body) VALUES (?, ?, ?)`,
      )
      .run(threadId, input.userId, input.body.trim());
    const thread = db
      .prepare(
        `SELECT id, user_id, subject, status, created_at, updated_at FROM threads WHERE id = ?`,
      )
      .get(threadId) as Thread;
    const message = db
      .prepare(
        `SELECT id, thread_id, sender_id, body, created_at FROM thread_messages WHERE id = ?`,
      )
      .get(messageInsert.lastInsertRowid) as ThreadMessage;
    return { thread, message };
  });
  return create();
}

export async function addThreadMessage(input: {
  threadId: number;
  senderId: number;
  body: string;
}): Promise<ThreadMessage> {
  await ensureSchema();

  if (usePostgres()) {
    const pool = getPgPool();
    const result = await pool.query(
      `INSERT INTO thread_messages (thread_id, sender_id, body)
       VALUES ($1, $2, $3)
       RETURNING id, thread_id, sender_id, body, created_at`,
      [input.threadId, input.senderId, input.body.trim()],
    );
    await pool.query(
      `UPDATE threads SET updated_at = NOW() WHERE id = $1`,
      [input.threadId],
    );
    return { ...result.rows[0], created_at: iso(result.rows[0].created_at) };
  }

  const db = getSqlite();
  const insert = db
    .prepare(
      `INSERT INTO thread_messages (thread_id, sender_id, body) VALUES (?, ?, ?)`,
    )
    .run(input.threadId, input.senderId, input.body.trim());
  db.prepare(
    `UPDATE threads SET updated_at = datetime('now') WHERE id = ?`,
  ).run(input.threadId);
  return db
    .prepare(
      `SELECT id, thread_id, sender_id, body, created_at FROM thread_messages WHERE id = ?`,
    )
    .get(insert.lastInsertRowid) as ThreadMessage;
}

export async function getThreadById(threadId: number): Promise<Thread | null> {
  await ensureSchema();

  if (usePostgres()) {
    const result = await getPgPool().query(
      `SELECT t.id, t.user_id, t.subject, t.status, t.created_at, t.updated_at,
              u.name AS user_name, u.email AS user_email
       FROM threads t
       JOIN users u ON u.id = t.user_id
       WHERE t.id = $1`,
      [threadId],
    );
    if (!result.rowCount) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      user_id: row.user_id,
      subject: row.subject,
      status: row.status,
      created_at: iso(row.created_at),
      updated_at: iso(row.updated_at),
      user_name: row.user_name,
      user_email: row.user_email,
    };
  }

  const row = getSqlite()
    .prepare(
      `SELECT t.id, t.user_id, t.subject, t.status, t.created_at, t.updated_at,
              u.name AS user_name, u.email AS user_email
       FROM threads t
       JOIN users u ON u.id = t.user_id
       WHERE t.id = ?`,
    )
    .get(threadId) as Thread | undefined;
  return row ?? null;
}

export async function listThreadsForUser(userId: number): Promise<Thread[]> {
  await ensureSchema();

  if (usePostgres()) {
    const result = await getPgPool().query(
      `SELECT t.id, t.user_id, t.subject, t.status, t.created_at, t.updated_at,
              (
                SELECT body FROM thread_messages tm
                WHERE tm.thread_id = t.id
                ORDER BY tm.created_at DESC
                LIMIT 1
              ) AS last_message
       FROM threads t
       WHERE t.user_id = $1
       ORDER BY t.updated_at DESC`,
      [userId],
    );
    return result.rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      subject: row.subject,
      status: row.status,
      created_at: iso(row.created_at),
      updated_at: iso(row.updated_at),
      last_message: row.last_message ?? undefined,
    }));
  }

  return getSqlite()
    .prepare(
      `SELECT t.id, t.user_id, t.subject, t.status, t.created_at, t.updated_at,
              (
                SELECT body FROM thread_messages tm
                WHERE tm.thread_id = t.id
                ORDER BY tm.created_at DESC
                LIMIT 1
              ) AS last_message
       FROM threads t
       WHERE t.user_id = ?
       ORDER BY t.updated_at DESC`,
    )
    .all(userId) as Thread[];
}

export async function listAllThreads(): Promise<Thread[]> {
  await ensureSchema();

  if (usePostgres()) {
    const result = await getPgPool().query(
      `SELECT t.id, t.user_id, t.subject, t.status, t.created_at, t.updated_at,
              u.name AS user_name, u.email AS user_email,
              (
                SELECT body FROM thread_messages tm
                WHERE tm.thread_id = t.id
                ORDER BY tm.created_at DESC
                LIMIT 1
              ) AS last_message
       FROM threads t
       JOIN users u ON u.id = t.user_id
       ORDER BY t.updated_at DESC`,
    );
    return result.rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      subject: row.subject,
      status: row.status,
      created_at: iso(row.created_at),
      updated_at: iso(row.updated_at),
      user_name: row.user_name,
      user_email: row.user_email,
      last_message: row.last_message ?? undefined,
    }));
  }

  return getSqlite()
    .prepare(
      `SELECT t.id, t.user_id, t.subject, t.status, t.created_at, t.updated_at,
              u.name AS user_name, u.email AS user_email,
              (
                SELECT body FROM thread_messages tm
                WHERE tm.thread_id = t.id
                ORDER BY tm.created_at DESC
                LIMIT 1
              ) AS last_message
       FROM threads t
       JOIN users u ON u.id = t.user_id
       ORDER BY t.updated_at DESC`,
    )
    .all() as Thread[];
}

export async function listThreadMessages(
  threadId: number,
): Promise<ThreadMessage[]> {
  await ensureSchema();

  if (usePostgres()) {
    const result = await getPgPool().query(
      `SELECT tm.id, tm.thread_id, tm.sender_id, tm.body, tm.created_at,
              u.name AS sender_name, u.role AS sender_role
       FROM thread_messages tm
       JOIN users u ON u.id = tm.sender_id
       WHERE tm.thread_id = $1
       ORDER BY tm.created_at ASC`,
      [threadId],
    );
    return result.rows.map((row) => ({
      id: row.id,
      thread_id: row.thread_id,
      sender_id: row.sender_id,
      body: row.body,
      created_at: iso(row.created_at),
      sender_name: row.sender_name,
      sender_role: row.sender_role,
    }));
  }

  return getSqlite()
    .prepare(
      `SELECT tm.id, tm.thread_id, tm.sender_id, tm.body, tm.created_at,
              u.name AS sender_name, u.role AS sender_role
       FROM thread_messages tm
       JOIN users u ON u.id = tm.sender_id
       WHERE tm.thread_id = ?
       ORDER BY tm.created_at ASC`,
    )
    .all(threadId) as ThreadMessage[];
}

// Contact form (legacy public form)
export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  message: string;
  created_at: string;
};

export async function saveContactMessage(input: {
  name: string;
  email: string;
  company?: string;
  message: string;
}): Promise<ContactMessage> {
  await ensureSchema();

  if (usePostgres()) {
    const result = await getPgPool().query(
      `INSERT INTO contact_messages (name, email, company, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, company, message, created_at`,
      [input.name, input.email, input.company ?? null, input.message],
    );
    const row = result.rows[0];
    return { ...row, created_at: iso(row.created_at) };
  }

  const db = getSqlite();
  const result = db
    .prepare(
      `INSERT INTO contact_messages (name, email, company, message)
       VALUES (@name, @email, @company, @message)`,
    )
    .run({
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      message: input.message,
    });

  return db
    .prepare(
      `SELECT id, name, email, company, message, created_at
       FROM contact_messages WHERE id = ?`,
    )
    .get(result.lastInsertRowid) as ContactMessage;
}

const OTP_TTL_MINUTES = 10;

function hashOtpCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export function generateOtpCode() {
  return String(randomInt(100000, 1000000));
}

export async function saveLoginOtp(email: string, code: string) {
  await ensureSchema();
  const normalized = email.trim().toLowerCase();
  const code_hash = hashOtpCode(code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  if (usePostgres()) {
    await getPgPool().query(`DELETE FROM login_otps WHERE email = $1`, [
      normalized,
    ]);
    await getPgPool().query(
      `INSERT INTO login_otps (email, code_hash, expires_at) VALUES ($1, $2, $3)`,
      [normalized, code_hash, expiresAt.toISOString()],
    );
    return;
  }

  const db = getSqlite();
  db.prepare(`DELETE FROM login_otps WHERE email = ?`).run(normalized);
  db.prepare(
    `INSERT INTO login_otps (email, code_hash, expires_at) VALUES (?, ?, ?)`,
  ).run(normalized, code_hash, expiresAt.toISOString());
}

export async function verifyLoginOtp(email: string, code: string) {
  await ensureSchema();
  const normalized = email.trim().toLowerCase();
  const code_hash = hashOtpCode(code);
  const now = new Date().toISOString();

  if (usePostgres()) {
    const result = await getPgPool().query(
      `SELECT id FROM login_otps
       WHERE email = $1 AND code_hash = $2 AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [normalized, code_hash],
    );
    if (!result.rowCount) return false;
    await getPgPool().query(`DELETE FROM login_otps WHERE email = $1`, [
      normalized,
    ]);
    return true;
  }

  const db = getSqlite();
  const row = db
    .prepare(
      `SELECT id FROM login_otps
       WHERE email = ? AND code_hash = ? AND expires_at > ?
       ORDER BY created_at DESC
       LIMIT 1`,
    )
    .get(normalized, code_hash, now) as { id: number } | undefined;

  if (!row) return false;
  db.prepare(`DELETE FROM login_otps WHERE email = ?`).run(normalized);
  return true;
}
