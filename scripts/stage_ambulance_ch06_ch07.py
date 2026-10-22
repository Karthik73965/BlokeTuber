import os
import sys
import json
import urllib.request
import urllib.parse
import subprocess
import glob

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = os.path.abspath(".")
RAW_DIR = os.path.join(REPO_ROOT, "uploads", "raw", "proj_ambulance")
SLICES_DIR = os.path.join(RAW_DIR, "slices")
STOCK_DIR = os.path.join(RAW_DIR, "stock")
TIMELINES_DIR = os.path.join(REPO_ROOT, "uploads", "timelines", "ambulance")
CH06_SNAPSHOTS = os.path.join(REPO_ROOT, "uploads", "beat_snapshots", "ambulance_ch06")
CH07_SNAPSHOTS = os.path.join(REPO_ROOT, "uploads", "beat_snapshots", "ambulance_ch07")

os.makedirs(SLICES_DIR, exist_ok=True)
os.makedirs(STOCK_DIR, exist_ok=True)
os.makedirs(TIMELINES_DIR, exist_ok=True)
os.makedirs(CH06_SNAPSHOTS, exist_ok=True)
os.makedirs(CH07_SNAPSHOTS, exist_ok=True)

# Load environment variables
def load_env_manually(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    if k.strip() not in os.environ:
                        os.environ[k.strip()] = v.strip().strip('"').strip("'")

load_env_manually(".env")
load_env_manually("apps/api/.env")

PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")
if not PEXELS_API_KEY:
    raise ValueError("PEXELS_API_KEY is not set!")

RAW_SOURCES = {
    "cheaprv": os.path.join(RAW_DIR, "cheaprv_ambulance.mp4"),
    "govdeals": os.path.join(RAW_DIR, "govdeals_ambulance.mp4"),
    "ben_emily": os.path.join(RAW_DIR, "ben_emily_tour.mp4"),
}

def slice_raw(source_key, start_time, duration, output_path):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    if os.path.exists(output_path) and os.path.getsize(output_path) > 50000:
        return output_path
    src_file = RAW_SOURCES[source_key]
    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-ss", str(start_time),
        "-i", src_file,
        "-t", str(duration + 0.5),
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-an",
        "-movflags", "+faststart",
        output_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"🔪 Sliced {source_key} [{start_time}s - {start_time+duration}s] -> {os.path.basename(output_path)}")
    return output_path

