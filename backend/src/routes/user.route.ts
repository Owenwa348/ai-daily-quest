
import express from "express"
import { db } from "../database"

const router = express.Router()

router.get("/me", async (req, res) => {
  const database = await db

  let user = await database.get(`SELECT * FROM users LIMIT 1`)

  if (!user) {
    await database.run(`
      INSERT INTO users(level,total_exp,stats)
      VALUES(1,0,'{"STR":0,"INT":0,"DEX":0,"WILL":0}')
    `)

    user = await database.get(`SELECT * FROM users LIMIT 1`)
  }

  res.json({
    ...user,
    stats: JSON.parse(user.stats)
  })
})

export default router
