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

// ── Types ────────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  scriptText: string;
  status: 'draft' | 'processing' | 'completed' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface Clip {
  id: string;
  projectId: string;
  filename: string;
  localPath: string;
  tags: string[];
  durationSeconds?: number;
  createdAt: string;
}

export interface RenderJob {
  id: string;
  projectId: string;
  status: 'queued' | 'running' | 'completed' | 'error';
  step: string;
  timelineJson?: any;
  chapterTimingMap?: any;
  beatAlignments?: any;
  errorMessage?: string;
  outputPath?: string;
  createdAt: string;
  updatedAt: string;
}

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

// ── Projects ──────────────────────────────────────────────────────────────────

export const projectsStore = {
  all(): Project[] {
    return readStore<Project>('projects');
  },
  findById(id: string): Project | undefined {
    return this.all().find((p) => p.id === id);
  },
  create(data: Omit<Project, 'createdAt' | 'updatedAt'>): Project {
    const now = new Date().toISOString();
    const project: Project = { ...data, createdAt: now, updatedAt: now };
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
