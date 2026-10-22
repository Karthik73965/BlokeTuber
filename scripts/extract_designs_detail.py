import subprocess
import os

# Let's extract 1 frame every 10 seconds between 60s and 400s
video = 'uploads/raw/proj_camperbike/beneath_bridges_7campers.mp4'
os.makedirs('uploads/beat_snapshots/designs_detail', exist_ok=True)

# Let's see what happens at various timestamps:
for t in range(30, 450, 20):
    out = f'uploads/beat_snapshots/designs_detail/t_{t:03d}.jpg'
    # full frame without crop to see what's on screen
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', video,
                    '-vframes', '1', '-q:v', '2', out],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("Extracted detail frames.")
