import os
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
RAW_DIR = REPO_ROOT / 'uploads' / 'raw' / 'proj_camperbike'
SLICES_DIR = RAW_DIR / 'slices'
SLICES_DIR.mkdir(parents=True, exist_ok=True)

# Define slice definitions from our core downloaded videos
# Source 1: paul_elkins_nomad.mp4
# Source 2: kirsten_elkins_150.mp4
# Source 3: drew_builds_stuff.mp4

slices_config = [
    # --- PAUL ELKINS NOMAD ---
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_awl_hole_punch.mp4",
        "ss": "00:00:35",
        "t": "6.0"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_campaign_signs_coroplast.mp4",
        "ss": "00:00:55",
        "t": "6.5"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_pine_floor_frame.mp4",
        "ss": "00:01:15",
        "t": "6.0"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_arcing_plastic_sheet.mp4",
        "ss": "00:01:40",
        "t": "7.0"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_zipties_rivets_seam.mp4",
        "ss": "00:02:05",
        "t": "6.0"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_plastic_tub_skylight.mp4",
        "ss": "00:02:35",
        "t": "6.5"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_folddown_counter_stove.mp4",
        "ss": "00:03:10",
        "t": "7.0"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_cozy_interior_bed.mp4",
        "ss": "00:03:45",
        "t": "7.5"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_towing_bike_field.mp4",
        "ss": "00:04:30",
        "t": "7.0"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_bike_wheel_axle.mp4",
        "ss": "00:04:50",
        "t": "6.5"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_resting_against_arched_wall.mp4",
        "ss": "00:05:15",
        "t": "6.5"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_breadpan_sink_water.mp4",
        "ss": "00:05:45",
        "t": "6.5"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_white_breadloaf_exterior.mp4",
        "ss": "00:06:15",
        "t": "7.0"
    },
    {
        "src": "paul_elkins_nomad.mp4",
        "name": "elkins_barrel_bolt_latched.mp4",
        "ss": "00:06:50",
        "t": "6.0"
    },

    # --- KIRSTEN DIRKSEN DOCUMENTARY ---
    {
        "src": "kirsten_elkins_150.mp4",
        "name": "kirsten_micro_camper_parked.mp4",
        "ss": "00:00:40",
        "t": "6.5"
    },
    {
        "src": "kirsten_elkins_150.mp4",
        "name": "kirsten_campaign_sign_lettering.mp4",
        "ss": "00:01:20",
        "t": "6.5"
    },
    {
        "src": "kirsten_elkins_150.mp4",
        "name": "kirsten_interior_wheel_well.mp4",
        "ss": "00:02:10",
        "t": "6.5"
    },
    {
        "src": "kirsten_elkins_150.mp4",
        "name": "kirsten_skylight_vent_detail.mp4",
        "ss": "00:03:05",
        "t": "6.0"
    },
    {
        "src": "kirsten_elkins_150.mp4",
        "name": "kirsten_swivel_reading_light.mp4",
        "ss": "00:03:45",
        "t": "6.0"
    },
    {
        "src": "kirsten_elkins_150.mp4",
        "name": "kirsten_table_counter_foldout.mp4",
        "ss": "00:04:30",
        "t": "6.5"
    },
    {
        "src": "kirsten_elkins_150.mp4",
        "name": "kirsten_tow_hitch_universal_joint.mp4",
        "ss": "00:05:20",
        "t": "6.5"
    },
    {
        "src": "kirsten_elkins_150.mp4",
        "name": "kirsten_arch_wall_strength_press.mp4",
        "ss": "00:06:10",
        "t": "6.5"
    },
    {
        "src": "kirsten_elkins_150.mp4",
        "name": "kirsten_towing_urban_street.mp4",
        "ss": "00:07:15",
        "t": "7.0"
    },
    {
        "src": "kirsten_elkins_150.mp4",
        "name": "kirsten_aerodynamic_nose_front.mp4",
        "ss": "00:08:05",
        "t": "6.0"
    },
    {
        "src": "kirsten_elkins_150.mp4",
        "name": "kirsten_side_window_ventilation.mp4",
        "ss": "00:09:10",
        "t": "6.5"
    },

    # --- DREW BUILDS STUFF ---
    {
        "src": "drew_builds_stuff.mp4",
        "name": "drew_woodworking_framing.mp4",
        "ss": "00:02:15",
        "t": "6.5"
    },
    {
        "src": "drew_builds_stuff.mp4",
        "name": "drew_floor_pocket_holes.mp4",
        "ss": "00:03:40",
        "t": "6.5"
    },
    {
        "src": "drew_builds_stuff.mp4",
        "name": "drew_foam_insulation_sheets.mp4",
        "ss": "00:06:10",
        "t": "6.5"
    },
    {
        "src": "drew_builds_stuff.mp4",
        "name": "drew_jigsaw_cutting_curves.mp4",
        "ss": "00:08:30",
        "t": "6.5"
    },
    {
        "src": "drew_builds_stuff.mp4",
        "name": "drew_fastening_exterior_panels.mp4",
        "ss": "00:11:15",
        "t": "6.5"
    },
    {
        "src": "drew_builds_stuff.mp4",
        "name": "drew_door_frame_hinges.mp4",
        "ss": "00:14:40",
        "t": "6.5"
    },
    {
        "src": "drew_builds_stuff.mp4",
        "name": "drew_curved_roof_assembly.mp4",
        "ss": "00:18:20",
        "t": "6.5"
    },
    {
        "src": "drew_builds_stuff.mp4",
        "name": "drew_exterior_white_paint.mp4",
        "ss": "00:22:10",
        "t": "6.5"
    },
    {
        "src": "drew_builds_stuff.mp4",
        "name": "drew_wheels_axle_mounting.mp4",
        "ss": "00:26:30",
        "t": "6.5"
    },
    {
        "src": "drew_builds_stuff.mp4",
        "name": "drew_bike_tow_hitch_bracket.mp4",
        "ss": "00:29:15",
        "t": "6.5"
    },
    {
        "src": "drew_builds_stuff.mp4",
        "name": "drew_towing_down_road.mp4",
        "ss": "00:32:45",
        "t": "7.0"
    },
    {
        "src": "drew_builds_stuff.mp4",
        "name": "drew_interior_mattress_cozy.mp4",
        "ss": "00:35:20",
        "t": "6.5"
    },

    # --- BENEATH THE BRIDGES: HOMELESS MICRO CAMPERS ---
    {
        "src": "beneath_bridges_homeless.mp4",
        "name": "bridges_urban_sidewalk_campers.mp4",
        "ss": "00:01:20",
        "t": "6.5"
    },
    {
        "src": "beneath_bridges_homeless.mp4",
        "name": "bridges_towing_away_sweep.mp4",
        "ss": "00:02:45",
        "t": "6.5"
    },
    {
        "src": "beneath_bridges_homeless.mp4",
        "name": "bridges_winter_weather_protection.mp4",
        "ss": "00:04:15",
        "t": "6.5"
    },
    {
        "src": "beneath_bridges_homeless.mp4",
        "name": "bridges_door_lock_privacy.mp4",
        "ss": "00:06:10",
        "t": "6.5"
    },
    {
        "src": "beneath_bridges_homeless.mp4",
        "name": "bridges_pet_inside_shelter.mp4",
        "ss": "00:08:20",
        "t": "6.5"
    },
    {
        "src": "beneath_bridges_homeless.mp4",
        "name": "bridges_storage_of_possessions.mp4",
        "ss": "00:10:40",
        "t": "6.5"
    },

    # --- BENEATH THE BRIDGES: 7 CAMPER DESIGNS ---
    {
        "src": "beneath_bridges_7campers.mp4",
        "name": "bridges7_emergency_shelter_pod.mp4",
        "ss": "00:01:10",
        "t": "6.5"
    },
    {
        "src": "beneath_bridges_7campers.mp4",
        "name": "bridges7_pushcart_shelter.mp4",
        "ss": "00:03:00",
        "t": "6.5"
    },
    {
        "src": "beneath_bridges_7campers.mp4",
        "name": "bridges7_vending_business_stall.mp4",
        "ss": "00:05:15",
        "t": "6.5"
    },
    {
        "src": "beneath_bridges_7campers.mp4",
        "name": "bridges7_teardrop_bike_camper.mp4",
        "ss": "00:07:30",
        "t": "6.5"
    },
    {
        "src": "beneath_bridges_7campers.mp4",
        "name": "bridges7_compact_interior_storage.mp4",
        "ss": "00:09:40",
        "t": "6.5"
    },
    {
        "src": "beneath_bridges_7campers.mp4",
        "name": "bridges7_lightweight_wheels.mp4",
        "ss": "00:11:20",
        "t": "6.5"
    }
]

