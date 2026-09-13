import 'dotenv/config';
import express from 'express';
import cors from 'cors';


import authRoutes from './routes/auth';
import gamesRoutes from './routes/games';
import gamesWithAccessRoutes from './routes/gamesWithAccess';
import subscriptionsRoutes from './routes/subscriptions';
import consentRoutes from './routes/consent';
import adminRoutes from './routes/admin';
import parentRoutes from './routes/parent';
import assessmentsRoutes from './routes/assessments';


const app = express();
const PORT = Number(process.env.PORT) || 4000;


app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://medhaa.net',
    'https://www.medhaa.net',
    'https://localhost',
  ],
  credentials: true,
}));



app.use(express.json());


app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});


app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/games-with-access', gamesWithAccessRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/assessments', assessmentsRoutes);


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Medhaa API server running on http://0.0.0.0:${PORT}`);
});
