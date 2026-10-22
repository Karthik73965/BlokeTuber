import os
import subprocess

TEMP_DIR = "temp_scene_catalog/ben_emily_scan"
os.makedirs(TEMP_DIR, exist_ok=True)
src_file = "uploads/raw/proj_ambulance/ben_emily_tour.mp4"

# Sample every 30s across the 1500s video
for ts in range(10, 1500, 30):
    out_jpg = os.path.join(TEMP_DIR, f"be_{ts}s.jpg")
    if not os.path.exists(out_jpg):
        subprocess.run([
            "ffmpeg", "-nostdin", "-y", "-ss", str(ts), "-i", src_file,
            "-vframes", "1", "-q:v", "3", out_jpg
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("Finished scanning ben_emily")
