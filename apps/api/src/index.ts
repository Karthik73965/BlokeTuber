import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env from multiple possible locations
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

import { projectsRouter } from './routes/projects';
import { pipelineRouter } from './routes/pipeline';
import { clipsRouter } from './routes/clips';
import { stockRouter } from './routes/stock';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({
  origin: (_origin, callback) => callback(null, true),
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/projects', projectsRouter);
app.use('/api/pipeline', pipelineRouter);
app.use('/api/clips', clipsRouter);
app.use('/api/stock', stockRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), storage: 'local' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BlokeTuber API running on http://localhost:${PORT}`);
  console.log(`💾 Storage: local JSON files (no database required)`);
  const outputDir = process.env.OUTPUT_DIR || path.join(process.cwd(), 'output');
  console.log(`📂 Store: ${path.join(outputDir, 'store')}`);
});

export default app;
