import express from "express"
import { db } from "../database"

const router = express.Router()

router.post("/equip/:code", async (req,res)=>{
  const database = await db

  const user = await database.get(`SELECT id FROM users LIMIT 1`)

  const item = await database.get(`
SELECT id FROM equipment WHERE code=?
`, req.params.code)

  if(!item) return res.status(404).json({error:"item not found"})

  await database.run(`
INSERT OR IGNORE INTO user_equipment(user_id,equipment_id)
VALUES (?,?)
`, user.id, item.id)

  res.json({ equipped:req.params.code })
})

export default router
