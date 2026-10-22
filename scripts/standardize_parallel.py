import os
import sys
import subprocess
import glob
from concurrent.futures import ThreadPoolExecutor, as_completed

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

print(f"Parallel standardizing {len(all_stock)} stock files with 6 workers...")

def process_file(src):
    base = os.path.basename(src)
    dst = os.path.join(DST_DIR, base)
    if os.path.exists(dst) and os.path.getsize(dst) > 100000:
        return base, "EXISTS"

    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-i", src,
        "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080",
        "-r", "30",
        "-fps_mode", "cfr",
        "-c:v", "libx264",
        "-preset", "veryfast",
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
        return base, "OK"
    except Exception as e:
        return base, f"FAIL: {e}"

with ThreadPoolExecutor(max_workers=6) as executor:
    futures = [executor.submit(process_file, f) for f in all_stock]
    done = 0
    for fut in as_completed(futures):
        base, status = fut.result()
        done += 1
        if done % 10 == 0 or done == len(all_stock):
            print(f"Progress: {done}/{len(all_stock)} ({status} - {base})", flush=True)

print(f"All {len(all_stock)} stock files standardized to 30fps CFR.", flush=True)
