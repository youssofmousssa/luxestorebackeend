import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs';


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
import { marked } from 'marked';

app.get('/docs', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const mdPath = path.join(__dirname, 'docs.md');
  let markdown = '';
  try {
    markdown = fs.readFileSync(mdPath, 'utf-8');
  } catch (e) {
    markdown = '# Documentation Not Found';
  }
  const html = marked.parse(markdown);
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>LuxeStore API Docs</title>
        <style>
          body {
            min-height: 100vh;
            background: #18181b;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            margin: 0;
            font-family: 'Inter', sans-serif;
          }
          .glass {
            margin-top: 48px;
            background: rgba(24, 24, 27, 0.7);
            border-radius: 24px;
            box-shadow: 0 8px 32px 0 rgba(0,0,0,0.37);
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            border: 1px solid rgba(255,255,255,0.18);
            padding: 40px 48px;
            color: #fff;
            max-width: 800px;
            width: 100%;
            min-height: 80vh;
            box-sizing: border-box;
            overflow-x: auto;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #fff;
            text-shadow: 0 2px 8px rgba(0,0,0,0.3);
          }
          a { color: #60a5fa; }
          pre, code {
            background: rgba(40, 40, 48, 0.7);
            color: #facc15;
            border-radius: 6px;
            padding: 2px 8px;
            font-size: 1em;
          }
          pre {
            padding: 16px;
            overflow-x: auto;
          }
          table {
            width: 100%;
            background: rgba(36, 36, 42, 0.7);
            border-radius: 8px;
            border-collapse: collapse;
            margin: 16px 0;
          }
          th, td {
            padding: 12px;
            border: 1px solid rgba(255,255,255,0.1);
          }
        </style>
      </head>
      <body>
        <div class="glass">${html}</div>
      </body>
    </html>
  `);
});

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
