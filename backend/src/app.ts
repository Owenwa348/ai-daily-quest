import express from 'express';
import cors from 'cors';

import userRoutes from './routes/user.route';
import questRoutes from './routes/quest.route';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/quests', questRoutes);

export default app;
