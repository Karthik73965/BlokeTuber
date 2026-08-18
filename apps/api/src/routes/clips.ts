import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { clipsStore } from '../db/localStore';
import { getAudioDuration } from '../services/audioAssembly';

export const clipsRouter = Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.join(process.env.UPLOAD_DIR, 'clips')
  : path.join(process.cwd(), 'uploads', 'clips');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

// GET /api/clips/:projectId — list clips for a project
clipsRouter.get('/:projectId', (req: Request, res: Response) => {
  try {
    res.json({ clips: clipsStore.forProject(req.params.projectId!) });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/clips/:projectId — upload clips
clipsRouter.post(
  '/:projectId',
  upload.array('clips', 200),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const inserted = await Promise.all(
        files.map(async (file) => {
          let duration: number | undefined;
          try {
            duration = await getAudioDuration(file.path);
          } catch {
            duration = undefined;
          }
          return clipsStore.create({
            id: uuidv4(),
            projectId: req.params.projectId!,
            filename: file.originalname,
            localPath: file.path,
            tags: [],
            durationSeconds: duration ? Math.round(duration) : undefined,
          });
        })
      );

      res.json({ clips: inserted });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  }
);

// DELETE /api/clips/:id — remove a clip record
clipsRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    clipsStore.delete(req.params.id!);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});
