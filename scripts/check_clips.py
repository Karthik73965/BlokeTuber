import json
import os

for ch in range(1, 11):
    path = f'uploads/timelines/fishingtent/chapter_{ch:02d}_final.json'
    with open(path, 'r', encoding='utf-8') as f:
        d = json.load(f)
    print(f"\n=== CHAPTER {ch:02d} ({len(d['clips'])} clips) ===")
    for idx, c in enumerate(d['clips']):
        name = os.path.basename(c['clipPath'])
        print(f"  [{idx:02d}] {name} | {c['text'][:45]}...")
