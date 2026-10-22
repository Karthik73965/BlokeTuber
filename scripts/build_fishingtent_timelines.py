import os
import sys
import json
import subprocess

REPO_ROOT = os.path.abspath(".")
TIMELINES_DIR = os.path.join(REPO_ROOT, "uploads", "timelines", "fishingtent")
os.makedirs(TIMELINES_DIR, exist_ok=True)

# Helper to slice
def get_slice(source_name, start, duration, output_rel, crop_bottom=0.12, crop_top=0.0):
    output_abs = os.path.join(REPO_ROOT, output_rel)
    cmd = [
        sys.executable,
        os.path.join(REPO_ROOT, "scripts", "get_fishing_tent_clip.py"),
        "--source", source_name,
        "--start", str(start),
        "--duration", str(duration),
        "--output", output_abs,
        "--crop-bottom", str(crop_bottom),
        "--crop-top", str(crop_top)
    ]
    subprocess.run(cmd, check=True)
    return output_abs

def stock_path(rel):
    p = os.path.join(REPO_ROOT, rel)
    if not os.path.exists(p):
        raise FileNotFoundError(f"Stock not found: {p}")
    return p

print("Builder initialized successfully.")
