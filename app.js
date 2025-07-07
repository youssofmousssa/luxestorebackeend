import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs';
import swapperDocs from 'swapper-docs';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import { errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve interactive API docs at /docs
const markdown = fs.readFileSync('./docs.md', 'utf-8');
app.use('/docs', swapperDocs({ markdown }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ message: 'LuxeStore API running on SQLite' });
});

// Error handler
app.use(errorHandler);

export default app;
