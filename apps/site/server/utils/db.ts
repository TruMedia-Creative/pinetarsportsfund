import Database from 'better-sqlite3'
import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

let db: Database.Database | null = null
let dbPath: string | null = null

export function setDatabasePath(path: string) {
  dbPath = path
}

export function getDatabase() {
  if (!db) {
    if (!dbPath) {
      throw new Error('Database path not set. Call setDatabasePath first.')
    }

    // Ensure directory exists
    const dir = dirname(dbPath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
  }
  return db
}

export function initDatabase() {
  const database = getDatabase()

  // Create tables if they don't exist
  database.exec(`
    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'draft',
      published INTEGER DEFAULT 0,
      publishedAt TEXT,
      slugForPublic TEXT,
      content JSON,
      marketingMetadata JSON,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT,
      url TEXT NOT NULL,
      alt TEXT,
      tags JSON,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS financial_models (
      id TEXT PRIMARY KEY,
      deckId TEXT,
      projectName TEXT,
      minimumInvestment REAL,
      targetRaise REAL,
      data JSON,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(deckId) REFERENCES decks(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `)
}

export function runQuery<T>(sql: string, params: any[] = []): T[] {
  const database = getDatabase()
  const stmt = database.prepare(sql)
  return stmt.all(...params) as T[]
}

export function runQueryOne<T>(sql: string, params: any[] = []): T | undefined {
  const database = getDatabase()
  const stmt = database.prepare(sql)
  return stmt.get(...params) as T | undefined
}

export function executeInsert(sql: string, params: any[] = []) {
  const database = getDatabase()
  const stmt = database.prepare(sql)
  const result = stmt.run(...params)
  return result
}