print(f"Slicing {len(slices_config)} high-value B-roll segments...")

for sc in slices_config:
    src_file = RAW_DIR / sc["src"]
    out_file = SLICES_DIR / sc["name"]

    if not src_file.exists():
        print(f"Source file {sc['src']} not found yet, skipping {sc['name']}")
        continue

    if out_file.exists() and out_file.stat().st_size > 100000:
        print(f"✓ Already sliced: {sc['name']}")
        continue

    # Crop out bottom 8% for kirsten (to remove faircompanies watermark) and upscale cleanly to 1080p
    vf_filter = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    if "kirsten" in sc["src"]:
        # crop bottom 8% then scale
        vf_filter = "crop=in_w:in_h*0.92:0:0,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"

    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-ss", sc["ss"],
        "-i", str(src_file),
        "-t", sc["t"],
        "-vf", vf_filter,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
        "-an",
        str(out_file)
    ]

    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        snap = str(out_file).replace(".mp4", ".jpg")
        subprocess.run(["ffmpeg", "-nostdin", "-y", "-ss", "1", "-i", str(out_file), "-vframes", "1", "-q:v", "2", snap],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"✓ Sliced {sc['name']} ({round(out_file.stat().st_size / 1024 / 1024, 2)} MB)")
    except Exception as e:
        print(f"Error slicing {sc['name']}: {e}")

print("Slicing complete!")
