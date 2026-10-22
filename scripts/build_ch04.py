import os
import sys
import json
import subprocess
from stage_helpers import slice_video, fetch_pexels_video

AUDIO_PATH = "C:/Users/karth/Documents/BlokeTuber/uploads/audio/ambulance/4 - DALE.mp3"
TIMELINE_OUT = os.path.abspath("uploads/timelines/ambulance/chapter_04_final.json")
SNAPSHOT_DIR = os.path.abspath("uploads/beat_snapshots/ambulance_ch04")
os.makedirs(SNAPSHOT_DIR, exist_ok=True)
os.makedirs(os.path.dirname(TIMELINE_OUT), exist_ok=True)

# Probe audio duration
probe_audio = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', AUDIO_PATH])
total_duration = float(json.loads(probe_audio)['format']['duration'])
print(f"Master Audio Duration: {total_duration:.3f}s")

# Chapter 4 beats definition (22 beats)
beats_config = [
    {
        "beatIndex": 0,
        "text": "Dale served in the army in the 80s, then he spent 26 years in freight, loading docks,",
        "startTime": 0.0,
        "endTime": 6.2,
        "mode": "pexels",
        "query": ["forklift warehouse loading dock", "freight shipping logistics warehouse", "industrial warehouse worker"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat00_freight_loading_dock.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "ARMY VETERAN • 63 YEARS OLD",
            "line2": "26 YEARS IN FREIGHT LOGISTICS",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 1,
        "text": "dispatch, laid off at 58, then his wife got sick, the treatment took the savings,",
        "startTime": 6.2,
        "endTime": 12.6,
        "mode": "pexels",
        "query": ["hospital bills medicine desk", "prescription medication illness", "sad elderly medical bills"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat01_medical_savings.mp4")
    },
    {
        "beatIndex": 2,
        "text": "and then it took her anyway, then the apartment went. Here's what the news won't tell you.",
        "startTime": 12.6,
        "endTime": 18.7,
        "mode": "pexels",
        "query": ["empty apartment rain window", "eviction keys empty room", "rain falling city window"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat02_empty_apartment.mp4")
    },
    {
        "beatIndex": 3,
        "text": "Dale is exactly the profile of the fastest-growing group of homeless people in this country,",
        "startTime": 18.7,
        "endTime": 24.6,
        "mode": "pexels",
        "query": ["elderly man walking winter cold street", "homeless senior man winter city", "older man somber sidewalk winter"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat03_demographic_profile.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "DEMOGRAPHIC REALITY",
            "line2": "FASTEST GROWING HOMELESS PROFILE",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 4,
        "text": "and it is not young men on drugs. It's people over 55 with long work histories wiped out by one",
        "startTime": 24.6,
        "endTime": 32.04,
        "mode": "pexels",
        "query": ["senior man looking out window somber", "elderly worker hands working", "senior thoughtful portrait"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat04_older_workers.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "AGE DEMOGRAPHIC: 55+",
            "line2": "LONG WORK HISTORIES DISPLACED",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 5,
        "text": "medical event and one rent-increased landing in the same year. Dale spent three years in a car",
        "startTime": 32.04,
        "endTime": 38.14,
        "mode": "pexels",
        "query": ["sleeping in car winter cold", "car window fog night winter", "person cold in car blanket"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat05_sleeping_in_car.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "3 YEARS VEHICLE RESIDENT",
            "line2": "SURVIVING IN PASSENGER CAR",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 6,
        "text": "and then a tent. Twice, everything he owned went into the back of a city truck during an encampment sweep,",
        "startTime": 38.14,
        "endTime": 45.0,
        "mode": "pexels",
        "query": ["homeless tent encampment rain", "tents rainy urban woods", "garbage truck municipal city street"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat06_encampment_sweep.mp4")
    },
    {
        "beatIndex": 7,
        "text": "and one of those times it included his discharge paperwork. If you've ever tried to claim veterans",
        "startTime": 45.0,
        "endTime": 50.92,
        "mode": "pexels",
        "query": ["military paperwork document official form", "veteran paperwork desk stamps", "official document paperwork hands"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat07_discharge_paperwork.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "DD-214 DISCHARGE PAPERS",
            "line2": "LOST IN MUNICIPAL SWEEP",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 8,
        "text": "benefits without your DD214, you know exactly what losing that single piece of paper costs a man,",
        "startTime": 50.92,
        "endTime": 57.9,
        "mode": "pexels",
        "query": ["man waiting government office paperwork", "veteran waiting room somber", "bureaucracy stamped paperwork"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat08_va_bureaucracy.mp4")
    },
    {
        "beatIndex": 9,
        "text": "in time, in months, in hope. Then a church group and a retired diesel mechanic put him in a decommission",
        "startTime": 57.9,
        "endTime": 65.74,
        "mode": "pexels",
        "query": ["church exterior winter morning snow", "church building sunrise winter", "steeple church winter cold"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat09_church_assistance.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "SPOKANE, WASHINGTON",
            "line2": "CHURCH SAFE LOT INITIATIVE",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 10,
        "text": "ambulance they'd bought at auction. They spent two months converting it in a driveway,",
        "startTime": 65.74,
        "endTime": 70.9,
        "mode": "slice",
        "source": "govdeals",
        "start": 5.0,
        "duration": 9.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch04_beat10_govdeals_auction.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "$1,500 RETIRED RIG",
            "line2": "MUNICIPAL SURPLUS AUCTION",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 11,
        "text": "and the conversion is less than you'd imagine. That's the whole point. The gurney and its mounting",
        "startTime": 70.9,
        "endTime": 77.06,
        "mode": "slice",
        "source": "cheaprv",
        "start": 120.0,
        "duration": 10.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch04_beat11_interior_floor_gurney.mp4")
    },
    {
        "beatIndex": 12,
        "text": "rail came out, an afternoon and a grinder. The medication cabinet on the driver's sidewall stayed",
        "startTime": 77.06,
        "endTime": 83.44,
        "mode": "pexels",
        "query": ["angle grinder metal sparks cutting", "grinder sparks workshop metalwork", "metal cutting grinder workshop"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat12_angle_grinder_sparks.mp4")
    },
    {
        "beatIndex": 13,
        "text": "because it's a perfectly good cupboard with a latch that holds at highway speed. A sheet of plywood",
        "startTime": 83.44,
        "endTime": 89.74,
        "mode": "slice",
        "source": "cheaprv",
        "start": 200.0,
        "duration": 10.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch04_beat13_med_cabinets_latches.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "FACTORY ALL-ALUMINUM CABINETS",
            "line2": "CRASH-RATED POSITIVE LATCHING",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 14,
        "text": "went over the gurney bolts to make a flat platform. A foam mattress went on top, up on slats.",
        "startTime": 89.74,
        "endTime": 95.9,
        "mode": "slice",
        "source": "ben_emily",
        "start": 118.0,
        "duration": 10.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch04_beat14_wood_slats_platform.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CUSTOM SLEEP PLATFORM",
            "line2": "PLYWOOD BASE OVER GURNEY BOLTS",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 15,
        "text": "The mechanic pulled the light bar off the roof and patched the holes with marine sealant. He took",
        "startTime": 95.9,
        "endTime": 101.74,
        "mode": "pexels",
        "query": ["mechanic repairing van roof sealant", "caulk gun sealing metal roof", "roof repair sealant waterproofing"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat15_marine_sealant_roof.mp4")
    },
    {
        "beatIndex": 16,
        "text": "the striping off the side panels with a heat gun over two long evenings, and he cut the wiring to",
        "startTime": 101.74,
        "endTime": 107.76,
        "mode": "pexels",
        "query": ["heat gun peeling decal sticker car", "heat gun vinyl wrapping removing", "workshop heat gun tool craft"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat16_heat_gun_striping.mp4")
    },
    {
        "beatIndex": 17,
        "text": "the siren rather than just switching it off. Because a disconnected siren is a defense, a switched off",
        "startTime": 107.76,
        "endTime": 114.62,
        "mode": "pexels",
        "query": ["cutting electrical wire pliers wire cutter", "wire stripper cutting cable electrician", "snipping wire cutters electrician"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat17_cut_siren_wiring.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "DISCONNECTED SIREN CIRCUIT",
            "line2": "LEGAL COMPLIANCE DEFENSE",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 18,
        "text": "one is not. He mounted a diesel heater in an outside compartment, ran the fuel line to the vehicle's own",
        "startTime": 114.62,
        "endTime": 121.46,
        "mode": "slice",
        "source": "govdeals",
        "start": 13.0,
        "duration": 10.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch04_beat18_outside_compartment_heater.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "EXTERIOR DIESEL HEATER",
            "line2": "PLUMBED TO MAIN DIESEL TANK",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 19,
        "text": "tank, cut one exhaust hole through the floor. He wired a small solar panel into the existing battery",
        "startTime": 121.46,
        "endTime": 127.8,
        "mode": "pexels",
        "query": ["solar panel installation roof battery", "solar charge controller technician", "solar panel wiring battery"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat19_solar_panel_wiring.mp4")
    },
    {
        "beatIndex": 20,
        "text": "bank, which was easy because the bank and the charge wiring were already sitting there from the",
        "startTime": 127.8,
        "endTime": 133.32,
        "mode": "slice",
        "source": "cheaprv",
        "start": 395.0,
        "duration": 9.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch04_beat20_battery_bank_wiring.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "FACTORY AUX BATTERY BANK",
            "line2": "DUAL CHARGING CIRCUIT INTACT",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 21,
        "text": "factory. Total spend on top of the 1500, around $1,100, most of it the heater and the tires.",
        "startTime": 133.32,
        "endTime": total_duration,
        "mode": "pexels",
        "query": ["van highway driving winter sunset", "camper driving mountain highway golden hour", "truck driving highway winter"],
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch04_beat21_completed_rig_highway.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "TOTAL BUILD SPEND: $2,600",
            "line2": "$1,500 PURCHASE + $1,100 CONVERSION",
            "themeColor": "gold"
        }
    }
]

# Fetch or slice all clips
for beat in beats_config:
    bidx = beat["beatIndex"]
    cpath = beat["clipPath"]
    dur = beat["endTime"] - beat["startTime"]
    print(f"\n--- Staging Beat {bidx:02d} ({dur:.2f}s) ---")
    if beat["mode"] == "slice":
        slice_video(beat["source"], beat["start"], beat["duration"], cpath)
    elif beat["mode"] == "pexels":
        fetch_pexels_video(beat["query"], cpath, min_duration=int(dur + 4))
        
    # Extract snapshot
    snapshot_path = os.path.join(SNAPSHOT_DIR, f"beat_{bidx:02d}.jpg")
    cmd = ["ffmpeg", "-y", "-ss", "1.5", "-i", cpath, "-vframes", "1", "-q:v", "3", snapshot_path]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Beat {bidx:02d} snapshot -> {snapshot_path}")

# Construct final timeline JSON
final_clips = []
for beat in beats_config:
    dur = round(beat["endTime"] - beat["startTime"], 3)
    c = {
        "beatIndex": beat["beatIndex"],
        "chapterIndex": 4,
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

print(f"\nChapter 4 timeline saved to: {TIMELINE_OUT}")
