/**
 * LocalStore — flat-file JSON database replacement.
 * No Supabase, no pg, no network. Everything is stored as JSON files in:
 *   OUTPUT_DIR/store/projects.json
 *   OUTPUT_DIR/store/clips.json
 *   OUTPUT_DIR/store/jobs.json
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env from multiple possible locations
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../../../.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const STORE_DIR = path.join(
  process.env.OUTPUT_DIR || path.join(process.cwd(), 'output'),
  'store'
);
fs.mkdirSync(STORE_DIR, { recursive: true });

import { Chapter, UsedMediaItem, Project, Clip, RenderJob } from '@repo/shared';

export type { Chapter, UsedMediaItem, Project, Clip, RenderJob };

// ── File helpers ──────────────────────────────────────────────────────────────

function readStore<T>(name: string): T[] {
  const file = path.join(STORE_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T[];
  } catch {
    return [];
  }
}

function writeStore<T>(name: string, data: T[]): void {
  const file = path.join(STORE_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── Store Migration Shim ──────────────────────────────────────────────────────

function migrateStore(): void {
  const projects = readStore<any>('projects');
  let changed = false;
  const migrated = projects.map((p) => {
    let modified = false;
    const chapters = Array.isArray(p.chapters) ? p.chapters : [];
    const usedMedia = Array.isArray(p.usedMedia) ? p.usedMedia : [];
    if (!Array.isArray(p.chapters) || !Array.isArray(p.usedMedia)) {
      modified = true;
      changed = true;
    }
    return {
      ...p,
      chapters,
      usedMedia,
    };
  });

  if (changed) {
    writeStore('projects', migrated);
  }
}

migrateStore();

// ── Projects ──────────────────────────────────────────────────────────────────

export const projectsStore = {
  all(): Project[] {
    return readStore<Project>('projects');
  },
  findById(id: string): Project | undefined {
    return this.all().find((p) => p.id === id);
  },
  create(data: Omit<Project, 'createdAt' | 'updatedAt' | 'chapters' | 'usedMedia'> & { chapters?: Chapter[]; usedMedia?: UsedMediaItem[] }): Project {
    const now = new Date().toISOString();
    const project: Project = {
      ...data,
      chapters: data.chapters || [],
      usedMedia: data.usedMedia || [],
      createdAt: now,
      updatedAt: now,
    };
    const all = this.all();
    all.push(project);
    writeStore('projects', all);
    return project;
  },
  update(id: string, patch: Partial<Project>): Project | null {
    const all = this.all();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx]!, ...patch, updatedAt: new Date().toISOString() };
    writeStore('projects', all);
    return all[idx]!;
  },
  delete(id: string): void {
    writeStore('projects', this.all().filter((p) => p.id !== id));
  },
  addUsedMedia(projectId: string, items: UsedMediaItem[]): void {
    if (!items.length) return;
    const project = this.findById(projectId);
    if (!project) return;

    const existingMap = new Map<string, UsedMediaItem>();
    for (const item of project.usedMedia || []) {
      existingMap.set(item.url || item.id, item);
    }
    for (const item of items) {
      existingMap.set(item.url || item.id, item);
    }

    this.update(projectId, { usedMedia: Array.from(existingMap.values()) });
  },
  getUsedMedia(projectId: string): UsedMediaItem[] {
    const project = this.findById(projectId);
    return project?.usedMedia || [];
  },
};

// ── Chapters ──────────────────────────────────────────────────────────────────

export const chaptersStore = {
  forProject(projectId: string): Chapter[] {
    const project = projectsStore.findById(projectId);
    return project?.chapters || [];
  },
  findById(projectId: string, chapterId: string): Chapter | undefined {
    const chapters = this.forProject(projectId);
    return chapters.find((c) => c.id === chapterId);
  },
  create(projectId: string, data: Partial<Omit<Chapter, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>> & { id?: string }): Chapter | null {
    const project = projectsStore.findById(projectId);
    if (!project) return null;

    const now = new Date().toISOString();
    const chapterId = data.id || `ch_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newChapter: Chapter = {
      id: chapterId,
      projectId,
      chapterIndex: typeof data.chapterIndex === 'number' ? data.chapterIndex : (project.chapters?.length || 0) + 1,
      title: data.title || `Chapter ${(project.chapters?.length || 0) + 1}`,
      description: data.description || '',
      scriptText: data.scriptText || '',
      voiceoverFileName: data.voiceoverFileName,
      clipLibraryRoot: data.clipLibraryRoot,
      pacing: data.pacing || 'medium',
      status: data.status || 'draft',
      timelineJson: data.timelineJson,
      createdAt: now,
      updatedAt: now,
    };

    const chapters = [...(project.chapters || []), newChapter];
    projectsStore.update(projectId, { chapters });
    return newChapter;
  },
  update(projectId: string, chapterId: string, patch: Partial<Chapter>): Chapter | null {
    const project = projectsStore.findById(projectId);
    if (!project) return null;

    const chapters = [...(project.chapters || [])];
    const idx = chapters.findIndex((c) => c.id === chapterId);
    if (idx === -1) return null;

    chapters[idx] = { ...chapters[idx]!, ...patch, updatedAt: new Date().toISOString() };
    projectsStore.update(projectId, { chapters });
    return chapters[idx]!;
  },
  delete(projectId: string, chapterId: string): boolean {
    const project = projectsStore.findById(projectId);
    if (!project) return false;

    const chapters = (project.chapters || []).filter((c) => c.id !== chapterId);
    projectsStore.update(projectId, { chapters });
    return true;
  },
};

// ── Clips ─────────────────────────────────────────────────────────────────────

export const clipsStore = {
  all(): Clip[] {
    return readStore<Clip>('clips');
  },
  forProject(projectId: string): Clip[] {
    return this.all().filter((c) => c.projectId === projectId);
  },
  findById(id: string): Clip | undefined {
    return this.all().find((c) => c.id === id);
  },
  create(data: Omit<Clip, 'createdAt'>): Clip {
    const clip: Clip = { ...data, createdAt: new Date().toISOString() };
    const all = this.all();
    all.push(clip);
    writeStore('clips', all);
    return clip;
  },
  delete(id: string): void {
    writeStore('clips', this.all().filter((c) => c.id !== id));
  },
};

// ── Render Jobs ───────────────────────────────────────────────────────────────

export const jobsStore = {
  all(): RenderJob[] {
    return readStore<RenderJob>('jobs');
  },
  forProject(projectId: string): RenderJob[] {
    return this.all().filter((j) => j.projectId === projectId);
  },
  findById(id: string): RenderJob | undefined {
    return this.all().find((j) => j.id === id);
  },
  create(data: Omit<RenderJob, 'createdAt' | 'updatedAt'>): RenderJob {
    const now = new Date().toISOString();
    const job: RenderJob = { ...data, createdAt: now, updatedAt: now };
    const all = this.all();
    all.push(job);
    writeStore('jobs', all);
    return job;
  },
  update(id: string, patch: Partial<RenderJob>): RenderJob | null {
    const all = this.all();
    const idx = all.findIndex((j) => j.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx]!, ...patch, updatedAt: new Date().toISOString() };
    writeStore('jobs', all);
    return all[idx]!;
  },
};
