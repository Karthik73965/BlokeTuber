import os
import subprocess

out_dir = "uploads/raw/proj_ambulance/source_probes"
os.makedirs(out_dir, exist_ok=True)

# probe govdeals (0 to 55s)
for t in [2, 8, 14, 20, 26, 32, 38, 44, 50]:
    out = f"{out_dir}/govdeals_{t}s.jpg"
    if not os.path.exists(out):
        cmd = ["ffmpeg", "-y", "-ss", str(t), "-i", "uploads/raw/proj_ambulance/govdeals_ambulance.mp4", "-vframes", "1", "-q:v", "2", out]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# probe cheaprv
for t in [5, 15, 25, 45, 75, 105, 135, 175, 225, 275, 325, 375, 425, 485, 545, 615, 685]:
    out = f"{out_dir}/cheaprv_{t}s.jpg"
    if not os.path.exists(out):
        cmd = ["ffmpeg", "-y", "-ss", str(t), "-i", "uploads/raw/proj_ambulance/cheaprv_ambulance.mp4", "-vframes", "1", "-q:v", "2", out]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# probe ben_emily (especially later half 900-1450s and some earlier)
for t in [30, 90, 180, 270, 360, 450, 540, 630, 720, 810, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380, 1440]:
    out = f"{out_dir}/ben_emily_{t}s.jpg"
    if not os.path.exists(out):
        cmd = ["ffmpeg", "-y", "-ss", str(t), "-i", "uploads/raw/proj_ambulance/ben_emily_tour.mp4", "-vframes", "1", "-q:v", "2", out]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("Probing completed.")
