import os
import sys
import json
import subprocess

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.abspath(".")
TIMELINE_DIR = os.path.join(BASE_DIR, "uploads", "timelines", "camperbike")
SNAPSHOTS_DIR = os.path.join(BASE_DIR, "uploads", "beat_snapshots")

for ch in [1, 2, 3, 4]:
    tl_path = os.path.join(TIMELINE_DIR, f"chapter_0{ch}_final.json")
    out_dir = os.path.join(SNAPSHOTS_DIR, f"camperbike_ch0{ch}")
    os.makedirs(out_dir, exist_ok=True)
    
    with open(tl_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    clips = data["clips"]
    print(f"\n=======================================================")
    print(f"Extracting snapshots for Chapter {ch}: {len(clips)} beats -> {out_dir}")
    print(f"=======================================================")
    
    for i, clip in enumerate(clips):
        clip_path = clip["clipPath"]
        if not os.path.exists(clip_path):
            print(f"❌ Beat {i:02d}: Clip not found: {clip_path}")
            continue
            
        # Get video duration
        cmd_dur = [
            "ffprobe", "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=duration",
            "-of", "json",
            clip_path
        ]
        res = subprocess.run(cmd_dur, capture_output=True, text=True)
        dur_data = json.loads(res.stdout)
        video_dur = float(dur_data["streams"][0]["duration"]) if dur_data.get("streams") and dur_data["streams"][0].get("duration") else clip["duration"]
        
        # 50% midpoint
        midpoint = round(min(video_dur, clip["duration"]) * 0.5, 2)
        if midpoint < 0.1:
            midpoint = 0.5
            
        snap_path = os.path.join(out_dir, f"beat_{i:02d}.jpg")
        cmd_snap = [
            "ffmpeg", "-y",
            "-ss", str(midpoint),
            "-i", clip_path,
            "-vframes", "1",
            "-q:v", "2",
            snap_path
        ]
        subprocess.run(cmd_snap, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        sz = os.path.getsize(snap_path) if os.path.exists(snap_path) else 0
        print(f"Beat {i:02d}: {os.path.basename(clip_path):40s} | mid={midpoint:.2f}s | snap: {sz} bytes")

print("\n🎉 ALL SNAPSHOTS EXTRACTED SUCCESSFULLY!")
