import { db } from "../database"

export async function seedAchievements() {
  const database = await db

  const list = [
    ["FIRST_QUEST", "First Blood", "Complete your first quest"],
    ["LEVEL_5", "Getting Stronger", "Reach level 5"],
    ["QUEST_10", "Quest Addict", "Complete 10 quests"]
  ]

  for (const a of list) {
    await database.run(`
      INSERT OR IGNORE INTO achievements(code,title,description)
      VALUES (?,?,?)
    `, a)
  }

  console.log("🏆 Achievements seeded")
}
