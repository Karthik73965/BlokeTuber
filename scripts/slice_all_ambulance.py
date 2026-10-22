import os
from get_clip import slice_video

slices_to_generate = [
    # Chapter 10
    ("govdeals", 1.0, 7.08, "uploads/raw/proj_ambulance/slices/ch10_beat01_govdeals_overnight_lot.mp4"),
    ("cheaprv", 20.0, 6.10, "uploads/raw/proj_ambulance/slices/ch10_beat03_cheaprv_parked_side.mp4"),
    ("ben_emily", 650.0, 5.92, "uploads/raw/proj_ambulance/slices/ch10_beat05_benemily_driveway_conversion.mp4"),
    ("cheaprv", 180.0, 6.08, "uploads/raw/proj_ambulance/slices/ch10_beat07_cheaprv_power_cables.mp4"),
    ("govdeals", 20.0, 6.30, "uploads/raw/proj_ambulance/slices/ch10_beat09_govdeals_rig_doors.mp4"),
    
    # Chapter 11
    ("cheaprv", 30.0, 5.18, "uploads/raw/proj_ambulance/slices/ch11_beat00_cheaprv_sealed_compartment.mp4"),
    ("ben_emily", 225.0, 7.36, "uploads/raw/proj_ambulance/slices/ch11_beat01_benemily_dry_storage.mp4"),
    ("ben_emily", 125.0, 5.24, "uploads/raw/proj_ambulance/slices/ch11_beat04_benemily_charging_station.mp4"),
    ("govdeals", 32.0, 6.74, "uploads/raw/proj_ambulance/slices/ch11_beat06_govdeals_solid_chassis.mp4"),
    
    # Chapter 12
    ("cheaprv", 40.0, 1.68, "uploads/raw/proj_ambulance/slices/ch12_beat01_cheaprv_warm_clear_rig.mp4"),
    ("ben_emily", 50.0, 9.42, "uploads/raw/proj_ambulance/slices/ch12_beat02_benemily_ambulance_full_tour.mp4"),
    ("govdeals", 12.0, 6.06, "uploads/raw/proj_ambulance/slices/ch12_beat04_govdeals_ambulance_drive.mp4"),
    ("ben_emily", 80.0, 4.20, "uploads/raw/proj_ambulance/slices/ch12_beat05_benemily_shoebox_diesel_heater.mp4"),
    ("cheaprv", 45.0, 5.42, "uploads/raw/proj_ambulance/slices/ch12_beat07_cheaprv_solid_box_front.mp4"),
    ("ben_emily", 128.0, 5.42, "uploads/raw/proj_ambulance/slices/ch12_beat10_benemily_cozy_quarters.mp4"),
]

os.makedirs("uploads/raw/proj_ambulance/slices", exist_ok=True)

for source, start, duration, output in slices_to_generate:
    print(f"Slicing {source} [{start}s, {duration}s] -> {output}")
    slice_video(source, start, duration, output)

print("All slices generated successfully.")
