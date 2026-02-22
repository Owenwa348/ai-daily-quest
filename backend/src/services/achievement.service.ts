// backend/src/services/achievement.service.ts
import { db } from "../database"

export async function checkAchievements(userId:number) {
  const database = await db

  const count = await database.get(`
    SELECT COUNT(*) as total FROM exp_logs WHERE user_id=?
  `, userId)

  const user = await database.get(`
    SELECT level FROM users WHERE id=?
  `, userId)

  if (count.total >= 1) await unlock(userId,"FIRST_QUEST")
  if (count.total >= 10) await unlock(userId,"QUEST_10")
  if (user.level >= 5) await unlock(userId,"LEVEL_5")
}

async function unlock(userId:number,code:string) {
  const database = await db

  const ach = await database.get(`
    SELECT id FROM achievements WHERE code=?
  `,code)

  if (!ach) return   // ⬅️ สำคัญ

  await database.run(`
    INSERT OR IGNORE INTO user_achievements(user_id,achievement_id)
    VALUES (?,?)
  `, userId, ach.id)
}
