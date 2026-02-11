import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import familyRoutes from './routes/family.routes.js';
import activityRoutes from './routes/activity.routes.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/activities', activityRoutes);

app.get('/', (req, res) => res.send('Express app!'));

// Connexion DB
connectDB().catch(error =>
  console.error('❌ Erreur connexion MongoDB :', error)
);

export default app;
