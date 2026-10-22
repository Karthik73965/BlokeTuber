import subprocess

for t in range(0, 60):
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', 'uploads/raw/proj_fishingtent/sources/clam_thermal_features.mp4', '-vframes', '1', '-vf', 'scale=480:270', '-q:v', '5', f'uploads/beat_snapshots/source_checks/clam_sec_{t:02d}.jpg'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("Probed all 60 seconds of clam_thermal_features")
