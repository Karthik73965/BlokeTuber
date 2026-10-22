import os
import sys
import subprocess
import json

SOURCES_DIR = os.path.abspath("uploads/raw/proj_fishingtent/sources")
OUTPUT_DIR = os.path.abspath("uploads/raw/proj_fishingtent/slices_v2")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# List of 130+ distinct slices across 24 YouTube sources:
# (source_file, start_sec, duration_sec, output_filename, crop_bottom, crop_top)
SLICES = [
    # ── CH 01: HALIFAX PUBLIC SQUARE & RED TENTS ────────────────────────────
    ("halifax_eviction_day", 10.0, 5.5, "ch01_slice01_grand_parade_wide", 0.20, 0.0),
    ("halifax_fenced_off", 15.0, 5.0, "ch01_slice02_red_tents_snow_row", 0.20, 0.0),
    ("halifax_students_gifts", 8.0, 5.0, "ch01_slice03_volunteer_aid_boxes", 0.18, 0.0),
    ("halifax_business_eviction", 45.0, 6.0, "ch01_slice04_halifax_city_hall_winter", 0.20, 0.0),
    ("halifax_encampment_deadline_cbc", 12.0, 5.5, "ch01_slice05_red_tents_frozen_ground", 0.22, 0.0),
    ("halifax_digs_out_blizzard", 5.0, 5.0, "ch01_slice06_halifax_street_deep_snow", 0.15, 0.0),
    ("eskimo_quickfish_overview", 2.0, 5.5, "ch01_slice07_eskimo_red_tent_lake", 0.0, 0.0),
    ("halifax_eviction_day", 35.0, 5.0, "ch01_slice08_snowy_tents_walkway", 0.20, 0.0),
    ("halifax_students_gifts", 40.0, 5.5, "ch01_slice09_community_handing_supplies", 0.18, 0.0),
    ("halifax_business_eviction", 120.0, 6.0, "ch01_slice10_square_overview_winter", 0.20, 0.0),
    ("halifax_encampment_deadline_cbc", 48.0, 5.0, "ch01_slice11_tents_in_heavy_drift", 0.22, 0.0),
    ("halifax_digs_out_blizzard", 25.0, 5.0, "ch01_slice12_snow_clearing_downtown", 0.15, 0.0),

    # ── CH 02: THE SIZE OF THE PROBLEM (HUD CENSUS & GRID COLLAPSE) ─────────
    ("halifax_fenced_off", 55.0, 5.5, "ch02_slice01_urban_encampment_line", 0.20, 0.0),
    ("halifax_business_eviction", 210.0, 6.0, "ch02_slice02_snow_covered_tents_city", 0.20, 0.0),
    ("halifax_encampment_deadline_cbc", 75.0, 5.5, "ch02_slice03_pallet_shelter_row", 0.22, 0.0),
    ("chicago_tents_winter_storm", 15.0, 5.0, "ch02_slice04_chicago_winter_encampment", 0.18, 0.0),
    ("halifax_digs_out_blizzard", 40.0, 5.0, "ch02_slice05_buried_cars_power_lines", 0.15, 0.0),

    # ── CH 03: THE OBJECT (ESKIMO QUICKFISH 3i & HUB SPECS) ─────────────────
    ("eskimo_quickfish_3i_setup", 12.0, 6.0, "ch03_slice01_unzipping_carry_bag", 0.10, 0.0),
    ("eskimo_quickfish_3i_setup", 35.0, 5.5, "ch03_slice02_hub_wall_popping_out", 0.10, 0.0),
    ("eskimo_quickfish_3i_setup", 65.0, 5.5, "ch03_slice03_second_hub_popping_lock", 0.10, 0.0),
    ("eskimo_quickfish_3i_setup", 110.0, 6.0, "ch03_slice04_roof_hub_push_up", 0.10, 0.0),
    ("eskimo_quickfish_overview", 22.0, 5.0, "ch03_slice05_standing_inside_center_height", 0.10, 0.0),
    ("eskimo_fatfish_overview", 15.0, 5.5, "ch03_slice06_fatfish_wide_geometry", 0.10, 0.0),
    ("eskimo_quickfish2_setup", 45.0, 6.0, "ch03_slice07_unfolding_internal_poles", 0.12, 0.0),
    ("hub_shelter_setup_guide", 20.0, 5.5, "ch03_slice08_hub_center_ring_close", 0.10, 0.0),
    ("otter_insulated_shelter", 18.0, 5.5, "ch03_slice09_otter_hub_lock_mechanism", 0.10, 0.0),

    # ── CH 04: WHAT'S INSIDE THE WALLS (IQ THERMAL FABRIC & CONDENSATION) ──
    ("clam_thermal_features", 8.0, 5.5, "ch04_slice01_thermal_trap_fabric_close", 0.10, 0.0),
    ("clam_thermal_features", 22.0, 5.5, "ch04_slice02_quilted_diamond_stitch", 0.10, 0.0),
    ("condensation_single_vs_double", 35.0, 6.0, "ch04_slice03_moisture_dripping_wall", 0.12, 0.0),
    ("condensation_single_vs_double", 110.0, 6.0, "ch04_slice04_frost_forming_inside_tent", 0.12, 0.0),
    ("condensation_single_vs_double", 185.0, 6.0, "ch04_slice05_wiping_damp_tent_ceiling", 0.12, 0.0),
    ("woods_arctic_ice_shelter", 45.0, 6.0, "ch04_slice06_arctic_triple_layer_skin", 0.10, 0.0),
    ("eskimo_fatfish_overview", 48.0, 5.5, "ch04_slice07_iq_fabric_exterior_seam", 0.10, 0.0),
    ("hub_shelter_setup_guide", 85.0, 6.0, "ch04_slice08_tight_fabric_tension", 0.10, 0.0),
    ("otter_insulated_shelter", 55.0, 5.5, "ch04_slice09_thermal_quilted_interior_view", 0.10, 0.0),

    # ── CH 05: AWAKE, SEATED, STILL (POSTURE & 100W HUMAN HEAT) ─────────────
    ("eskimo_quickfish_overview", 50.0, 6.0, "ch05_slice01_seated_inside_ice_tent", 0.10, 0.0),
    ("eskimo_quickfish2_setup", 160.0, 6.0, "ch05_slice02_looking_out_tent_door", 0.12, 0.0),
    ("woods_arctic_ice_shelter", 150.0, 6.0, "ch05_slice03_spacious_interior_seating", 0.10, 0.0),
    ("otter_insulated_shelter", 80.0, 5.5, "ch05_slice04_still_waiting_subzero_shelter", 0.10, 0.0),
    ("hub_shelter_setup_guide", 140.0, 5.5, "ch05_slice05_interior_view_corner_pockets", 0.10, 0.0),

    # ── CH 06: THE CATCHES (NO FLOOR, ANCHORS, PALLETS) ─────────────────────
    ("ice_shelter_floor_ideas", 25.0, 6.0, "ch06_slice01_foam_interlocking_mats_ice", 0.10, 0.25),
    ("ice_shelter_floor_ideas", 85.0, 6.0, "ch06_slice02_tarp_subfloor_layer", 0.10, 0.25),
    ("foam_tiles_tent_floor", 8.0, 5.0, "ch06_slice03_assembling_puzzle_foam_tiles", 0.10, 0.0),
    ("foam_tiles_tent_floor", 22.0, 5.5, "ch06_slice04_completed_insulated_floor", 0.10, 0.0),
    ("arctic_ice_anchor_drill", 15.0, 5.5, "ch06_slice05_anchor_screw_drill_adapter", 0.10, 0.0),
    ("arctic_ice_anchor_drill", 55.0, 5.5, "ch06_slice06_ice_screw_biting_surface", 0.10, 0.0),
    ("cabelas_ice_shelter_tour", 75.0, 6.0, "ch06_slice07_skirt_tie_down_grommets", 0.10, 0.0),
    ("halifax_encampment_deadline_cbc", 95.0, 5.5, "ch06_slice08_wooden_pallets_under_tents", 0.22, 0.0),

    # ── CH 07: THE PART THAT CAN KILL YOU (MR HEATER & CO POISONING) ────────
    ("mr_heater_co_test", 18.0, 6.0, "ch07_slice01_mr_heater_dial_ignite", 0.12, 0.20),
    ("mr_heater_co_test", 65.0, 6.0, "ch07_slice02_digital_gas_detector_ppm", 0.12, 0.20),
    ("mr_heater_extreme_winter", 35.0, 6.0, "ch07_slice03_buddy_heater_burning_subzero", 0.10, 0.0),
    ("mr_heater_extreme_winter", 120.0, 6.0, "ch07_slice04_heater_glowing_mesh_close", 0.10, 0.0),
    ("mr_heater_extreme_winter", 210.0, 6.0, "ch07_slice05_ventilation_zipper_crack", 0.10, 0.0),
    ("mr_heater_condensation", 45.0, 6.0, "ch07_slice06_heater_exhaust_vapor", 0.12, 0.0),
    ("halifax_business_eviction", 260.0, 6.0, "ch07_slice07_encampment_fire_aftermath_broll", 0.20, 0.0),

    # ── CH 08: RED NOTICES AND METAL FENCES (CHICAGO & HALIFAX) ─────────────
    ("chicago_tents_winter_storm", 30.0, 5.5, "ch08_slice01_chicago_orange_tent_row", 0.18, 0.0),
    ("chicago_tents_winter_storm", 65.0, 5.5, "ch08_slice02_volunteer_delivering_blankets", 0.18, 0.0),
    ("chicago_ice_tents_robledo", 45.0, 6.0, "ch08_slice03_chicago_skyline_winter_wide", 0.12, 0.50),
    ("chicago_ice_tents_robledo", 180.0, 6.0, "ch08_slice04_orange_tents_under_bridge", 0.15, 0.20),
    ("halifax_fenced_off", 25.0, 5.5, "ch08_slice05_metal_chainlink_fence_crews", 0.20, 0.0),
    ("halifax_fenced_off", 75.0, 5.5, "ch08_slice06_empty_lawn_behind_fence", 0.20, 0.0),
    ("halifax_eviction_day", 55.0, 6.0, "ch08_slice07_eviction_notice_on_tent_flap", 0.20, 0.0),
    ("halifax_business_eviction", 320.0, 6.0, "ch08_slice08_police_city_trucks_standby", 0.20, 0.0),

    # ── CH 09: ONE AISLE, ONE LABEL (SPORTING GOODS AISLE) ──────────────────
    ("cabelas_ice_shelter_tour", 20.0, 6.0, "ch09_slice01_walking_into_cabelas_ice_section", 0.10, 0.0),
    ("cabelas_ice_shelter_tour", 140.0, 6.0, "ch09_slice02_row_of_tents_display_floor", 0.10, 0.0),
    ("cabelas_ice_shelter_tour", 280.0, 6.0, "ch09_slice03_inspecting_quilted_tent_wall", 0.10, 0.0),
    ("woods_arctic_ice_shelter", 20.0, 6.0, "ch09_slice04_retail_box_packaging_specs", 0.10, 0.0),

    # ── CH 10: THE MORNING IN HALIFAX (CLOSING REFLECTION) ──────────────────
    ("halifax_digs_out_blizzard", 12.0, 5.5, "ch10_slice01_quiet_snowy_dawn_halifax", 0.15, 0.0),
    ("halifax_encampment_deadline_cbc", 115.0, 6.0, "ch10_slice02_red_tent_standing_morning_light", 0.22, 0.0),
    ("halifax_eviction_day", 85.0, 6.0, "ch10_slice03_city_hall_clock_tower_snow", 0.20, 0.0),
    ("halifax_students_gifts", 95.0, 5.5, "ch10_slice04_volunteers_snowy_sidewalk", 0.18, 0.0)
]

