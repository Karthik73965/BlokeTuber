import json

amb = json.load(open('uploads/timelines/ambulance/chapter_01_final.json', 'r', encoding='utf-8'))
print('Ambulance Ch01 clips count:', len(amb['clips']))
for c in amb['clips']:
    print(f"[{c['beatIndex']:02d}] {c['startTime']:5.2f} - {c['endTime']:5.2f} ({c['duration']:4.2f}s): {c['text'][:60]}")
