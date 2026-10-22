import subprocess
import os

video = 'uploads/raw/proj_camperbike/beneath_bridges_7campers.mp4'
out_dir = 'uploads/beat_snapshots/designs7_all'
os.makedirs(out_dir, exist_ok=True)

times = range(10, 1195, 20)
for t in times:
    out = os.path.join(out_dir, f'f_{t:04d}.jpg')
    # Let's crop bottom 14% to remove subtitles:
    # crop=in_w:in_h*0.86:0:0
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', video,
                    '-vf', 'crop=in_w:in_h*0.86:0:0,scale=1920:1080',
                    '-vframes', '1', '-q:v', '2', out],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print(f"Sampled {len(times)} frames from designs7.")