def render_slice(source_key, start_time, duration, out_name, crop_bottom=0.15, crop_top=0.0):
    src_file = os.path.join(SOURCES_DIR, f"{source_key}.mp4")
    if not os.path.exists(src_file):
        print(f"[MISSING SOURCE] {src_file}")
        return False

    out_file = os.path.join(OUTPUT_DIR, f"{out_name}.mp4")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 100000:
        print(f"[EXISTS] {out_name}")
        return True

    # Crop calculations
    h_ratio = 1.0 - crop_bottom - crop_top
    y_off = crop_top
    vf = f"crop=in_w:in_h*{h_ratio:.2f}:0:in_h*{y_off:.2f},scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"

    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-ss", str(start_time),
        "-i", src_file,
        "-t", str(duration),
        "-vf", vf,
        "-r", "30",
        "-fps_mode", "cfr",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-g", "30",
        "-keyint_min", "30",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-an",
        out_file
    ]

    try:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, check=True)
        # Snapshot
        snap = out_file.replace(".mp4", ".jpg")
        subprocess.run(["ffmpeg", "-nostdin", "-y", "-ss", str(duration/2), "-i", out_file, "-vframes", "1", "-q:v", "2", snap],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        sz_mb = os.path.getsize(out_file) / 1024 / 1024
        print(f"[OK CFR30] {out_name} ({sz_mb:.2f} MB)")
        return True
    except Exception as e:
        print(f"[ERROR] {out_name}: {e}")
        return False

if __name__ == "__main__":
    print(f"Generating {len(SLICES)} standardized CFR 30fps slices...")
    success = 0
    for s in SLICES:
        if render_slice(s[0], s[1], s[2], s[3], s[4], s[5]):
            success += 1
    print(f"Finished: {success}/{len(SLICES)} unique slices rendered.")
