import os
import sys
import subprocess
from get_clip import slice_video, fetch_pexels_video

# Chapter 2 Clips
ch02_tasks = [
    {"type": "pexels", "query": "ambulance emergency vehicle", "dur": 5.8, "output": "uploads/raw/proj_ambulance/stock/ch02_beat00_ambulance_vehicle.mp4"},
    {"type": "slice", "source": "govdeals", "start": 30.0, "dur": 5.4, "output": "uploads/raw/proj_ambulance/slices/ch02_beat01_govdeals_box.mp4"},
    {"type": "pexels", "query": "truck chassis heavy duty", "dur": 3.6, "output": "uploads/raw/proj_ambulance/stock/ch02_beat02_truck_chassis.mp4"},
    {"type": "slice", "source": "cheaprv", "start": 18.0, "dur": 6.0, "output": "uploads/raw/proj_ambulance/slices/ch02_beat03_cheaprv_profile.mp4"},
    {"type": "pexels", "query": "paramedic working ambulance", "dur": 5.5, "output": "uploads/raw/proj_ambulance/stock/ch02_beat04_paramedic_module.mp4"},
    {"type": "slice", "source": "ben_emily", "start": 948.0, "dur": 5.2, "output": "uploads/raw/proj_ambulance/slices/ch02_beat05_benemily_insulation.mp4"},
    {"type": "pexels", "query": "metal construction floor heavy", "dur": 5.3, "output": "uploads/raw/proj_ambulance/stock/ch02_beat06_reinforced_floor.mp4"},
    {"type": "slice", "source": "ben_emily", "start": 598.0, "dur": 7.2, "output": "uploads/raw/proj_ambulance/slices/ch02_beat07_benemily_electrical.mp4"},
    {"type": "pexels", "query": "hospital emergency bay ambulance", "dur": 7.0, "output": "uploads/raw/proj_ambulance/stock/ch02_beat08_hospital_bay.mp4"},
    {"type": "slice", "source": "govdeals", "start": 2.0, "dur": 4.5, "output": "uploads/raw/proj_ambulance/slices/ch02_beat09_govdeals_alternator.mp4"},
    {"type": "slice", "source": "cheaprv", "start": 618.0, "dur": 8.3, "output": "uploads/raw/proj_ambulance/slices/ch02_beat10_cheaprv_shorepower.mp4"},
    {"type": "pexels", "query": "man working tools inside van", "dur": 8.6, "output": "uploads/raw/proj_ambulance/stock/ch02_beat11_van_conversion.mp4"},
    {"type": "slice", "source": "ben_emily", "start": 942.0, "dur": 6.1, "output": "uploads/raw/proj_ambulance/slices/ch02_beat12_benemily_wiring.mp4"},
    {"type": "slice", "source": "govdeals", "start": 12.0, "dur": 8.3, "output": "uploads/raw/proj_ambulance/slices/ch02_beat13_govdeals_compartments.mp4"},
    {"type": "pexels", "query": "camping equipment tools storage", "dur": 7.8, "output": "uploads/raw/proj_ambulance/stock/ch02_beat14_outdoor_storage.mp4"},
    {"type": "slice", "source": "ben_emily", "start": 308.0, "dur": 5.9, "output": "uploads/raw/proj_ambulance/slices/ch02_beat15_benemily_ceiling_handles.mp4"},
    {"type": "pexels", "query": "senior man thoughtful resting inside", "dur": 5.01, "output": "uploads/raw/proj_ambulance/stock/ch02_beat16_senior_man_cabin.mp4"},
]

# Chapter 3 Clips
ch03_tasks = [
    {"type": "slice", "source": "govdeals", "start": 50.0, "dur": 5.0, "output": "uploads/raw/proj_ambulance/slices/ch03_beat00_govdeals_yard.mp4"},
    {"type": "pexels", "query": "fire station truck bay", "dur": 7.8, "output": "uploads/raw/proj_ambulance/stock/ch03_beat01_fire_district.mp4"},
    {"type": "slice", "source": "cheaprv", "start": 24.0, "dur": 7.0, "output": "uploads/raw/proj_ambulance/slices/ch03_beat02_cheaprv_wheels.mp4"},
    {"type": "pexels", "query": "person typing laptop bidding online", "dur": 6.5, "output": "uploads/raw/proj_ambulance/stock/ch03_beat03_auction_site.mp4"},
    {"type": "slice", "source": "govdeals", "start": 34.0, "dur": 7.1, "output": "uploads/raw/proj_ambulance/slices/ch03_beat04_govdeals_rear.mp4"},
    {"type": "pexels", "query": "car speedometer dashboard mileage", "dur": 6.4, "output": "uploads/raw/proj_ambulance/stock/ch03_beat05_odometer.mp4"},
    {"type": "slice", "source": "cheaprv", "start": 108.0, "dur": 6.6, "output": "uploads/raw/proj_ambulance/slices/ch03_beat06_cheaprv_cab.mp4"},
    {"type": "pexels", "query": "diesel truck engine running", "dur": 6.6, "output": "uploads/raw/proj_ambulance/stock/ch03_beat07_diesel_engine.mp4"},
    {"type": "slice", "source": "govdeals", "start": 0.0, "dur": 10.2, "output": "uploads/raw/proj_ambulance/slices/ch03_beat08_govdeals_diesel_hood.mp4"},
    {"type": "pexels", "query": "mechanic checklist clipboard inspection", "dur": 8.6, "output": "uploads/raw/proj_ambulance/stock/ch03_beat09_maintenance_sheet.mp4"},
    {"type": "slice", "source": "ben_emily", "start": 10.0, "dur": 10.6, "output": "uploads/raw/proj_ambulance/slices/ch03_beat10_benemily_striping.mp4"},
    {"type": "slice", "source": "cheaprv", "start": 12.0, "dur": 7.1, "output": "uploads/raw/proj_ambulance/slices/ch03_beat11_cheaprv_ford_amb.mp4"},
    {"type": "pexels", "query": "senior man standing outside thoughtful winter", "dur": 6.35, "output": "uploads/raw/proj_ambulance/stock/ch03_beat12_dale_portrait.mp4"},
]

def process_tasks(tasks, ch_name):
    print(f"\n==================== PROCESSING {ch_name} ====================")
    for idx, t in enumerate(tasks):
        out = t["output"]
        if os.path.exists(out) and os.path.getsize(out) > 1000:
            print(f"[{idx}] Already exists: {out}")
            continue
            
        print(f"[{idx}] Generating {t['type']} -> {out}...")
        if t["type"] == "slice":
            slice_video(t["source"], t["start"], t["dur"], out)
        elif t["type"] == "pexels":
            ok = fetch_pexels_video(t["query"], out)
            if not ok:
                # Fallback query
                simple_q = t["query"].split()[0]
                print(f"  Retrying with simple query: {simple_q}")
                fetch_pexels_video(simple_q, out)

process_tasks(ch02_tasks, "CHAPTER 2")
process_tasks(ch03_tasks, "CHAPTER 3")
print("\nAll tasks finished successfully!")
