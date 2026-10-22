import os
import sys
import json
import subprocess
from stage_helpers import slice_video, fetch_pexels_video

AUDIO_PATH = "C:/Users/karth/Documents/BlokeTuber/uploads/audio/ambulance/5 - A DAY INSIDE.mp3"
TIMELINE_OUT = os.path.abspath("uploads/timelines/ambulance/chapter_05_final.json")
SNAPSHOT_DIR = os.path.abspath("uploads/beat_snapshots/ambulance_ch05")
os.makedirs(SNAPSHOT_DIR, exist_ok=True)
os.makedirs(os.path.dirname(TIMELINE_OUT), exist_ok=True)

# Probe audio duration
probe_audio = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', AUDIO_PATH])
total_duration = float(json.loads(probe_audio)['format']['duration'])
print(f"Master Audio Duration: {total_duration:.3f}s")

# Chapter 5 beats definition (38 beats)
beats_config = [
    {
        "beatIndex": 0,
        "text": "So what does a day in one of these actually look like?",
        "startTime": 0.0,
        "endTime": 3.18,
        "mode": "slice",
        "source": "cheaprv",
        "start": 120.0,
        "duration": 6.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch05_beat00_day_inside_overview.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "06:00 AM • MORNING ROUTINE",
            "line2": "LIFE INSIDE RETIRED RIG",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 1,
        "text": "Dale's alarm clock is not a clock.",
        "startTime": 3.18,
        "endTime": 5.78,
        "mode": "pexels",
        "query": ["digital alarm clock morning", "vintage alarm clock morning light", "alarm clock bedroom morning"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat01_alarm_clock.mp4")
    },
    {
        "beatIndex": 2,
        "text": "It's an arrangement.",
        "startTime": 5.78,
        "endTime": 7.50,
        "mode": "pexels",
        "query": ["church building dawn silhouette", "church exterior morning sunlight", "gravel lot sunrise fence"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat02_church_lot_silhouette.mp4")
    },
    {
        "beatIndex": 3,
        "text": "The church's maintenance man arrives at 6.30.",
        "startTime": 7.50,
        "endTime": 11.20,
        "mode": "pexels",
        "query": ["pickup truck headlights morning dawn", "truck driving into gravel lot morning", "truck headlights dark parking lot"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat03_pickup_headlights_morning.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "06:30 AM • LOT MAINTENANCE",
            "line2": "SCHEDULED ARRIVAL WINDOW",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 4,
        "text": "Dale is gone by 7.30 every day without being asked twice.",
        "startTime": 11.20,
        "endTime": 16.80,
        "mode": "slice",
        "source": "cheaprv",
        "start": 680.0,
        "duration": 8.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch05_beat04_ambulance_departing_lot.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "07:30 AM DEPARTURE DEADLINE",
            "line2": "ZERO-EXCEPTION SAFE LOT RULE",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 5,
        "text": "That is the entire deal and it's the first rule",
        "startTime": 16.80,
        "endTime": 20.26,
        "mode": "pexels",
        "query": ["morning highway asphalt driving road", "empty highway morning light", "highway pavement road travel"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat05_morning_highway.mp4")
    },
    {
        "beatIndex": 6,
        "text": "anyone living in a vehicle learns.",
        "startTime": 20.26,
        "endTime": 22.50,
        "mode": "pexels",
        "query": ["hands steering wheel morning drive", "steering wheel car driving hands", "driver hands wheel road"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat06_hands_steering_wheel.mp4")
    },
    {
        "beatIndex": 7,
        "text": "You leave before you're noticed.",
        "startTime": 22.50,
        "endTime": 24.60,
        "mode": "pexels",
        "query": ["empty parking space gravel lot", "empty parking lot asphalt morning", "empty street dawn"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat07_empty_gravel_lot.mp4")
    },
    {
        "beatIndex": 8,
        "text": "Because getting noticed is what starts the paperwork",
        "startTime": 24.60,
        "endTime": 27.48,
        "mode": "pexels",
        "query": ["police car lights flashing city", "police lights dark night street", "parking enforcement ticket clipboard"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat08_parking_paperwork.mp4")
    },
    {
        "beatIndex": 9,
        "text": "that ends with your home on the back of a tow truck.",
        "startTime": 27.48,
        "endTime": 30.60,
        "mode": "pexels",
        "query": ["tow truck hauling vehicle street", "flatbed tow truck towing car", "tow truck highway driving"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat09_tow_truck.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "IMPOUND PROTOCOLS",
            "line2": "THE 72-HOUR STREET LIMIT",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 10,
        "text": "Water rides in two five gallon jugs in the outside compartment.",
        "startTime": 30.60,
        "endTime": 34.80,
        "mode": "slice",
        "source": "govdeals",
        "start": 14.0,
        "duration": 8.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch05_beat10_outside_water_compartment.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "POTABLE WATER STORAGE",
            "line2": "2X 5-GALLON CONTAINERS",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 11,
        "text": "He fills them at a spigot behind a hardware store,",
        "startTime": 34.80,
        "endTime": 38.10,
        "mode": "pexels",
        "query": ["filling water container outdoor spigot tap", "outdoor water faucet hose garden", "running water tap outdoor filling bottle"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat11_water_spigot_filling.mp4")
    },
    {
        "beatIndex": 12,
        "text": "where the owner told him plainly that he doesn't mind",
        "startTime": 38.10,
        "endTime": 41.00,
        "mode": "pexels",
        "query": ["hardware store exterior storefront lumber", "small business storefront street", "workshop owner tool shop"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat12_hardware_store_exterior.mp4")
    },
    {
        "beatIndex": 13,
        "text": "as long as nobody else finds out.",
        "startTime": 41.00,
        "endTime": 43.30,
        "mode": "pexels",
        "query": ["screwing cap bottle water jug", "hand closing water container lid", "plastic container lid water"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat13_tightening_water_cap.mp4")
    },
    {
        "beatIndex": 14,
        "text": "Washing is the harder problem.",
        "startTime": 43.30,
        "endTime": 45.60,
        "mode": "pexels",
        "query": ["frost window condensation winter cold", "steamy glass window water droplets", "winter frost ice window"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat14_winter_window_frost.mp4")
    },
    {
        "beatIndex": 15,
        "text": "And the answer for most people in vehicles",
        "startTime": 45.60,
        "endTime": 47.94,
        "mode": "pexels",
        "query": ["commercial gym exterior building entrance", "gym entrance fitness center building", "fitness club building outside"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat15_commercial_gym_exterior.mp4")
    },
    {
        "beatIndex": 16,
        "text": "turns out to be a gym membership.",
        "startTime": 47.94,
        "endTime": 50.40,
        "mode": "pexels",
        "query": ["card scan electronic turnstile gym", "credit card key fob scanner entrance", "scanning access card door entrance"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat16_gym_membership_card.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "GYM SUBSCRIPTION: $20/MO",
            "line2": "ESSENTIAL HYGIENE INFRASTRUCTURE",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 17,
        "text": "$20 a month buys a hot shower every morning",
        "startTime": 50.40,
        "endTime": 53.90,
        "mode": "pexels",
        "query": ["hot shower water running steam tile", "shower head spraying water steam", "running water shower bathroom"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat17_hot_shower_steam.mp4")
    },
    {
        "beatIndex": 18,
        "text": "in a heated building with a locking door.",
        "startTime": 53.90,
        "endTime": 56.60,
        "mode": "pexels",
        "query": ["locker room door closing lock", "lock turning metal door handle", "closed door lock security"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat18_locking_door_heated.mp4")
    },
    {
        "beatIndex": 19,
        "text": "People who've lived in tents will tell you",
        "startTime": 56.60,
        "endTime": 59.14,
        "mode": "pexels",
        "query": ["tents camping rain cold woods", "homeless tent wet ground rain", "tarp tent rain dripping forest"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat19_tents_wet_woods.mp4")
    },
    {
        "beatIndex": 20,
        "text": "it's the single most valuable subscription in their lives.",
        "startTime": 59.14,
        "endTime": 63.00,
        "mode": "pexels",
        "query": ["holding hot coffee thermos steam morning", "steaming coffee cup winter hands", "thermos mug steaming coffee"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat20_coffee_thermos_steam.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CABIN TEMP: 61°F (OUTSIDE: 14°F)",
            "line2": "HEATED COMPARTMENT LIVING",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 21,
        "text": "Breakfast happens on a full-down shelf",
        "startTime": 63.00,
        "endTime": 65.56,
        "mode": "slice",
        "source": "cheaprv",
        "start": 342.0,
        "duration": 6.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch05_beat21_fold_down_shelf.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "FOLD-DOWN GALLEY SHELF",
            "line2": "COMPACT MORNING PREP STATION",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 22,
        "text": "with a butane burner and the back doors cracked",
        "startTime": 65.56,
        "endTime": 68.10,
        "mode": "pexels",
        "query": ["camping stove blue flame burner", "gas stove burner flame blue cooking", "small gas stove burner flame"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat22_butane_burner_flame.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "SINGLE-BURNER PROPANE STOVE",
            "line2": "VENTILATED COOKING WORKSPACE",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 23,
        "text": "six inches for air.",
        "startTime": 68.10,
        "endTime": 70.00,
        "mode": "slice",
        "source": "govdeals",
        "start": 26.0,
        "duration": 6.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch05_beat23_rear_doors_cracked.mp4")
    },
    {
        "beatIndex": 24,
        "text": "Then the middle of the day is errands",
        "startTime": 70.00,
        "endTime": 72.22,
        "mode": "pexels",
        "query": ["city street driving car window", "urban traffic street daytime driving", "downtown driving traffic"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat24_city_driving_errands.mp4")
    },
    {
        "beatIndex": 25,
        "text": "that take four times longer than they should.",
        "startTime": 72.22,
        "endTime": 74.60,
        "mode": "pexels",
        "query": ["traffic jam cars waiting rain", "car windshield wipers traffic rain", "cars waiting intersection traffic"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat25_traffic_waiting_delay.mp4")
    },
    {
        "beatIndex": 26,
        "text": "The VA appointment across town, the pharmacy,",
        "startTime": 74.60,
        "endTime": 78.40,
        "mode": "pexels",
        "query": ["pharmacy medicine bottle counter", "prescription pills bottle pharmacy", "medical clinic entrance hospital sign"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat26_va_pharmacy_building.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "VA MEDICAL CENTER",
            "line2": "OUTPATIENT CLINIC & PHARMACY",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 27,
        "text": "the county office that closes at four.",
        "startTime": 78.40,
        "endTime": 81.10,
        "mode": "pexels",
        "query": ["city hall government office building", "clock wall office 4 oclock", "public administrative building exterior"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat27_county_office_clock.mp4")
    },
    {
        "beatIndex": 28,
        "text": "But his phone charges off the alternator while he drives",
        "startTime": 81.10,
        "endTime": 84.60,
        "mode": "pexels",
        "query": ["smartphone charging cable car dashboard", "phone plugged in usb car", "phone screen charging cable"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat28_phone_charging_dash.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "BATTERY BANK VOLTAGE: 12.8V",
            "line2": "DUAL-ALTERNATOR HIGH OUTPUT BUS",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 29,
        "text": "because an ambulance was built to power a cardiac monitor",
        "startTime": 84.60,
        "endTime": 88.36,
        "mode": "slice",
        "source": "cheaprv",
        "start": 400.0,
        "duration": 7.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch05_beat29_cardiac_electrical_panel.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CARDIAC MONITOR CIRCUIT",
            "line2": "FACTORY 1,000W INVERTER BUS",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 30,
        "text": "and a phone is nothing.",
        "startTime": 88.36,
        "endTime": 90.40,
        "mode": "pexels",
        "query": ["smartphone battery icon 100 percent screen", "phone battery full charged screen", "charging mobile phone screen"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat30_phone_full_battery.mp4")
    },
    {
        "beatIndex": 31,
        "text": "So he's not the man in the library chair",
        "startTime": 90.40,
        "endTime": 92.90,
        "mode": "pexels",
        "query": ["man sitting library reading alone", "public library interior books shelves", "person sitting quiet library"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat31_man_library_chair.mp4")
    },
    {
        "beatIndex": 32,
        "text": "waiting two hours for a wall outlet.",
        "startTime": 92.90,
        "endTime": 95.60,
        "mode": "pexels",
        "query": ["wall electrical outlet charger plugs", "phone plugged in wall socket floor", "power strip wall outlet cords"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat32_public_wall_outlet.mp4")
    },
    {
        "beatIndex": 33,
        "text": "And he doesn't have to choose between the appointment",
        "startTime": 95.60,
        "endTime": 98.34,
        "mode": "pexels",
        "query": ["medical clipboard appointment paperwork doctor", "doctor clipboard medical form checkup", "medical waiting room paperwork clipboard"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat33_appointment_clipboard.mp4")
    },
    {
        "beatIndex": 34,
        "text": "and guarding what he owns.",
        "startTime": 98.34,
        "endTime": 100.30,
        "mode": "pexels",
        "query": ["heavy padlock key metal gate", "padlock locked door security", "key unlocking padlock heavy duty"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat34_guarding_belongings.mp4")
    },
    {
        "beatIndex": 35,
        "text": "Because what he owns is behind a locked steel door",
        "startTime": 100.30,
        "endTime": 103.78,
        "mode": "slice",
        "source": "govdeals",
        "start": 17.0,
        "duration": 7.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch05_beat35_locked_steel_door.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "REINFORCED STEEL CABIN",
            "line2": "AUTOMOTIVE DEADBOLTS & KEYED ACCESS",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 36,
        "text": "in a lot he can see from the waiting room window,",
        "startTime": 103.78,
        "endTime": 106.80,
        "mode": "pexels",
        "query": ["hospital waiting room window looking parking lot", "looking out window office parking lot", "window view parking lot cars"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat36_waiting_room_window.mp4")
    },
    {
        "beatIndex": 37,
        "text": "which brings us to the night.",
        "startTime": 106.80,
        "endTime": total_duration,
        "mode": "pexels",
        "query": ["winter twilight city snowy evening", "snowy parking lot dusk street lights", "winter sunset city buildings dusk"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch05_beat37_twilight_nightfall.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "SPOKANE, WA • 07:00 PM",
            "line2": "TRANSITION TO NIGHT PROTOCOLS",
            "themeColor": "gold"
        }
    }
]

# Fetch or slice all clips
for beat in beats_config:
    bidx = beat["beatIndex"]
    cpath = beat["clipPath"]
    dur = beat["endTime"] - beat["startTime"]
    print(f"\n--- Staging Ch05 Beat {bidx:02d} ({dur:.2f}s) ---")
    if beat["mode"] == "slice":
        slice_video(beat["source"], beat["start"], beat["duration"], cpath)
    elif beat["mode"] == "pexels":
        fetch_pexels_video(beat["query"], cpath, min_duration=int(dur + 4))
        
    # Extract snapshot
    snapshot_path = os.path.join(SNAPSHOT_DIR, f"beat_{bidx:02d}.jpg")
    cmd = ["ffmpeg", "-y", "-ss", "1.0", "-i", cpath, "-vframes", "1", "-q:v", "3", snapshot_path]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Beat {bidx:02d} snapshot -> {snapshot_path}")

# Construct final timeline JSON
final_clips = []
for beat in beats_config:
    dur = round(beat["endTime"] - beat["startTime"], 3)
    c = {
        "beatIndex": beat["beatIndex"],
        "chapterIndex": 5,
        "text": beat["text"],
        "startTime": round(beat["startTime"], 3),
        "endTime": round(beat["endTime"], 3),
        "duration": dur,
        "clipPath": beat["clipPath"],
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    }
    if "callout" in beat:
        c["callout"] = beat["callout"]
    final_clips.append(c)

timeline_data = {
    "masterAudioPath": AUDIO_PATH,
    "totalDuration": total_duration,
    "clips": final_clips
}

with open(TIMELINE_OUT, "w", encoding="utf-8") as f:
    json.dump(timeline_data, f, indent=2)

print(f"\nChapter 5 timeline saved to: {TIMELINE_OUT}")
