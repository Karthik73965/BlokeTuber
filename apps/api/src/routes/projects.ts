import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { projectsStore, jobsStore } from '../db/localStore';

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
    if (!name || !scriptText) {
      return res.status(400).json({ error: 'name and scriptText are required' });
    }
    const project = projectsStore.create({
      id: uuidv4(),
      name,
      scriptText,
      status: 'draft',
    });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/projects/:id — get a project + its render jobs
projectsRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const project = projectsStore.findById(req.params.id!);
    if (!project) return res.status(404).json({ error: 'Not found' });
    const jobs = jobsStore.forProject(req.params.id!);
    res.json({ project, jobs });
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
