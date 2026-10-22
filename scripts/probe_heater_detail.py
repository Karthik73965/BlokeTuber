import subprocess

for t in range(110, 160, 5):
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', 'uploads/raw/proj_fishingtent/sources/mr_heater_co_test.mp4', '-vframes', '1', '-vf', 'scale=640:360', '-q:v', '5', f'uploads/beat_snapshots/source_checks/heater_detail_{t}s.jpg'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

for t in range(300, 350, 5):
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', 'uploads/raw/proj_fishingtent/sources/mr_heater_co_test.mp4', '-vframes', '1', '-vf', 'scale=640:360', '-q:v', '5', f'uploads/beat_snapshots/source_checks/heater_detail_{t}s.jpg'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("Heater detail probed")
