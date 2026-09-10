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
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const AUD_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Tract\\AUD';
const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Tract\\Raw';
const PROJECT_NAME = 'Tract';
const PROJECT_DESC = 'Community Supported Shelters & Conestoga Huts • Eugene, Oregon Micro-Housing by Tracy';

const UPLOADS_AUDIO_DIR = path.resolve(process.cwd(), 'uploads', 'audio');
const TRANSCRIPTS_DIR = path.resolve(process.cwd(), 'uploads', 'transcripts', 'tract');
fs.mkdirSync(UPLOADS_AUDIO_DIR, { recursive: true });
fs.mkdirSync(TRANSCRIPTS_DIR, { recursive: true });

function cleanChapterTitle(rawName: string): string {
  let cleaned = rawName
    .replace(/\.mp3$/i, '')
    .replace(/^[\d.]+\s*[-—–]+\s*/, '')
    .trim();

  // Fix known typos in audio filenames
  if (cleaned.toUpperCase() === 'HE ARGUMENT') {
    cleaned = 'The Argument';
  } else if (cleaned.toUpperCase() === 'A BUILD DA') {
    cleaned = 'A Build Day';
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
  console.log('🎬 [LOCAL WHISPER] TRANSCRIBING AUDIO & INITIALIZING TRACT PROJECT');
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
    const txtPath = path.join(TRANSCRIPTS_DIR, `${spec.numStr}_${safeStem}.txt`);
    const jsonPath = path.join(TRANSCRIPTS_DIR, `${spec.numStr}_${safeStem}.json`);

    // Copy to uploads/audio for web dashboard playback
    const copyDest = path.join(UPLOADS_AUDIO_DIR, spec.filename);
    if (!fs.existsSync(copyDest)) {
      fs.copyFileSync(sourceAudioPath, copyDest);
    }

    let text = '';
    let segments: any[] = [];

    if (fs.existsSync(txtPath) && fs.existsSync(jsonPath)) {
      console.log(`⚡ [${spec.numStr}/${chapterSpecs.length}] Loading cached transcript for "${spec.filename}"...`);
      text = fs.readFileSync(txtPath, 'utf-8').trim();
      try {
        const parsed = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        segments = parsed.segments || [];
      } catch {}
    } else {
      console.log(`🎙️ [${spec.numStr}/${chapterSpecs.length}] Transcribing "${spec.filename}" locally...`);
      const startTime = Date.now();
      segments = await alignWithLocalWhisper(sourceAudioPath);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      text = segments.map((s) => s.text).join(' ').trim();
      fs.writeFileSync(txtPath, text, 'utf-8');
      fs.writeFileSync(
        jsonPath,
        JSON.stringify({ filename: spec.filename, text, segments }, null, 2),
        'utf-8'
      );
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
        description: `Eugene, OR Community Supported Shelters • Built by Tracy. Pacing: Medium.`,
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
  const masterTxtPath = path.join(TRANSCRIPTS_DIR, '00_FULL_MASTER_SCRIPT.txt');
  fs.writeFileSync(masterTxtPath, masterScript, 'utf-8');
  projectsStore.update(project.id, { scriptText: masterScript });

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('🎉 [PROJECT SETUP COMPLETE]');
  console.log(`- Project "${project.name}" (ID: ${project.id}) initialized with ${allTranscripts.length} chapters.`);
  console.log(`- Transcripts saved to: ${TRANSCRIPTS_DIR}`);
  console.log(`- Project Master Script saved to: ${masterTxtPath}`);
  console.log(`- Dashboard URL: http://localhost:3000/project/${project.id}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

run().catch((err) => {
  console.error('❌ Script Error:', err);
  process.exit(1);
});
