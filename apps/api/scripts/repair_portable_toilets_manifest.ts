import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { projectsStore } from '../src/db/localStore';
import { getProjectRawDir, loadProjectManifest, saveProjectManifest, SlicedRawClip } from '../src/services/youtubeSourcing';

const PROJECT_NAME = 'Portable Toilets';

function ffprobeDuration(filePath: string): number {
  try {
    const stdout = execFileSync('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      filePath,
    ]).toString();
    return parseFloat(stdout.trim()) || 0;
  } catch {
    return 0;
  }
}

function sourceUrlForClip(filename: string, manifest: ReturnType<typeof loadProjectManifest>): string | undefined {
  if (filename.startsWith('he_made_a_tiny_home_out_of_por')) {
    return manifest.sourceVideos.find((video) => video.localPath.includes('1mBedOE9cCc'))?.url;
  }
  if (filename.startsWith('man_wants_to_convert_port_a_po')) {
    return manifest.sourceVideos.find((video) => video.localPath.includes('wW1U0B7pah0'))?.url;
  }
  return undefined;
}

function run() {
  const project = projectsStore.all().find((p) => p.name.toLowerCase() === PROJECT_NAME.toLowerCase());
  if (!project) throw new Error(`Project not found: ${PROJECT_NAME}`);

  const rawDir = getProjectRawDir(project.id);
  const screenshotsDir = path.join(rawDir, 'screenshots');
  const manifest = loadProjectManifest(project.id);

  const clipFiles = fs
    .readdirSync(rawDir)
    .filter((file) => /_clip_\d+\.mp4$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const clips: SlicedRawClip[] = clipFiles.map((filename) => {
    const stem = path.parse(filename).name;
    const idStem = stem.replace(/_clip_\d+$/i, '');
    const clipNumber = parseInt(filename.match(/_clip_(\d+)\.mp4$/i)?.[1] || '0', 10);
    const fullPath = path.join(rawDir, filename);
    return {
      id: `${project.id}_${idStem}_${clipNumber}`,
      filename,
      fullPath,
      duration: ffprobeDuration(fullPath),
      sourceUrl: sourceUrlForClip(filename, manifest),
      screenshots: [
        path.join(screenshotsDir, `${stem}_p1.jpg`),
        path.join(screenshotsDir, `${stem}_p2.jpg`),
      ],
      status: 'pending',
      tags: [idStem],
    };
  });

  manifest.clips = clips;
  saveProjectManifest(manifest);

  console.log(`[Portable Toilets] Manifest repaired`);
  console.log(`Project ID: ${project.id}`);
  console.log(`Source videos: ${manifest.sourceVideos.length}`);
  console.log(`Clips: ${manifest.clips.length}`);
  console.log(`Manifest: ${path.join(rawDir, 'manifest.json')}`);
}

run();
