import subprocess
import os

video = 'uploads/raw/proj_camperbike/beneath_bridges_7campers.mp4'
out_dir = 'uploads/beat_snapshots/designs_find'
os.makedirs(out_dir, exist_ok=True)

times = range(135, 270, 5)
for t in times:
    out = os.path.join(out_dir, f't_{t:03d}.jpg')
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', video,
                    '-vf', 'crop=in_w:in_h*0.88:0:0,scale=1920:1080',
                    '-vframes', '1', '-q:v', '2', out],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("Extracted 135-270 frames.")
