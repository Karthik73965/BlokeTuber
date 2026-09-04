import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import dotenv from 'dotenv';
import { projectsStore, chaptersStore } from '../src/db/localStore';

// Load environment variables
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error('❌ Error: OPENROUTER_API_KEY is not set in environment.');
  process.exit(1);
}

const AUD_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Kloehn\\AUD';
const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Kloehn\\RAW';
const PROJECT_NAME = 'Kloehn';
const PROJECT_DESC = 'Gregory Kloehn — Homeless Mobile Tiny Homes from Dumpsters & Recycled Trash (Oakland, CA)';

const UPLOADS_AUDIO_DIR = path.resolve(process.cwd(), 'uploads', 'audio');
const TRANSCRIPTS_DIR = path.resolve(process.cwd(), 'uploads', 'transcripts', 'kloehn');
fs.mkdirSync(UPLOADS_AUDIO_DIR, { recursive: true });
fs.mkdirSync(TRANSCRIPTS_DIR, { recursive: true });

function getAudioChapterSpecs(audDir: string) {
  if (!fs.existsSync(audDir)) {
    throw new Error(`Audio directory not found: ${audDir}`);
  }

  const files = fs.readdirSync(audDir).filter((f) => f.toLowerCase().endsWith('.mp3'));
  const sorted = files.sort((a, b) => {
    const numA = parseFloat(a.match(/^([\d.]+)/)?.[1] || '0');
    const numB = parseFloat(b.match(/^([\d.]+)/)?.[1] || '0');
    return numA - numB;
  });

  function toTitleCase(str: string) {
    return str
      .toLowerCase()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  return sorted.map((filename, idx) => {
    const clean = filename.replace(/\.mp3$/i, '').replace(/^[\d.]+\s*[-—–]+\s*/, '').trim();
    const num = String(idx + 1).padStart(2, '0');
    const title = `Chapter ${num}: ${toTitleCase(clean)}`;
    return {
      index: idx + 1,
      filename,
      title,
      num,
    };
  });
}

async function transcribeFileWithWhisper(audioPath: string): Promise<{ text: string; segments: any[] }> {
  const form = new FormData();
  form.append('file', fs.readFileSync(audioPath), {
    filename: path.basename(audioPath),
    contentType: 'audio/mpeg',
  });
  form.append('model', 'openai/whisper-1');
  form.append('response_format', 'verbose_json');
  form.append('timestamp_granularities[]', 'word');
  form.append('timestamp_granularities[]', 'segment');

  const headers: Record<string, string> = {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    'HTTP-Referer': 'https://bloketuber.app',
    'X-Title': 'BlokeTuber',
    ...form.getHeaders(),
  };

  const response = await fetch('https://openrouter.ai/api/v1/audio/transcriptions', {
    method: 'POST',
    headers,
    body: form.getBuffer() as any,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter Whisper error (${response.status}): ${err}`);
  }

  const data = (await response.json()) as any;
  return {
    text: String(data.text || '').trim(),
    segments: Array.isArray(data.segments) ? data.segments : [],
  };
}

async function runPhase1() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 [PHASE 1] TRANSCRIBING AUDIO & INITIALIZING KLOEHN PROJECT');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`📁 Audio Source: ${AUD_DIR}`);
  console.log(`📁 Local RAW Clips: ${RAW_DIR}`);
  console.log(`⚡ Pacing Directive: FAST & PUNCHY (High Pacing)`);

  const chapterSpecs = getAudioChapterSpecs(AUD_DIR);
  console.log(`📋 Total Chapters Discovered: ${chapterSpecs.length}\n`);

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
  }

  const allTranscripts: Array<{ chapter: string; text: string }> = [];

  // 2. Iterate through each audio file, transcribe, copy, and create/update chapter
  for (const spec of chapterSpecs) {
    const sourceAudioPath = path.join(AUD_DIR, spec.filename);
    if (!fs.existsSync(sourceAudioPath)) {
      console.warn(`⚠️ Warning: Audio file not found: ${sourceAudioPath}`);
      continue;
    }

    const safeStem = path.parse(spec.filename).name.replace(/[^\w\s-]/g, '').trim();
    const txtPath = path.join(TRANSCRIPTS_DIR, `${spec.num}_${safeStem}.txt`);
    const jsonPath = path.join(TRANSCRIPTS_DIR, `${spec.num}_${safeStem}.json`);

    // Copy to uploads/audio for web dashboard playback
    const copyDest = path.join(UPLOADS_AUDIO_DIR, spec.filename);
    if (!fs.existsSync(copyDest)) {
      fs.copyFileSync(sourceAudioPath, copyDest);
    }

    let text = '';
    let segments: any[] = [];

    if (fs.existsSync(txtPath) && fs.existsSync(jsonPath)) {
      console.log(`⚡ [${spec.num}/${chapterSpecs.length}] Loading cached transcript for "${spec.filename}"...`);
      text = fs.readFileSync(txtPath, 'utf-8').trim();
      try {
        const parsed = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        segments = parsed.segments || [];
      } catch {}
    } else {
      console.log(`🎙️ [${spec.num}/${chapterSpecs.length}] Transcribing "${spec.filename}" via Whisper...`);
      const res = await transcribeFileWithWhisper(sourceAudioPath);
      text = res.text;
      segments = res.segments;

      fs.writeFileSync(txtPath, text, 'utf-8');
      fs.writeFileSync(jsonPath, JSON.stringify({ filename: spec.filename, text, segments }, null, 2), 'utf-8');
    }

    console.log(`   ✓ Transcribed (${text.split(/\s+/).length} words): "${text.slice(0, 75)}..."`);
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
        pacing: 'high',
        status: 'draft',
      });
      console.log(`   ✓ Updated Chapter ${spec.index}: "${spec.title}"`);
    } else {
      chapter = chaptersStore.create(project.id, {
        chapterIndex: spec.index,
        title: spec.title,
        description: `Oakland mobile tiny homes story • Gregory Kloehn. Pacing: High.`,
        scriptText: text,
        voiceoverFileName: spec.filename,
        clipLibraryRoot: RAW_DIR,
        pacing: 'high',
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
  console.log('🎉 [PHASE 1 COMPLETE]');
  console.log(`- Project "${PROJECT_NAME}" initialized with ${allTranscripts.length} chapters.`);
  console.log(`- Transcripts saved to: ${TRANSCRIPTS_DIR}`);
  console.log(`- Project Master Script saved to: ${masterTxtPath}`);
  console.log(`- Dashboard URL: http://localhost:3000/project/${project.id}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

runPhase1().catch((err) => {
  console.error('❌ Phase 1 Execution Error:', err);
  process.exit(1);
});
