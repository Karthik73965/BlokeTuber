import json
import os

for i in range(1, 11):
    path = f'uploads/transcripts/fishingtent/chapter_{i:02d}.json'
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n{'='*70}")
    print(f"CHAPTER {i:02d}: {data['audio_file']} | Duration: {data['duration']}s")
    print(f"{'='*70}")
    print(data['full_text'])
