import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { projectsStore, chaptersStore } from '../src/db/localStore';
import { alignWithLocalWhisper } from '../src/services/whisperAlignment';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) dotenv.config({ path: envPath });
}

const AUD_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Dome\\AUD';
const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Dome\\RAW';
const PROJECT_ID = 'proj_dome_villages';
const PROJECT_NAME = 'Dome Villages: The Cheapest Roof in America';
const PROJECT_DESC =
  'The 30-year history of geodesic and fiberglass dome shelters as an immediate, dignified, and controversial response to America\'s homelessness crisis.';

const UPLOAD_AUDIO_DIRS = Array.from(
  new Set([
    path.resolve(process.cwd(), 'uploads', 'audio'),
    path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'audio'),
    path.resolve(__dirname, '..', 'uploads', 'audio'),
  ])
);

const TRANSCRIPT_DIRS = Array.from(
  new Set([
    path.resolve(process.cwd(), 'uploads', 'transcripts', 'dome'),
    path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'transcripts', 'dome'),
    path.resolve(__dirname, '..', 'uploads', 'transcripts', 'dome'),
  ])
);

for (const dir of [...UPLOAD_AUDIO_DIRS, ...TRANSCRIPT_DIRS]) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanChapterTitle(filename: string): string {
  return filename
    .replace(/\.mp3$/i, '')
    .replace(/^\d+\s*-\s*/, '')
    .trim();
}

function getAudioChapterSpecs(audDir: string) {
  if (!fs.existsSync(audDir)) {
    throw new Error(`Audio directory not found: ${audDir}`);
  }

  const files = fs.readdirSync(audDir).filter((file) => file.toLowerCase().endsWith('.mp3'));
  const sorted = files.sort((a, b) => {
    const numA = parseInt(a.match(/^(\d+)/)?.[1] || '0', 10);
    const numB = parseInt(b.match(/^(\d+)/)?.[1] || '0', 10);
    return numA - numB;
  });

  return sorted.map((filename, idx) => {
    const index = parseInt(filename.match(/^(\d+)/)?.[1] || String(idx + 1), 10);
    const numStr = String(index).padStart(2, '0');
    const title = `Chapter ${numStr}: ${cleanChapterTitle(filename)}`;
    return { index, filename, numStr, title };
  });
}

async function run() {
  console.log('[Dome Villages] Setting up project from audio files...');
  console.log(`Audio source: ${AUD_DIR}`);

  const chapterSpecs = getAudioChapterSpecs(AUD_DIR);
  console.log(`Discovered ${chapterSpecs.length} chapter audio files.`);

  if (!fs.existsSync(RAW_DIR)) {
    fs.mkdirSync(RAW_DIR, { recursive: true });
    console.log(`Created raw footage directory: ${RAW_DIR}`);
  }

  let project = projectsStore.all().find(
    (p) => p.id === PROJECT_ID || p.name.toLowerCase() === PROJECT_NAME.toLowerCase()
  );

  if (!project) {
    project = projectsStore.create({
      id: PROJECT_ID,
      name: PROJECT_NAME,
      description: PROJECT_DESC,
      scriptText: '',
      status: 'draft',
    });
    console.log(`Created project "${PROJECT_NAME}" (${project.id})`);
  } else {
    projectsStore.update(project.id, { description: PROJECT_DESC, name: PROJECT_NAME });
    console.log(`Found existing project "${PROJECT_NAME}" (${project.id})`);
  }

  const allTranscripts: Array<{ chapter: string; text: string }> = [];

  for (const spec of chapterSpecs) {
    const sourceAudioPath = path.join(AUD_DIR, spec.filename);
    const safeStem = path.parse(spec.filename).name.replace(/[^\w\s-]/g, '').trim();

    for (const audioDir of UPLOAD_AUDIO_DIRS) {
      const copyDest = path.join(audioDir, spec.filename);
      if (!fs.existsSync(copyDest)) fs.copyFileSync(sourceAudioPath, copyDest);
    }

    const primaryTranscriptDir = TRANSCRIPT_DIRS[0]!;
    const primaryTxtPath = path.join(primaryTranscriptDir, `${spec.numStr}_${safeStem}.txt`);
    const primaryJsonPath = path.join(primaryTranscriptDir, `${spec.numStr}_${safeStem}.json`);

    let text = '';
    let segments: any[] = [];

    if (fs.existsSync(primaryTxtPath) && fs.existsSync(primaryJsonPath)) {
      console.log(`[${spec.numStr}/${chapterSpecs.length}] Loading cached transcript: ${spec.filename}`);
      text = fs.readFileSync(primaryTxtPath, 'utf-8').trim();
      try {
        const parsed = JSON.parse(fs.readFileSync(primaryJsonPath, 'utf-8'));
        segments = parsed.segments || [];
      } catch {
        segments = [];
      }
    } else {
      console.log(`[${spec.numStr}/${chapterSpecs.length}] Transcribing locally with Whisper: ${spec.filename}`);
      segments = await alignWithLocalWhisper(sourceAudioPath);
      text = segments.map((segment) => segment.text).join(' ').trim();

      for (const transcriptDir of TRANSCRIPT_DIRS) {
        fs.writeFileSync(path.join(transcriptDir, `${spec.numStr}_${safeStem}.txt`), text, 'utf-8');
        fs.writeFileSync(
          path.join(transcriptDir, `${spec.numStr}_${safeStem}.json`),
          JSON.stringify({ filename: spec.filename, text, segments }, null, 2),
          'utf-8'
        );
      }
    }

    allTranscripts.push({ chapter: spec.title, text });

    const existingChapters = chaptersStore.forProject(project.id);
    const existing = existingChapters.find((chapter) => chapter.chapterIndex === spec.index);
    const chapterPatch = {
      title: spec.title,
      description:
        'Dome Villages documentary chapter. Use beat-specific fiberglass domes, Ted Hayes archival, Skid Row, assembly, community living, and homelessness reality visuals.',
      scriptText: text,
      voiceoverFileName: spec.filename,
      clipLibraryRoot: RAW_DIR,
      pacing: 'medium' as const,
      status: 'draft' as const,
    };

    if (existing) {
      chaptersStore.update(project.id, existing.id, chapterPatch);
      console.log(`Updated chapter ${spec.numStr}: ${spec.title}`);
    } else {
      chaptersStore.create(project.id, {
        chapterIndex: spec.index,
        ...chapterPatch,
      });
      console.log(`Created chapter ${spec.numStr}: ${spec.title}`);
    }
  }

  const masterScript = allTranscripts.map((item) => `### ${item.chapter}\n\n${item.text}`).join('\n\n---\n\n');
  for (const transcriptDir of TRANSCRIPT_DIRS) {
    fs.writeFileSync(path.join(transcriptDir, '00_FULL_MASTER_SCRIPT.txt'), masterScript, 'utf-8');
  }
  projectsStore.update(project.id, { scriptText: masterScript });

  console.log('\n[Dome Villages] Setup & Whisper Alignment Complete!');
  console.log(`Project ID: ${project.id}`);
  console.log(`Dashboard: http://localhost:3000/project/${project.id}`);
  console.log(`Transcripts: ${TRANSCRIPT_DIRS[0]}`);
}

run().catch((error) => {
  console.error('[Dome Villages] Setup failed:', error);
  process.exit(1);
});
