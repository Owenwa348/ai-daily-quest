import { db } from '../database'

const BASE_LEVEL_EXP = 500

export async function gainExp(userId: number, baseExp: number) {
  const database = await db

  const user = await database.get(
    `SELECT * FROM users WHERE id=?`,
    userId
  )

  let totalExp = user.total_exp
  let level = user.level

  let stats = user.stats
    ? JSON.parse(user.stats)
    : { STR: 0, INT: 0, DEX: 0, WILL: 0 }

  // =====================
  // STAT MODIFIER
  // =====================

  const statBonus =
    1 +
    stats.INT * 0.05 +     // ฉลาด = ได้ exp เพิ่ม
    stats.WILL * 0.03     // ใจแกร่ง = grind เก่ง

  const gained = Math.floor(baseExp * statBonus)

  totalExp += gained

  let leveled = false

  // dynamic level requirement
  while (totalExp >= level * BASE_LEVEL_EXP) {
    totalExp -= level * BASE_LEVEL_EXP
    level++
    leveled = true

    // stat gain
    stats.STR++
    stats.INT++
    stats.DEX++
    stats.WILL++
  }

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
    gained,
    level,
    totalExp,
    stats,
    leveled
  }
}
