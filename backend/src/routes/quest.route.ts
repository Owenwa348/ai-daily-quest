import express from 'express'
import { db } from '../database'
import { generateDailyQuests } from '../services/ai.service'
import { gainExp } from '../services/exp.service'

const router = express.Router()

// ===============================
// Generate daily quests
// ===============================
router.get('/today', async (req, res) => {
  try {
    const database = await db

    await database.run(`DELETE FROM quests`)

    const quests = await generateDailyQuests()

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

    const user = await database.get(`SELECT * FROM users LIMIT 1`)

    // prevent duplicate completion
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

    const result = await gainExp(user.id, quest.base_exp)

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

export default router
