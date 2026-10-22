import os
import sys
import subprocess
import glob

DST_DIR = os.path.abspath("uploads/raw/proj_fishingtent/stock_cfr30")
os.makedirs(DST_DIR, exist_ok=True)

stock_dirs = [
    os.path.abspath("uploads/raw/proj_fishingtent/stock"),
    os.path.abspath("uploads/raw/proj_fishingtent/stock_expanded")
]

all_stock = []
for d in stock_dirs:
    if os.path.exists(d):
        all_stock.extend(glob.glob(f"{d}/*.mp4"))

print(f"Standardizing {len(all_stock)} stock files to CFR 30fps...")

for f in all_stock:
    base = os.path.basename(f)
    dst = os.path.join(DST_DIR, base)
    if os.path.exists(dst) and os.path.getsize(dst) > 100000:
        continue

    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-i", f,
        "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080",
        "-r", "30",
        "-fps_mode", "cfr",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-g", "30",
        "-keyint_min", "30",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-an",
        dst
    ]
    try:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        print(f"[CFR30 OK] {base}")
    except Exception as e:
        print(f"[FAIL] {base}: {e}")

print("All stock standardized.")
