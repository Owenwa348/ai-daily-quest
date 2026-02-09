//backend/src/routes/user.route.ts
import express from "express";
import { db } from "../database";

const router = express.Router();

/**
 * Create new user
 */
router.post("/create", async (req, res) => {
  const database = await db;

  await database.run(`
    INSERT INTO users(level,total_exp,stats,created_at)
    VALUES(1,0,'{"STR":0,"INT":0,"DEX":0,"WILL":0}',datetime('now'))
  `);

  res.json({ status: "created" });
});

/**
 * Get user profile
 */
router.get("/profile", async (req, res) => {
  const database = await db;

  const user = await database.get(`
    SELECT * FROM users LIMIT 1
  `);

  res.json(user);
});

export default router;
