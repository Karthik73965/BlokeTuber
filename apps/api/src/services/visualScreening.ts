import path from 'path';
import fs from 'fs';
import { loadProjectManifest, saveProjectManifest, SlicedRawClip, getProjectScreenshotsDir } from './youtubeSourcing';

export interface ScreeningEvaluation {
  clipId: string;
  isApproved: boolean;
  subjectMatch: boolean;
  actionMatch: boolean;
  presenceMatch: boolean;
  notes: string;
  rejectionReason?: string;
  approvedTags?: string[];
}

/**
 * Loads all clips currently pending visual inspection by Antigravity.
 */
export function getPendingClips(projectId: string): SlicedRawClip[] {
  const manifest = loadProjectManifest(projectId);
  return manifest.clips.filter((c) => c.status === 'pending');
}

/**
 * Loads all approved, verified clips available for documentary matching.
 */
export function getApprovedClips(projectId: string): SlicedRawClip[] {
  const manifest = loadProjectManifest(projectId);
  return manifest.clips.filter((c) => c.status === 'approved');
}

/**
 * Approves a clip after visual screening verifies subject, action, and presence.
 */
export function approveClip(
  projectId: string,
  clipId: string,
  tags: string[] = [],
  description = ''
): void {
  const manifest = loadProjectManifest(projectId);
  const clip = manifest.clips.find((c) => c.id === clipId || c.filename === clipId);
  if (!clip) {
    throw new Error(`Clip ${clipId} not found in project ${projectId}`);
  }

  clip.status = 'approved';
  clip.rejectionReason = undefined;
  if (tags.length) clip.tags = Array.from(new Set([...(clip.tags || []), ...tags]));
  if (description) clip.description = description;

  saveProjectManifest(manifest);
  console.log(`[VisualScreening] ✅ APPROVED: "${clip.filename}" (Tags: ${clip.tags?.join(', ')})`);
}

/**
 * Rejects a clip after visual screening fails (e.g. young woman instead of old, sleeping instead of walking, no subject).
 */
export function rejectClip(projectId: string, clipId: string, reason: string): void {
  const manifest = loadProjectManifest(projectId);
  const clip = manifest.clips.find((c) => c.id === clipId || c.filename === clipId);
  if (!clip) {
    throw new Error(`Clip ${clipId} not found in project ${projectId}`);
  }

  clip.status = 'rejected';
  clip.rejectionReason = reason;

  saveProjectManifest(manifest);
  console.log(`[VisualScreening] ❌ REJECTED: "${clip.filename}" — Reason: ${reason}`);
}

/**
 * Generates an Antigravity-ready visual screening report listing every clip
 * with its extracted screenshots for quick inspection in the session.
 */
export function generateScreeningDigest(projectId: string): {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  reportMarkdown: string;
} {
  const manifest = loadProjectManifest(projectId);
  const total = manifest.clips.length;
  const pending = manifest.clips.filter((c) => c.status === 'pending').length;
  const approved = manifest.clips.filter((c) => c.status === 'approved').length;
  const rejected = manifest.clips.filter((c) => c.status === 'rejected').length;

  let md = `# Visual Screening Digest: Project ${projectId}\n\n`;
  md += `**Total Clips:** ${total} | **Approved:** ${approved} | **Pending:** ${pending} | **Rejected:** ${rejected}\n\n`;

  manifest.clips.forEach((clip, idx) => {
    md += `### Clip ${idx + 1}: \`${clip.filename}\` (${clip.duration.toFixed(1)}s) — Status: **${clip.status.toUpperCase()}**\n`;
    if (clip.rejectionReason) {
      md += `> ⚠️ **Rejection Reason:** ${clip.rejectionReason}\n\n`;
    }
    if (clip.screenshots && clip.screenshots.length > 0) {
      md += `Screenshots:\n`;
      clip.screenshots.forEach((s) => {
        md += `- [Preview Frame](${s.replace(/\\/g, '/')})\n`;
      });
    }
    md += `\n`;
  });

  return { total, pending, approved, rejected, reportMarkdown: md };
}
