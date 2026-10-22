import os
import subprocess

out_dir = "uploads/beat_snapshots/probe_drew"
os.makedirs(out_dir, exist_ok=True)

# Probe Drew at 2000s, 2100s, 2200s, 2220s, 2240s
for ts in [2000, 2100, 2150, 2200, 2220, 2240]:
    out_snap = os.path.join(out_dir, f"drew_{ts}s.jpg")
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(ts),
        "-i", "uploads/raw/proj_camperbike/drew_builds_stuff.mp4",
        "-vf", "crop=in_w:in_h*0.90:0:in_h*0.10,scale=1920:1080",
        "-vframes", "1",
        "-q:v", "2",
        out_snap
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Extracted {out_snap}")
