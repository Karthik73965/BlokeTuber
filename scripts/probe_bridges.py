import os
import subprocess

out_dir = "uploads/beat_snapshots/probe_bridges"
os.makedirs(out_dir, exist_ok=True)

# Probe 7 campers at 20s, 60s, 100s, 150s, 200s, 250s, 300s, 400s
for ts in [20, 60, 100, 150, 200, 250, 300, 400]:
    out_snap = os.path.join(out_dir, f"bridges7_{ts}s.jpg")
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(ts),
        "-i", "uploads/raw/proj_camperbike/beneath_bridges_7campers.mp4",
        "-vf", "crop=in_w:in_h*0.84:0:0,scale=1920:1080",
        "-vframes", "1",
        "-q:v", "2",
        out_snap
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Extracted {out_snap}")
