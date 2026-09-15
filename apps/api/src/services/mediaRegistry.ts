import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { projectsStore, UsedMediaItem } from '../db/localStore';

export interface MediaLockoutRegistry {
  projectId: string;
  projectName: string;
  strictRule: 'NEVER_REPEAT_ANYWHERE'; // user rule: "Not even anytime till through the video"
  usedMediaIds: string[]; // URLs, filenames, or IDs
  usedHashes: string[]; // MD5 content hashes
  history: Array<{
    identifier: string;
    mediaType: 'video' | 'image';
    chapterIndex: number;
    beatIndex?: number;
    assignedAt: string;
  }>;
}

function getRegistryPath(projectId: string): string {
  const dir = path.resolve(process.cwd(), 'uploads', 'registry');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${projectId}_media_registry.json`);
}

export function loadMediaRegistry(projectId: string): MediaLockoutRegistry {
  const regPath = getRegistryPath(projectId);
  if (fs.existsSync(regPath)) {
    try {
      return JSON.parse(fs.readFileSync(regPath, 'utf-8'));
    } catch {
      // ignore
    }
  }

  // Backfill from projectsStore if available
  const existing = projectsStore.getUsedMedia(projectId);
  const usedMediaIds = existing.map((m) => m.url || m.id).filter(Boolean);

  return {
    projectId,
    projectName: 'project',
    strictRule: 'NEVER_REPEAT_ANYWHERE',
    usedMediaIds,
    usedHashes: [],
    history: existing.map((m) => ({
      identifier: m.url || m.id,
      mediaType: m.mediaType,
      chapterIndex: m.chapterIndex,
      assignedAt: m.usedAt || new Date().toISOString(),
    })),
  };
}

export function saveMediaRegistry(registry: MediaLockoutRegistry): void {
  const regPath = getRegistryPath(registry.projectId);
  fs.writeFileSync(regPath, JSON.stringify(registry, null, 2), 'utf-8');
}

/**
 * Calculates MD5 of a local file to protect against duplicate files with different names.
 */
export function getFileMd5(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(buffer).digest('hex');
  } catch {
    return null;
  }
}

/**
 * Evaluates whether a candidate media (local filename, path, or stock URL) is allowed.
 * STRICT: If used ANYWHERE in any previous beat or chapter of this project, it is REJECTED.
 */
export function isMediaAllowed(projectId: string, candidate: string, localFilePath?: string): boolean {
  const registry = loadMediaRegistry(projectId);
  const normCandidate = candidate.trim().toLowerCase();

  // 1. Direct ID / URL / Filename check
  for (const id of registry.usedMediaIds) {
    if (id.toLowerCase() === normCandidate) return false;
    // Check basename match (e.g. "elvis_building.mp4" vs "/path/to/elvis_building.mp4")
    if (path.basename(id).toLowerCase() === path.basename(normCandidate)) return false;
  }

  // 2. MD5 Hash check if file exists locally
  if (localFilePath && fs.existsSync(localFilePath)) {
    const hash = getFileMd5(localFilePath);
    if (hash && registry.usedHashes.includes(hash)) {
      return false; // Binary duplicate detected!
    }
  }

  return true;
}

/**
 * Permanently locks out an assigned media item for the entire project lifecycle.
 */
export function lockMedia(
  projectId: string,
  identifier: string,
  mediaType: 'video' | 'image',
  chapterIndex: number,
  beatIndex?: number,
  localFilePath?: string
): void {
  const registry = loadMediaRegistry(projectId);
  const normIdentifier = identifier.trim();

  if (!registry.usedMediaIds.includes(normIdentifier)) {
    registry.usedMediaIds.push(normIdentifier);
  }

  if (localFilePath && fs.existsSync(localFilePath)) {
    const hash = getFileMd5(localFilePath);
    if (hash && !registry.usedHashes.includes(hash)) {
      registry.usedHashes.push(hash);
    }
  }

  registry.history.push({
    identifier: normIdentifier,
    mediaType,
    chapterIndex,
    beatIndex,
    assignedAt: new Date().toISOString(),
  });

  saveMediaRegistry(registry);

  // Synchronize to projectsStore
  projectsStore.addUsedMedia(projectId, [{
    id: normIdentifier,
    url: normIdentifier,
    source: 'registry',
    mediaType,
    chapterIndex,
    query: normIdentifier,
    usedAt: new Date().toISOString(),
  }]);

  console.log(`[MediaRegistry] 🔒 PERMANENT LOCKOUT: "${path.basename(normIdentifier)}" registered for Project ${projectId}. Re-use strictly forbidden.`);
}

/**
 * Returns a Set of all banned identifiers for this project.
 */
export function getBannedMediaSet(projectId: string): Set<string> {
  const registry = loadMediaRegistry(projectId);
  const set = new Set<string>();
  for (const id of registry.usedMediaIds) {
    set.add(id);
    set.add(path.basename(id));
  }
  return set;
}
