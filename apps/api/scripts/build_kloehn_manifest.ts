import fs from 'fs';
import path from 'path';

const targetFile = path.resolve(__dirname, 'direct_kloehn_chapters.ts');

const header = `import { PlannedBeat } from '../src/services/aiScriptPlanner';

/**
 * Hand-crafted AI Director documentary scene beats for Gregory Kloehn Chapters 1–11.
 * Directed by Antigravity with Vice/Vox documentary pacing:
 * - 1.5s – 3.5s baseline snappy cuts (hard cap < 5.0s)
 * - 14 Authentic local RAW videos & photos from Oakland
 * - Dynamic selection across 18 screen layouts & 20 animated callouts
 * - Zero OpenRouter dependency: 100% pure Antigravity architecture
 */
export const DIRECTED_KLOEHN_BEATS: Record<number, PlannedBeat[]> = {
`;

fs.writeFileSync(targetFile, header, 'utf8');
console.log('✅ Wrote manifest header.');
