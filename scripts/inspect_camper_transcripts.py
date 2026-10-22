import json
import os

for ch in [1, 2, 3, 4]:
    tr_path = f"uploads/transcripts/camperbike/chapter_0{ch}.json"
    with open(tr_path, "r", encoding="utf-8") as f:
        tr = json.load(f)
    print(f"\n================ CHAPTER {ch} ({len(tr['segments'])} segments) ================")
    for i, s in enumerate(tr["segments"]):
        print(f"[{i:02d}] {s['start']:5.2f} - {s['end']:5.2f} ({s['end']-s['start']:4.2f}s): {s['text'].strip()}")
