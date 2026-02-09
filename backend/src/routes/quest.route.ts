// backend/src/routes/quest.route.ts

import express from 'express'
import { db } from '../database'
import { generateDailyQuests } from '../services/ai.service'

const router = express.Router()

router.get('/today', async (req, res) => {
  try {
    const database = await db

    // 1. clear quest เก่าวันนี้ (กันซ้ำ)
    await database.run(`DELETE FROM quests`)

    // 2. generate quest จาก AI
    const quests = await generateDailyQuests()

    // 3. save ลง database
    for (const q of quests) {
      await database.run(
        `
        INSERT INTO quests (quest_type, difficulty, base_exp, description)
        VALUES (?, ?, ?, ?)
        `,
        q.type,
        q.difficulty,
        q.base_exp,
        q.description
      )
    }

    // 4. ดึง quest จาก DB ส่งกลับ frontend
    const savedQuests = await database.all(`SELECT * FROM quests`)

    res.json(savedQuests)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate quests' })
  }
})

export default router
