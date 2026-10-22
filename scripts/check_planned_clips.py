import os

ch01_clips = [
    ("stock/stock_frost_morning.mp4", "frost morning"),
    ("slices/bridges_urban_sidewalk_campers.mp4", "sidewalk campers"),
    ("stock/stock_bridge_overpass.mp4", "bridge overpass"),
    ("slices/elkins_white_breadloaf_exterior.mp4", "white breadloaf exterior"),
    ("slices/drew_towing_down_road.mp4", "towing down road"),
    ("stock/stock_freezing_rain.mp4", "freezing rain"),
    ("slices/elkins_cozy_interior_bed.mp4", "cozy bed"),
    ("slices/bridges_door_lock_privacy.mp4", "door lock"),
    ("stock/stock_warm_sleep.mp4", "warm sleep"),
    ("stock/stock_fire_flame_stove.mp4", "flame stove"),
    ("slices/elkins_folddown_counter_stove.mp4", "counter stove"),
    ("slices/kirsten_skylight_vent_detail.mp4", "skylight vent"),
    ("stock/stock_dollar_cash.mp4", "dollar cash"),
    ("stock/stock_nyc_steam_vent.mp4", "steam vent cold"),
    ("slices/bridges_winter_weather_protection.mp4", "winter weather"),
    ("stock/stock_deep_sleep_dream.mp4", "deep sleep"),
]

ch02_clips = [
    ("stock/stock_dollar_cash.mp4", "dollar cash"),
    ("slices/elkins_towing_bike_field.mp4", "towing field"),
    ("stock/stock_cyclist_pedaling.mp4", "cyclist pedaling"),
    ("slices/kirsten_arch_wall_strength_press.mp4", "arch wall strength"),
    ("stock/stock_engineer_drafting.mp4", "engineer drafting"),
    ("slices/elkins_barrel_bolt_latched.mp4", "barrel bolt latched"),
    ("stock/stock_window_condensation.mp4", "window condensation"),
    ("slices/drew_fastening_exterior_panels.mp4", "fastening panels"),
    ("stock/stock_street_sweeper.mp4", "street sweeper"),
    ("slices/bridges_towing_away_sweep.mp4", "towing sweep"),
    ("stock/stock_sunrise_highway.mp4", "sunrise highway"),
    ("slices/kirsten_micro_camper_parked.mp4", "micro camper parked"),
    ("stock/stock_cyclist_pedaling.mp4", "cyclist pedaling"),
]

ch03_clips = [
    ("stock/stock_hardware_lumber.mp4", "hardware lumber"),
    ("slices/elkins_campaign_signs_coroplast.mp4", "campaign signs"),
    ("stock/stock_bike_wheel_roll.mp4", "bike wheel roll"),
    ("slices/elkins_pine_floor_frame.mp4", "pine floor frame"),
    ("slices/drew_fastening_exterior_panels.mp4", "fastening panels"),
    ("stock/stock_dollar_cash.mp4", "dollar cash"),
    ("slices/kirsten_micro_camper_parked.mp4", "micro camper parked"),
    ("slices/elkins_folddown_counter_stove.mp4", "counter stove"),
    ("stock/stock_engineer_drafting.mp4", "engineer drafting"),
    ("slices/bridges7_compact_interior_storage.mp4", "compact interior"),
    ("slices/elkins_plastic_tub_skylight.mp4", "plastic tub skylight"),
    ("stock/stock_utility_knife_cut.mp4", "utility knife cut"),
    ("slices/drew_door_frame_hinges.mp4", "door frame hinges"),
    ("slices/kirsten_swivel_reading_light.mp4", "reading light"),
    ("stock/stock_warm_sleep.mp4", "warm sleep"),
    ("slices/elkins_towing_bike_field.mp4", "towing field"),
]

ch04_clips = [
    ("slices/kirsten_aerodynamic_nose_front.mp4", "aerodynamic nose"),
    ("stock/stock_engineer_drafting.mp4", "engineer drafting"),
    ("slices/drew_curved_roof_assembly.mp4", "curved roof assembly"),
    ("slices/elkins_pine_floor_frame.mp4", "pine floor frame"),
    ("stock/stock_hardware_lumber.mp4", "hardware lumber"),
    ("slices/elkins_arcing_plastic_sheet.mp4", "arcing plastic sheet"),
    ("stock/stock_engineer_drafting.mp4", "engineer drafting"),
    ("slices/elkins_campaign_signs_coroplast.mp4", "campaign signs"),
    ("stock/stock_airplane_boeing.mp4", "airplane boeing"),
    ("slices/drew_jigsaw_cutting_curves.mp4", "jigsaw cutting"),
    ("slices/kirsten_arch_wall_strength_press.mp4", "arch wall strength"),
    ("stock/stock_stone_arch.mp4", "stone arch"),
    ("slices/elkins_arcing_plastic_sheet.mp4", "arcing plastic sheet"),
    ("stock/stock_bridge_overpass.mp4", "bridge overpass"),
    ("stock/stock_eggshell_curve.mp4", "eggshell curve"),
    ("stock/stock_desert_festival.mp4", "desert festival"),
    ("slices/drew_woodworking_framing.mp4", "woodworking framing"),
    ("stock/stock_hardware_lumber.mp4", "hardware lumber"),
    ("slices/bridges7_lightweight_wheels.mp4", "lightweight wheels"),
    ("slices/kirsten_towing_urban_street.mp4", "towing urban street"),
    ("stock/stock_cyclist_pedaling.mp4", "cyclist pedaling"),
    ("slices/kirsten_arch_wall_strength_press.mp4", "arch wall strength"),
    ("slices/elkins_resting_against_arched_wall.mp4", "resting against arched wall"),
]

for ch_idx, clist in [(1, ch01_clips), (2, ch02_clips), (3, ch03_clips), (4, ch04_clips)]:
    print(f"Chapter {ch_idx}: {len(clist)} clips")
    for rel_path, desc in clist:
        full = os.path.join("uploads/raw/proj_camperbike", rel_path)
        if not os.path.exists(full):
            print(f"  MISSING: {full}")
        else:
            print(f"  OK: {rel_path} ({desc})")
