import json

with open("uploads/transcripts/fishingtent/chapter_04.json", "r", encoding="utf-8") as f:
    t4 = json.load(f)

print(f"Total duration: {t4['duration']}")
segs = t4['segments']
# Let's inspect segments and design ~30-32 beats of ~5-7 seconds each
for i, s in enumerate(segs):
    print(f"[{i:02d}] {s['start']:6.2f} - {s['end']:6.2f} ({s['end']-s['start']:4.1f}s): {s['text']}")
