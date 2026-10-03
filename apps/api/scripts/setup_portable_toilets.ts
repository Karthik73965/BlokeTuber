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

const AUD_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\portable toilets\\AUD';
const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\portable toilets\\RAW';
const PROJECT_NAME = 'Portable Toilets';
const PROJECT_DESC =
  'Portable toilets, public sanitation, homelessness, and the street-level systems around survival and removal.';

const UPLOAD_AUDIO_DIRS = Array.from(
  new Set([
    path.resolve(process.cwd(), 'uploads', 'audio'),
    path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'audio'),
    path.resolve(__dirname, '..', 'uploads', 'audio'),
  ])
);

const TRANSCRIPT_DIRS = Array.from(
  new Set([
    path.resolve(process.cwd(), 'uploads', 'transcripts', 'portable-toilets'),
    path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'transcripts', 'portable-toilets'),
    path.resolve(__dirname, '..', 'uploads', 'transcripts', 'portable-toilets'),
  ])
);

for (const dir of [...UPLOAD_AUDIO_DIRS, ...TRANSCRIPT_DIRS]) {
  fs.mkdirSync(dir, { recursive: true });
}

function titleCase(raw: string): string {
  return raw
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function cleanChapterTitle(filename: string): string {
  const cleaned = filename
    .replace(/\.mp3$/i, '')
    .replace(/^\d+\s*-\s*/, '')
    .trim();

  if (cleaned.toUpperCase() === 'COLD') return 'Cold Open';
  if (cleaned.toUpperCase() === 'CLOSING') return 'Closing';
  return titleCase(cleaned);
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
  console.log('[Portable Toilets] Setting up project from audio files');
  console.log(`Audio source: ${AUD_DIR}`);

  const chapterSpecs = getAudioChapterSpecs(AUD_DIR);
  console.log(`Discovered ${chapterSpecs.length} chapter audio files`);

  if (!fs.existsSync(RAW_DIR)) {
    fs.mkdirSync(RAW_DIR, { recursive: true });
    console.log(`Created raw footage directory: ${RAW_DIR}`);
  }

  let project = projectsStore.all().find((p) => p.name.toLowerCase() === PROJECT_NAME.toLowerCase());
  if (!project) {
    project = projectsStore.create({
      id: `proj_${Date.now()}`,
      name: PROJECT_NAME,
      description: PROJECT_DESC,
      scriptText: '',
      status: 'draft',
    });
    console.log(`Created project "${PROJECT_NAME}" (${project.id})`);
  } else {
    projectsStore.update(project.id, { description: PROJECT_DESC });
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
      console.log(`[${spec.numStr}/${chapterSpecs.length}] Transcribing locally: ${spec.filename}`);
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
        'Portable toilets and homelessness documentary chapter. Use beat-specific sanitation, shelter, encampment, public works, street survival, and relevant archival visuals.',
      scriptText: text,
      voiceoverFileName: spec.filename,
      clipLibraryRoot: RAW_DIR,
      pacing: 'medium' as const,
      status: 'draft' as const,
    };

    if (existing) {
      chaptersStore.update(project.id, existing.id, chapterPatch);
      console.log(`Updated ${spec.title}`);
    } else {
      chaptersStore.create(project.id, {
        chapterIndex: spec.index,
        ...chapterPatch,
      });
      console.log(`Created ${spec.title}`);
    }
  }

  const masterScript = allTranscripts.map((item) => `### ${item.chapter}\n\n${item.text}`).join('\n\n---\n\n');
  for (const transcriptDir of TRANSCRIPT_DIRS) {
    fs.writeFileSync(path.join(transcriptDir, '00_FULL_MASTER_SCRIPT.txt'), masterScript, 'utf-8');
  }
  projectsStore.update(project.id, { scriptText: masterScript });

  console.log('[Portable Toilets] Setup complete');
  console.log(`Project ID: ${project.id}`);
  console.log(`Dashboard: http://localhost:3000/project/${project.id}`);
  console.log(`Transcripts: ${TRANSCRIPT_DIRS[0]}`);
}

run().catch((error) => {
  console.error('[Portable Toilets] Setup failed:', error);
  process.exit(1);
});
