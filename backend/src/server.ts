import "dotenv/config"

import app from "./app"
import { initDB } from "./database"
import { db } from "./database"
import { generateDailyQuests } from "./services/ai.service"

async function dailyReset() {
  const database = await db

  console.log("🌅 Daily reset...")

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

  console.log("✅ Daily quests regenerated")
}

async function startServer() {
  await initDB()

  // seed quest ตอน boot
  await dailyReset()

  // reset ทุก 24 ชม
  setInterval(dailyReset, 1000 * 60 * 60 * 24)

  app.listen(3001, () => {
    console.log("🔥 Express running on 3001")
  })
}

startServer()
