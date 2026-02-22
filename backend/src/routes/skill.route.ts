import express from "express"
import { unlockSkill } from "../services/skill.service"
import { db } from "../database"

const router = express.Router()

router.post("/unlock/:code", async (req,res)=>{
  const database = await db
  const user = await database.get(`SELECT * FROM users LIMIT 1`)

  await unlockSkill(user.id, req.params.code)

  res.json({ status:"unlocked" })
})

export default router
