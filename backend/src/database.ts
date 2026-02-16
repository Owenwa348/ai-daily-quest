// backend/src/database.ts
import sqlite3 from "sqlite3"
import { open } from "sqlite"

export const db = open({
  filename: "./db.sqlite",
  driver: sqlite3.Database,
})

export async function initDB() {
  const database = await db

  await database.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER DEFAULT 1,
  total_exp INTEGER DEFAULT 0,
  stats TEXT DEFAULT '{"STR":0,"INT":0,"DEX":0,"WILL":0}'
);

CREATE TABLE IF NOT EXISTS quests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quest_type TEXT,
  difficulty INTEGER,
  base_exp INTEGER,
  description TEXT
);

CREATE TABLE IF NOT EXISTS exp_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  quest_id INTEGER,
  exp_gained INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE,
  title TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  achievement_id INTEGER,
  unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE,
  name TEXT,
  bonus_exp REAL
);

CREATE TABLE IF NOT EXISTS user_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  skill_id INTEGER,
  unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE,
  name TEXT,
  bonus_exp REAL,
  bonus_stats TEXT
);

CREATE TABLE IF NOT EXISTS user_equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  equipment_id INTEGER
);
`)

await database.run(`
INSERT OR IGNORE INTO skills(code,name,bonus_exp) VALUES
('FAST_LEARN','Fast Learner',1.2),
('HARD_WORKER','Hard Worker',1.3)
`)

await database.run(`
INSERT OR IGNORE INTO equipment(code,name,bonus_exp,bonus_stats) VALUES
('RING_BASIC','Beginner Ring',1.1,'{"STR":1}'),
('BOOK_INT','Magic Book',1.15,'{"INT":2}'),
('BOOT_DEX','Swift Boots',1.1,'{"DEX":1}')
`)

console.log("✅ DB ready")
}
