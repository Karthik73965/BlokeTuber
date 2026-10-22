import os
import sys
import subprocess

SOURCES = [
    ("halifax_fenced_off", "https://www.youtube.com/watch?v=hcgh8oHbiaM"),
    ("halifax_eviction_day", "https://www.youtube.com/watch?v=_N06OmVrm2Q"),
    ("halifax_students_gifts", "https://www.youtube.com/watch?v=MYzjQCgdUis"),
    ("halifax_business_eviction", "https://www.youtube.com/watch?v=8MBdMh86GUA"),
    ("chicago_ice_tents_robledo", "https://www.youtube.com/watch?v=OOz1HlB8_kc"),
    ("eskimo_quickfish_3i_setup", "https://www.youtube.com/watch?v=RbWXAqG_yTs"),
    ("eskimo_quickfish_overview", "https://www.youtube.com/watch?v=iSNPlE6VkG0"),
    ("clam_thermal_features", "https://www.youtube.com/watch?v=j1D0uQZpqDY"),
    ("condensation_single_vs_double", "https://www.youtube.com/watch?v=EZ8UikUgx7Y"),
    ("mr_heater_co_test", "https://www.youtube.com/watch?v=EzP-z9COgdY"),
    ("mr_heater_condensation", "https://www.youtube.com/watch?v=CpgL-8ufb5E"),
    ("ice_shelter_floor_ideas", "https://www.youtube.com/watch?v=UOpDQxqFkwo"),
    ("arctic_ice_anchor_drill", "https://www.youtube.com/watch?v=ra86nyOx2yo"),
    ("cabelas_ice_shelter_tour", "https://www.youtube.com/watch?v=DPKxgjWddmw"),
]

out_dir = os.path.abspath("uploads/raw/proj_fishingtent/sources")
os.makedirs(out_dir, exist_ok=True)

for name, url in SOURCES:
    out_file = os.path.join(out_dir, f"{name}.mp4")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 1000000:
        print(f"[EXISTS] {name} ({os.path.getsize(out_file)/1024/1024:.2f} MB)")
        continue

    print(f"[DOWNLOADING] {name} from {url}...")
    cmd = [
        "yt-dlp",
        "--extractor-args", "youtube:player_client=android",
        "-f", "18/b[ext=mp4]/best[ext=mp4]/best",
        "-o", out_file,
        url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_file) and os.path.getsize(out_file) > 100000:
        print(f"[OK] {name} ({os.path.getsize(out_file)/1024/1024:.2f} MB)")
    else:
        print(f"[FAIL] {name}: {res.stderr[:200]}")

print("All sources downloaded.")
