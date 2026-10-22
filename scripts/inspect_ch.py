import json

for ch in [4, 5, 6, 7]:
    fn = f"uploads/transcripts/fishingtent/chapter_{ch:02d}.json"
    with open(fn, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"\n==================== CHAPTER {ch:02d} ({data.get('duration')}s) ====================")
    for i, seg in enumerate(data['segments']):
        print(f"Beat {i:02d} [{seg['start']:6.2f} - {seg['end']:6.2f}] ({seg['end']-seg['start']:4.1f}s): {seg['text']}")
