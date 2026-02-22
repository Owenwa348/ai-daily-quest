import { db } from "../database"

export async function getUserExpMultiplier(userId:number) {
  const database = await db

  const rows = await database.all(`
    SELECT skills.bonus_exp
    FROM user_skills
    JOIN skills ON skills.id = user_skills.skill_id
    WHERE user_skills.user_id=?
  `, userId)

  let multiplier = 1

  for (const r of rows) multiplier *= r.bonus_exp

  return multiplier
}

export async function unlockSkill(userId:number, code:string) {
  const database = await db

  const skill = await database.get(`
    SELECT id FROM skills WHERE code=?
  `, code)

  if (!skill) return

  await database.run(`
    INSERT OR IGNORE INTO user_skills(user_id,skill_id)
    VALUES (?,?)
  `, userId, skill.id)
}
