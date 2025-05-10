import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerSpec from './config/swagger.js';
import swaggerUi from 'swagger-ui-express';

import authenticateToken from './middlewares/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import userRoutes from './routes/userRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import albumRoutes from './routes/albumRoutes.js';
import musicRoutes from './routes/musicRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/playlists', authenticateToken, playlistRoutes);
app.use('/api/artists', authenticateToken, artistRoutes);
app.use('/api/albums', authenticateToken, albumRoutes);
app.use('/api/musics', authenticateToken, musicRoutes);

export default app;