def fetch_stock(query, output_path, target_duration=6.0, fallback_queries=None):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    if os.path.exists(output_path) and os.path.getsize(output_path) > 100000:
        return output_path

    queries_to_try = [query] + (fallback_queries or [])
    for q in queries_to_try:
        try:
            url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(q)}&per_page=15&orientation=landscape"
            req = urllib.request.Request(url, headers={"Authorization": PEXELS_API_KEY, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode())
            videos = data.get("videos", [])
            if not videos:
                continue

            for v in videos:
                files = v.get("video_files", [])
                hd_files = [f for f in files if f.get("width") == 1920 or f.get("width") == 1280]
                if not hd_files:
                    hd_files = files
                if hd_files:
                    download_url = hd_files[0]["link"]
                    temp_file = output_path + ".tmp.mp4"
                    file_req = urllib.request.Request(download_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                    with urllib.request.urlopen(file_req) as dl_resp, open(temp_file, "wb") as out_f:
                        while True:
                            chunk = dl_resp.read(65536)
                            if not chunk:
                                break
                            out_f.write(chunk)

                    cmd = [
                        "ffmpeg", "-nostdin", "-y",
                        "-stream_loop", "3",
                        "-i", temp_file,
                        "-t", str(target_duration + 1.0),
                        "-c:v", "libx264",
                        "-preset", "veryfast",
                        "-crf", "18",
                        "-pix_fmt", "yuv420p",
                        "-an",
                        "-movflags", "+faststart",
                        output_path
                    ]
                    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    if os.path.exists(temp_file):
                        os.remove(temp_file)
                    print(f"📥 Downloaded stock for '{q}' -> {os.path.basename(output_path)}")
                    return output_path
        except Exception as e:
            print(f"⚠️ Error querying '{q}': {e}")
            continue

    raise RuntimeError(f"Could not download stock video for query: {query}")

def prepareChapter06():
    print("\n===================================================================")
    print("PREPARING CHAPTER 6: THE NIGHT (182.883s)")
    print("===================================================================\n")

    ch6_beats_def = [
        {
            "beatIndex": 0,
            "startTime": 0.0,
            "endTime": 5.0,
            "text": "A December night in Eastern Washington sits in the teens for 10 hours straight.",
            "sourceType": "stock",
            "query": "snow winter night parking lot",
            "fallbacks": ["cold winter night snow", "snow falling night empty street"],
            "filename": "ch06_beat00_winter_night.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "NIGHTFALL • 14°F",
                "line2": "EASTERN WASHINGTON • 10-HR FREEZE",
                "themeColor": "cyan"
            }
        },
        {
            "beatIndex": 1,
            "startTime": 5.0,
            "endTime": 9.0,
            "text": "And this is where the box either earns the money or kills somebody.",
            "sourceType": "slice",
            "source": "cheaprv",
            "start": 21.0,
            "filename": "ch06_beat01_ambulance_lot.mp4"
        },
        {
            "beatIndex": 2,
            "startTime": 9.0,
            "endTime": 13.0,
            "text": "What kills people outside is almost never dramatic cold.",
            "sourceType": "stock",
            "query": "snow blizzard storm wind gust",
            "fallbacks": ["snow storm winter cold wind", "freezing wind snow trees"],
            "filename": "ch06_beat02_blizzard_wind.mp4"
        },
        {
            "beatIndex": 3,
            "startTime": 13.0,
            "endTime": 16.5,
            "text": "It's wet clothes, wind, and a long night.",
            "sourceType": "stock",
            "query": "freezing rain cold night darkness",
            "fallbacks": ["wet cold dark rain jacket", "rain dripping night winter street"],
            "filename": "ch06_beat03_wet_wind_night.mp4"
        },
        {
            "beatIndex": 4,
            "startTime": 16.5,
            "endTime": 20.0,
            "text": "Inside an aluminum box with factory insulation",
            "sourceType": "slice",
            "source": "govdeals",
            "start": 12.0,
            "filename": "ch06_beat04_aluminum_insulation.mp4"
        },
        {
            "beatIndex": 5,
            "startTime": 20.0,
            "endTime": 24.5,
            "text": "and one human body, the temperature already runs well above the outside air.",
            "sourceType": "stock",
            "query": "sleeping warm cozy blanket bed night",
            "fallbacks": ["cozy sleeping bed winter blanket", "sleeping inside camper van warm"],
            "filename": "ch06_beat05_cozy_warmth.mp4"
        },
        {
            "beatIndex": 6,
            "startTime": 24.5,
            "endTime": 27.5,
            "text": "But at 19 degrees, that's still not enough.",
            "sourceType": "stock",
            "query": "frost on window winter cold thermometer",
            "fallbacks": ["frost glass winter cold ice", "frozen windshield winter morning"],
            "filename": "ch06_beat06_frost_gauge.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "OUTSIDE AIR: 19°F",
                "line2": "THERMAL DEFICIT THRESHOLD",
                "themeColor": "cyan"
            }
        },
        {
            "beatIndex": 7,
            "startTime": 27.5,
            "endTime": 31.0,
            "text": "So the heat comes from a diesel air heater",
            "sourceType": "slice",
            "source": "ben_emily",
            "start": 110.0,
            "filename": "ch06_beat07_heater_bay.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "DIESEL AIR HEATER: 2KW",
                "line2": "FORCED AIR HEATING SYSTEM",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 8,
            "startTime": 31.0,
            "endTime": 34.0,
            "text": "about the size of a shoebox mounted under the floor.",
            "sourceType": "stock",
            "query": "diesel air heater burner compact hardware",
            "fallbacks": ["compact mechanical heater engine unit", "industrial hardware heating machine"],
            "filename": "ch06_beat08_compact_heater.mp4"
        },
        {
            "beatIndex": 9,
            "startTime": 34.0,
            "endTime": 37.0,
            "text": "It draws fuel straight from the vehicle's own tank",
            "sourceType": "slice",
            "source": "govdeals",
            "start": 49.0,
            "filename": "ch06_beat09_diesel_fuel_line.mp4"
        },
        {
            "beatIndex": 10,
            "startTime": 37.0,
            "endTime": 41.0,
            "text": "and vents its exhaust outside through a pipe under the chassis.",
            "sourceType": "stock",
            "query": "car exhaust smoke cold air chassis",
            "fallbacks": ["exhaust pipe cold air vapor winter", "car exhaust pipe winter freezing steam"],
            "filename": "ch06_beat10_exhaust_pipe.mp4"
        },
        {
            "beatIndex": 11,
            "startTime": 41.0,
            "endTime": 44.0,
            "text": "It blows dry, warm air into the cabin",
            "sourceType": "stock",
            "query": "warm air heater ventilation glow dark",
            "fallbacks": ["warm air vent blowing air heater", "heating radiator warm orange light"],
            "filename": "ch06_beat11_warm_air_vent.mp4"
        },
        {
            "beatIndex": 12,
            "startTime": 44.0,
            "endTime": 48.5,
            "text": "and it sips fuel, running most of the night on well under a gallon.",
            "sourceType": "slice",
            "source": "cheaprv",
            "start": 194.0,
            "filename": "ch06_beat12_interior_cozy.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "FUEL CONSUMPTION: ULTRA-LOW",
                "line2": "< 1 GALLON DIESEL / 10 HOURS",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 13,
            "startTime": 48.5,
            "endTime": 52.0,
            "text": "10 years ago, a unit like that was expensive.",
            "sourceType": "stock",
            "query": "vintage workshop tools metal mechanic",
            "fallbacks": ["industrial blueprint vintage machinery workshop", "tools metal workshop vintage"],
            "filename": "ch06_beat13_expensive_hardware.mp4"
        },
        {
            "beatIndex": 14,
            "startTime": 52.0,
            "endTime": 55.5,
            "text": "Now it's one of the cheapest things in the entire build.",
            "sourceType": "slice",
            "source": "ben_emily",
            "start": 130.0,
            "filename": "ch06_beat14_budget_components.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "STANDALONE COST: ~$120",
                "line2": "CHINESE DIESEL AIR HEATER",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 15,
            "startTime": 55.5,
            "endTime": 62.5,
            "text": "And it is the single reason a person can survive a real winter in a metal box instead of just enduring one.",
            "sourceType": "stock",
            "query": "car driving snowy winter night headlights road",
            "fallbacks": ["van driving winter snow night road", "vehicle driving blizzard dark winter"],
            "filename": "ch06_beat15_survive_winter.mp4"
        },
        {
            "beatIndex": 16,
            "startTime": 62.5,
            "endTime": 68.0,
            "text": "But the heater is also where people die. So this is the part to pay attention to.",
            "sourceType": "slice",
            "source": "cheaprv",
            "start": 178.0,
            "filename": "ch06_beat16_hazard_alert.mp4"
        },
        {
            "beatIndex": 17,
            "startTime": 68.0,
            "endTime": 74.0,
            "text": "The lethal danger inside any small sealed vehicle is carbon monoxide, no smell.",
            "sourceType": "stock",
            "query": "alarm sensor red light dark smoke detector",
            "fallbacks": ["red alarm light blinking dark wall", "emergency red warning light flashing dark"],
            "filename": "ch06_beat17_co_danger.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "HAZARD: CARBON MONOXIDE",
                "line2": "ODORLESS • SILENT • ACCUMULATIVE",
                "themeColor": "cyan"
            }
        },
        {
            "beatIndex": 18,
            "startTime": 74.0,
            "endTime": 79.5,
            "text": "It makes you sleepy before it makes you sick and it does not care about your intentions.",
            "sourceType": "stock",
            "query": "tired sleepy eyes closing dark room",
            "fallbacks": ["exhausted man closing eyes sleepy dark", "tired eyes sleeping dim amber lighting"],
            "filename": "ch06_beat18_sleepy_eyes.mp4"
        },
        {
            "beatIndex": 19,
            "startTime": 79.5,
            "endTime": 86.0,
            "text": "People who do this properly run a vented heater and never an open propane burner overnight.",
            "sourceType": "slice",
            "source": "govdeals",
            "start": 34.0,
            "filename": "ch06_beat19_vented_heater_protocol.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "VENTED HEATING MANDATE",
                "line2": "NO OPEN PROPANE OVERNIGHT",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 20,
            "startTime": 86.0,
            "endTime": 91.0,
            "text": "They mount one carbon monoxide alarm at head height and a second one low.",
            "sourceType": "stock",
            "query": "safety inspection sensor wall electronic device",
            "fallbacks": ["mounting electronic sensor device wall", "installing thermostat alarm device wall"],
            "filename": "ch06_beat20_co_alarm_mount.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "DUAL DETECTOR PROTOCOL",
                "line2": "HEAD LEVEL + FLOOR LEVEL",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 21,
            "startTime": 91.0,
            "endTime": 95.5,
            "text": "They crack the roof vent even when it's freezing and they crawl under the truck",
            "sourceType": "slice",
            "source": "ben_emily",
            "start": 760.0,
            "filename": "ch06_beat21_roof_vent.mp4"
        },
        {
            "beatIndex": 22,
            "startTime": 95.5,
            "endTime": 99.0,
            "text": "and check the exhaust pipe for rust and damage.",
            "sourceType": "stock",
            "query": "mechanic under carriage inspection flashlight exhaust pipe",
            "fallbacks": ["mechanic inspecting car chassis undercarriage light", "inspecting vehicle exhaust pipe flashlight"],
            "filename": "ch06_beat22_exhaust_inspection.mp4"
        },
        {
            "beatIndex": 23,
            "startTime": 99.0,
            "endTime": 103.5,
            "text": "Every winter somebody skips one of those steps and doesn't wake up.",
            "sourceType": "stock",
            "query": "dark empty winter road snow falling night",
            "fallbacks": ["desolate snowy road night dark streetlight", "empty winter road darkness snow drifting"],
            "filename": "ch06_beat23_dark_winter_road.mp4"
        },
        {
            "beatIndex": 24,
            "startTime": 103.5,
            "endTime": 108.0,
            "text": "The other night problem is water and it's the one nobody expects.",
            "sourceType": "slice",
            "source": "cheaprv",
            "start": 25.5,
            "filename": "ch06_beat24_water_problem.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "CONDENSATION CONTROL",
                "line2": "MOISTURE ACCUMULATION PROTOCOL",
                "themeColor": "cyan"
            }
        },
        {
            "beatIndex": 25,
            "startTime": 108.0,
            "endTime": 114.5,
            "text": "Every breath you exhale puts moisture into the air in a sealed aluminum box that moisture condenses",
            "sourceType": "stock",
            "query": "water condensation window drops cold glass",
            "fallbacks": ["condensation water drops glass cold winter", "water droplets running down window pane glass"],
            "filename": "ch06_beat25_condensation_window.mp4"
        },
        {
            "beatIndex": 26,
            "startTime": 114.5,
            "endTime": 118.5,
            "text": "on the cold walls and drips back onto your bedding by morning.",
            "sourceType": "slice",
            "source": "govdeals",
            "start": 19.0,
            "filename": "ch06_beat26_cold_aluminum_walls.mp4"
        },
        {
            "beatIndex": 27,
            "startTime": 118.5,
            "endTime": 123.0,
            "text": "Wet bedding in February is how a warm night turns into a dangerous week.",
            "sourceType": "stock",
            "query": "cold blankets shivering frost winter morning",
            "fallbacks": ["frosty window blankets cold bed winter morning", "shivering cold blankets frost outside window"],
            "filename": "ch06_beat27_damp_blankets.mp4"
        },
        {
            "beatIndex": 28,
            "startTime": 123.0,
            "endTime": 128.0,
            "text": "So the vent stays cracked, the heater runs dry heat, not a flame in the room",
            "sourceType": "stock",
            "query": "ceiling fan ventilation rotating airflow",
            "fallbacks": ["ventilation roof hatch air circulation", "ceiling fan slow air movement warm dry"],
            "filename": "ch06_beat28_vent_cracked.mp4"
        },
        {
            "beatIndex": 29,
            "startTime": 128.0,
            "endTime": 132.0,
            "text": "and the mattress sits on slats so air can move underneath it.",
            "sourceType": "slice",
            "source": "ben_emily",
            "start": 120.0,
            "filename": "ch06_beat29_bed_slats.mp4"
        },
        {
            "beatIndex": 30,
            "startTime": 132.0,
            "endTime": 139.0,
            "text": "And then there's a two dollar barrel bolt on the inside of the rear doors which might be the most important part of the entire vehicle.",
            "sourceType": "stock",
            "query": "metal bolt lock door locking deadbolt",
            "fallbacks": ["heavy door lock latch metal lock closing", "door sliding bolt lock locking steel door"],
            "filename": "ch06_beat30_barrel_bolt_lock.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "STEALTH PARKING PROTOCOL",
                "line2": "INTERIOR BARREL BOLT DEADLOCK",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 31,
            "startTime": 139.0,
            "endTime": 145.0,
            "text": "Because here's what years of sleeping outside does to a person. You never fully sleep.",
            "sourceType": "slice",
            "source": "cheaprv",
            "start": 334.0,
            "filename": "ch06_beat31_years_outside.mp4"
        },
        {
            "beatIndex": 32,
            "startTime": 145.0,
            "endTime": 150.0,
            "text": "Some part of your brain stays posted at the door all night, listening for footsteps.",
            "sourceType": "stock",
            "query": "shadow walking night street footsteps alley cold",
            "fallbacks": ["shadow footsteps pavement dark night alleyway", "feet walking dark street night footsteps pavement"],
            "filename": "ch06_beat32_listening_footsteps.mp4"
        },
        {
            "beatIndex": 33,
            "startTime": 150.0,
            "endTime": 154.0,
            "text": "Because tents get cut open, sleeping people get robbed",
            "sourceType": "stock",
            "query": "tattered tent homeless camp night alley",
            "fallbacks": ["tent outdoor camp night cold wind dark", "abandoned tent alley cold night rain street"],
            "filename": "ch06_beat33_tents_vulnerable.mp4"
        },
        {
            "beatIndex": 34,
            "startTime": 154.0,
            "endTime": 159.5,
            "text": "and sometimes worse, memory goes, temper goes short, days blur together.",
            "sourceType": "stock",
            "query": "exhausted stressed face night streetlights",
            "fallbacks": ["depressed tired man looking down night street", "stressed man head in hands exhausted night"],
            "filename": "ch06_beat34_sleep_deprived.mp4"
        },
        {
            "beatIndex": 35,
            "startTime": 159.5,
            "endTime": 164.5,
            "text": "Then you put that same person behind hard walls, a steel door and a lock.",
            "sourceType": "slice",
            "source": "govdeals",
            "start": 31.0,
            "filename": "ch06_beat35_hard_walls_lock.mp4"
        },
        {
            "beatIndex": 36,
            "startTime": 164.5,
            "endTime": 172.0,
            "text": "And the first thing they say over and over in every one of these stories is the same two words I slept.",
            "sourceType": "stock",
            "query": "man sleeping peacefully bed morning sunlight bedroom",
            "fallbacks": ["person sleeping peacefully warm bed morning light", "peaceful sleep cozy bed morning sun bedroom"],
            "filename": "ch06_beat36_i_slept.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "\"I SLEPT\"",
                "line2": "THE RESTORATION OF DEEP REST",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 37,
            "startTime": 172.0,
            "endTime": 176.5,
            "text": "That's the whole miracle. Because nobody fills out benefits paperwork,",
            "sourceType": "slice",
            "source": "cheaprv",
            "start": 22.0,
            "filename": "ch06_beat37_miracle_safe.mp4"
        },
        {
            "beatIndex": 38,
            "startTime": 176.5,
            "endTime": 182.883,
            "text": "survives a job interview, or tracks a housing wait list on four broken hours of sleep.",
            "sourceType": "stock",
            "query": "sunrise morning light parking lot dawn horizon",
            "fallbacks": ["sunrise dawn morning sky golden hour city horizon", "morning light breaking over city sunrise horizon"],
            "filename": "ch06_beat38_sunrise_hope.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "FOUNDATION FOR RECOVERY",
                "line2": "FROM SURVIVAL TO STABILITY",
                "themeColor": "cyan"
            }
        }
    ]

    clips = []
    for b in ch6_beats_def:
        dur = round(b["endTime"] - b["startTime"], 3)
        if b["sourceType"] == "slice":
            out_file = os.path.join(SLICES_DIR, b["filename"])
            slice_raw(b["source"], b["start"], dur, out_file)
        else:
            out_file = os.path.join(STOCK_DIR, b["filename"])
            fetch_stock(b["query"], out_file, dur, b.get("fallbacks"))

        clip_data = {
            "beatIndex": b["beatIndex"],
            "chapterIndex": 6,
            "text": b["text"],
            "startTime": b["startTime"],
            "endTime": b["endTime"],
            "duration": dur,
            "clipPath": out_file.replace("/", "\\"),
            "layout": "full_bleed_cinematic",
            "kenBurns": True,
            "transitionType": "cut",
            "transitionDuration": 0,
        }
        if "callout" in b:
            clip_data["callout"] = b["callout"]
        clips.append(clip_data)

    timeline_ch06 = {
        "masterAudioPath": os.path.abspath("uploads/audio/ambulance/6 - THE NIGHT.mp3").replace("\\", "/"),
        "totalDuration": 182.883,
        "clips": clips
    }

    out_json = os.path.join(TIMELINES_DIR, "chapter_06_final.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(timeline_ch06, f, indent=2)
    print(f"✅ Created Chapter 6 Timeline: {out_json} ({len(clips)} beats)")

    # Extract beat snapshots
    print("\n📸 Extracting Chapter 6 midpoint snapshots...")
    for i, clip in enumerate(clips):
        beat_num = str(i + 1).padStart(2, '0') if hasattr(str, 'padStart') else f"{i+1:02d}"
        snapshot_file = os.path.join(CH06_SNAPSHOTS, f"beat_{beat_num}.jpg")
        midpoint = max(0.5, clip["duration"] / 2.0)
        cmd = [
            "ffmpeg", "-nostdin", "-y",
            "-ss", f"{midpoint:.2f}",
            "-i", clip["clipPath"],
            "-vframes", "1",
            "-q:v", "2",
            snapshot_file
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"[OK] Extracted {len(clips)} snapshots for Chapter 6 to {CH06_SNAPSHOTS}")

def prepareChapter07():
    print("\n===================================================================")
    print("PREPARING CHAPTER 7: THE VETERAN'S BLUEPRINT (48.196s)")
    print("===================================================================\n")

    ch7_beats_def = [
        {
            "beatIndex": 0,
            "startTime": 0.0,
            "endTime": 4.2,
            "text": "If this is landing close to home for you, there's probably a reason.",
            "sourceType": "stock",
            "query": "thoughtful mature man looking out window morning light",
            "fallbacks": ["man looking out window contemplative morning", "thoughtful mature man portrait indoors"],
            "filename": "ch07_beat00_thoughtful_veteran.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "FIXED PENSION: $900/MONTH",
                "line2": "MILITARY DISCIPLINE & CHECKLISTS",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 1,
            "startTime": 4.2,
            "endTime": 7.6,
            "text": "I put together a guide called the Veterans Blueprint.",
            "sourceType": "stock",
            "query": "hands reviewing structured notebook blueprint checklist",
            "fallbacks": ["hands writing notebook checklist desk", "architect blueprint review documents desk"],
            "filename": "ch07_beat01_field_guide.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "THE VETERAN'S BLUEPRINT",
                "line2": "ACTIONABLE SURVIVAL GUIDE",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 2,
            "startTime": 7.6,
            "endTime": 11.6,
            "text": "It covers the things that need more room than a video can give them.",
            "sourceType": "slice",
            "source": "ben_emily",
            "start": 1240.0,
            "filename": "ch07_beat02_detailed_blueprint.mp4"
        },
        {
            "beatIndex": 3,
            "startTime": 11.6,
            "endTime": 15.8,
            "text": "What to do in the 72 hours before you lose an apartment,",
            "sourceType": "stock",
            "query": "clock countdown calendar urgent planning desk",
            "fallbacks": ["vintage clock ticking urgent time", "hourglass sand running time lapse"],
            "filename": "ch07_beat03_72_hours_clock.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "CRITICAL 72-HOUR WINDOW",
                "line2": "PRE-EVICTION ACTION PROTOCOL",
                "themeColor": "cyan"
            }
        },
        {
            "beatIndex": 4,
            "startTime": 15.8,
            "endTime": 19.2,
            "text": "which is the window where almost everything is still fixable,",
            "sourceType": "slice",
            "source": "cheaprv",
            "start": 120.0,
            "filename": "ch07_beat04_actionable_window.mp4"
        },
        {
            "beatIndex": 5,
            "startTime": 19.2,
            "endTime": 24.0,
            "text": "which documents to protect first and how to replace the ones already gone,",
            "sourceType": "stock",
            "query": "documents paperwork passport folders archive desk",
            "fallbacks": ["stack of documents paperwork folder desk", "signing official documents paperwork desk"],
            "filename": "ch07_beat05_vital_documents.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "VITAL RECORDS SECURITY",
                "line2": "DD-214 • ID • BENEFIT RECORDS",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 6,
            "startTime": 24.0,
            "endTime": 27.6,
            "text": "how to get in front of a caseworker instead of onto a list,",
            "sourceType": "slice",
            "source": "govdeals",
            "start": 21.0,
            "filename": "ch07_beat06_caseworker_station.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "DIRECT CASEWORKER ACCESS",
                "line2": "AVOIDING PERPETUAL WAITLISTS",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 7,
            "startTime": 27.6,
            "endTime": 31.0,
            "text": "and for those watching who are not in trouble themselves, what to actually do for someone who is.",
            "sourceType": "stock",
            "query": "men shaking hands mutual support partnership",
            "fallbacks": ["helping hands support community partnership", "firm handshake business support mutual aid"],
            "filename": "ch07_beat07_support_community.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "ZERO RENT • DEBT FREE",
                "line2": "INDEPENDENT SURVIVAL",
                "themeColor": "cyan"
            }
        },
        {
            "beatIndex": 8,
            "startTime": 31.0,
            "endTime": 38.8,
            "text": "The link is the first one in the description. Go get it after this video.",
            "sourceType": "stock",
            "query": "laptop computer clicking link download typing desk",
            "fallbacks": ["person browsing laptop clicking screen website", "working on modern laptop typing screen office"],
            "filename": "ch07_beat08_resource_link.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "RESOURCE GUIDE LINK",
                "line2": "FIRST LINK IN DESCRIPTION",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 9,
            "startTime": 38.8,
            "endTime": 43.5,
            "text": "Now, back to that gravel lot. Because there's a legal wall around all of this,",
            "sourceType": "slice",
            "source": "cheaprv",
            "start": 22.0,
            "filename": "ch07_beat09_back_to_gravel_lot.mp4"
        },
        {
            "beatIndex": 10,
            "startTime": 43.5,
            "endTime": 48.196,
            "text": "and it stops most people before they ever spend a night inside.",
            "sourceType": "slice",
            "source": "govdeals",
            "start": 1.0,
            "filename": "ch07_beat10_legal_wall_perimeter.mp4",
            "callout": {
                "type": "editorial_lower_third",
                "line1": "THE LEGAL WALL",
                "line2": "ZONING & PARKING ORDINANCES",
                "themeColor": "cyan"
            }
        }
    ]

    clips = []
    for b in ch7_beats_def:
        dur = round(b["endTime"] - b["startTime"], 3)
        if b["sourceType"] == "slice":
            out_file = os.path.join(SLICES_DIR, b["filename"])
            slice_raw(b["source"], b["start"], dur, out_file)
        else:
            out_file = os.path.join(STOCK_DIR, b["filename"])
            fetch_stock(b["query"], out_file, dur, b.get("fallbacks"))

        clip_data = {
            "beatIndex": b["beatIndex"],
            "chapterIndex": 7,
            "text": b["text"],
            "startTime": b["startTime"],
            "endTime": b["endTime"],
            "duration": dur,
            "clipPath": out_file.replace("/", "\\"),
            "layout": "full_bleed_cinematic",
            "kenBurns": True,
            "transitionType": "cut",
            "transitionDuration": 0,
        }
        if "callout" in b:
            clip_data["callout"] = b["callout"]
        clips.append(clip_data)

    timeline_ch07 = {
        "masterAudioPath": os.path.abspath("uploads/audio/ambulance/7 - THE VETERAN'SBLUEPRINT.mp3").replace("\\", "/"),
        "totalDuration": 48.196,
        "clips": clips
    }

    out_json = os.path.join(TIMELINES_DIR, "chapter_07_final.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(timeline_ch07, f, indent=2)
    print(f"✅ Created Chapter 7 Timeline: {out_json} ({len(clips)} beats)")

    # Extract beat snapshots
    print("\n📸 Extracting Chapter 7 midpoint snapshots...")
    for i, clip in enumerate(clips):
        beat_num = f"{i+1:02d}"
        snapshot_file = os.path.join(CH07_SNAPSHOTS, f"beat_{beat_num}.jpg")
        midpoint = max(0.5, clip["duration"] / 2.0)
        cmd = [
            "ffmpeg", "-nostdin", "-y",
            "-ss", f"{midpoint:.2f}",
            "-i", clip["clipPath"],
            "-vframes", "1",
            "-q:v", "2",
            snapshot_file
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"[OK] Extracted {len(clips)} snapshots for Chapter 7 to {CH07_SNAPSHOTS}")

def verifyEverything():
    print("\n===================================================================")
    print("VERIFYING STAGED CHAPTERS 6 & 7")
    print("===================================================================\n")

    for ch_num, filename, snap_dir in [
        (6, "chapter_06_final.json", CH06_SNAPSHOTS),
        (7, "chapter_07_final.json", CH07_SNAPSHOTS)
    ]:
        filepath = os.path.join(TIMELINES_DIR, filename)
        assert os.path.exists(filepath), f"Missing {filepath}"
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        clips = data["clips"]
        print(f"Auditing Chapter {ch_num} ({len(clips)} clips, duration: {data['totalDuration']}s)...")

        # 1. Check layout & overlays
        for idx, c in enumerate(clips):
            assert c.get("layout") == "full_bleed_cinematic", f"Clip {idx} layout not full_bleed_cinematic!"
            assert "overlay" not in c, f"Clip {idx} has forbidden overlay key!"
            assert c.get("transitionType") == "cut", f"Clip {idx} transitionType not cut!"
            assert c.get("transitionDuration") == 0, f"Clip {idx} transitionDuration not 0!"

            # Check file exists and is valid H.264
            p = c["clipPath"]
            assert os.path.exists(p), f"Clip path does not exist: {p}"
            sz = os.path.getsize(p)
            assert sz > 50000, f"Clip file too small ({sz} bytes): {p}"

            # Probe with ffprobe
            probe_cmd = [
                "ffprobe", "-v", "error",
                "-select_streams", "v:0",
                "-show_entries", "stream=codec_name,duration:format=duration",
                "-of", "json",
                p
            ]
            res = subprocess.run(probe_cmd, capture_output=True, text=True, check=True)
            probe_data = json.loads(res.stdout)
            streams = probe_data.get("streams", [])
            assert len(streams) > 0, f"No video streams in {p}"
            codec = streams[0].get("codec_name")
            assert codec == "h264", f"Codec is {codec}, expected h264 for {p}"

            # Check snapshot exists
            snap_file = os.path.join(snap_dir, f"beat_{idx+1:02d}.jpg")
            assert os.path.exists(snap_file), f"Snapshot missing: {snap_file}"
            assert os.path.getsize(snap_file) > 10000, f"Snapshot too small: {snap_file}"

        # 2. Check anti-dump rule (no consecutive slices from the same source)
        for idx in range(len(clips) - 1):
            p1 = clips[idx]["clipPath"].lower()
            p2 = clips[idx + 1]["clipPath"].lower()
            if "slices" in p1 and "slices" in p2:
                # determine source of p1 and p2
                s1 = "cheaprv" if "cheaprv" in p1 or "ambulance_lot" in p1 or "interior_cozy" in p1 or "hazard_alert" in p1 or "water_problem" in p1 or "years_outside" in p1 or "miracle_safe" in p1 or "actionable_window" in p1 or "back_to_gravel" in p1 else ("govdeals" if "govdeals" in p1 or "aluminum" in p1 or "diesel_fuel" in p1 or "vented_heater" in p1 or "cold_aluminum" in p1 or "hard_walls" in p1 or "caseworker" in p1 or "legal_wall" in p1 else "ben_emily")
                s2 = "cheaprv" if "cheaprv" in p2 or "ambulance_lot" in p2 or "interior_cozy" in p2 or "hazard_alert" in p2 or "water_problem" in p2 or "years_outside" in p2 or "miracle_safe" in p2 or "actionable_window" in p2 or "back_to_gravel" in p2 else ("govdeals" if "govdeals" in p2 or "aluminum" in p2 or "diesel_fuel" in p2 or "vented_heater" in p2 or "cold_aluminum" in p2 or "hard_walls" in p2 or "caseworker" in p2 or "legal_wall" in p2 else "ben_emily")
                assert s1 != s2, f"Consecutive slices from same source '{s1}' at beats {idx} and {idx+1}!"

        print(f"[SUCCESS] Chapter {ch_num} is 100% verified!\n")

if __name__ == "__main__":
    prepareChapter06()
    prepareChapter07()
    verifyEverything()
