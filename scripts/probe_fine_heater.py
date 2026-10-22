import subprocess

for t in range(112, 130):
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', 'uploads/raw/proj_fishingtent/sources/mr_heater_co_test.mp4', '-vframes', '1', '-vf', 'scale=320:180', '-q:v', '5', f'uploads/beat_snapshots/source_checks/ht_fine_{t}s.jpg'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("probed 112-130s")
