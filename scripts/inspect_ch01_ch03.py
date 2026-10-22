import json

for i in [1, 2, 3]:
    path = f'uploads/transcripts/fishingtent/chapter_{i:02d}.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print('='*70)
    print(f"CHAPTER {i:02d} duration={data['duration']}")
    for seg in data['segments']:
        print(f"{seg['id']:02d}: {seg['start']:6.2f} - {seg['end']:6.2f} ({seg['end']-seg['start']:4.2f}s) | {seg['text']}")
