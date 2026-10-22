import os
import sys
import json
import subprocess

REPO_ROOT = os.path.abspath(".")
TIMELINES_DIR = os.path.join(REPO_ROOT, "uploads", "timelines", "fishingtent")
SLICES_DIR = os.path.join(REPO_ROOT, "uploads", "raw", "proj_fishingtent", "slices")
os.makedirs(TIMELINES_DIR, exist_ok=True)
os.makedirs(SLICES_DIR, exist_ok=True)

def get_slice(source_name, start, duration, output_rel, crop_bottom=0.12, crop_top=0.0):
    output_abs = os.path.join(REPO_ROOT, output_rel)
    if os.path.exists(output_abs) and os.path.getsize(output_abs) > 10000:
        return output_abs
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

def stock(rel):
    p = os.path.join(REPO_ROOT, "uploads", "raw", "proj_fishingtent", "stock", rel)
    if not os.path.exists(p):
        raise FileNotFoundError(f"Stock not found: {p}")
    return p

# Clean any existing used_slices.json to start fresh and clean
used_slices_path = os.path.join(REPO_ROOT, "uploads", "raw", "proj_fishingtent", "used_slices.json")
if os.path.exists(used_slices_path):
    os.remove(used_slices_path)

print("Starting generation of all 4 chapters...")
