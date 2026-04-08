import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const dbFilePath = path.join(projectRoot, "data", "app.sqlite.bin");

let db;
let SQL;

function locateSqlWasm(file) {
  return path.join(projectRoot, "node_modules", "sql.js", "dist", file);
}

function persistDb() {
  const bytes = db.export();
  fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  fs.writeFileSync(dbFilePath, Buffer.from(bytes));
}

function assertTableName(table) {
  if (!/^[a-z_]+$/.test(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }
}

export async function initDb() {
  if (db) return db;

  SQL = await initSqlJs({ locateFile: locateSqlWasm });

  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    db = new SQL.Database(new Uint8Array(fileBuffer));
  } else {
    db = new SQL.Database();
  }

  db.run("CREATE TABLE IF NOT EXISTS decks (id TEXT PRIMARY KEY, json TEXT NOT NULL)");
  db.run("CREATE TABLE IF NOT EXISTS assets (id TEXT PRIMARY KEY, json TEXT NOT NULL)");
  db.run("CREATE TABLE IF NOT EXISTS financial_models (id TEXT PRIMARY KEY, json TEXT NOT NULL)");

  persistDb();
  return db;
}

export async function listRows(table) {
  assertTableName(table);
  await initDb();
  const result = db.exec(`SELECT json FROM ${table}`);
  const rows = result[0]?.values ?? [];
  return rows.map((r) => JSON.parse(String(r[0])));
}

export async function getRowById(table, id) {
  assertTableName(table);
  await initDb();
  const stmt = db.prepare(`SELECT json FROM ${table} WHERE id = ?`);
  stmt.bind([id]);
  const found = stmt.step();
  if (!found) {
    stmt.free();
    return undefined;
  }
  const row = stmt.getAsObject();
  stmt.free();
  if (typeof row.json !== "string") return undefined;
  return JSON.parse(row.json);
}

export async function upsertRow(table, row) {
  assertTableName(table);
  await initDb();
  db.run(
    `INSERT INTO ${table} (id, json) VALUES (?, ?)
     ON CONFLICT(id) DO UPDATE SET json = excluded.json`,
    [row.id, JSON.stringify(row)],
  );
  persistDb();
}

export async function deleteRowById(table, id) {
  assertTableName(table);
  await initDb();
  db.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
  persistDb();
}
