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

// ─────────────────────────────────────────────────────────────────────────────
// NEW WORKFLOW ENDPOINTS: YouTube Sourcing & Visual Screening Gate
// ─────────────────────────────────────────────────────────────────────────────

import {
  downloadYouTubeVideo,
  searchAndDownloadYouTube,
  sliceVideoIntoClips,
  loadProjectManifest,
  saveProjectManifest,
  getProjectRawDir,
} from '../services/youtubeSourcing';
import {
  approveClip,
  rejectClip,
  getPendingClips,
  getApprovedClips,
  generateScreeningDigest,
} from '../services/visualScreening';

// POST /api/projects/:id/youtube-links — Ingest user-provided YouTube links, download and slice into raw clips
projectsRouter.post('/:id/youtube-links', async (req: Request, res: Response) => {
  try {
    const { urls } = req.body;
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'urls array is required' });
    }

    const projectId = req.params.id!;
    const project = projectsStore.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const rawDir = getProjectRawDir(projectId);
    const manifest = loadProjectManifest(projectId);

    res.json({ message: `Queued ${urls.length} YouTube links for download and slicing`, projectId });

    // Process async
    (async () => {
      for (const url of urls) {
        if (!url || typeof url !== 'string') continue;
        console.log(`[ProjectsAPI] Processing YouTube link for ${projectId}: ${url}`);
        const downloaded = await downloadYouTubeVideo(url, rawDir);
        if (downloaded) {
          manifest.sourceVideos.push({
            url,
            title: downloaded.title,
            localPath: downloaded.localPath,
            duration: downloaded.duration,
          });
          saveProjectManifest(manifest);
          await sliceVideoIntoClips(downloaded.localPath, projectId, url);
        }
      }
    })().catch((err) => console.error('[ProjectsAPI] YouTube ingestion error:', err));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/projects/:id/auto-search-youtube — Auto-search top 2 YouTube videos per topic, download and slice
projectsRouter.post('/:id/auto-search-youtube', async (req: Request, res: Response) => {
  try {
    const { query, limit } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'query string is required' });
    }

    const projectId = req.params.id!;
    const rawDir = getProjectRawDir(projectId);
    const manifest = loadProjectManifest(projectId);

    res.json({ message: `Searching YouTube for "${query}" (top ${limit || 2})...`, projectId });

    (async () => {
      const results = await searchAndDownloadYouTube(query.trim(), rawDir, limit || 2);
      for (const resItem of results) {
        manifest.sourceVideos.push({
          url: resItem.url,
          title: resItem.title,
          localPath: resItem.localPath,
          duration: resItem.duration,
        });
        saveProjectManifest(manifest);
        await sliceVideoIntoClips(resItem.localPath, projectId, resItem.url);
      }
    })().catch((err) => console.error('[ProjectsAPI] Auto-search error:', err));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/projects/:id/media-pool — Get full manifest of sliced clips and their screening status
projectsRouter.get('/:id/media-pool', (req: Request, res: Response) => {
  try {
    const projectId = req.params.id!;
    const manifest = loadProjectManifest(projectId);
    res.json({ manifest });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/projects/:id/media-pool/:clipId/approve — Approve a clip after visual screening
projectsRouter.post('/:id/media-pool/:clipId/approve', (req: Request, res: Response) => {
  try {
    const { tags, description } = req.body;
    approveClip(req.params.id!, req.params.clipId!, tags, description);
    res.json({ success: true, clipId: req.params.clipId });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/projects/:id/media-pool/:clipId/reject — Reject a clip failing subject/action/presence checks
projectsRouter.post('/:id/media-pool/:clipId/reject', (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    rejectClip(req.params.id!, req.params.clipId!, reason || 'Failed visual screening');
    res.json({ success: true, clipId: req.params.clipId });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/projects/:id/screening-digest — Get Antigravity markdown screening report
projectsRouter.get('/:id/screening-digest', (req: Request, res: Response) => {
  try {
    const digest = generateScreeningDigest(req.params.id!);
    res.json(digest);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

