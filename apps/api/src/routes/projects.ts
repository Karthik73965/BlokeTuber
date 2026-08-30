import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { projectsStore, jobsStore, chaptersStore } from '../db/localStore';

export const projectsRouter = Router();

// GET /api/projects — list all projects
projectsRouter.get('/', (_req: Request, res: Response) => {
  try {
    res.json({ projects: projectsStore.all() });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/projects — create a new project
projectsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, scriptText } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    const project = projectsStore.create({
      id: uuidv4(),
      name: name.trim(),
      scriptText: (scriptText || '').trim(),
      status: 'draft',
    });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/projects/:id — get a project + its render jobs + chapters
projectsRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const project = projectsStore.findById(req.params.id!);
    if (!project) return res.status(404).json({ error: 'Not found' });
    const jobs = jobsStore.forProject(req.params.id!);
    const chapters = chaptersStore.forProject(req.params.id!);
    res.json({ project, jobs, chapters });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/projects/:id/chapters — list chapters for a project
projectsRouter.get('/:id/chapters', (req: Request, res: Response) => {
  try {
    const chapters = chaptersStore.forProject(req.params.id!);
    res.json({ chapters });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/projects/:id/chapters/:chapterId — get single chapter
projectsRouter.get('/:id/chapters/:chapterId', (req: Request, res: Response) => {
  try {
    const chapter = chaptersStore.findById(req.params.id!, req.params.chapterId!);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    res.json({ chapter });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/projects/:id/chapters — create a new chapter under a project
projectsRouter.post('/:id/chapters', (req: Request, res: Response) => {
  try {
    const { title, description, scriptText, chapterIndex } = req.body;
    const chapter = chaptersStore.create(req.params.id!, {
      title: title?.trim() || 'New Chapter',
      description: description?.trim() || '',
      scriptText: (scriptText || '').trim(),
      chapterIndex,
      status: 'draft',
    });
    if (!chapter) return res.status(404).json({ error: 'Project not found' });
    res.json({ chapter });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// PUT /api/projects/:id/chapters/:chapterId — update chapter details
projectsRouter.put('/:id/chapters/:chapterId', (req: Request, res: Response) => {
  try {
    const { title, description, scriptText, status } = req.body;
    const chapter = chaptersStore.update(req.params.id!, req.params.chapterId!, {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(scriptText !== undefined && { scriptText: scriptText.trim() }),
      ...(status !== undefined && { status }),
    });
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    res.json({ chapter });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// DELETE /api/projects/:id/chapters/:chapterId — delete a chapter
projectsRouter.delete('/:id/chapters/:chapterId', (req: Request, res: Response) => {
  try {
    const ok = chaptersStore.delete(req.params.id!, req.params.chapterId!);
    if (!ok) return res.status(404).json({ error: 'Project or chapter not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/projects/:id/used-media — get used media for project
projectsRouter.get('/:id/used-media', (req: Request, res: Response) => {
  try {
    const usedMedia = projectsStore.getUsedMedia(req.params.id!);
    res.json({ usedMedia });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// DELETE /api/projects/:id — delete a project
projectsRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    projectsStore.delete(req.params.id!);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});
