import os
import sys
import json
import subprocess

BASE_DIR = r"C:\Users\karth\Documents\BlokeTuber"
os.chdir(BASE_DIR)

SLICES_DIR = os.path.join(BASE_DIR, "uploads", "raw", "proj_fishingtent", "slices")
STOCK_DIR = os.path.join(BASE_DIR, "uploads", "raw", "proj_fishingtent", "stock")
TIMELINES_DIR = os.path.join(BASE_DIR, "uploads", "timelines", "fishingtent")
os.makedirs(SLICES_DIR, exist_ok=True)
os.makedirs(TIMELINES_DIR, exist_ok=True)

def run_slice(source, start, duration, output_rel, crop_bottom=0.14, crop_top=0.0):
    output_path = os.path.join(BASE_DIR, output_rel.replace("/", "\\"))
    cmd = [
        sys.executable,
        "scripts/get_fishing_tent_clip.py",
        "--source", source,
        "--start", str(start),
        "--duration", str(duration),
        "--output", output_path,
        "--crop-bottom", str(crop_bottom),
        "--crop-top", str(crop_top)
    ]
    print(f"Executing: {' '.join(cmd)}")
    subprocess.run(cmd, check=True)
    return output_path

def get_stock(filename):
    p = os.path.join(STOCK_DIR, filename)
    if not os.path.exists(p):
        raise FileNotFoundError(f"Stock file not found: {p}")
    return p

# ==============================================================================
# CHAPTER 08
# ==============================================================================
print("\n>>> SLICING CLIPS FOR CHAPTER 08...")
ch08_s01 = run_slice("chicago_ice_tents_robledo", 10.0, 6.10, "uploads/raw/proj_fishingtent/slices/ch08_beat01_chicago_skyline.mp4", crop_bottom=0.12, crop_top=0.54)
ch08_s04 = run_slice("halifax_business_eviction", 121.0, 6.80, "uploads/raw/proj_fishingtent/slices/ch08_beat04_halifax_tents_wide.mp4", crop_bottom=0.22, crop_top=0.0)
ch08_s06 = run_slice("cabelas_ice_shelter_tour", 10.0, 6.98, "uploads/raw/proj_fishingtent/slices/ch08_beat06_cabelas_hub_ext.mp4", crop_bottom=0.14, crop_top=0.0)
ch08_s08 = run_slice("halifax_business_eviction", 101.0, 6.04, "uploads/raw/proj_fishingtent/slices/ch08_beat08_halifax_notice_close.mp4", crop_bottom=0.22, crop_top=0.0)
ch08_s10 = run_slice("halifax_business_eviction", 113.0, 6.26, "uploads/raw/proj_fishingtent/slices/ch08_beat10_halifax_worker_tagging.mp4", crop_bottom=0.22, crop_top=0.0)
ch08_s12 = run_slice("cabelas_ice_shelter_tour", 32.0, 6.92, "uploads/raw/proj_fishingtent/slices/ch08_beat12_cabelas_tent_door.mp4", crop_bottom=0.14, crop_top=0.0)
ch08_s14 = run_slice("halifax_business_eviction", 310.0, 6.62, "uploads/raw/proj_fishingtent/slices/ch08_beat14_halifax_park_snow.mp4", crop_bottom=0.22, crop_top=0.0)
ch08_s16 = run_slice("halifax_fenced_off", 1.0, 6.08, "uploads/raw/proj_fishingtent/slices/ch08_beat16_halifax_fence_erect.mp4", crop_bottom=0.20, crop_top=0.12)
ch08_s18 = run_slice("halifax_business_eviction", 171.0, 6.56, "uploads/raw/proj_fishingtent/slices/ch08_beat18_halifax_modular_units.mp4", crop_bottom=0.22, crop_top=0.0)
ch08_s20 = run_slice("halifax_fenced_off", 20.0, 5.68, "uploads/raw/proj_fishingtent/slices/ch08_beat20_halifax_closed_sign.mp4", crop_bottom=0.22, crop_top=0.12)
ch08_s23 = run_slice("cabelas_ice_shelter_tour", 200.0, 5.88, "uploads/raw/proj_fishingtent/slices/ch08_beat23_cabelas_interior_net.mp4", crop_bottom=0.14, crop_top=0.0)
ch08_s26 = run_slice("halifax_business_eviction", 1.5, 6.46, "uploads/raw/proj_fishingtent/slices/ch08_beat26_halifax_eskimo_snow.mp4", crop_bottom=0.22, crop_top=0.0)
ch08_s28 = run_slice("halifax_fenced_off", 8.0, 5.94, "uploads/raw/proj_fishingtent/slices/ch08_beat28_halifax_fence_clamping.mp4", crop_bottom=0.20, crop_top=0.12)
ch08_s31 = run_slice("cabelas_ice_shelter_tour", 20.0, 5.72, "uploads/raw/proj_fishingtent/slices/ch08_beat31_cabelas_corner_hub.mp4", crop_bottom=0.14, crop_top=0.0)
ch08_s33 = run_slice("halifax_business_eviction", 128.0, 5.40, "uploads/raw/proj_fishingtent/slices/ch08_beat33_halifax_tents_overview.mp4", crop_bottom=0.22, crop_top=0.0)

# ==============================================================================
# CHAPTER 09
# ==============================================================================
print("\n>>> SLICING CLIPS FOR CHAPTER 09...")
ch09_s01 = run_slice("cabelas_ice_shelter_tour", 40.0, 7.04, "uploads/raw/proj_fishingtent/slices/ch09_beat01_cabelas_full_view.mp4", crop_bottom=0.14, crop_top=0.0)
ch09_s03 = run_slice("halifax_business_eviction", 135.0, 5.92, "uploads/raw/proj_fishingtent/slices/ch09_beat03_halifax_eskimo_tents.mp4", crop_bottom=0.22, crop_top=0.0)
ch09_s05 = run_slice("cabelas_ice_shelter_tour", 50.0, 6.34, "uploads/raw/proj_fishingtent/slices/ch09_beat05_cabelas_thermal_shell.mp4", crop_bottom=0.14, crop_top=0.0)
ch09_s07 = run_slice("halifax_fenced_off", 35.0, 6.54, "uploads/raw/proj_fishingtent/slices/ch09_beat07_halifax_perimeter.mp4", crop_bottom=0.20, crop_top=0.12)

# ==============================================================================
# CHAPTER 10
# ==============================================================================
print("\n>>> SLICING CLIPS FOR CHAPTER 10...")
ch10_s01 = run_slice("halifax_business_eviction", 180.0, 6.12, "uploads/raw/proj_fishingtent/slices/ch10_beat01_halifax_modular_row.mp4", crop_bottom=0.22, crop_top=0.0)
ch10_s03 = run_slice("cabelas_ice_shelter_tour", 60.0, 6.50, "uploads/raw/proj_fishingtent/slices/ch10_beat03_cabelas_heavy_insulation.mp4", crop_bottom=0.14, crop_top=0.0)
ch10_s06 = run_slice("halifax_business_eviction", 8.0, 5.46, "uploads/raw/proj_fishingtent/slices/ch10_beat06_halifax_eskimo_red.mp4", crop_bottom=0.22, crop_top=0.0)
ch10_s09 = run_slice("halifax_business_eviction", 145.0, 8.14, "uploads/raw/proj_fishingtent/slices/ch10_beat09_halifax_square_community.mp4", crop_bottom=0.22, crop_top=0.0)

print("\n>>> ALL CLIPS SUCCESSFULLY SLICED!")
