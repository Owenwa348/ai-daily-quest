import { db } from "../database"

export async function getEquipmentBonus(userId:number) {
  const database = await db

  const rows = await database.all(`
SELECT e.bonus_exp,e.bonus_stats
FROM user_equipment ue
JOIN equipment e ON e.id = ue.equipment_id
WHERE ue.user_id=?
`, userId)

  let exp = 1
  let stats = { STR:0, INT:0, DEX:0, WILL:0 }

  for (const r of rows) {
    exp *= r.bonus_exp || 1

    if (r.bonus_stats) {
      const s = JSON.parse(r.bonus_stats)
      for (const k in s) stats[k] += s[k]
    }
  }

  return { exp, stats }
}
