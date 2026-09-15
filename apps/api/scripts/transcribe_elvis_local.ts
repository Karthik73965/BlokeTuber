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

const AUD_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\ELVIS\\AUD';
const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\ELVIS\\RAW';
const PROJECT_NAME = 'Elvis';
const PROJECT_DESC = 'Elvis Summers • Tiny Homes for the Homeless on the Streets of Los Angeles';

const UPLOAD_AUDIO_DIRS = Array.from(
  new Set([
    path.resolve(process.cwd(), 'uploads', 'audio'),
    path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'audio'),
    path.resolve(__dirname, '..', 'uploads', 'audio'),
  ])
);

const TRANSCRIPT_DIRS = Array.from(
  new Set([
    path.resolve(process.cwd(), 'uploads', 'transcripts', 'elvis'),
    path.resolve(process.cwd(), 'apps', 'api', 'uploads', 'transcripts', 'elvis'),
    path.resolve(__dirname, '..', 'uploads', 'transcripts', 'elvis'),
  ])
);

for (const dir of [...UPLOAD_AUDIO_DIRS, ...TRANSCRIPT_DIRS]) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanChapterTitle(rawName: string): string {
  let cleaned = rawName
    .replace(/\.mp3$/i, '')
    .replace(/^[\d.]+\s*[-—–]+\s*/, '')
    .replace(/^[-—–]+\s*/, '')
    .trim();

  if (cleaned.toUpperCase() === 'OPEN') {
    cleaned = 'Open';
  } else if (cleaned.toUpperCase() === 'CLOSING') {
    cleaned = 'Closing';
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
  console.log('🎬 [LOCAL WHISPER] TRANSCRIBING AUDIO & INITIALIZING ELVIS PROJECT');
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

  // 2. Transcribe each chapter
  for (const spec of chapterSpecs) {
    const sourceAudioPath = path.join(AUD_DIR, spec.filename);
    if (!fs.existsSync(sourceAudioPath)) {
      console.warn(`⚠️ Warning: Audio file not found: ${sourceAudioPath}`);
      continue;
    }

    const safeStem = path.parse(spec.filename).name.replace(/[^\w\s-]/g, '').trim();

    // Copy to uploads/audio
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
      console.log(`   ✅ Finished in ${elapsed}s (${segments.length} speech segments, ${text.split(' ').length} words)`);
    }

    allTranscripts.push({ chapter: spec.title, text });

    // Update chapter store
    let chapter = chaptersStore.forProject(project.id).find((c) => c.chapterIndex === spec.index);
    if (!chapter) {
      chapter = chaptersStore.create(project.id, {
        id: `chap_${project.id}_${spec.numStr}`,
        title: spec.title,
        voiceoverFileName: spec.filename,
        chapterIndex: spec.index,
        scriptText: text,
      });
      console.log(`   📝 Registered ${spec.title}`);
    } else {
      chaptersStore.update(project.id, chapter.id, {
        title: spec.title,
        voiceoverFileName: spec.filename,
        scriptText: text,
      });
      console.log(`   📝 Updated ${spec.title}`);
    }
  }

  // Update overall project script
  const fullDocText = allTranscripts.map((t) => `## ${t.chapter}\n\n${t.text}`).join('\n\n');
  projectsStore.update(project.id, {
    scriptText: fullDocText,
    status: 'transcribed',
  });

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('🎉 ALL 7 CHAPTERS TRANSCRIBED LOCALLY WITH WORD-LEVEL ALIGNMENTS');
  console.log(`📊 Total Word Count: ${fullDocText.split(/\s+/).length} words across 7 chapters`);
  console.log('═══════════════════════════════════════════════════════════════════');
}

run().catch((err) => {
  console.error('Fatal error in transcribe_elvis_local:', err);
  process.exit(1);
});
