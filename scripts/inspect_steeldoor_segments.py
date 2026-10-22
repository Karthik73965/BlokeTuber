import os
import json
import glob

TRANSCRIPTS_DIR = os.path.abspath("uploads/transcripts/steeldoor")

files = sorted(glob.glob(os.path.join(TRANSCRIPTS_DIR, "ch*.json")))

print(f"Analyzing {len(files)} transcript files...")

for f in files:
    stem = os.path.basename(f).replace(".json", "")
    with open(f, encoding="utf-8") as fp:
        segs = json.load(fp)
    total_dur = segs[-1]["end"] if segs else 0
    print(f"\n{'='*60}")
    print(f"{stem} | Duration: {total_dur:.1f}s | Segments: {len(segs)}")
    print(f"{'='*60}")
    for idx, s in enumerate(segs[:5]):
        print(f"  [{s['start']:5.1f}s - {s['end']:5.1f}s] ({s['end']-s['start']:4.1f}s): {s['text']}")
    if len(segs) > 5:
        print(f"  ... (+ {len(segs)-5} more segments)")
