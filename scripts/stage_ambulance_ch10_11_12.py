import os
import json
import subprocess

BASE_DIR = r"C:\Users\karth\Documents\BlokeTuber"

ch10_clips = [
    {
        "beatIndex": 0,
        "chapterIndex": 10,
        "text": "In a lot of cities, there are now safe parking programs where a church, a nonprofit or the city itself",
        "startTime": 0.0,
        "endTime": 6.42,
        "duration": 6.42,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch10_beat00_safe_parking_lot.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "SAFE PARKING PROGRAM",
            "line2": "CHURCH & CITY SANCTIONED LOTS",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 1,
        "chapterIndex": 10,
        "text": "opens a lot at night for people living in vehicles. Santa Barbara has run one since 2004.",
        "startTime": 6.42,
        "endTime": 13.50,
        "duration": 7.08,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch10_beat01_govdeals_overnight_lot.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "SANTA BARBARA SAFE PARKING",
            "line2": "OPERATING CONTINUOUSLY SINCE 2004",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 2,
        "chapterIndex": 10,
        "text": "Seattle, Denver, Portland and dozens of smaller cities have their own. A gate that closes,",
        "startTime": 13.50,
        "endTime": 19.90,
        "duration": 6.40,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch10_beat02_security_gate_closing.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 3,
        "chapterIndex": 10,
        "text": "a portable toilet, sometimes a shower trailer twice a week, sometimes a caseworker walking the",
        "startTime": 19.90,
        "endTime": 26.00,
        "duration": 6.10,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch10_beat03_cheaprv_parked_side.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "BASIC SANITATION & SUPPORT",
            "line2": "RESTROOMS • SHOWERS • SECURITY",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 4,
        "chapterIndex": 10,
        "text": "rows on Tuesdays. And what happens inside those lots is the thing nobody cost it out. A retired",
        "startTime": 26.00,
        "endTime": 32.56,
        "duration": 6.56,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch10_beat04_community_evening_walk.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 5,
        "chapterIndex": 10,
        "text": "diesel mechanic in Ohio bought two old ambulances at auction, converted them in his own driveway",
        "startTime": 32.56,
        "endTime": 38.48,
        "duration": 5.92,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch10_beat05_benemily_driveway_conversion.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "DRIVEWAY CONVERSIONS",
            "line2": "RETIRED DIESEL MECHANIC • OHIO",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 6,
        "chapterIndex": 10,
        "text": "and gave them both away. He says the vehicles turned out to be the easy part. The lot was the medicine.",
        "startTime": 38.48,
        "endTime": 45.20,
        "duration": 6.72,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch10_beat06_mutual_aid_warmth.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "MUTUAL AID COMMUNITY",
            "line2": "\"THE LOT WAS THE MEDICINE\"",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 7,
        "chapterIndex": 10,
        "text": "Somebody has jumper cables. Somebody knows which clinic won't ask for an address. Somebody",
        "startTime": 45.20,
        "endTime": 51.28,
        "duration": 6.08,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch10_beat07_cheaprv_power_cables.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "SHARING POWER & PROPANE",
            "line2": "PEER SUPPORT & RESOURCE SHARING",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 8,
        "chapterIndex": 10,
        "text": "watches your rig while you take the bus to an interview. A woman parked three spaces down,",
        "startTime": 51.28,
        "endTime": 56.86,
        "duration": 5.58,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch10_beat08_city_bus_interview.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 9,
        "chapterIndex": 10,
        "text": "notices your doors haven't opened by noon, and comes and knocks. Eight rigs behind a chain link",
        "startTime": 56.86,
        "endTime": 63.16,
        "duration": 6.30,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch10_beat09_govdeals_rig_doors.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 10,
        "chapterIndex": 10,
        "text": "fence is not a parking lot. It's the first neighborhood some of these people have had in years.",
        "startTime": 63.16,
        "endTime": 68.989,
        "duration": 5.829,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch10_beat10_lot_morning_sunrise.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "FIRST REAL NEIGHBORHOOD",
            "line2": "MUTUAL SECURITY & DIGNITY",
            "themeColor": "cyan"
        }
    }
]

