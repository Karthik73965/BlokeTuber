import os
import sys
import subprocess
from concurrent.futures import ThreadPoolExecutor

SOURCES_DIR = os.path.abspath("uploads/raw/proj_steeldoor/sources")
OUT_DIR = os.path.abspath("uploads/raw/proj_steeldoor/pool_cfr30")
os.makedirs(OUT_DIR, exist_ok=True)

# Format: (source_filename, start_sec, duration_sec, output_filename, crop_bottom)
SLICES = [
    # ── CH 01: COLD DOOR ─────────────────────────────────────────────────────
    ("jasper_county_farm_drone.mp4", 5.0, 5.5, "ch01_slice01_rural_treeline.mp4", 0.0),
    ("jasper_county_farm_drone.mp4", 35.0, 5.5, "ch01_slice02_red_clay_approach.mp4", 0.0),
    ("laurel_ms_drone.mp4", 15.0, 5.5, "ch01_slice03_laurel_county_landscape.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 5.0, 5.5, "ch01_slice04_container_exterior_trees.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 25.0, 5.5, "ch01_slice05_welcome_mat_door.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 45.0, 5.5, "ch01_slice06_solar_roof_tilt.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 85.0, 5.5, "ch01_slice07_folding_chair_interior.mp4", 0.0),
    ("chevy_malibu_overview.mp4", 8.0, 5.5, "ch01_slice08_malibu_profile.mp4", 0.0),

    # ── CH 02: THE NUMBER THAT BROKE HER ─────────────────────────────────────
    ("dollar_general_rural.mp4", 5.0, 5.5, "ch02_slice01_dg_exterior_parking.mp4", 0.15),
    ("dollar_general_rural.mp4", 25.0, 5.5, "ch02_slice02_dg_shelves_canned.mp4", 0.15),
    ("dollar_general_rural.mp4", 45.0, 5.5, "ch02_slice03_dg_cashier_morning.mp4", 0.15),
    ("dollar_general_ms.mp4", 60.0, 5.5, "ch02_slice04_dg_aisle_cleaning.mp4", 0.15),
    ("dollar_general_ms.mp4", 110.0, 5.5, "ch02_slice05_dg_supplies_budget.mp4", 0.15),
    ("laurel_ms_drone.mp4", 35.0, 5.5, "ch02_slice06_laurel_downtown_residential.mp4", 0.0),
    ("laurel_ms_drone.mp4", 75.0, 5.5, "ch02_slice07_laurel_street_crossroads.mp4", 0.0),

    # ── CH 03: WHERE THEY SLEPT ──────────────────────────────────────────────
    ("chevy_malibu_pov.mp4", 15.0, 5.5, "ch03_slice01_malibu_dashboard_night.mp4", 0.0),
    ("chevy_malibu_pov.mp4", 55.0, 5.5, "ch03_slice02_malibu_driver_view_empty_road.mp4", 0.0),
    ("chevy_malibu_pov.mp4", 120.0, 5.5, "ch03_slice03_malibu_backseat_space.mp4", 0.0),
    ("chevy_malibu_pov.mp4", 180.0, 5.5, "ch03_slice04_malibu_center_console.mp4", 0.0),
    ("storm_camping_tiny_car.mp4", 20.0, 5.5, "ch03_slice05_car_window_freezing_fog.mp4", 0.10),
    ("storm_camping_tiny_car.mp4", 60.0, 5.5, "ch03_slice06_bundled_in_blankets.mp4", 0.10),
    ("storm_camping_tiny_car.mp4", 150.0, 5.5, "ch03_slice07_night_car_interior_glow.mp4", 0.10),
    ("storm_camping_tiny_car.mp4", 240.0, 5.5, "ch03_slice08_car_shelter_morning_light.mp4", 0.10),

    # ── CH 04: THE THINGS NOBODY BELIEVED ────────────────────────────────────
    ("laurel_ms_drone.mp4", 90.0, 5.5, "ch04_slice01_laurel_public_buildings.mp4", 0.0),
    ("laurel_ms_drone.mp4", 130.0, 5.5, "ch04_slice02_railroad_industrial_edge.mp4", 0.0),
    ("container_depot_yard.mp4", 10.0, 5.5, "ch04_slice03_depot_stacks_overview.mp4", 0.0),
    ("container_depot_yard.mp4", 35.0, 5.5, "ch04_slice04_depot_forklift_moving.mp4", 0.0),
    ("container_depot_yard.mp4", 60.0, 5.5, "ch04_slice05_depot_aged_containers.mp4", 0.0),

    # ── CH 05: THE BOX NOBODY WANTED ─────────────────────────────────────────
    ("port_gulfport_cranes.mp4", 8.0, 5.5, "ch05_slice01_gulfport_gantry_cranes.mp4", 0.0),
    ("port_gulfport_ship.mp4", 10.0, 5.5, "ch05_slice02_gulfport_cargo_dock.mp4", 0.0),
    ("used_container_inspection_andy.mp4", 15.0, 5.5, "ch05_slice03_inspecting_dented_panel.mp4", 0.12),
    ("used_container_inspection_andy.mp4", 45.0, 5.5, "ch05_slice04_checking_cargo_door_alignment.mp4", 0.12),
    ("used_container_inspection_andy.mp4", 85.0, 5.5, "ch05_slice05_examining_corner_casting.mp4", 0.12),
    ("used_container_inspection_andy.mp4", 130.0, 5.5, "ch05_slice06_checking_plywood_floor.mp4", 0.12),
    ("used_container_inspection_quick.mp4", 12.0, 5.5, "ch05_slice07_corrugated_wall_run.mp4", 0.0),
    ("used_container_inspection_quick.mp4", 35.0, 5.5, "ch05_slice08_roof_seam_check.mp4", 0.0),

    # ── CH 06: TWO ACRES AND A HANDSHAKE ─────────────────────────────────────
    ("jasper_county_farm_drone.mp4", 50.0, 5.5, "ch06_slice01_overgrown_pasture_timber.mp4", 0.0),
    ("jasper_county_farm_drone.mp4", 80.0, 5.5, "ch06_slice02_farm_driveway_trees.mp4", 0.0),
    ("jasper_county_farm_drone.mp4", 140.0, 5.5, "ch06_slice03_clearing_in_pine_forest.mp4", 0.0),
    ("container_delivery_20ft.mp4", 8.0, 5.5, "ch06_slice04_flatbed_with_20ft_box.mp4", 0.0),
    ("container_delivery_20ft.mp4", 25.0, 5.5, "ch06_slice05_truck_turning_dirt_road.mp4", 0.0),
    ("container_delivery_offload.mp4", 15.0, 5.5, "ch06_slice06_tilt_bed_hydraulic_lift.mp4", 0.0),
    ("container_delivery_offload.mp4", 40.0, 5.5, "ch06_slice07_container_sliding_to_ground.mp4", 0.0),
    ("container_delivery_offload.mp4", 70.0, 5.5, "ch06_slice08_container_landing_clay.mp4", 0.0),

    # ── CH 07: THE SOUND OF A GRINDER ────────────────────────────────────────
    ("window_angle_grind_cut.mp4", 3.0, 5.5, "ch07_slice01_marking_cut_chalk.mp4", 0.0),
    ("window_angle_grind_cut.mp4", 18.0, 5.5, "ch07_slice02_grinder_plunge_cut.mp4", 0.0),
    ("window_angle_grind_cut.mp4", 35.0, 5.5, "ch07_slice03_cutting_vertical_seam.mp4", 0.0),
    ("container_cutting_stages.mp4", 10.0, 5.5, "ch07_slice04_cutting_rough_window_opening.mp4", 0.0),
    ("container_cutting_stages.mp4", 28.0, 5.5, "ch07_slice05_steel_cutout_drop.mp4", 0.0),
    ("habitat_restore_doors.mp4", 20.0, 5.5, "ch07_slice06_restore_exterior_doors_row.mp4", 0.0),
    ("habitat_restore_doors.mp4", 65.0, 5.5, "ch07_slice07_restore_aisle_hardware.mp4", 0.0),
    ("habitat_restore_doors.mp4", 120.0, 5.5, "ch07_slice08_restore_loading_door.mp4", 0.0),
    ("container_door_frame_hand.mp4", 25.0, 5.5, "ch07_slice09_framing_door_opening_steel.mp4", 0.10),
    ("container_door_frame_hand.mp4", 70.0, 5.5, "ch07_slice10_square_tubing_weld.mp4", 0.10),
    ("container_install_door_guide.mp4", 30.0, 5.5, "ch07_slice11_mounting_exterior_door.mp4", 0.10),
    ("container_install_door_guide.mp4", 85.0, 5.5, "ch07_slice12_door_latch_test.mp4", 0.10),

    # ── CH 08: WHAT CONTRACTORS THROW AWAY ───────────────────────────────────
    ("touch_n_foam_can_app.mp4", 10.0, 5.5, "ch08_slice01_straw_nozzle_foam_spray.mp4", 0.0),
    ("touch_n_foam_can_app.mp4", 35.0, 5.5, "ch08_slice02_expanding_foam_gap_seal.mp4", 0.0),
    ("touch_n_foam_pro_kit.mp4", 15.0, 5.5, "ch08_slice03_pro_spray_nozzle_wall.mp4", 0.0),
    ("touch_n_foam_pro_kit.mp4", 40.0, 5.5, "ch08_slice04_foam_insulation_depth.mp4", 0.0),
    ("container_vapor_barrier_guide.mp4", 20.0, 5.5, "ch08_slice05_vapor_barrier_sheeting_roll.mp4", 0.10),
    ("container_vapor_barrier_guide.mp4", 65.0, 5.5, "ch08_slice06_stapling_plastic_over_studs.mp4", 0.10),
    ("container_vapor_barrier_guide.mp4", 110.0, 5.5, "ch08_slice07_taping_vapor_barrier_seams.mp4", 0.10),
    ("container_vapor_barrier_guide.mp4", 160.0, 5.5, "ch08_slice08_insulation_stud_bay_overview.mp4", 0.10),
    ("pallet_walls_tiny_home.mp4", 25.0, 5.5, "ch08_slice09_pallet_wood_disassembly.mp4", 0.10),
    ("pallet_walls_tiny_home.mp4", 65.0, 5.5, "ch08_slice10_nailing_planks_to_wall.mp4", 0.10),
    ("pallet_walls_tiny_home.mp4", 120.0, 5.5, "ch08_slice11_finished_pallet_wood_corner.mp4", 0.10),

    # ── CH 09: THE PANELS BEHIND THE WAREHOUSE ───────────────────────────────
    ("diy_solar_car_battery_setup.mp4", 15.0, 5.5, "ch09_slice01_testing_solar_panel_sun.mp4", 0.10),
    ("diy_solar_car_battery_setup.mp4", 45.0, 5.5, "ch09_slice02_wiring_charge_controller.mp4", 0.10),
    ("diy_solar_car_battery_setup.mp4", 80.0, 5.5, "ch09_slice03_car_battery_bank_connections.mp4", 0.10),
    ("diy_solar_car_battery_setup.mp4", 120.0, 5.5, "ch09_slice04_charge_controller_screen.mp4", 0.10),
    ("diy_solar_car_battery_setup.mp4", 160.0, 5.5, "ch09_slice05_12v_fan_led_switch_on.mp4", 0.10),
    ("rainwater_55gal_drum_setup.mp4", 10.0, 5.5, "ch09_slice06_blue_55gal_barrel_overview.mp4", 0.0),
    ("rainwater_55gal_drum_setup.mp4", 40.0, 5.5, "ch09_slice07_downspout_diverter_connection.mp4", 0.0),
    ("rainwater_55gal_drum_setup.mp4", 75.0, 5.5, "ch09_slice08_water_spigot_flow.mp4", 0.0),
    ("coleman_camp_stove_demo.mp4", 15.0, 5.5, "ch09_slice09_connecting_propane_bottle.mp4", 0.0),
    ("coleman_camp_stove_demo.mp4", 40.0, 5.5, "ch09_slice10_striking_match_burner.mp4", 0.0),
    ("coleman_camp_stove_demo.mp4", 75.0, 5.5, "ch09_slice11_simmering_pot_on_stove.mp4", 0.0),

    # ── CH 10: WHAT WAS BEHIND THE DOOR ──────────────────────────────────────
    ("wilson_container_interior_tour.mp4", 10.0, 5.5, "ch10_slice01_interior_living_wide.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 35.0, 5.5, "ch10_slice02_compact_kitchenette_counter.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 60.0, 5.5, "ch10_slice03_folding_chairs_dining.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 90.0, 5.5, "ch10_slice04_curtain_divider_pass.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 120.0, 5.5, "ch10_slice05_platform_pallet_bed.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 150.0, 5.5, "ch10_slice06_study_desk_corner.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 180.0, 5.5, "ch10_slice07_hooks_tools_inside_door.mp4", 0.0),
    ("cinder_block_raised_garden.mp4", 20.0, 5.5, "ch10_slice08_cinder_block_bed_layout.mp4", 0.0),
    ("cinder_block_raised_garden.mp4", 65.0, 5.5, "ch10_slice09_soil_filling_planter.mp4", 0.0),
    ("cinder_block_raised_garden.mp4", 120.0, 5.5, "ch10_slice10_vegetable_plants_thriving.mp4", 0.0),

    # ── CH 11: THE QUESTION SHE NEVER ASKED ──────────────────────────────────
    ("mississippi_8k_scenic.mp4", 10.0, 5.5, "ch11_slice01_deep_south_rural_panorama.mp4", 0.0),
    ("mississippi_8k_scenic.mp4", 40.0, 5.5, "ch11_slice02_mist_over_southern_woods.mp4", 0.0),
    ("mississippi_8k_scenic.mp4", 70.0, 5.5, "ch11_slice03_isolated_homestead_clearing.mp4", 0.0),
    ("jasper_county_farm_drone.mp4", 120.0, 5.5, "ch11_slice04_red_clay_road_dusk.mp4", 0.0),
    ("jasper_county_farm_drone.mp4", 150.0, 5.5, "ch11_slice05_golden_light_farm_trees.mp4", 0.0),
    ("wilson_container_interior_tour.mp4", 210.0, 5.5, "ch11_slice06_glowing_window_in_dark.mp4", 0.0)
]

print(f"=== SLICING {len(SLICES)} AUTHENTIC TARGET CLIPS DIRECTLY TO CFR 30.00 FPS / 1s GOP ===")

def process_slice(item):
    src_name, start_sec, dur_sec, out_name, crop_b = item
    src_file = os.path.join(SOURCES_DIR, src_name)
    out_file = os.path.join(OUT_DIR, out_name)

    if os.path.exists(out_file) and os.path.getsize(out_file) > 50000:
        return out_name, "skipped"

    if not os.path.exists(src_file):
        return out_name, f"source missing: {src_name}"

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
        if os.path.exists(out_file) and os.path.getsize(out_file) > 50000:
            return out_name, "success"
        else:
            return out_name, "empty"
    except Exception as e:
        return out_name, f"error: {e}"

with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(process_slice, SLICES))

success = sum(1 for _, s in results if s in ["success", "skipped"])
print(f"\nSlicing Complete: {success}/{len(SLICES)} slices in {OUT_DIR}")
