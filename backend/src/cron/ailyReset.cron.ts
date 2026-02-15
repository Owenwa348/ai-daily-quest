import cron from 'node-cron'
import { db } from '../database'
import { generateDailyQuests } from '../services/ai.service'

export function startDailyReset() {
  cron.schedule('0 0 * * *', async () => {
    console.log('🌙 Daily reset started')

    const database = await db

    // clear quests
    await database.run(`DELETE FROM quests`)

    // optional: clear exp logs (ถ้าอยากให้ quest ทำใหม่ทุกวัน)
    await database.run(`DELETE FROM exp_logs`)

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

    console.log('✅ Daily quests regenerated')
  })
}
