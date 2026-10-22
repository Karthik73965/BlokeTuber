import os
import sys
import subprocess

NEW_SOURCES = [
    ("halifax_encampment_deadline_cbc", "https://www.youtube.com/watch?v=s5dazn8QtpE"),
    ("halifax_digs_out_blizzard", "https://www.youtube.com/watch?v=TB8VsZDW784"),
    ("chicago_tents_winter_storm", "https://www.youtube.com/watch?v=cuMxv3lDgiE"),
    ("eskimo_fatfish_overview", "https://www.youtube.com/watch?v=6vaoG2Lx8Qo"),
    ("eskimo_quickfish2_setup", "https://www.youtube.com/watch?v=FiqSHv5qHyo"),
    ("otter_insulated_shelter", "https://www.youtube.com/watch?v=EnINEfNzlAo"),
    ("hub_shelter_setup_guide", "https://www.youtube.com/watch?v=S_J5aU_cDKI"),
    ("mr_heater_extreme_winter", "https://www.youtube.com/watch?v=Ktqk4-Anfgs"),
    ("woods_arctic_ice_shelter", "https://www.youtube.com/watch?v=mM2olYQ0kA8"),
    ("foam_tiles_tent_floor", "https://www.youtube.com/watch?v=AbDhL2D3Ato"),
]

out_dir = os.path.abspath("uploads/raw/proj_fishingtent/sources")
os.makedirs(out_dir, exist_ok=True)

for name, url in NEW_SOURCES:
    out_file = os.path.join(out_dir, f"{name}.mp4")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 500000:
        print(f"[EXISTS] {name} ({os.path.getsize(out_file)/1024/1024:.2f} MB)", flush=True)
        continue

    print(f"[DOWNLOADING] {name} from {url}...", flush=True)
    cmd = [
        "yt-dlp",
        "--extractor-args", "youtube:player_client=android",
        "-f", "18/b[ext=mp4]/best[ext=mp4]/best",
        "-o", out_file,
        url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_file) and os.path.getsize(out_file) > 100000:
        print(f"[OK] {name} ({os.path.getsize(out_file)/1024/1024:.2f} MB)", flush=True)
    else:
        print(f"[FAIL] {name}: {res.stderr[:200]}", flush=True)

print("All new sources downloaded.", flush=True)
