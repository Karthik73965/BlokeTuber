import os
import subprocess
import json

sources = {
    "cheaprv": "uploads/raw/proj_ambulance/cheaprv_ambulance.mp4",
    "govdeals": "uploads/raw/proj_ambulance/govdeals_ambulance.mp4",
    "ben_emily": "uploads/raw/proj_ambulance/ben_emily_tour.mp4",
}

for name, path in sources.items():
    if os.path.exists(path):
        cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", path]
        res = subprocess.run(cmd, capture_output=True, text=True)
        dur = res.stdout.strip()
        size_mb = os.path.getsize(path) / (1024*1024)
        print(f"{name}: {path} exists ({size_mb:.2f} MB), duration: {dur}s")
    else:
        print(f"{name}: {path} NOT FOUND")
