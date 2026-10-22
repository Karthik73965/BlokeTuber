import os
import subprocess

# Let's sample specific sections of ben_emily:
# Let's inspect every 10s from 400 to 1400 in ben_emily
os.makedirs("uploads/beat_snapshots/source_samples/ben_emily_details", exist_ok=True)

# Sample 50 frames across ben_emily where they show features
times = [
    50, 100, 150, 200, 250, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800,
    850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450
]
for t in times:
    out = f"uploads/beat_snapshots/source_samples/ben_emily_details/be_{t}s.jpg"
    if not os.path.exists(out):
        subprocess.run(["ffmpeg", "-y", "-ss", str(t), "-i", "uploads/raw/proj_ambulance/ben_emily_tour.mp4", "-vframes", "1", "-q:v", "3", out],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# Also let's sample cheaprv exterior and compartments:
os.makedirs("uploads/beat_snapshots/source_samples/cheaprv_details", exist_ok=True)
crv_times = [10, 25, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345, 375, 405, 435, 465, 495, 525, 555, 585, 615, 645, 675, 705, 735]
for t in crv_times:
    out = f"uploads/beat_snapshots/source_samples/cheaprv_details/crv_{t}s.jpg"
    if not os.path.exists(out):
        subprocess.run(["ffmpeg", "-y", "-ss", str(t), "-i", "uploads/raw/proj_ambulance/cheaprv_ambulance.mp4", "-vframes", "1", "-q:v", "3", out],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("Detail sampling complete!")
