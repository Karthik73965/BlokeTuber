import json

with open('uploads/transcripts/ambulance/chapter_04.json') as f:
    t = json.load(f)
with open('uploads/timelines/ambulance/chapter_04_final.json') as f:
    tl = json.load(f)

print('ambulance transcript segments:', len(t['segments']))
print('ambulance timeline clips:', len(tl['clips']))

for i in range(min(5, len(tl['clips']))):
    c = tl['clips'][i]
    print(f"Clip {i}: [{c['startTime']} - {c['endTime']}] ({c['duration']}s): {c['text'][:50]}...")

for i in range(min(5, len(t['segments']))):
    s = t['segments'][i]
    print(f"Seg {i}: [{s['start']} - {s['end']}] ({s['end']-s['start']}s): {s['text'][:50]}...")
