import localforage from "localforage";
import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";

const LEGACY_STORE = localforage.createInstance({
  name: "pinetar-sports-fund",
  storeName: "mock_api",
  description: "Legacy mock storage",
});

const SQLITE_STORE = localforage.createInstance({
  name: "pinetar-sports-fund",
  storeName: "sqlite",
  description: "SQLite binary persistence",
});

const SQLITE_BINARY_KEY = "db.bin";

let sqlJsPromise: Promise<SqlJsStatic> | null = null;
let dbPromise: Promise<Database> | null = null;

function getSqlJs(): Promise<SqlJsStatic> {
<<<<<<< HEAD:apps/dashboard/src/lib/api/mock/sqlite.ts
  if (!sqlJsPromise) {
    sqlJsPromise = initSqlJs({
      locateFile: () => wasmUrl,
    });
  }
  const currentPromise = sqlJsPromise;
  if (!currentPromise) {
    throw new Error("Failed to initialize sql.js");
  }
  return currentPromise;
=======
  sqlJsPromise ??= initSqlJs({ locateFile: () => wasmUrl });
  return sqlJsPromise;
>>>>>>> a34fbe056dbd77f91f0d96ce82e13b8fd98de97d:src/lib/api/mock/sqlite.ts
}

async function persistDb(db: Database): Promise<void> {
  const bytes = db.export();
  await SQLITE_STORE.setItem(SQLITE_BINARY_KEY, bytes);
}

function assertTableName(table: string): void {
  if (!/^[a-z_]+$/.test(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }
}

export async function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const SQL = await getSqlJs();
      const bytes = await SQLITE_STORE.getItem<Uint8Array>(SQLITE_BINARY_KEY);
      const db = bytes ? new SQL.Database(bytes) : new SQL.Database();

      db.run("CREATE TABLE IF NOT EXISTS decks (id TEXT PRIMARY KEY, json TEXT NOT NULL)");
      db.run("CREATE TABLE IF NOT EXISTS assets (id TEXT PRIMARY KEY, json TEXT NOT NULL)");
      db.run("CREATE TABLE IF NOT EXISTS financial_models (id TEXT PRIMARY KEY, json TEXT NOT NULL)");

      if (!bytes) {
        await persistDb(db);
      }

      return db;
    })();
  }

  return dbPromise;
}

export async function seedTableFromLegacyOrDefaults<T extends { id: string }>(
  table: "decks" | "assets" | "financial_models",
  legacyKey: string,
  defaults: T[],
): Promise<void> {
  const db = await getDb();
  const existing = db.exec(`SELECT COUNT(*) AS count FROM ${table}`);
  const count = Number(existing[0]?.values?.[0]?.[0] ?? 0);
  if (count > 0) return;

  let records: T[] | undefined;

  // 1) old localStorage
  try {
    const ls = window.localStorage.getItem(legacyKey);
    if (ls) records = JSON.parse(ls) as T[];
  } catch {
    // ignore
  }

  // 2) previous localforage mock store
  if (!records || records.length === 0) {
    try {
      const lf = await LEGACY_STORE.getItem<T[]>(legacyKey);
      if (lf && lf.length > 0) records = lf;
    } catch {
      // ignore
    }
  }

  const source = records && records.length > 0 ? records : defaults;
  const stmt = db.prepare(`INSERT INTO ${table} (id, json) VALUES (?, ?)`);
  for (const record of source) {
    stmt.run([record.id, JSON.stringify(record)]);
  }
  stmt.free();

  await persistDb(db);

  try {
    window.localStorage.removeItem(legacyKey);
  } catch {
    // ignore
  }
  try {
    await LEGACY_STORE.removeItem(legacyKey);
  } catch {
    // ignore
  }
}

export async function listRows<T>(table: "decks" | "assets" | "financial_models"): Promise<T[]> {
  assertTableName(table);
  const db = await getDb();
  const result = db.exec(`SELECT json FROM ${table}`);
  const rows: unknown[][] = result[0]?.values ?? [];
  return rows.map((r) => JSON.parse(String(r[0])) as T);
}

export async function getRowById<T>(
  table: "decks" | "assets" | "financial_models",
  id: string,
): Promise<T | undefined> {
  assertTableName(table);
  const db = await getDb();
  const stmt = db.prepare(`SELECT json FROM ${table} WHERE id = ?`);
  stmt.bind([id]);
  const found = stmt.step();
  if (!found) {
    stmt.free();
    return undefined;
  }
  const row = stmt.getAsObject() as { json?: unknown };
  stmt.free();
  if (typeof row.json !== "string") return undefined;
  return JSON.parse(row.json) as T;
}

export async function upsertRow<T extends { id: string }>(
  table: "decks" | "assets" | "financial_models",
  row: T,
): Promise<void> {
  assertTableName(table);
  const db = await getDb();
  db.run(
    `INSERT INTO ${table} (id, json) VALUES (?, ?)
     ON CONFLICT(id) DO UPDATE SET json = excluded.json`,
    [row.id, JSON.stringify(row)],
  );
  await persistDb(db);
}

export async function deleteRowById(
  table: "decks" | "assets" | "financial_models",
  id: string,
): Promise<void> {
  assertTableName(table);
  const db = await getDb();
  db.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
  await persistDb(db);
}
