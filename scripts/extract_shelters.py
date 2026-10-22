import subprocess
import os

video = 'uploads/raw/proj_camperbike/beneath_bridges_7campers.mp4'
os.makedirs('uploads/beat_snapshots/designs_shelters', exist_ok=True)

# Scan around 190 to 300 (Emergency Shelter)
# Scan around 300 to 500 (Pushcart and Vending)
for t in range(180, 480, 15):
    out = f'uploads/beat_snapshots/designs_shelters/t_{t:03d}.jpg'
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', video,
                    '-vf', 'crop=in_w:in_h*0.88:0:0,scale=1920:1080',
                    '-vframes', '1', '-q:v', '2', out],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("Extracted cropped shelter frames.")
