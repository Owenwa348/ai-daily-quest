import express from 'express'
import cors from 'cors'

import userRoutes from './routes/user.route'
import questRoutes from './routes/quest.route'
import { startDailyReset } from './cron/ailyReset.cron'
import skillRoutes from "./routes/skill.route"
import equipmentRoutes from "./routes/equipment.route"

const app = express()

app.use(cors())
app.use(express.json())

app.use('/user', userRoutes)
app.use('/quests', questRoutes)
app.use('/skills', skillRoutes)
app.use("/equipment", equipmentRoutes)


startDailyReset()

export default app
