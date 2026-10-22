import os
import sys
import glob
import subprocess
from concurrent.futures import ThreadPoolExecutor

STOCK_DIR = os.path.abspath("uploads/raw/proj_steeldoor/stock")
OUT_DIR = os.path.abspath("uploads/raw/proj_steeldoor/pool_cfr30")
os.makedirs(OUT_DIR, exist_ok=True)

stock_files = sorted(glob.glob(os.path.join(STOCK_DIR, "*.mp4")))
print(f"=== STANDARDIZING {len(stock_files)} STOCK CLIPS TO CFR 30.00 FPS / 1s GOP ===")

def process_one(src_path):
    filename = os.path.basename(src_path)
    out_path = os.path.join(OUT_DIR, filename)
    
    if os.path.exists(out_path) and os.path.getsize(out_path) > 50000:
        return filename, "skipped"
        
    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-i", src_path,
        "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-r", "30",
        "-fps_mode", "cfr",
        "-g", "30",
        "-keyint_min", "30",
        "-an",
        out_path
    ]
    try:
        proc = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=60)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 50000:
            return filename, "success"
        else:
            return filename, "failed"
    except Exception as e:
        return filename, f"error: {e}"

with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(process_one, stock_files))

success_count = sum(1 for _, s in results if s in ["success", "skipped"])
print(f"\nStandardized {success_count}/{len(stock_files)} stock clips into {OUT_DIR}")
