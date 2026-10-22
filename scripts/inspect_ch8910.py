import json

for ch in [8, 9, 10]:
    path = f"uploads/transcripts/fishingtent/chapter_{ch:02d}.json"
    with open(path, "r", encoding="utf-8") as f:
        d = json.load(f)
    print(f"\n================ CHAPTER {ch:02d} ================")
    print(f"Duration: {d.get('duration')}s, Audio: {d.get('audio_file')}")
    print(f"Total segments: {len(d.get('segments', []))}")
    for idx, s in enumerate(d.get("segments", [])):
        print(f"[{idx:02d}] {s['start']:6.2f} - {s['end']:6.2f} ({s['end']-s['start']:4.2f}s): {s['text']}")
