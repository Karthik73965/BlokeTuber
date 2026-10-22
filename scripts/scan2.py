import subprocess
import os

video = 'uploads/raw/proj_camperbike/beneath_bridges_7campers.mp4'
os.makedirs('uploads/beat_snapshots/designs_scan2', exist_ok=True)

for t in range(450, 950, 30):
    out = f'uploads/beat_snapshots/designs_scan2/t_{t:03d}.jpg'
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', video,
                    '-vf', 'crop=in_w:in_h*0.88:0:0,scale=1920:1080',
                    '-vframes', '1', '-q:v', '2', out],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("Extracted scan2.")
