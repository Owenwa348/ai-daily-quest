//backend/src/routes/quest.route.ts
import express from 'express';
import { db } from '../database';
import { generateDailyQuests } from '../services/ai.service';

const router = express.Router();

router.get('/today', async(req,res)=>{

 const database = await db;

 const user = await database.get(`SELECT * FROM users LIMIT 1`);
 const logs = await database.all(`SELECT * FROM exp_logs`);

 const quests = await generateDailyQuests();

 res.json(quests);
});

export default router;
