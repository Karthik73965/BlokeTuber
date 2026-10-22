import os
import subprocess

out_dir = "uploads/beat_snapshots/probe_kirsten_door"
os.makedirs(out_dir, exist_ok=True)

for ts in range(360, 600, 20):
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
print("Done probing kirsten 360-600s")
