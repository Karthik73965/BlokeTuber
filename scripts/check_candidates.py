import os
import subprocess

# We want clean b-roll slices from:
# 1. eskimo_quickfish_3i_setup:
#    - 0 to 40s: unfolding and popping out hubs on snow (no talking head!)
#    - 50 to 90s: popping roof, exterior and looking inside at snow floor
#    - 140 to 180s: wide shots of red shelter on vast ice lake
# 2. clam_thermal_features:
#    - 10 to 22s: interior quilted blue ceiling and flex tested poles (with crop_bottom=0.22 to eliminate text)
#    - 25 to 35s: wide shot of blue thermal shelter on snow lake (crop_bottom=0.22)
#    - 40 to 52s: ice anchor skirt and windows (crop_bottom=0.22)
# 3. ice_shelter_floor_ideas:
#    - Let's find exact seconds with hands on mats / floor demo, no talking head!
# 4. arctic_ice_anchor_drill:
#    - 40 to 90s: winch and anchor cable in snow
# 5. mr_heater_co_test:
#    - 120 to 180s: Mr Heater glowing red, CO detector, timer, table (no face!)
#    - 290 to 360s: heater running inside tent enclosure, detector readings

# Let's inspect floor ideas and mr heater co test around these ranges
test_snaps = [
    ("ice_shelter_floor_ideas", [10, 50, 110, 140, 170, 230, 290, 310, 350, 410]),
    ("mr_heater_co_test", [125, 135, 145, 155, 315, 325, 335, 345, 355]),
    ("clam_thermal_features", [12, 18, 25, 32, 45, 52]),
    ("eskimo_quickfish_3i_setup", [15, 25, 35, 75, 85, 155, 165, 175])
]

os.makedirs("uploads/beat_snapshots/source_checks", exist_ok=True)
for src, times in test_snaps:
    for t in times:
        out = f"uploads/beat_snapshots/source_checks/{src}_{t}s.jpg"
        subprocess.run([
            "ffmpeg", "-nostdin", "-y", "-ss", str(t), "-i", f"uploads/raw/proj_fishingtent/sources/{src}.mp4",
            "-vframes", "1", "-vf", "scale=640:360", "-q:v", "5", out
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("Checked candidate frames")
