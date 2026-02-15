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
  level INTEGER,
  total_exp INTEGER,
  stats TEXT
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

`)

await database.run(`
INSERT OR IGNORE INTO skills(code,name,bonus_exp) VALUES
('FAST_LEARN','Fast Learner',1.2),
('HARD_WORKER','Hard Worker',1.3)
`)
  console.log("✅ DB ready")
}
