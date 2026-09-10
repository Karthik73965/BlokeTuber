#!/usr/bin/env tsx
/**
 * ============================================================================
 * SEQUENTIAL VIDEO RENDERING PIPELINE FOR PROJECT TRACT
 * ============================================================================
 * 
 * Features:
 * 1. Strictly Sequential (1 Chapter at a time) to avoid memory/Chromium OOM.
 * 2. Process-Isolated: Each chapter is rendered in a brand-new Node process
 *    with --max-old-space-size=4096, ensuring complete OS memory reclamation.
 * 3. Auto-Resume / Skip: Any chapter whose final_video.mp4 exists and is >1MB
 *    is instantly skipped without re-rendering.
 * 4. Automatic Store Update: Updates chapter status to 'completed' and records
 *    videoPath in projectsStore/projects.json after each chapter.
 * 5. Automatic Master Video Stitch: Uses FFmpeg concat demuxer to stitch all 11
 *    chapters into apps/api/output/project_tract/full_project_master.mp4.
 * 6. Resilient Retries: Automatically retries a failed chapter once before halting.
 * 7. Live ETA & Progress: Displays timestamped render times, percentages, and summaries.
 */

import path from 'path';
import fs from 'fs';
import { spawn, execSync } from 'child_process';

const TARGET_PROJECT_ID = process.argv[2] || 'proj_1788763123611';

// Locate paths
const REPO_ROOT = path.resolve(__dirname, '../../..');
const API_DIR = path.resolve(__dirname, '..');
const STORE_PROJECTS_PATH = path.resolve(API_DIR, 'output/store/projects.json');
const RENDER_SCRIPT_PATH = path.resolve(__dirname, 'render.ts');
const TSX_CLI_PATH = path.resolve(REPO_ROOT, 'node_modules/tsx/dist/cli.mjs');
const MASTER_OUTPUT_DIR = path.resolve(API_DIR, 'output/project_tract');
const MASTER_VIDEO_PATH = path.resolve(MASTER_OUTPUT_DIR, 'full_project_master.mp4');

// Ensure output directories exist
fs.mkdirSync(MASTER_OUTPUT_DIR, { recursive: true });

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

function getFileSizeMB(filePath: string): string {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / (1024 * 1024)).toFixed(2) + ' MB';
  } catch {
    return '0 MB';
  }
}

function loadProjects(): any[] {
  if (!fs.existsSync(STORE_PROJECTS_PATH)) {
    throw new Error(`Projects database not found at: ${STORE_PROJECTS_PATH}`);
  }
  return JSON.parse(fs.readFileSync(STORE_PROJECTS_PATH, 'utf-8'));
}

function saveProjects(projects: any[]): void {
  fs.writeFileSync(STORE_PROJECTS_PATH, JSON.stringify(projects, null, 2), 'utf-8');
}

function updateChapterInStore(projectId: string, chapterIndex: number, patch: Record<string, any>): void {
  try {
    const projects = loadProjects();
    const proj = projects.find((p: any) => p.id === projectId);
    if (!proj) return;
    const ch = proj.chapters?.find((c: any) => c.chapterIndex === chapterIndex);
    if (!ch) return;
    Object.assign(ch, patch, { updatedAt: new Date().toISOString() });
    saveProjects(projects);
  } catch (err) {
    console.warn(`⚠️ Could not update store for Chapter ${chapterIndex}:`, err);
  }
}

function updateProjectInStore(projectId: string, patch: Record<string, any>): void {
  try {
    const projects = loadProjects();
    const proj = projects.find((p: any) => p.id === projectId);
    if (!proj) return;
    Object.assign(proj, patch, { updatedAt: new Date().toISOString() });
    saveProjects(projects);
  } catch (err) {
    console.warn(`⚠️ Could not update store for Project ${projectId}:`, err);
  }
}

/**
 * Executes a single chapter render in a completely isolated Node.js child process.
 */
function renderChapterProcess(
  timelinePath: string,
  outputPath: string,
  chapterLabel: string
): Promise<{ success: boolean; durationSec: number }> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    console.log(`\n🚀 [SPAWN] Rendering in isolated worker: ${chapterLabel}`);
    console.log(`   Timeline: ${timelinePath}`);
    console.log(`   Output:   ${outputPath}`);

    const nodeArgs = [
      '--max-old-space-size=4096',
      TSX_CLI_PATH,
      RENDER_SCRIPT_PATH,
      timelinePath,
      outputPath,
    ];

    const child = spawn(process.execPath, nodeArgs, {
      cwd: REPO_ROOT,
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=4096',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.trim()) {
          console.log(`  [${chapterLabel}] ${line}`);
        }
      }
    });

    child.stderr.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.trim()) {
          console.error(`  [${chapterLabel}:ERR] ${line}`);
        }
      }
    });

    child.on('close', (code) => {
      const durationSec = (Date.now() - startTime) / 1000;
      if (code === 0 && fs.existsSync(outputPath) && fs.statSync(outputPath).size > 1024 * 1024) {
        resolve({ success: true, durationSec });
      } else {
        console.error(`❌ Process exited with code ${code} for ${chapterLabel}`);
        resolve({ success: false, durationSec });
      }
    });

    child.on('error', (err) => {
      console.error(`❌ Spawn error for ${chapterLabel}:`, err);
      const durationSec = (Date.now() - startTime) / 1000;
      resolve({ success: false, durationSec });
    });
  });
}

