import json

with open("uploads/timelines/camperbike/chapter_04_final.json") as f:
    tl = json.load(f)
print(f"camperbike ch04 clips count: {len(tl['clips'])}, totalDuration: {tl['totalDuration']}")
for i, c in enumerate(tl['clips']):
    print(f"Beat {i:02d} [{c['startTime']:6.2f} - {c['endTime']:6.2f}] ({c['duration']:4.2f}s): {c['text'][:60]}")
