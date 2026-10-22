import os
import subprocess

# Let's inspect snapshots for Chapter 05, 06, 07
def list_snaps(ch):
    d = f"uploads/beat_snapshots/fishingtent_ch{ch:02d}"
    return [os.path.join(d, f) for f in sorted(os.listdir(d)) if f.endswith('.jpg')]

print("Ch 04:", len(list_snaps(4)))
print("Ch 05:", len(list_snaps(5)))
print("Ch 06:", len(list_snaps(6)))
print("Ch 07:", len(list_snaps(7)))
