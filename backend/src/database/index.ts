//backend/src/database/index.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db = open({
 filename: './db.sqlite',
 driver: sqlite3.Database
});

export async function initDB() {
 const database = await db;

 await database.exec(`
CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY,
 level INTEGER,
 total_exp INTEGER,
 stats TEXT,
 created_at TEXT
);

CREATE TABLE IF NOT EXISTS quests(
 id INTEGER PRIMARY KEY,
 quest_type TEXT,
 difficulty REAL,
 base_exp INTEGER,
 description TEXT,
 created_at TEXT
);

CREATE TABLE IF NOT EXISTS exp_logs(
 id INTEGER PRIMARY KEY,
 user_id INTEGER,
 quest_id INTEGER,
 exp_gained INTEGER,
 timestamp TEXT
);
`);
}
