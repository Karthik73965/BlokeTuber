import os
import subprocess

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def abs_path(rel_path):
    return os.path.normpath(os.path.join(REPO_ROOT, rel_path)).replace("\\", "/")

RAW_SOURCES = {
    "nomad": abs_path("uploads/raw/proj_camperbike/paul_elkins_nomad.mp4"),
    "kirsten": abs_path("uploads/raw/proj_camperbike/kirsten_elkins_150.mp4"),
    "homeless": abs_path("uploads/raw/proj_camperbike/beneath_bridges_homeless.mp4"),
    "designs7": abs_path("uploads/raw/proj_camperbike/beneath_bridges_7campers.mp4"),
}

OUTPUT_DIR = abs_path("uploads/raw/proj_camperbike/slices_clean")
os.makedirs(OUTPUT_DIR, exist_ok=True)

CUSTOM_SLICES = [
    # Ch 08
    ("kirsten", 14, 8, "kirsten_ch08_towing_park.mp4"),
    ("homeless", 555, 8, "bridges_ch08_door_latch_clean.mp4"),
    ("designs7", 95, 8, "designs7_ch08_tents_sidewalk.mp4"),
    ("homeless", 238, 8, "bridges_ch08_man_waking_inside.mp4"),
    ("nomad", 24, 8, "elkins_ch08_door_close_outside.mp4"),
    ("kirsten", 208, 8, "kirsten_ch08_mattress_frame.mp4"),
    ("kirsten", 28, 8, "kirsten_ch08_skylight_ceiling.mp4"),
    ("nomad", 138, 8, "elkins_ch08_riveting_floor.mp4"),
    ("designs7", 958, 8, "designs7_ch08_camper_autumn_road.mp4"),

    # Ch 09
    ("nomad", 108, 8, "elkins_ch09_wheel_installation.mp4"),
    ("homeless", 78, 8, "bridges_ch09_sweep_crew_clearing.mp4"),
    ("designs7", 28, 8, "designs7_ch09_interior_storage_shelves.mp4"),
    ("kirsten", 118, 8, "kirsten_ch09_yellow_camper_parked.mp4"),
    ("homeless", 448, 8, "bridges_ch09_camper_under_bridge.mp4"),
    ("designs7", 118, 8, "designs7_ch09_bike_camper_fence.mp4"),
    ("designs7", 958, 8, "designs7_ch09_rolling_open_road.mp4"),
    ("homeless", 308, 8, "bridges_ch09_wet_tent_sweep.mp4"),
    ("nomad", 378, 8, "elkins_ch09_tow_hitch_mount.mp4"),
    ("kirsten", 14, 8, "kirsten_ch09_towing_freely.mp4"),

    # Ch 10
    ("kirsten", 478, 8, "kirsten_ch10_counter_butane_stove.mp4"),
    ("homeless", 178, 8, "bridges_ch10_sidewalk_meal_wait.mp4"),
    ("designs7", 28, 8, "designs7_ch10_compact_kitchen_prep.mp4"),
    ("nomad", 228, 8, "elkins_ch10_breadpan_sink_water.mp4"),
    ("kirsten", 118, 8, "kirsten_ch10_peaceful_camper_sun.mp4"),

    # Ch 11
    ("homeless", 448, 8, "bridges_ch11_pod_under_bridge.mp4"),
    ("designs7", 198, 8, "designs7_ch11_dog_in_shelter.mp4"),
    ("designs7", 358, 8, "designs7_ch11_tandem_camper_couple.mp4"),
    ("homeless", 178, 8, "bridges_ch11_walking_away_street.mp4"),
    ("designs7", 28, 8, "designs7_ch11_cart_bags_storage.mp4"),
    ("homeless", 308, 8, "bridges_ch11_belongings_wet_pavement.mp4"),
    ("kirsten", 14, 8, "kirsten_ch11_mobile_pod_moving.mp4"),
    ("nomad", 28, 8, "elkins_ch11_proud_camper_exterior.mp4"),
]

def slice_asset(source_key, start_time, duration, output_filename):
    src = RAW_SOURCES[source_key]
    out_path = os.path.join(OUTPUT_DIR, output_filename)
    
    # Filter selection for broadcast cleanliness (zero watermarks, zero subtitles)
    if source_key == "nomad":
        vf = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    elif source_key == "kirsten":
        vf = "crop=in_w:in_h*0.90:0:0,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    elif source_key in ["homeless", "designs7"]:
        vf = "crop=in_w:in_h*0.86:0:0,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    else:
        vf = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"

    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-ss", str(start_time),
        "-i", src,
        "-t", str(duration),
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-an",
        out_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    snap = out_path.replace(".mp4", ".jpg")
    try:
        subprocess.run(["ffmpeg", "-nostdin", "-y", "-ss", "2", "-i", out_path, "-vframes", "1", "-q:v", "2", snap],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    except:
        pass
    print(f"Generated clean slice: {output_filename}")

def main():
    print(f"Slicing {len(CUSTOM_SLICES)} broadcast-clean assets...")
    for src_key, start, dur, fname in CUSTOM_SLICES:
        slice_asset(src_key, start, dur, fname)
    print("All clean slices generated successfully!")

if __name__ == "__main__":
    main()
