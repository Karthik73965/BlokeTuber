import os
import subprocess

# Let's inspect frame by frame around 90-180s and 250-320s
for t in range(90, 180, 5):
    # let's check text at top right vs clean frames
    pass

# Let's list which frames have the heater
# We know 110-120s is clean heater
# What about 100s?
# What about 140-180?
# What about 250-300?
# What about 360-420?
for t in [90, 100, 105, 110, 115, 120, 160, 170, 240, 250, 260, 270, 360, 370, 380, 390, 400, 410, 420]:
    out = f"uploads/beat_snapshots/source_checks/ht_sub_{t}s.jpg"
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-ss', str(t), '-i', 'uploads/raw/proj_fishingtent/sources/mr_heater_co_test.mp4', '-vframes', '1', '-vf', 'scale=640:360', '-q:v', '5', out], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("probed specific times")