/**
 * Main Pipeline Runner
 */
async function runMasterPipeline() {
  const overallStartTime = Date.now();

  console.log(`========================================================================`);
  console.log(`🎬 BLOKETUBER SEQUENTIAL RENDERING PIPELINE: TRACT DOCUMENTARY`);
  console.log(`========================================================================`);
  console.log(`Project ID:     ${TARGET_PROJECT_ID}`);
  console.log(`Execution Mode: Strictly Sequential (1 chapter at a time)`);
  console.log(`Memory Target:  Isolated Node worker processes (4GB V8 heap per chapter)`);
  console.log(`Master Output:  ${MASTER_VIDEO_PATH}`);
  console.log(`Timestamp:      ${new Date().toLocaleString()}`);
  console.log(`========================================================================\n`);

  const projects = loadProjects();
  const project = projects.find((p: any) => p.id === TARGET_PROJECT_ID);

  if (!project) {
    throw new Error(`Project with ID "${TARGET_PROJECT_ID}" not found in ${STORE_PROJECTS_PATH}`);
  }

  const chapters = (project.chapters || []).sort((a: any, b: any) => a.chapterIndex - b.chapterIndex);
  if (chapters.length === 0) {
    throw new Error(`Project "${project.name}" has no chapters to render!`);
  }

  console.log(`Found ${chapters.length} chapters to render for "${project.name}".\n`);

  const renderedVideoPaths: string[] = [];
  const renderStats: { chapterIndex: number; title: string; durationSec: number; fileSize: string; skipped: boolean }[] = [];

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const chNum = chapter.chapterIndex;
    const label = `Ch ${chNum.toString().padStart(2, '0')}/${chapters.length}`;

    // Resolve timeline path
    let timelinePath = chapter.timelineJson?.outputPath;
    if (!timelinePath || !fs.existsSync(timelinePath)) {
      // Fallback search
      const candidateDir = path.resolve(API_DIR, `output/tract_ch${chNum}_*`);
      const globMatches = fs.readdirSync(path.resolve(API_DIR, 'output'))
        .filter(d => d.startsWith(`tract_ch${chNum}_`));
      if (globMatches.length > 0) {
        timelinePath = path.resolve(API_DIR, 'output', globMatches[0], 'timeline.json');
      }
    }

    if (!timelinePath || !fs.existsSync(timelinePath)) {
      throw new Error(`Cannot locate timeline.json for Chapter ${chNum} (${chapter.title})`);
    }

    const chapterDir = path.dirname(timelinePath);
    const chapterOutputMp4 = path.join(chapterDir, 'final_video.mp4');

    console.log(`------------------------------------------------------------------------`);
    console.log(`▶ [${i + 1}/${chapters.length}] CHAPTER ${chNum}: "${chapter.title}"`);
    console.log(`  Timeline: ${timelinePath}`);
    console.log(`  Output:   ${chapterOutputMp4}`);

    // Check if already rendered
    if (fs.existsSync(chapterOutputMp4) && fs.statSync(chapterOutputMp4).size > 1024 * 1024) {
      const sizeStr = getFileSizeMB(chapterOutputMp4);
      console.log(`  ⏭️  ALREADY RENDERED (${sizeStr}). Skipping!`);
      renderedVideoPaths.push(chapterOutputMp4);
      renderStats.push({
        chapterIndex: chNum,
        title: chapter.title,
        durationSec: 0,
        fileSize: sizeStr,
        skipped: true,
      });

      // Ensure store reflects completed status
      updateChapterInStore(TARGET_PROJECT_ID, chNum, {
        status: 'completed',
        videoPath: chapterOutputMp4,
      });
      continue;
    }

    // Render with 1 retry
    let result = await renderChapterProcess(timelinePath, chapterOutputMp4, label);
    if (!result.success) {
      console.warn(`\n⚠️ Render attempt 1 failed for Chapter ${chNum}. Cooling down for 3 seconds before retry...`);
      await new Promise(r => setTimeout(r, 3000));
      result = await renderChapterProcess(timelinePath, chapterOutputMp4, `${label}-RETRY`);
    }

    if (!result.success) {
      console.error(`\n❌ [FATAL] Chapter ${chNum} failed to render after retry.`);
      updateChapterInStore(TARGET_PROJECT_ID, chNum, { status: 'failed' });
      process.exit(1);
    }

    const sizeStr = getFileSizeMB(chapterOutputMp4);
    console.log(`\n  ✅ Chapter ${chNum} COMPLETE in ${formatDuration(result.durationSec)} (${sizeStr})`);

    // Update database store
    updateChapterInStore(TARGET_PROJECT_ID, chNum, {
      status: 'completed',
      videoPath: chapterOutputMp4,
    });

    renderedVideoPaths.push(chapterOutputMp4);
    renderStats.push({
      chapterIndex: chNum,
      title: chapter.title,
      durationSec: result.durationSec,
      fileSize: sizeStr,
      skipped: false,
    });
  }

  // -------------------------------------------------------------------------
  // STAGE 2: MASTER CONCATENATION VIA FFMPEG
  // -------------------------------------------------------------------------
  console.log(`\n========================================================================`);
  console.log(`🔗 ALL 11 CHAPTERS RENDERED! STITCHING MASTER PROJECT VIDEO...`);
  console.log(`========================================================================`);

  const concatListPath = path.join(MASTER_OUTPUT_DIR, 'concat_list.txt');
  const concatContent = renderedVideoPaths
    .map(p => `file '${p.replace(/\\/g, '/')}'`)
    .join('\n');

  fs.writeFileSync(concatListPath, concatContent, 'utf-8');
  console.log(`📝 Generated FFmpeg Concat List: ${concatListPath}`);
  console.log(concatContent);

  const concatStart = Date.now();
  let concatSuccess = false;

  // Attempt 1: Stream copy (Instant zero-loss stitch)
  try {
    console.log(`\n⚡ Running FFmpeg stream copy concat (-c copy)...`);
    const ffmpegCopyCmd = `ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${MASTER_VIDEO_PATH}"`;
    execSync(ffmpegCopyCmd, { stdio: 'inherit' });
    if (fs.existsSync(MASTER_VIDEO_PATH) && fs.statSync(MASTER_VIDEO_PATH).size > 10 * 1024 * 1024) {
      concatSuccess = true;
      console.log(`✅ Stream copy concat succeeded!`);
    }
  } catch (err) {
    console.warn(`⚠️ Stream copy concat encountered an issue, falling back to seamless re-encode concat...`, err);
  }

  // Attempt 2: Re-encode fallback if stream copy failed
  if (!concatSuccess) {
    console.log(`\n🔄 Running FFmpeg full re-encode stitch (-c:v libx264 -crf 18)...`);
    const ffmpegReencodeCmd = `ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k "${MASTER_VIDEO_PATH}"`;
    execSync(ffmpegReencodeCmd, { stdio: 'inherit' });
    if (fs.existsSync(MASTER_VIDEO_PATH) && fs.statSync(MASTER_VIDEO_PATH).size > 10 * 1024 * 1024) {
      concatSuccess = true;
    }
  }

  if (!concatSuccess) {
    console.error(`❌ Failed to produce master video at: ${MASTER_VIDEO_PATH}`);
    process.exit(1);
  }

  const concatTime = (Date.now() - concatStart) / 1000;
  const masterSize = getFileSizeMB(MASTER_VIDEO_PATH);

  // Update project in store
  updateProjectInStore(TARGET_PROJECT_ID, {
    status: 'completed',
    masterVideoPath: MASTER_VIDEO_PATH,
  });

  const totalRuntimeSec = (Date.now() - overallStartTime) / 1000;

  // -------------------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------------------
  console.log(`\n========================================================================`);
  console.log(`🎉 FULL PIPELINE COMPLETED SUCCESSFULLY!`);
  console.log(`========================================================================`);
  console.log(`Total Wall Clock Time: ${formatDuration(totalRuntimeSec)}`);
  console.log(`Master Video File:     ${MASTER_VIDEO_PATH}`);
  console.log(`Master Video Size:     ${masterSize}`);
  console.log(`Stitch Time:           ${formatDuration(concatTime)}`);
  console.log(`------------------------------------------------------------------------`);
  console.log(`CHAPTER BREAKDOWN:`);
  renderStats.forEach((st) => {
    const statusLabel = st.skipped ? 'Skipped (Pre-rendered)' : `Rendered in ${formatDuration(st.durationSec)}`;
    console.log(`  Ch ${st.chapterIndex.toString().padStart(2, '0')}: ${st.title.padEnd(45, ' ')} | ${statusLabel.padEnd(25, ' ')} | Size: ${st.fileSize}`);
  });
  console.log(`========================================================================\n`);
}

runMasterPipeline().catch((err) => {
  console.error('\n❌ Unhandled error in pipeline runner:', err);
  process.exit(1);
});
