import os
import subprocess

TEMP_DIR = "temp_scene_catalog/sources"
os.makedirs(TEMP_DIR, exist_ok=True)

sources = {
    "ben_emily": ("uploads/raw/proj_ambulance/ben_emily_tour.mp4", [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 350, 400, 450, 500, 550, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400]),
    "cheaprv": ("uploads/raw/proj_ambulance/cheaprv_ambulance.mp4", [10, 25, 45, 70, 95, 120, 150, 180, 210, 240, 270, 310, 350, 390, 430, 480, 530, 580, 630, 680, 720]),
    "govdeals": ("uploads/raw/proj_ambulance/govdeals_ambulance.mp4", [2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55])
}

for src_name, (src_file, timestamps) in sources.items():
    if not os.path.exists(src_file):
        continue
    for ts in timestamps:
        out_jpg = os.path.join(TEMP_DIR, f"{src_name}_{ts}s.jpg")
        if not os.path.exists(out_jpg):
            subprocess.run([
                "ffmpeg", "-nostdin", "-y", "-ss", str(ts), "-i", src_file,
                "-vframes", "1", "-q:v", "3", out_jpg
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("Extracted preview frames to", TEMP_DIR)
