import subprocess
import os

# Let's sample frames every 30s from 0 to 1200 in designs7
os.makedirs('uploads/beat_snapshots/designs7_scan', exist_ok=True)
video = 'uploads/raw/proj_camperbike/beneath_bridges_7campers.mp4'

# Sample key times
times = list(range(10, 1190, 45))
for t in times:
    out = f'uploads/beat_snapshots/designs7_scan/frame_{t:04d}s.jpg'
    # Let's crop out bottom 15% and top 8% to see if subtitles disappear:
    # crop=in_w:in_h*0.75:0:in_h*0.08
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', video,
                    '-vf', 'crop=in_w:in_h*0.75:0:in_h*0.08,scale=1920:1080',
                    '-vframes', '1', '-q:v', '2', out],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print(f"Sampled {len(times)} frames from designs7.")
