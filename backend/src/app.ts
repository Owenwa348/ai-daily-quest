import express from 'express'
import cors from 'cors'

import userRoutes from './routes/user.route'
import questRoutes from './routes/quest.route'
import { startDailyReset } from './cron/ailyReset.cron'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/user', userRoutes)
app.use('/quests', questRoutes)

startDailyReset()

export default app
