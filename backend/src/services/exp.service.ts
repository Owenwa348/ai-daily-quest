import { db } from '../database'

const LEVEL_EXP = 500

export async function gainExp(userId: number, baseExp: number) {
  const database = await db

  const user = await database.get(
    `SELECT * FROM users WHERE id=?`,
    userId
  )

  let totalExp = user.total_exp + baseExp
  let level = user.level

  let stats = user.stats
    ? JSON.parse(user.stats)
    : { STR: 0, INT: 0, DEX: 0, WILL: 0 }

  let leveled = false
  let levelUps = 0

  while (totalExp >= LEVEL_EXP) {
    totalExp -= LEVEL_EXP
    level++
    levelUps++
    leveled = true

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
    gained: baseExp,
    level,
    levelUps,
    totalExp,
    stats,
    leveled
  }
}
