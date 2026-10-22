import os
import subprocess

SOURCES_DIR = os.path.abspath("uploads/raw/proj_fishingtent/sources")
TEST_DIR = os.path.abspath("scratch/verify_slices")
os.makedirs(TEST_DIR, exist_ok=True)

test_candidates = [
    # Chapter 1
    ("halifax_business_eviction", 123.0, 5.2, "ch01_b01_halifax_square_wide", 0.22),
    ("halifax_eviction_day", 30.0, 4.2, "ch01_b03_halifax_summer_tent", 0.22),
    ("halifax_students_gifts", 1.0, 6.22, "ch01_b05_halifax_red_tents_row", 0.22),
    ("eskimo_quickfish_3i_setup", 14.0, 6.86, "ch01_b06_eskimo_lake_popup", 0.0),
    ("eskimo_quickfish_overview", 16.0, 6.12, "ch01_b07_eskimo_hole_fishing", 0.0),
    ("halifax_business_eviction", 100.0, 6.3, "ch01_b09_halifax_tent_snow", 0.22),
    ("halifax_students_gifts", 91.0, 6.33, "ch01_b12_halifax_volunteers_work", 0.22),
    ("halifax_eviction_day", 1.0, 6.68, "ch01_b14_halifax_square_morning", 0.22),
    ("halifax_business_eviction", 170.0, 6.42, "ch01_b16_halifax_encampment_view", 0.22),
    ("halifax_students_gifts", 10.0, 6.18, "ch01_b18_halifax_community_supplies", 0.22),
    ("halifax_business_eviction", 300.0, 6.24, "ch01_b20_halifax_winter_field", 0.22),
    ("halifax_business_eviction", 180.0, 5.88, "ch01_b22_halifax_pallet_units", 0.22),
    ("halifax_eviction_day", 55.0, 7.86, "ch01_b24_halifax_encampment_hill", 0.22),
    ("eskimo_quickfish_3i_setup", 1.0, 6.54, "ch01_b26_eskimo_lake_overview", 0.0),
    ("halifax_business_eviction", 129.0, 8.11, "ch01_b28_halifax_square_pan", 0.22),

    # Chapter 2
    ("halifax_business_eviction", 310.0, 6.2, "ch02_b00_halifax_encampment_tents", 0.22),
    ("halifax_eviction_day", 100.0, 6.0, "ch02_b02_halifax_snow_urban", 0.22),
    ("halifax_students_gifts", 20.0, 8.0, "ch02_b04_halifax_emergency_row", 0.22),
    ("eskimo_quickfish_3i_setup", 40.0, 6.5, "ch02_b11_eskimo_3i_hub_ice", 0.0),

    # Chapter 3
    ("eskimo_quickfish_3i_setup", 20.0, 3.4, "ch03_b01_eskimo_standing_ice", 0.0),
    ("eskimo_quickfish_3i_setup", 75.0, 5.1, "ch03_b04_eskimo_interior_standing", 0.0),
    ("eskimo_quickfish_overview", 75.0, 4.3, "ch03_b06_eskimo_carry_bag_pack", 0.0),
    ("eskimo_quickfish_3i_setup", 5.0, 7.9, "ch03_b07_eskimo_hub_rapid_deploy", 0.0),
    ("eskimo_quickfish_overview", 40.0, 6.0, "ch03_b10_eskimo_corner_joints", 0.0),
    ("eskimo_quickfish_3i_setup", 160.0, 8.23, "ch03_b12_eskimo_quilted_wall", 0.0),
]

for src, start, dur, name, crop_b in test_candidates:
    src_file = os.path.join(SOURCES_DIR, f"{src}.mp4")
    out_jpg = os.path.join(TEST_DIR, f"{name}.jpg")
    
    if crop_b > 0:
        h_ratio = 1.0 - crop_b
        vf = f"crop=in_w:in_h*{h_ratio:.2f}:0:0,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    else:
        vf = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
        
    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-ss", str(start + min(1.0, dur / 2)),
        "-i", src_file,
        "-vframes", "1",
        "-vf", vf,
        "-q:v", "2",
        out_jpg
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"Generated {name}.jpg")