ch11_clips = [
    {
        "beatIndex": 0,
        "chapterIndex": 11,
        "text": "which is roughly how Dale's year went. His paperwork lives in a sealed tub in the outside",
        "startTime": 0.0,
        "endTime": 5.18,
        "duration": 5.18,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch11_beat00_cheaprv_sealed_compartment.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "365 DAYS HOUSED",
            "line2": "WEATHERPROOF OUTSIDE STORAGE",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 1,
        "chapterIndex": 11,
        "text": "compartment now, off the floor, dry. His medication stays where he left it, and his brain finally",
        "startTime": 5.18,
        "endTime": 12.54,
        "duration": 7.36,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch11_beat01_benemily_dry_storage.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "ANNUAL SAVINGS: $14,400 VS RENT",
            "line2": "DRY & SECURE RECOVERY SPACE",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 2,
        "chapterIndex": 11,
        "text": "getting seven hours started working again. Inside 12 months he had replaced his discharge papers,",
        "startTime": 12.54,
        "endTime": 19.20,
        "duration": 6.66,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch11_beat02_peaceful_sleep_morning.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "7 HOURS RESTORED SLEEP",
            "line2": "COGNITIVE RECOVERY • 12 MONTHS",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 3,
        "chapterIndex": 11,
        "text": "gotten into a VA housing program, and stayed on top of the wait list, mostly because he had",
        "startTime": 19.20,
        "endTime": 25.10,
        "duration": 5.90,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch11_beat03_veteran_paperwork_va.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "VA HOUSING PROGRAM",
            "line2": "DISCHARGE PAPERS REPLACED",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 4,
        "chapterIndex": 11,
        "text": "somewhere to keep the letters, and a phone that stayed charged. The people who build these things",
        "startTime": 25.10,
        "endTime": 30.34,
        "duration": 5.24,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch11_beat04_benemily_charging_station.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "12V CONTINUOUS POWER",
            "line2": "CHARGED PHONE • ACTIVE ON WAITLIST",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 5,
        "chapterIndex": 11,
        "text": "have a saying that holds the whole idea in one line. Nobody climbs out of a hole while they're",
        "startTime": 30.34,
        "endTime": 35.66,
        "duration": 5.32,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch11_beat05_horizon_hope.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 6,
        "chapterIndex": 11,
        "text": "still falling. The rig doesn't lift anybody out, it stops the fall, and the man does the rest.",
        "startTime": 35.66,
        "endTime": 42.397,
        "duration": 6.737,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch11_beat06_govdeals_solid_chassis.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "WINTER SURVIVAL SUCCESS",
            "line2": "\"IT STOPS THE FALL • MAN DOES THE REST\"",
            "themeColor": "gold"
        }
    }
]

ch12_clips = [
    {
        "beatIndex": 0,
        "chapterIndex": 12,
        "text": "So tomorrow morning, in that gravel lot in Spokane, the ice will be back on every windshield",
        "startTime": 0.0,
        "endTime": 5.68,
        "duration": 5.68,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch12_beat00_frozen_windshields_morning.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 1,
        "chapterIndex": 12,
        "text": "except one.",
        "startTime": 5.68,
        "endTime": 7.36,
        "duration": 1.68,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch12_beat01_cheaprv_warm_clear_rig.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "INSULATED VEHICLE CABIN",
            "line2": "ICE-FREE AT 61°F • GRAVEL LOT",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 2,
        "chapterIndex": 12,
        "text": "The $1,500 ambulance, video script, 3.5 k words, Dale will slide a $2 bolt, push a",
        "startTime": 7.36,
        "endTime": 16.78,
        "duration": 9.42,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch12_beat02_benemily_ambulance_full_tour.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "THE $1,500 AMBULANCE",
            "line2": "MODERN AMERICAN SHELTER",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 3,
        "chapterIndex": 12,
        "text": "steel door open into 19-degree air with coffee he made himself, and drive his home three",
        "startTime": 16.78,
        "endTime": 22.74,
        "duration": 5.96,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch12_beat03_hot_coffee_winter.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "19°F OUTSIDE • COFFEE MADE HIMSELF",
            "line2": "SELF-CONTAINED INDEPENDENCE",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 4,
        "chapterIndex": 12,
        "text": "miles across town before the maintenance guy arrives, the way he does every single day.",
        "startTime": 22.74,
        "endTime": 28.80,
        "duration": 6.06,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch12_beat04_govdeals_ambulance_drive.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 5,
        "chapterIndex": 12,
        "text": "It's a small life held together with paperwork and a shoebox heater.",
        "startTime": 28.80,
        "endTime": 33.00,
        "duration": 4.20,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch12_beat05_benemily_shoebox_diesel_heater.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "SHOEBOX DIESEL HEATER",
            "line2": "COMPACT DIESEL PARKING HEATER",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 6,
        "chapterIndex": 12,
        "text": "It's also, for the first time in six years, a life he is actually awake for.",
        "startTime": 33.00,
        "endTime": 38.20,
        "duration": 5.20,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch12_beat06_veteran_awake_sunrise.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "INDEPENDENCE REDEFINED",
            "line2": "AWAKE & PURPOSEFUL AFTER SIX YEARS",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 7,
        "chapterIndex": 12,
        "text": "If any part of this felt close to home, for you or for someone you love, the veteran's",
        "startTime": 38.20,
        "endTime": 43.62,
        "duration": 5.42,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch12_beat07_cheaprv_solid_box_front.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 8,
        "chapterIndex": 12,
        "text": "blueprint is the first link in the description.",
        "startTime": 43.62,
        "endTime": 46.50,
        "duration": 2.88,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch12_beat08_blueprint_manual.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "THE VETERAN'S BLUEPRINT",
            "line2": "FIRST LINK IN DESCRIPTION",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 9,
        "chapterIndex": 12,
        "text": "Go get it before you close this video.",
        "startTime": 46.50,
        "endTime": 49.30,
        "duration": 2.80,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch12_beat09_laptop_screen_link.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 10,
        "chapterIndex": 12,
        "text": "It's the most useful thing I know how to hand you, and if stories like this one matter",
        "startTime": 49.30,
        "endTime": 54.72,
        "duration": 5.42,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\slices\ch12_beat10_benemily_cozy_quarters.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 11,
        "chapterIndex": 12,
        "text": "to you, stories about ordinary people quietly refusing to give up on each other, subscribe.",
        "startTime": 54.72,
        "endTime": 60.70,
        "duration": 5.98,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch12_beat11_people_helping_community.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "QUIET AMERICAN RESILIENCE",
            "line2": "SUBSCRIBE FOR MORE STORIES",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 12,
        "chapterIndex": 12,
        "text": "There are far more of them out there than the news will ever bother to tell you.",
        "startTime": 60.70,
        "endTime": 65.802,
        "duration": 5.102,
        "clipPath": os.path.join(BASE_DIR, r"uploads\raw\proj_ambulance\stock\ch12_beat12_open_highway_sunrise.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "HOPE ON THE HORIZON",
            "line2": "ORDINARY PEOPLE REFUSING TO GIVE UP",
            "themeColor": "cyan"
        }
    }
]

