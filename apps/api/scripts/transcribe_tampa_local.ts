import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { projectsStore, chaptersStore } from '../src/db/localStore';
import { alignWithLocalWhisper } from '../src/services/whisperAlignment';

// Load environment variables
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const AUD_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Tampa\\AUD';
const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Tampa\\RAW';
const PROJECT_NAME = 'Tampa';
const PROJECT_DESC = 'Tampa Hope Cottages • Catholic Charities & City of Tampa Tiny Homes for the Unhoused';

// Ensure directories exist in both root and api packages
const UPLOAD_AUDIO_DIRS = Array.from(
  new Set([
    path.resolve(process.cwd(), 'uploads', 'audio'),
    path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'audio'),
    path.resolve(__dirname, '..', 'uploads', 'audio'),
  ])
);

const TRANSCRIPT_DIRS = Array.from(
  new Set([
    path.resolve(process.cwd(), 'uploads', 'transcripts', 'tampa'),
    path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'transcripts', 'tampa'),
    path.resolve(__dirname, '..', 'uploads', 'transcripts', 'tampa'),
  ])
);

for (const dir of [...UPLOAD_AUDIO_DIRS, ...TRANSCRIPT_DIRS]) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanChapterTitle(rawName: string): string {
  let cleaned = rawName
    .replace(/\.mp3$/i, '')
    .replace(/^[\d.]+\s*[-—–]+\s*/, '')
    .trim();

  if (cleaned.toUpperCase() === 'COLD') {
    cleaned = 'Cold Open';
  } else if (cleaned.toUpperCase() === 'CLOSE') {
    cleaned = 'Close';
  }

  return cleaned
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getAudioChapterSpecs(audDir: string) {
  if (!fs.existsSync(audDir)) {
    throw new Error(`Audio directory not found: ${audDir}`);
  }

  const files = fs.readdirSync(audDir).filter((f) => f.toLowerCase().endsWith('.mp3'));
  const sorted = files.sort((a, b) => {
    const numA = parseInt(a.match(/^(\d+)/)?.[1] || '0', 10);
    const numB = parseInt(b.match(/^(\d+)/)?.[1] || '0', 10);
    return numA - numB;
  });

  return sorted.map((filename, idx) => {
    const num = parseInt(filename.match(/^(\d+)/)?.[1] || String(idx + 1), 10);
    const numStr = String(num).padStart(2, '0');
    const cleanedTitle = cleanChapterTitle(filename);
    const title = `Chapter ${numStr}: ${cleanedTitle}`;
    return {
      index: num,
      filename,
      title,
      numStr,
    };
  });
}

async function run() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 [LOCAL WHISPER] TRANSCRIBING AUDIO & INITIALIZING TAMPA PROJECT');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`📁 Audio Source: ${AUD_DIR}`);
  console.log(`📁 Local RAW Clips: ${RAW_DIR}`);
  console.log(`🎙️ Transcription Engine: 100% Local faster-whisper (0 API Cost)`);

  const chapterSpecs = getAudioChapterSpecs(AUD_DIR);
  console.log(`📋 Total Chapters Discovered: ${chapterSpecs.length}\n`);

  for (const s of chapterSpecs) {
    console.log(`   [${s.numStr}] ${s.filename} -> ${s.title}`);
  }
  console.log('');

  // 1. Create or retrieve Project
  let project = projectsStore.all().find((p) => p.name.toLowerCase() === PROJECT_NAME.toLowerCase());
  if (!project) {
    project = projectsStore.create({
      id: `proj_${Date.now()}`,
      name: PROJECT_NAME,
      description: PROJECT_DESC,
      scriptText: '',
      status: 'draft',
    });
    console.log(`✅ Created Project "${project.name}" (ID: ${project.id})`);
  } else {
    console.log(`ℹ️ Found Existing Project "${project.name}" (ID: ${project.id})`);
    projectsStore.update(project.id, {
      description: PROJECT_DESC,
    });
  }

  const allTranscripts: Array<{ chapter: string; text: string }> = [];

  // 2. Iterate through each audio file, transcribe via local Whisper, copy, and create/update chapter
  for (const spec of chapterSpecs) {
    const sourceAudioPath = path.join(AUD_DIR, spec.filename);
    if (!fs.existsSync(sourceAudioPath)) {
      console.warn(`⚠️ Warning: Audio file not found: ${sourceAudioPath}`);
      continue;
    }

    const safeStem = path.parse(spec.filename).name.replace(/[^\w\s-]/g, '').trim();

    // Copy to all uploads/audio locations for web dashboard playback
    for (const audioDir of UPLOAD_AUDIO_DIRS) {
      const copyDest = path.join(audioDir, spec.filename);
      if (!fs.existsSync(copyDest)) {
        try {
          fs.copyFileSync(sourceAudioPath, copyDest);
        } catch (e) {
          console.warn(`Failed copying to ${copyDest}:`, e);
        }
      }
    }

    let text = '';
    let segments: any[] = [];

    // Check primary transcript dir for cache
    const primaryTranscriptsDir = TRANSCRIPT_DIRS[0]!;
    const primaryTxtPath = path.join(primaryTranscriptsDir, `${spec.numStr}_${safeStem}.txt`);
    const primaryJsonPath = path.join(primaryTranscriptsDir, `${spec.numStr}_${safeStem}.json`);

    if (fs.existsSync(primaryTxtPath) && fs.existsSync(primaryJsonPath)) {
      console.log(`⚡ [${spec.numStr}/${chapterSpecs.length}] Loading cached transcript for "${spec.filename}"...`);
      text = fs.readFileSync(primaryTxtPath, 'utf-8').trim();
      try {
        const parsed = JSON.parse(fs.readFileSync(primaryJsonPath, 'utf-8'));
        segments = parsed.segments || [];
      } catch {}
    } else {
      console.log(`🎙️ [${spec.numStr}/${chapterSpecs.length}] Transcribing "${spec.filename}" locally...`);
      const startTime = Date.now();
      segments = await alignWithLocalWhisper(sourceAudioPath);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      text = segments.map((s) => s.text).join(' ').trim();

      // Write to all transcript directories
      for (const tDir of TRANSCRIPT_DIRS) {
        const txtPath = path.join(tDir, `${spec.numStr}_${safeStem}.txt`);
        const jsonPath = path.join(tDir, `${spec.numStr}_${safeStem}.json`);
        fs.writeFileSync(txtPath, text, 'utf-8');
        fs.writeFileSync(
          jsonPath,
          JSON.stringify({ filename: spec.filename, text, segments }, null, 2),
          'utf-8'
        );
      }
      console.log(`   ✓ Transcribed in ${elapsed}s (${text.split(/\s+/).length} words, ${segments.length} segments)`);
    }

    console.log(`   Preview: "${text.slice(0, 90)}..."\n`);
    allTranscripts.push({ chapter: spec.title, text });

    // Check if chapter already exists in project
    const existingChapters = chaptersStore.forProject(project.id);
    let chapter = existingChapters.find((c) => c.chapterIndex === spec.index);

    if (chapter) {
      chaptersStore.update(project.id, chapter.id, {
        title: spec.title,
        scriptText: text,
        voiceoverFileName: spec.filename,
        clipLibraryRoot: RAW_DIR,
        pacing: 'medium',
        status: 'draft',
      });
      console.log(`   ✓ Updated Chapter ${spec.index}: "${spec.title}"`);
    } else {
      chapter = chaptersStore.create(project.id, {
        chapterIndex: spec.index,
        title: spec.title,
        description: `Tampa Hope Cottages • Catholic Charities & City of Tampa Tiny Homes for the Unhoused. Pacing: Medium.`,
        scriptText: text,
        voiceoverFileName: spec.filename,
        clipLibraryRoot: RAW_DIR,
        pacing: 'medium',
        status: 'draft',
      });
      console.log(`   ✓ Created Chapter ${spec.index}: "${spec.title}"`);
    }
  }

  // Save consolidated project master script
  const masterScript = allTranscripts.map((t) => `### ${t.chapter}\n\n${t.text}`).join('\n\n---\n\n');
  for (const tDir of TRANSCRIPT_DIRS) {
    const masterTxtPath = path.join(tDir, '00_FULL_MASTER_SCRIPT.txt');
    fs.writeFileSync(masterTxtPath, masterScript, 'utf-8');
  }
  projectsStore.update(project.id, { scriptText: masterScript });

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('🎉 [PROJECT SETUP COMPLETE]');
  console.log(`- Project "${project.name}" (ID: ${project.id}) initialized with ${allTranscripts.length} chapters.`);
  console.log(`- Transcripts saved to: ${TRANSCRIPT_DIRS[0]}`);
  console.log(`- Dashboard URL: http://localhost:3000/project/${project.id}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

run().catch((err) => {
  console.error('❌ Script Error:', err);
  process.exit(1);
});
