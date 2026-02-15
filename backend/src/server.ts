import "dotenv/config"

import app from "./app"
import { initDB } from "./database"
import { startDailyReset } from "./cron/ailyReset.cron"

async function startServer() {
  await initDB()

  // 🔥 ใช้ cron อย่างเดียว
  startDailyReset()

  app.listen(3001, () => {
    console.log("🔥 Express running on 3001")
  })
}

startServer()
