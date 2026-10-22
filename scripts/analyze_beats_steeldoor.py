import os
import json
import glob

TRANSCRIPTS_DIR = os.path.abspath("uploads/transcripts/steeldoor")
POOL_DIR = os.path.abspath("uploads/raw/proj_steeldoor/pool_cfr30")

all_pool_clips = sorted(glob.glob(os.path.join(POOL_DIR, "*.mp4")))
print(f"Total available CFR30 clips in pool: {len(all_pool_clips)}")

# Analyze each transcript to compute total beats
ch_files = sorted(glob.glob(os.path.join(TRANSCRIPTS_DIR, "ch*.json")))

total_beats = 0
for ch_file in ch_files:
    with open(ch_file, encoding="utf-8") as fp:
        segs = json.load(fp)
    
    # Simple beat grouping: aim for ~4-6 seconds per beat
    beats = []
    cur_text = []
    cur_start = segs[0]["start"]
    cur_end = segs[0]["end"]
    
    for s in segs:
        cur_text.append(s["text"].strip())
        cur_end = s["end"]
        dur = cur_end - cur_start
        if dur >= 3.8:
            beats.append({
                "start": cur_start,
                "end": cur_end,
                "dur": round(dur, 2),
                "text": " ".join(cur_text)
            })
            cur_text = []
            cur_start = cur_end
            
    if cur_text:
        if beats and (cur_end - cur_start) < 2.5:
            beats[-1]["end"] = cur_end
            beats[-1]["dur"] = round(cur_end - beats[-1]["start"], 2)
            beats[-1]["text"] += " " + " ".join(cur_text)
        else:
            beats.append({
                "start": cur_start,
                "end": cur_end,
                "dur": round(cur_end - cur_start, 2),
                "text": " ".join(cur_text)
            })
            
    stem = os.path.basename(ch_file).replace(".json", "")
    print(f"{stem}: {len(beats)} beats (audio dur: {segs[-1]['end']:.1f}s)")
    total_beats += len(beats)

print(f"\n=== TOTAL PLANNED BEATS: {total_beats} across all 11 chapters ===")
print(f"Pool size: {len(all_pool_clips)} clips")
