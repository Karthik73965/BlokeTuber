import subprocess

for t in range(0, 430, 10):
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', 'uploads/raw/proj_fishingtent/sources/mr_heater_co_test.mp4', '-vframes', '1', '-vf', 'scale=320:180', '-q:v', '5', f'uploads/beat_snapshots/source_checks/ht_{t:03d}s.jpg'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("Scanned all 430s of mr_heater_co_test")
