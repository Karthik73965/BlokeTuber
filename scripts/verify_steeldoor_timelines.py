import glob
import json
import os

timeline_files = sorted(glob.glob("uploads/timelines/steeldoor/chapter_*_final.json"))
print(f"Found {len(timeline_files)} timeline files.")

all_clips = set()
total_clips = 0
total_callouts = 0

for tf in timeline_files:
    ch_name = os.path.basename(tf).replace("_final.json", "")
    with open(tf, encoding="utf-8") as f:
        data = json.load(f)
    clips = data.get("clips", [])
    total_clips += len(clips)
    ch_callouts = sum(1 for c in clips if "callout" in c)
    total_callouts += ch_callouts
    for c in clips:
        all_clips.add(c["clipPath"])
    print(f"  {ch_name}: {len(clips)} beats | {ch_callouts} callouts | dur: {data['totalDuration']}s")

print("-" * 50)
print(f"Total Beats across 11 Chapters: {total_clips}")
print(f"Unique Clips used: {len(all_clips)}")
print(f"Repeated Clips: {total_clips - len(all_clips)}")
print(f"Total Editorial Callouts: {total_callouts}")
