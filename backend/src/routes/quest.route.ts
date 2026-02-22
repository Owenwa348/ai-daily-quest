// backend/src/routes/quest.route.ts
import express from 'express'
import { db } from '../database'
import { generateDailyQuests } from '../services/ai.service'
import { gainExp } from '../services/exp.service'
import { checkAchievements } from '../services/achievement.service'

const router = express.Router()

// ===============================
// Generate daily quests
// ===============================
router.get('/today', async (req, res) => {
  try {
    const database = await db

    // ลบ quest เก่า
    await database.run(`DELETE FROM quests`)

    // generate จาก AI
    const quests = await generateDailyQuests()

    // save ลง db
    for (const q of quests) {
      await database.run(`
        INSERT INTO quests (quest_type,difficulty,base_exp,description)
        VALUES (?,?,?,?)
      `,
        q.type,
        q.difficulty,
        q.base_exp,
        q.description
      )
    }

    const saved = await database.all(`SELECT * FROM quests`)
    res.json(saved)

  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'generate failed' })
  }
})


// ===============================
// Complete quest + gain EXP
// ===============================
router.post('/complete/:id', async (req, res) => {
  try {
    const database = await db
    const questId = Number(req.params.id)

    const quest = await database.get(
      `SELECT * FROM quests WHERE id=?`,
      questId
    )

    if (!quest) return res.status(404).json({ error: 'Quest not found' })

    // solo player
    const user = await database.get(`SELECT * FROM users LIMIT 1`)

    // กันกดซ้ำ
    const already = await database.get(`
      SELECT id FROM exp_logs
      WHERE quest_id=? AND user_id=?
    `,
      quest.id,
      user.id
    )

    if (already) {
      return res.status(400).json({ error: 'Quest already completed' })
    }

    // log exp
    await database.run(`
      INSERT INTO exp_logs(user_id,quest_id,exp_gained)
      VALUES (?,?,?)
    `,
      user.id,
      quest.id,
      quest.base_exp
    )

    // CORE RPG
    const result = await gainExp(user.id, quest.base_exp)
    await checkAchievements(user.id)

    res.json({
      quest: quest.description,
      reward: quest.base_exp,
      level: result.level,
      stats: result.stats,
      leveled: result.leveled,
      total_exp: result.totalExp
    })

  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'complete failed' })
  }
})


// ===============================
// Quest history
// ===============================
router.get('/history', async (req, res) => {
  const database = await db

  const rows = await database.all(`
    SELECT 
      exp_logs.id,
      quests.description,
      exp_logs.exp_gained,
      exp_logs.created_at
    FROM exp_logs
    JOIN quests ON quests.id = exp_logs.quest_id
    ORDER BY exp_logs.created_at DESC
  `)

  res.json(rows)
})

export default router
