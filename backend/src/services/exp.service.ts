import { db } from "../database"
import { getUserExpMultiplier } from "./skill.service"

const LEVEL_EXP = 500

/**
 * Core RPG EXP + Level + Stat system (with skill bonus)
 */
export async function gainExp(userId: number, baseExp: number) {
  const database = await db

  const user = await database.get(
    `SELECT * FROM users WHERE id=?`,
    userId
  )

  if (!user) throw new Error("User not found")

  // 🔥 skill passive multiplier
  const bonus = await getUserExpMultiplier(userId)

  // EXP ที่ได้จริง (หลัง skill bonus)
  const gained = Math.floor(baseExp * bonus)

  let totalExp = user.total_exp + gained
  let level = user.level

  let stats = user.stats
    ? JSON.parse(user.stats)
    : { STR: 0, INT: 0, DEX: 0, WILL: 0 }

  let leveled = false
  let levelUps = 0

  // =========================
  // LEVEL LOOP
  // =========================
  while (totalExp >= LEVEL_EXP) {
    totalExp -= LEVEL_EXP
    level++
    levelUps++
    leveled = true

    // stat gain ทุก level
    stats.STR++
    stats.INT++
    stats.DEX++
    stats.WILL++
  }

  // =========================
  // SAVE USER
  // =========================
  await database.run(`
    UPDATE users
    SET level=?, total_exp=?, stats=?
    WHERE id=?
  `,
    level,
    totalExp,
    JSON.stringify(stats),
    userId
  )

  return {
    gained,        // 🔥 EXP หลัง bonus
    level,
    levelUps,
    totalExp,
    stats,
    leveled
  }
}
