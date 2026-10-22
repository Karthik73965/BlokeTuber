import subprocess
import os

video = 'uploads/raw/proj_camperbike/beneath_bridges_homeless.mp4'
out_dir = 'uploads/beat_snapshots/homeless_scan'
os.makedirs(out_dir, exist_ok=True)

times = range(30, 1200, 45)
for t in times:
    out = os.path.join(out_dir, f'h_{t:04d}.jpg')
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', video,
                    '-vf', 'crop=in_w:in_h*0.86:0:0,scale=1920:1080',
                    '-vframes', '1', '-q:v', '2', out],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print(f"Sampled {len(times)} frames from beneath_bridges_homeless.")
