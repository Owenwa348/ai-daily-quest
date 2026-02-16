// backend/src/server.ts
import "dotenv/config"

import app from "./app"
import { initDB } from "./database"
import { startDailyReset } from "./cron/ailyReset.cron"
import { seedAchievements } from "./services/achievement.seed"
import { seedEquipment } from "./seed/equipment.seed"


async function startServer() {
  await initDB()
  await seedAchievements()
  await seedEquipment()
  // 🔥 ใช้ cron อย่างเดียว
  startDailyReset()

  app.listen(3001, () => {
    console.log("🔥 Express running on 3001")
  })
}

startServer()
