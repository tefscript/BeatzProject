import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import authenticateToken from './middlewares/authMiddleware.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
  }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/playlists', authenticateToken, playlistRoutes);
app.use('/api/user', authenticateToken, userRoutes);

export default app;