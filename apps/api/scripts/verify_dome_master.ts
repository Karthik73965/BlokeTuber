import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/dome');

export function verifyDomeMaster(): boolean {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🔎 AUDITING ALL 13 DOME VILLAGES TIMELINES (MASTER BROADCAST CHECK)');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  let allOk = true;
  const projectSeenPaths = new Set<string>();

  for (let chNum = 1; chNum <= 13; chNum++) {
    const filename = `chapter_${String(chNum).padStart(2, '0')}_final.json`;
    const tpath = path.join(TIMELINES_DIR, filename);

    console.log(`\n── CHAPTER ${String(chNum).padStart(2, '0')} (${filename}) ─────────────────────────────`);

    if (!fs.existsSync(tpath)) {
      console.error(`❌ CRITICAL: Timeline file not found: ${tpath}`);
      allOk = false;
      continue;
    }

    const data = JSON.parse(fs.readFileSync(tpath, 'utf-8'));
    const masterAudio = data.masterAudioPath;

    if (!fs.existsSync(masterAudio)) {
      console.error(`❌ CRITICAL: Master audio not found: ${masterAudio}`);
      allOk = false;
    }

    const clips = data.clips || [];
    console.log(`Clips count: ${clips.length} | Master duration: ${data.totalDuration?.toFixed(2)}s`);

    let prevEnd = 0.0;
    for (let idx = 0; idx < clips.length; idx++) {
      const c = clips[idx]!;
      const st = c.startTime;
      const et = c.endTime;
      const dur = et - st;
      const cpath = c.clipPath;

      const idxStr = String(idx).padStart(2, '0');

      // 1. Continuity check
      if (Math.abs(st - prevEnd) > 0.005) {
        console.error(`  ❌ [FAIL GAP] Clip ${idxStr}: start ${st.toFixed(3)} != prevEnd ${prevEnd.toFixed(3)}`);
        allOk = false;
      }
      prevEnd = et;

      // 2. Project-wide duplicate check
      if (projectSeenPaths.has(cpath)) {
        console.error(`  ❌ [FAIL DUPLICATE] Clip ${idxStr}: duplicate clip path used elsewhere: ${path.basename(cpath)}`);
        allOk = false;
      }
      projectSeenPaths.add(cpath);

      // 3. Existence check
      if (!fs.existsSync(cpath)) {
        console.error(`  ❌ [FAIL MISSING] Clip ${idxStr}: file does not exist on disk: ${cpath}`);
        allOk = false;
        continue;
      }

      // 4. Beat duration bounds
      if (dur < 2.4) {
        console.warn(`  ⚠️ [SHORT BEAT] Clip ${idxStr}: duration ${dur.toFixed(2)}s is below 2.5s`);
      } else if (dur > 6.5) {
        console.warn(`  ⚠️ [LONG BEAT] Clip ${idxStr}: duration ${dur.toFixed(2)}s exceeds 6.5s`);
      }
    }

    // 5. Total duration check
    if (Math.abs(prevEnd - data.totalDuration) > 0.05) {
      console.error(`  ❌ [FAIL END TIME] final clip end ${prevEnd.toFixed(2)} != totalDuration ${data.totalDuration.toFixed(2)}`);
      allOk = false;
    } else {
      console.log(`  ✅ Chapter ${chNum} passed timeline continuity & end time checks.`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════════');
  if (allOk) {
    console.log(`🏆 ALL 13 CHAPTERS PASSED VERIFICATION! (Total Unique Clips: ${projectSeenPaths.size})`);
  } else {
    console.error(`❌ VERIFICATION FAILED — CHECK LOGS ABOVE`);
  }
  console.log('═══════════════════════════════════════════════════════════════════\n');

  return allOk;
}

if (require.main === module) {
  const ok = verifyDomeMaster();
  process.exit(ok ? 0 : 1);
}