chapters = [
    {
        "num": "10",
        "timeline_path": r"uploads\timelines\ambulance\chapter_10_final.json",
        "audio_path": r"C:/Users/karth/Documents/BlokeTuber/uploads/audio/ambulance/10 - THELOTISTHE MEDICINE.mp3",
        "totalDuration": 68.989,
        "snapshot_dir": r"uploads\beat_snapshots\ambulance_ch10",
        "clips": ch10_clips
    },
    {
        "num": "11",
        "timeline_path": r"uploads\timelines\ambulance\chapter_11_final.json",
        "audio_path": r"C:/Users/karth/Documents/BlokeTuber/uploads/audio/ambulance/11 -  DALE'S YEAR.mp3",
        "totalDuration": 42.397,
        "snapshot_dir": r"uploads\beat_snapshots\ambulance_ch11",
        "clips": ch11_clips
    },
    {
        "num": "12",
        "timeline_path": r"uploads\timelines\ambulance\chapter_12_final.json",
        "audio_path": r"C:/Users/karth/Documents/BlokeTuber/uploads/audio/ambulance/12 - close.mp3",
        "totalDuration": 65.802,
        "snapshot_dir": r"uploads\beat_snapshots\ambulance_ch12",
        "clips": ch12_clips
    }
]

# Validation and Staging
for ch in chapters:
    print(f"\n==========================================")
    print(f"STAGING & VALIDATING CHAPTER {ch['num']}")
    os.makedirs(ch["snapshot_dir"], exist_ok=True)
    os.makedirs(os.path.dirname(ch["timeline_path"]), exist_ok=True)
    
    # 1. Verify every clip path exists and probe H.264
    for i, clip in enumerate(ch["clips"]):
        cp = clip["clipPath"]
        if not os.path.exists(cp):
            raise FileNotFoundError(f"Clip not found: {cp}")
        size = os.path.getsize(cp)
        if size == 0:
            raise ValueError(f"Clip is empty: {cp}")
            
        probe_cmd = [
            "ffprobe", "-v", "error",
            "-show_entries", "stream=codec_name,width,height:format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            cp
        ]
        probe_out = subprocess.check_output(probe_cmd).decode().split()
        codec = probe_out[0]
        w = probe_out[1]
        h = probe_out[2]
        dur = float(probe_out[3])
        
        if codec != "h264":
            raise ValueError(f"Clip {cp} is not h264! Found: {codec}")
        if dur < clip["duration"] - 0.2:
            print(f"WARNING: Clip {cp} duration {dur:.2f}s is less than required {clip['duration']:.2f}s!")
        print(f"  Beat {i:02d}: OK [{codec} {w}x{h} {dur:.2f}s] -> {os.path.basename(cp)}")
        
        # 2. Extract snapshot
        snap_path = os.path.join(ch["snapshot_dir"], f"beat_{i+1:02d}.jpg")
        # sample at 1.0s or mid point
        sample_time = min(1.0, clip["duration"] / 2.0)
        snap_cmd = [
            "ffmpeg", "-y",
            "-ss", str(sample_time),
            "-i", cp,
            "-vframes", "1",
            "-q:v", "2",
            snap_path
        ]
        subprocess.run(snap_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        if not os.path.exists(snap_path) or os.path.getsize(snap_path) == 0:
            raise RuntimeError(f"Failed to generate snapshot: {snap_path}")

    print(f"All {len(ch['clips'])} snapshots generated in {ch['snapshot_dir']}")
    
    # 3. Write timeline JSON
    timeline_data = {
        "masterAudioPath": ch["audio_path"],
        "totalDuration": ch["totalDuration"],
        "clips": ch["clips"]
    }
    with open(ch["timeline_path"], "w", encoding="utf-8") as f:
        json.dump(timeline_data, f, indent=2)
    print(f"Wrote timeline JSON: {ch['timeline_path']}")

print("\n==========================================")
print("ALL CHAPTERS 10, 11, and 12 STAGED AND VALIDATED SUCCESSFULLY!")
