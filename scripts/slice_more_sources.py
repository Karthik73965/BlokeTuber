import os
import sys
import subprocess
from concurrent.futures import ThreadPoolExecutor

SOURCES_DIR = os.path.abspath("uploads/raw/proj_steeldoor/sources")
OUT_DIR = os.path.abspath("uploads/raw/proj_steeldoor/pool_cfr30")

ADDITIONAL_SLICES = [
    # Ch 01: Extra rural tree lines and container views
    ("jasper_county_farm_drone.mp4", 95.0, 5.5, "ch01_slice09_timber_boundary.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 15.0, 5.5, "ch01_slice10_side_curtains_exterior.mp4", 0.0),
    ("laurel_ms_drone.mp4", 60.0, 5.5, "ch01_slice11_county_pine_canopy.mp4", 0.0),

    # Ch 02: Extra dollar general / laurel town
    ("dollar_general_rural.mp4", 15.0, 5.5, "ch02_slice08_dg_entry_doors.mp4", 0.15),
    ("dollar_general_ms.mp4", 140.0, 5.5, "ch02_slice09_dg_snack_aisle.mp4", 0.15),
    ("laurel_ms_drone.mp4", 105.0, 5.5, "ch02_slice10_laurel_quiet_streets.mp4", 0.0),

    # Ch 03: Extra car shelter & highway
    ("chevy_malibu_pov.mp4", 210.0, 5.5, "ch03_slice09_malibu_highway_dusk.mp4", 0.0),
    ("storm_camping_tiny_car.mp4", 180.0, 5.5, "ch03_slice10_subzero_windshield_frost.mp4", 0.10),
    ("storm_camping_tiny_car.mp4", 310.0, 5.5, "ch03_slice11_steaming_hot_water_mug.mp4", 0.10),

    # Ch 04: Extra container yard and research
    ("container_depot_yard.mp4", 20.0, 5.5, "ch04_slice06_depot_corner_posts.mp4", 0.0),
    ("container_depot_yard.mp4", 48.0, 5.5, "ch04_slice07_depot_sea_containers.mp4", 0.0),
    ("laurel_ms_drone.mp4", 150.0, 5.5, "ch04_slice08_county_tree_line_horizon.mp4", 0.0),

    # Ch 05: Extra container inspection details
    ("used_container_inspection_andy.mp4", 60.0, 5.5, "ch05_slice09_dented_corrugation_detail.mp4", 0.12),
    ("used_container_inspection_andy.mp4", 105.0, 5.5, "ch05_slice10_cargo_door_rubber_gasket.mp4", 0.12),
    ("used_container_inspection_quick.mp4", 22.0, 5.5, "ch05_slice11_measuring_steel_post.mp4", 0.0),

    # Ch 06: Extra land and offload
    ("jasper_county_farm_drone.mp4", 115.0, 5.5, "ch06_slice09_southern_pasture_dusk.mp4", 0.0),
    ("container_delivery_offload.mp4", 55.0, 5.5, "ch06_slice10_container_winch_cable.mp4", 0.0),
    ("container_delivery_offload.mp4", 85.0, 5.5, "ch06_slice11_container_placed_in_dirt.mp4", 0.0),

    # Ch 07: Extra cutting and door installation
    ("container_cutting_stages.mp4", 18.0, 5.5, "ch07_slice13_corner_cut_grinder.mp4", 0.0),
    ("container_door_frame_hand.mp4", 45.0, 5.5, "ch07_slice14_clamping_steel_tube.mp4", 0.10),
    ("container_install_door_guide.mp4", 55.0, 5.5, "ch07_slice15_screwing_door_frame.mp4", 0.10),
    ("container_install_door_guide.mp4", 115.0, 5.5, "ch07_slice16_tight_seal_door_close.mp4", 0.10),

    # Ch 08: Extra insulation and vapor barrier
    ("touch_n_foam_can_app.mp4", 22.0, 5.5, "ch08_slice12_foam_nozzle_deep_corner.mp4", 0.0),
    ("container_vapor_barrier_guide.mp4", 45.0, 5.5, "ch08_slice13_plastic_framing_seal.mp4", 0.10),
    ("container_vapor_barrier_guide.mp4", 85.0, 5.5, "ch08_slice14_taut_vapor_barrier.mp4", 0.10),
    ("pallet_walls_tiny_home.mp4", 45.0, 5.5, "ch08_slice15_planks_rustic_texture.mp4", 0.10),
    ("pallet_walls_tiny_home.mp4", 95.0, 5.5, "ch08_slice16_nail_gun_fastening_wood.mp4", 0.10),

    # Ch 09: Extra solar, batteries, drums, stove
    ("diy_solar_car_battery_setup.mp4", 30.0, 5.5, "ch09_slice12_solar_wires_clamp.mp4", 0.10),
    ("diy_solar_car_battery_setup.mp4", 60.0, 5.5, "ch09_slice13_battery_fuse_safety.mp4", 0.10),
    ("rainwater_55gal_drum_setup.mp4", 25.0, 5.5, "ch09_slice14_cleaning_drum_interior.mp4", 0.0),
    ("rainwater_55gal_drum_setup.mp4", 55.0, 5.5, "ch09_slice15_gutter_rain_overflow.mp4", 0.0),
    ("coleman_camp_stove_demo.mp4", 30.0, 5.5, "ch09_slice16_adjusting_gas_dial.mp4", 0.0),

    # Ch 10: Extra interior and garden
    ("wilson_container_interior_tour.mp4", 75.0, 5.5, "ch10_slice11_shelf_storage_details.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 135.0, 5.5, "ch10_slice12_cozy_quilted_bed_corner.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 165.0, 5.5, "ch10_slice13_warm_reading_nook.mp4", 0.0),
    ("cinder_block_raised_garden.mp4", 45.0, 5.5, "ch10_slice14_laying_block_foundation.mp4", 0.0),
    ("cinder_block_raised_garden.mp4", 95.0, 5.5, "ch10_slice15_watering_vegetable_sprouts.mp4", 0.0),

    # Ch 11: Extra Deep South panorama and dusk
    ("mississippi_8k_scenic.mp4", 25.0, 5.5, "ch11_slice07_endless_pine_woods.mp4", 0.0),
    ("mississippi_8k_scenic.mp4", 55.0, 5.5, "ch11_slice08_mississippi_sky_clouds.mp4", 0.0),
    ("jasper_county_farm_drone.mp4", 130.0, 5.5, "ch11_slice09_sunset_over_mississippi_farm.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 230.0, 5.5, "ch11_slice10_peaceful_evening_cabin.mp4", 0.0)
]

def process_extra(item):
    src_name, start_sec, dur_sec, out_name, crop_b = item
    src_file = os.path.join(SOURCES_DIR, src_name)
    out_file = os.path.join(OUT_DIR, out_name)

    if os.path.exists(out_file) and os.path.getsize(out_file) > 50000:
        return out_name, "skipped"

    if not os.path.exists(src_file):
        return out_name, f"missing: {src_name}"

    if crop_b > 0:
        h_ratio = 1.0 - crop_b
        vf = f"crop=in_w:in_h*{h_ratio:.2f}:0:0,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    else:
        vf = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"

    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-ss", str(start_sec),
        "-i", src_file,
        "-t", str(dur_sec),
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-r", "30",
        "-fps_mode", "cfr",
        "-g", "30",
        "-keyint_min", "30",
        "-an",
        out_file
    ]

    try:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return out_name, "success"
    except Exception as e:
        return out_name, f"error: {e}"

print(f"=== SLICING {len(ADDITIONAL_SLICES)} EXTRA TARGET CLIPS TO REACH 180+ CFR30 POOL ===")
with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(process_extra, ADDITIONAL_SLICES))

done = sum(1 for _, s in results if s in ["success", "skipped"])
print(f"Extra Slices Done: {done}/{len(ADDITIONAL_SLICES)}")
