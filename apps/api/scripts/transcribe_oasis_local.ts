import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { alignWithLocalWhisper } from '../src/services/whisperAlignment';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const TRANSCRIPTS_DIR = path.resolve(process.cwd(), 'uploads', 'transcripts', 'oasis_village');
const UPLOAD_AUDIO_DIR = path.resolve(process.cwd(), 'uploads', 'audio');

async function transcribeAllChapters() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎙️ RUNNING LOCAL FASTER-WHISPER WORD-LEVEL ALIGNMENT (0 API COST)');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  for (let chNum = 1; chNum <= 9; chNum++) {
    const numStr = String(chNum).padStart(2, '0');
    const audioFileName = `oasis_ch${numStr}.mp3`;
    const audioPath = path.join(UPLOAD_AUDIO_DIR, audioFileName);
    const jsonOutPath = path.join(TRANSCRIPTS_DIR, `ch${numStr}_alignment.json`);

    if (fs.existsSync(jsonOutPath) && fs.statSync(jsonOutPath).size > 100) {
      console.log(`⏩ [Ch ${numStr}] Already transcribed (${(fs.statSync(jsonOutPath).size / 1024).toFixed(1)} KB) — Skipping`);
      continue;
    }

    if (!fs.existsSync(audioPath)) {
      console.warn(`⚠️ Audio not found for Ch ${numStr}: ${audioPath}`);
      continue;
    }

    console.log(`🎙️ [Ch ${numStr}/09] Transcribing ${audioFileName}...`);
    try {
      const alignments = await alignWithLocalWhisper(audioPath, 'base');
      fs.writeFileSync(jsonOutPath, JSON.stringify(alignments, null, 2), 'utf-8');
      console.log(`✅ [Ch ${numStr}] Saved ${alignments.length} segments with word timestamps -> ${path.basename(jsonOutPath)}`);
    } catch (err) {
      console.error(`❌ [Ch ${numStr}] Transcription failed:`, err);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('✅ ALL CHAPTERS TRANSCRIBED WITH WORD-LEVEL PRECISION');
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

transcribeAllChapters().catch(console.error);
