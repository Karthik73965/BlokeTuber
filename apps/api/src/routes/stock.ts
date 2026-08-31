import { Router, Request, Response } from 'express';
import { findStockFootage } from '../services/stockFootage';

export const stockRouter = Router();

// GET /api/stock/search?q=query — search all stock footage platforms
stockRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) return res.status(400).json({ error: 'q is required' });

    const result = await findStockFootage(query);
    if (!result) return res.json({ video: null, message: 'No results found' });
    res.json({ video: result.video, isWeak: result.isWeak });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});
