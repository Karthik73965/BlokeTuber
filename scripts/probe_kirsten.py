import os
import subprocess

out_dir = "uploads/beat_snapshots/probe_kirsten"
os.makedirs(out_dir, exist_ok=True)

# probe kirsten at 10s, 30s, 60s, 90s, 120s, 150s, 180s, 240s, 300s, 360s
timestamps = [10, 30, 60, 90, 120, 150, 180, 240, 300, 360, 420, 480]

for ts in timestamps:
    out_snap = os.path.join(out_dir, f"kirsten_{ts:03d}s.jpg")
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(ts),
        "-i", "uploads/raw/proj_camperbike/kirsten_elkins_150.mp4",
        "-vf", "crop=in_w:in_h*0.88:0:0,scale=1920:1080",
        "-vframes", "1",
        "-q:v", "2",
        out_snap
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Extracted {out_snap}")
