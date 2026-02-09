// backend/src/database/index.ts

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

// 👉 fix path ให้ชัด (db.sqlite อยู่ root project)
const dbPath = path.join(process.cwd(), 'db.sqlite')

console.log('📦 SQLITE FILE:', dbPath)

export const db = open({
  filename: dbPath,
  driver: sqlite3.Database
})

export async function initDB() {
  const database = await db

  // USERS
  await database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level INTEGER DEFAULT 1,
      total_exp INTEGER DEFAULT 0,
      stats TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // QUESTS
  await database.exec(`
    CREATE TABLE IF NOT EXISTS quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quest_type TEXT,
      difficulty INTEGER,
      base_exp INTEGER,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // EXP LOGS
  await database.exec(`
    CREATE TABLE IF NOT EXISTS exp_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      quest_id INTEGER,
      exp_gained INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  console.log('✅ SQLite tables ready')

  // 🌱 seed user (ครั้งเดียว)
  const user = await database.get(`SELECT id FROM users LIMIT 1`)

  if (!user) {
    await database.run(`
      INSERT INTO users(level,total_exp,stats)
      VALUES(1,0,'{}')
    `)

    console.log('🌱 Seeded first user')
  }

  // debug users
  const users = await database.all(`SELECT * FROM users`)
  console.log('👤 USERS:', users)
}
