import os
import subprocess
import json
import urllib.request
import urllib.parse

from get_clip import fetch_pexels_video

stock_requests = [
    # Chapter 10
    ("ch10_beat00_safe_parking_lot.mp4", "parking lot night cars"),
    ("ch10_beat02_security_gate_closing.mp4", "fence gate dusk"),
    ("ch10_beat04_community_evening_walk.mp4", "peaceful neighborhood dusk"),
    ("ch10_beat06_mutual_aid_warmth.mp4", "people helping community sunset"),
    ("ch10_beat08_city_bus_interview.mp4", "city bus transit stop"),
    ("ch10_beat10_lot_morning_sunrise.mp4", "sunrise over parking lot"),
    
    # Chapter 11
    ("ch11_beat02_peaceful_sleep_morning.mp4", "man sleeping peacefully bed"),
    ("ch11_beat03_veteran_paperwork_va.mp4", "documents paperwork desk signing"),
    ("ch11_beat05_horizon_hope.mp4", "highway road horizon sunrise"),
    
    # Chapter 12
    ("ch12_beat00_frozen_windshields_morning.mp4", "ice windshield car winter"),
    ("ch12_beat03_hot_coffee_winter.mp4", "steaming coffee cup morning"),
    ("ch12_beat06_veteran_awake_sunrise.mp4", "older man smiling sunrise"),
    ("ch12_beat08_blueprint_manual.mp4", "architectural blueprints desk"),
    ("ch12_beat09_laptop_screen_link.mp4", "laptop typing hands desk"),
    ("ch12_beat11_people_helping_community.mp4", "helping hands kindness community"),
    ("ch12_beat12_open_highway_sunrise.mp4", "driving highway into sunrise")
]

os.makedirs("uploads/raw/proj_ambulance/stock", exist_ok=True)

for filename, query in stock_requests:
    out_path = os.path.join("uploads/raw/proj_ambulance/stock", filename)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 100000:
        print(f"Already exists: {filename}")
        continue
    print(f"Fetching: {filename} query='{query}'...")
    success = fetch_pexels_video(query, out_path)
    if not success:
        # fallback query
        fallback_query = query.split()[0]
        print(f"Retrying with fallback query: '{fallback_query}'...")
        fetch_pexels_video(fallback_query, out_path)

print("Stock fetch completed.")
