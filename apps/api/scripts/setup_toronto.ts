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

const AUD_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Toronto\\Aud';
const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Toronto\\RAW';
const PROJECT_NAME = 'Toronto Tiny Shelters: The House The Size Of A Closet';
const PROJECT_DESC =
  'Toronto tiny mobile shelters, Ryan Donais, Terra Sawler, winter street survival, city injunctions, and alternative housing.';

const UPLOAD_AUDIO_DIRS = Array.from(
  new Set([
    path.resolve(process.cwd(), 'uploads', 'audio'),
    path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'audio'),
    path.resolve(__dirname, '..', 'uploads', 'audio'),
  ])
);

const TRANSCRIPT_DIRS = Array.from(
  new Set([
    path.resolve(process.cwd(), 'uploads', 'transcripts', 'toronto'),
    path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'transcripts', 'toronto'),
    path.resolve(__dirname, '..', 'uploads', 'transcripts', 'toronto'),
  ])
);

for (const dir of [...UPLOAD_AUDIO_DIRS, ...TRANSCRIPT_DIRS]) {
  fs.mkdirSync(dir, { recursive: true });
}

// 8 Audio chapters specification (Skipping Chapter 5 as instructed)
const CHAPTER_SPECS = [
  { index: 1, filename: '1 - Close.mp3', numStr: '01', title: 'Chapter 01: Cold Open' },
  { index: 2, filename: '2 - THREE YEARS OUTSIDE.mp3', numStr: '02', title: 'Chapter 02: Three Years Outside' },
  { index: 3, filename: '3 - THE MAN WITH THE PROTOTYPE.mp3', numStr: '03', title: 'Chapter 03: The Man With The Prototype' },
  { index: 4, filename: '4 - THE GHOST OF 2020.mp3', numStr: '04', title: 'Chapter 04: The Ghost Of 2020' },
  { index: 5, filename: '6 -  THE LETTER.mp3', numStr: '05', title: 'Chapter 05: The Letter' },
  { index: 6, filename: '7 - WHAT THE NUMBERS SAY.mp3', numStr: '06', title: 'Chapter 06: What The Numbers Say' },
  { index: 7, filename: '8 - FROM ONE BOX TO A VILLAGE.mp3', numStr: '07', title: 'Chapter 07: From One Box To A Village' },
  { index: 8, filename: '9 - CLOSER + TEASER.mp3', numStr: '08', title: 'Chapter 08: Closer + Teaser' },
];

async function run() {
  console.log('[Toronto Setup] Initializing project from audio files...');
  console.log(`Audio source: ${AUD_DIR}`);

  let project = projectsStore.all().find((p) => p.name.toLowerCase().includes('toronto'));
  const projectId = project?.id || `proj_${Date.now()}`;

  if (!project) {
    project = projectsStore.create({
      id: projectId,
      name: PROJECT_NAME,
      description: PROJECT_DESC,
      scriptText: '',
      status: 'draft',
    });
    console.log(`✅ Created project "${PROJECT_NAME}" (${project.id})`);
  } else {
    projectsStore.update(project.id, { description: PROJECT_DESC, name: PROJECT_NAME });
    console.log(`✅ Found existing project "${project.name}" (${project.id})`);
  }

  // Set up project raw directory and copy user provided raw files
  const projectRawDir = path.resolve(process.cwd(), 'uploads', 'raw', project.id);
  fs.mkdirSync(projectRawDir, { recursive: true });
  fs.mkdirSync(path.join(projectRawDir, 'screenshots'), { recursive: true });

  if (fs.existsSync(RAW_DIR)) {
    const rawFiles = fs.readdirSync(RAW_DIR);
    for (const rf of rawFiles) {
      const src = path.join(RAW_DIR, rf);
      const dest = path.join(projectRawDir, rf);
      if (!fs.existsSync(dest) && fs.statSync(src).isFile()) {
        fs.copyFileSync(src, dest);
        console.log(`📁 Copied raw asset: ${rf}`);
      }
    }
  }

  const allTranscripts: Array<{ chapter: string; text: string }> = [];

  for (const spec of CHAPTER_SPECS) {
    const sourceAudioPath = path.join(AUD_DIR, spec.filename);
    if (!fs.existsSync(sourceAudioPath)) {
      console.error(`❌ Audio file not found: ${sourceAudioPath}`);
      continue;
    }

    const safeStem = path.parse(spec.filename).name.replace(/[^\w\s-]/g, '').trim();

    // Copy audio to shared upload directories
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
      console.log(`[${spec.numStr}/${CHAPTER_SPECS.length}] Loading cached transcript: ${spec.filename}`);
      text = fs.readFileSync(primaryTxtPath, 'utf-8').trim();
      try {
        const parsed = JSON.parse(fs.readFileSync(primaryJsonPath, 'utf-8'));
        segments = parsed.segments || [];
      } catch {
        segments = [];
      }
    } else {
      console.log(`[${spec.numStr}/${CHAPTER_SPECS.length}] 🎙️ Transcribing locally with faster-whisper: ${spec.filename}`);
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
        'Toronto tiny shelters documentary chapter. Focus on authentic documentary b-roll, winter street conditions, tiny home construction, and personal stories. NO news reporters or studio news anchors.',
      scriptText: text,
      voiceoverFileName: spec.filename,
      clipLibraryRoot: projectRawDir,
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

  console.log('\n========================================');
  console.log('🎉 [Toronto Setup] Project Setup Complete!');
  console.log(`Project ID: ${project.id}`);
  console.log(`Dashboard: http://localhost:3000/project/${project.id}`);
  console.log(`Raw Folder: ${projectRawDir}`);
  console.log(`Transcripts: ${TRANSCRIPT_DIRS[0]}`);
  console.log('========================================\n');
}

run().catch((error) => {
  console.error('[Toronto Setup] Error:', error);
  process.exit(1);
});
