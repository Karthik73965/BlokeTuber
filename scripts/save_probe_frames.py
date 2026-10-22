import os
import subprocess

# Let's save frames from each detected point so we can inspect or see
probes = [
    ("govdeals_ambulance", 7.5, "govdeals_7_5s.jpg"),
    ("cheaprv_ambulance", 23.0, "cheaprv_23s.jpg"),
    ("cheaprv_ambulance", 217.0, "cheaprv_217s.jpg"),
    ("cheaprv_ambulance", 183.0, "cheaprv_183s.jpg"),
    ("ben_emily_tour", 272.0, "benemily_272s.jpg"),
    ("ben_emily_tour", 874.0, "benemily_874s.jpg"),
    ("ben_emily_tour", 55.0, "benemily_55s.jpg"),
    ("ben_emily_tour", 353.0, "benemily_353s.jpg"),
]

for src, t, out_name in probes:
    out = f"uploads/raw/proj_ambulance/scans/{out_name}"
    cmd = ["ffmpeg", "-y", "-ss", str(t), "-i", f"uploads/raw/proj_ambulance/{src}.mp4", "-vframes", "1", "-q:v", "2", out]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("Saved probes.")
