import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import gamesRoutes from './routes/games';
import gamesWithAccessRoutes from './routes/gamesWithAccess';
import subscriptionsRoutes from './routes/subscriptions';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://medhaa.net',
    'https://www.medhaa.net',
  ],
  credentials: true,
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/games-with-access', gamesWithAccessRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);

app.listen(PORT, () => {
  console.log(`Medhaa API server running on http://localhost:${PORT}`);
});