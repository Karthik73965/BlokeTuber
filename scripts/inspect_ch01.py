import json

with open('uploads/transcripts/ambulance/ch01_1 -Cold.mp3.json') as f:
    t = json.load(f)
with open('uploads/timelines/ambulance/chapter_01_final.json') as f:
    c = json.load(f)['clips']

print('ch01 transcript len:', len(t), 'clips len:', len(c))
for i, item in enumerate(t):
    print(f"T {i}: [{item['start']} -> {item['end']}] {item['text']}")
for i, clip in enumerate(c):
    print(f"C {i}: [{clip['startTime']} -> {clip['endTime']}] {clip['text']}")
