import os
import json
import subprocess

def get_audio_duration(path):
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "json",
        path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(json.loads(res.stdout)["format"]["duration"])

BASE_DIR = os.path.abspath(".")
TIMELINE_DIR = os.path.join(BASE_DIR, "uploads", "timelines", "camperbike")
os.makedirs(TIMELINE_DIR, exist_ok=True)

# -------------------------------------------------------------
# CHAPTER 1: Cold Open & The $150 Pod
# -------------------------------------------------------------
ch01_audio = os.path.join(BASE_DIR, "uploads", "audio", "camperbike", "ch01_cold.mp3")
ch01_dur = get_audio_duration(ch01_audio)

ch01_beats = [
    {
        "beatIndex": 0,
        "chapterIndex": 1,
        "text": "Six in the morning, the Pacific Northwest, and there is frost on everything.",
        "startTime": 0.0,
        "endTime": 4.87,
        "clipRel": "stock/stock_frost_morning.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "PACIFIC NORTHWEST • 06:00 AM",
            "line2": "MORNING FROST ADVISORY",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 1,
        "chapterIndex": 1,
        "text": "On the grass, on the shopping carts, on the tents, on the chain link fence.",
        "startTime": 4.87,
        "endTime": 10.06,
        "clipRel": "stock/stock_homeless_encampment.mp4"
    },
    {
        "beatIndex": 2,
        "chapterIndex": 1,
        "text": "Under an overpass, wedged between two concrete pillars, there's a small white shape, seven",
        "startTime": 10.06,
        "endTime": 16.42,
        "clipRel": "stock/stock_bridge_overpass.mp4"
    },
    {
        "beatIndex": 3,
        "chapterIndex": 1,
        "text": "feet long, rounded at the front like a loaf of bread, sitting on two bicycle wheels.",
        "startTime": 16.42,
        "endTime": 21.54,
        "clipRel": "slices/kirsten_breadloaf_profile_exterior.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "7 FT LENGTH • BREAD-LOAF SHAPE",
            "line2": "AERODYNAMIC COROPLAST SHELL",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 4,
        "chapterIndex": 1,
        "text": "It doesn't look like a house, it looks like something a courier company would tow behind a van.",
        "startTime": 21.54,
        "endTime": 26.90,
        "clipRel": "slices/bridges7_teardrop_bike_trailer.mp4"
    },
    {
        "beatIndex": 5,
        "chapterIndex": 1,
        "text": "There's frost on that too. But here's the thing, the frost is only on the outside.",
        "startTime": 26.90,
        "endTime": 32.09,
        "clipRel": "stock/stock_freezing_rain.mp4"
    },
    {
        "beatIndex": 6,
        "chapterIndex": 1,
        "text": "Inside, a man is asleep on a foam pad. Dry.",
        "startTime": 32.09,
        "endTime": 36.07,
        "clipRel": "slices/elkins_cozy_interior_bed.mp4"
    },
    {
        "beatIndex": 7,
        "chapterIndex": 1,
        "text": "Behind a door that's bolted from the inside.",
        "startTime": 36.07,
        "endTime": 38.97,
        "clipRel": "stock/stock_barrel_bolt_lock.mp4"
    },
    {
        "beatIndex": 8,
        "chapterIndex": 1,
        "text": "And the air around him is somewhere between 20 and 30 degrees warmer than the air three inches away on the other side of the wall.",
        "startTime": 38.97,
        "endTime": 46.82,
        "clipRel": "stock/stock_warm_sleep.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "+20°F TO +30°F WARMER INSIDE",
            "line2": "BODY HEAT RETENTION IN ENCLOSED VOLUME",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 9,
        "chapterIndex": 1,
        "text": "No heater, no flame, no electricity.",
        "startTime": 46.82,
        "endTime": 49.80,
        "clipRel": "stock/stock_fire_flame_stove.mp4"
    },
    {
        "beatIndex": 10,
        "chapterIndex": 1,
        "text": "There's a little butane stove on a full-down counter. A sink made from a breadpan.",
        "startTime": 49.80,
        "endTime": 55.37,
        "clipRel": "slices/elkins_folddown_counter_stove.mp4"
    },
    {
        "beatIndex": 11,
        "chapterIndex": 1,
        "text": "A skylight made from a plastic tub, letting in the first gray light of the day.",
        "startTime": 55.37,
        "endTime": 60.37,
        "clipRel": "slices/kirsten_skylight_vent_detail.mp4"
    },
    {
        "beatIndex": 12,
        "chapterIndex": 1,
        "text": "And the whole thing cost about $150. That includes the bicycle.",
        "startTime": 60.37,
        "endTime": 65.47,
        "clipRel": "stock/stock_dollar_cash.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "$150 TOTAL BUILD COST",
            "line2": "INCLUDES RECYCLED BICYCLE WHEELS",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 13,
        "chapterIndex": 1,
        "text": "Now, if you've ever spent a night outside in the cold, you already know how strange that sounds.",
        "startTime": 65.47,
        "endTime": 71.62,
        "clipRel": "stock/stock_nyc_steam_vent.mp4"
    },
    {
        "beatIndex": 14,
        "chapterIndex": 1,
        "text": "You know that frost doesn't just sit on your skin. It gets in your bones.",
        "startTime": 71.62,
        "endTime": 76.09,
        "clipRel": "slices/kirsten_towing_camper_bike.mp4"
    },
    {
        "beatIndex": 15,
        "chapterIndex": 1,
        "text": "And this man is lying there, warm, with the door bolted, listening to a quiet that most people on that street haven't heard in years.",
        "startTime": 76.09,
        "endTime": round(ch01_dur, 3),
        "clipRel": "stock/stock_deep_sleep_dream.mp4"
    }
]

# -------------------------------------------------------------
# CHAPTER 2: The Promise & Real Limits
# -------------------------------------------------------------
ch02_audio = os.path.join(BASE_DIR, "uploads", "audio", "camperbike", "ch02_promise.mp3")
ch02_dur = get_audio_duration(ch02_audio)

ch02_beats = [
    {
        "beatIndex": 0,
        "chapterIndex": 2,
        "text": "Let me say that again, because it sounds like a mistake, $150.",
        "startTime": 0.0,
        "endTime": 5.21,
        "clipRel": "stock/stock_dollar_cash.mp4"
    },
    {
        "beatIndex": 1,
        "chapterIndex": 2,
        "text": "A shelter you can pedal away, stay with me for the next few minutes,",
        "startTime": 5.21,
        "endTime": 10.42,
        "clipRel": "slices/kirsten_towing_camper_bike.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "$150 BICYCLE SHELTER",
            "line2": "PEDAL-POWERED MOBILE RETREAT",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 2,
        "chapterIndex": 2,
        "text": "and I'm going to show you exactly what $150 actually buys.",
        "startTime": 10.42,
        "endTime": 15.63,
        "clipRel": "stock/stock_cyclist_pedaling.mp4"
    },
    {
        "beatIndex": 3,
        "chapterIndex": 2,
        "text": "I'll show you why the walls of this thing hold themselves up without a frame, no studs, no ribs, nothing.",
        "startTime": 15.63,
        "endTime": 22.81,
        "clipRel": "slices/bridges7_white_breadloaf_build.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "FRAMELESS ARCHITECTURE",
            "line2": "ZERO INTERNAL RIBS OR STUDS",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 4,
        "chapterIndex": 2,
        "text": "I'll show you why the two most important parts of the whole build",
        "startTime": 22.81,
        "endTime": 26.64,
        "clipRel": "stock/stock_engineer_drafting.mp4"
    },
    {
        "beatIndex": 5,
        "chapterIndex": 2,
        "text": "are also the cheapest, a $2 bolt and a pair of wheels.",
        "startTime": 26.64,
        "endTime": 31.14,
        "clipRel": "slices/elkins_bike_wheel_axle.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "THE $2 BOLT & BICYCLE WHEELS",
            "line2": "CRITICAL HARDWARE FOR SECURITY & MOBILITY",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 6,
        "chapterIndex": 2,
        "text": "And I'm going to be honest with you about what this thing cannot do,",
        "startTime": 31.14,
        "endTime": 35.37,
        "clipRel": "stock/stock_window_condensation.mp4"
    },
    {
        "beatIndex": 7,
        "chapterIndex": 2,
        "text": "because the man who designed it refuses to oversell it,",
        "startTime": 35.37,
        "endTime": 39.27,
        "clipRel": "slices/drew_clean_door_hinges.mp4"
    },
    {
        "beatIndex": 8,
        "chapterIndex": 2,
        "text": "and so will I, because I don't want to sell you a fantasy.",
        "startTime": 39.27,
        "endTime": 43.41,
        "clipRel": "stock/stock_street_sweeper.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "NO FANTASIES • HONEST LIMITS",
            "line2": "ENGINEERED FOR REALISTIC URBAN SURVIVAL",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 9,
        "chapterIndex": 2,
        "text": "I want to show you something real with all of its limits",
        "startTime": 43.41,
        "endTime": 47.28,
        "clipRel": "stock/stock_homeless_encampment.mp4"
    },
    {
        "beatIndex": 10,
        "chapterIndex": 2,
        "text": "and let you decide what it means, because this is not a story about a miracle.",
        "startTime": 47.28,
        "endTime": 52.20,
        "clipRel": "stock/stock_sunrise_highway.mp4"
    },
    {
        "beatIndex": 11,
        "chapterIndex": 2,
        "text": "It's a story about one very stubborn question,",
        "startTime": 52.20,
        "endTime": 55.88,
        "clipRel": "slices/kirsten_breadloaf_profile_exterior.mp4"
    },
    {
        "beatIndex": 12,
        "chapterIndex": 2,
        "text": "and what happened when somebody actually bothered to answer it.",
        "startTime": 55.88,
        "endTime": round(ch02_dur, 3),
        "clipRel": "stock/stock_cyclist_pedaling.mp4"
    }
]

# -------------------------------------------------------------
# CHAPTER 3: What $150 Buys & The 60-lb Shell
# -------------------------------------------------------------
ch03_audio = os.path.join(BASE_DIR, "uploads", "audio", "camperbike", "ch03_what_150_buys.mp3")
ch03_dur = get_audio_duration(ch03_audio)

ch03_beats = [
    {
        "beatIndex": 0,
        "chapterIndex": 3,
        "text": "Let's start with the shopping list because it's almost funny.",
        "startTime": 0.0,
        "endTime": 3.51,
        "clipRel": "stock/stock_hardware_lumber.mp4"
    },
    {
        "beatIndex": 1,
        "chapterIndex": 3,
        "text": "Four recycled plastic campaign signs.",
        "startTime": 3.51,
        "endTime": 6.41,
        "clipRel": "slices/kirsten_triangle_signs_coroplast.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "4 RECYCLED CAMPAIGN SIGNS",
            "line2": "COROPLAST POLYPROPYLENE SHEETING",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 2,
        "chapterIndex": 3,
        "text": "One second hand bicycle, about $20, bought for the wheels and nothing else.",
        "startTime": 6.41,
        "endTime": 11.89,
        "clipRel": "stock/stock_bike_wheel_roll.mp4"
    },
    {
        "beatIndex": 3,
        "chapterIndex": 3,
        "text": "Six pine boards, one inch by two inch, about a dollar each at home depot.",
        "startTime": 11.89,
        "endTime": 17.45,
        "clipRel": "slices/kirsten_pine_floor_frame_signs.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "6 PINE 1x2 BOARDS ($1 EACH)",
            "line2": "MINIMAL WOOD SUBFLOOR PERIMETER",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 4,
        "chapterIndex": 3,
        "text": "Screws, duct tape, zip ties, bubble insulation, a can of spray paint.",
        "startTime": 17.45,
        "endTime": 22.89,
        "clipRel": "slices/drew_clean_fastening_panels.mp4"
    },
    {
        "beatIndex": 5,
        "chapterIndex": 3,
        "text": "That's it, $150 total.",
        "startTime": 22.89,
        "endTime": 26.40,
        "clipRel": "stock/stock_dollar_cash.mp4"
    },
    {
        "beatIndex": 6,
        "chapterIndex": 3,
        "text": "Now here's what fits inside a shell built from that list.",
        "startTime": 26.40,
        "endTime": 30.25,
        "clipRel": "slices/bridges7_white_breadloaf_build.mp4"
    },
    {
        "beatIndex": 7,
        "chapterIndex": 3,
        "text": "A bed, a butane stove, a sink, a counter,",
        "startTime": 30.25,
        "endTime": 34.00,
        "clipRel": "slices/elkins_folddown_counter_stove.mp4"
    },
    {
        "beatIndex": 8,
        "chapterIndex": 3,
        "text": "food storage shelves, bins for clothes, LED lighting, little plexiglass windows,",
        "startTime": 34.00,
        "endTime": 39.60,
        "clipRel": "slices/drew_clean_curved_roof.mp4"
    },
    {
        "beatIndex": 9,
        "chapterIndex": 3,
        "text": "a stereo, a pee jug because let's be real, and a skylight.",
        "startTime": 39.60,
        "endTime": 44.20,
        "clipRel": "stock/stock_engineer_drafting.mp4"
    },
    {
        "beatIndex": 10,
        "chapterIndex": 3,
        "text": "That skylight is my favorite part. It's a one gallon plastic tub.",
        "startTime": 44.20,
        "endTime": 48.94,
        "clipRel": "slices/elkins_plastic_tub_skylight.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "1-GALLON TUB SKYLIGHT",
            "line2": "POP-RIVETED PLEXIGLASS ESCAPE HATCH",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 11,
        "chapterIndex": 3,
        "text": "Somebody cut out the center and pop riveted a piece of plexiglass into the gap.",
        "startTime": 48.94,
        "endTime": 53.55,
        "clipRel": "stock/stock_utility_knife_cut.mp4"
    },
    {
        "beatIndex": 12,
        "chapterIndex": 3,
        "text": "It snaps shut, it lifts right out,",
        "startTime": 53.55,
        "endTime": 56.49,
        "clipRel": "slices/kirsten_skylight_vent_detail.mp4"
    },
    {
        "beatIndex": 13,
        "chapterIndex": 3,
        "text": "and the reading light inside is on a swivel, and it turns on when you touch it.",
        "startTime": 56.49,
        "endTime": 61.26,
        "clipRel": "slices/drew_clean_door_hinges.mp4"
    },
    {
        "beatIndex": 14,
        "chapterIndex": 3,
        "text": "Now, picture all of that loaded in. The foam pad, the stove, every last thing.",
        "startTime": 61.26,
        "endTime": 67.15,
        "clipRel": "stock/stock_warm_sleep.mp4"
    },
    {
        "beatIndex": 15,
        "chapterIndex": 3,
        "text": "The whole house weighs about 60 pounds. 60 pounds, you could pick your house up.",
        "startTime": 67.15,
        "endTime": round(ch03_dur, 3),
        "clipRel": "slices/kirsten_towing_camper_bike.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "TOTAL RIG WEIGHT: 60 LBS",
            "line2": "LIGHT ENOUGH TO LIFT BY HAND",
            "themeColor": "gold"
        }
    }
]

# -------------------------------------------------------------
# CHAPTER 4: The Arc & Frameless Physics
# -------------------------------------------------------------
ch04_audio = os.path.join(BASE_DIR, "uploads", "audio", "camperbike", "ch04_arc.mp3")
ch04_dur = get_audio_duration(ch04_audio)

ch04_beats = [
    {
        "beatIndex": 0,
        "chapterIndex": 4,
        "text": "So here's the question that bothered me when I first saw one of these. What's holding it up?",
        "startTime": 0.0,
        "endTime": 5.25,
        "clipRel": "slices/kirsten_breadloaf_profile_exterior.mp4"
    },
    {
        "beatIndex": 1,
        "chapterIndex": 4,
        "text": "Because look closely, and something is missing.",
        "startTime": 5.25,
        "endTime": 8.27,
        "clipRel": "stock/stock_engineer_drafting.mp4"
    },
    {
        "beatIndex": 2,
        "chapterIndex": 4,
        "text": "There is no frame, no ribs, no studs, no hidden skeleton.",
        "startTime": 8.27,
        "endTime": 13.34,
        "clipRel": "slices/bridges7_white_breadloaf_build.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "ZERO STUDS • ZERO RIBS",
            "line2": "UNSUPPORTED MONOCOQUE ENCLOSURE",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 3,
        "chapterIndex": 4,
        "text": "The only lumber in the entire build is a light wooden frame around the floor, with some cross-bracing underneath.",
        "startTime": 13.34,
        "endTime": 20.41,
        "clipRel": "slices/kirsten_pine_floor_frame_signs.mp4"
    },
    {
        "beatIndex": 4,
        "chapterIndex": 4,
        "text": "Above the floor line, it's plastic sheeting, and that's all it is.",
        "startTime": 20.41,
        "endTime": 24.57,
        "clipRel": "stock/stock_hardware_lumber.mp4"
    },
    {
        "beatIndex": 5,
        "chapterIndex": 4,
        "text": "So what's holding the walls up? The curve is.",
        "startTime": 24.57,
        "endTime": 28.12,
        "clipRel": "slices/drew_clean_wood_framing.mp4"
    },
    {
        "beatIndex": 6,
        "chapterIndex": 4,
        "text": "The man who designed this put it better than anyone could.",
        "startTime": 28.12,
        "endTime": 31.77,
        "clipRel": "stock/stock_engineer_drafting.mp4"
    },
    {
        "beatIndex": 7,
        "chapterIndex": 4,
        "text": "He said he was wondering what space you could make by arcing a sheet of fluted plastic lengthwise.",
        "startTime": 31.77,
        "endTime": 37.56,
        "clipRel": "slices/kirsten_triangle_signs_coroplast.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "ARCED FLUTED POLYPROPYLENE",
            "line2": "SINGLE 4x8 SHEET COMPRESSION",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 8,
        "chapterIndex": 4,
        "text": "That's the whole invention. One sentence.",
        "startTime": 37.56,
        "endTime": 40.69,
        "clipRel": "stock/stock_airplane_boeing.mp4"
    },
    {
        "beatIndex": 9,
        "chapterIndex": 4,
        "text": "Think about a flat sheet of plastic. It's floppy, barely stands on its own.",
        "startTime": 40.69,
        "endTime": 45.74,
        "clipRel": "slices/drew_clean_jigsaw_cutting.mp4"
    },
    {
        "beatIndex": 10,
        "chapterIndex": 4,
        "text": "But bend that same sheet into an arc, and suddenly it's rigid.",
        "startTime": 45.74,
        "endTime": 50.34,
        "clipRel": "slices/bridges7_white_breadloaf_build.mp4"
    },
    {
        "beatIndex": 11,
        "chapterIndex": 4,
        "text": "Because anything pushing down on the top has to squeeze the entire curve outward before it can collapse.",
        "startTime": 50.34,
        "endTime": 56.95,
        "clipRel": "stock/stock_stone_arch.mp4"
    },
    {
        "beatIndex": 12,
        "chapterIndex": 4,
        "text": "And the material fights that all along its length.",
        "startTime": 56.95,
        "endTime": 60.38,
        "clipRel": "slices/elkins_zipties_rivets_seam.mp4"
    },
    {
        "beatIndex": 13,
        "chapterIndex": 4,
        "text": "It's the same trick that holds up a stone bridge, a barrel vault, an egg,",
        "startTime": 60.38,
        "endTime": 65.32,
        "clipRel": "stock/stock_bridge_overpass.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "NATURAL BARREL VAULT PHYSICS",
            "line2": "FORCE DISTRIBUTION ALONG CURVATURE",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 14,
        "chapterIndex": 4,
        "text": "an egg shell is paper thin, and yet it takes real force to crush one from end to end.",
        "startTime": 65.32,
        "endTime": 71.40,
        "clipRel": "stock/stock_eggshell_curve.mp4"
    },
    {
        "beatIndex": 15,
        "chapterIndex": 4,
        "text": "Nature figured this out a long time ago.",
        "startTime": 71.40,
        "endTime": 74.09,
        "clipRel": "stock/stock_desert_festival.mp4"
    },
    {
        "beatIndex": 16,
        "chapterIndex": 4,
        "text": "So the arc is doing the job of a frame, which means every pound of framing you would normally need,",
        "startTime": 74.09,
        "endTime": 80.33,
        "clipRel": "slices/drew_clean_wood_framing.mp4"
    },
    {
        "beatIndex": 17,
        "chapterIndex": 4,
        "text": "and it would be most of the weight, simply isn't there.",
        "startTime": 80.33,
        "endTime": 83.70,
        "clipRel": "stock/stock_hardware_lumber.mp4"
    },
    {
        "beatIndex": 18,
        "chapterIndex": 4,
        "text": "That's why this thing weighs 60 pounds instead of 200.",
        "startTime": 83.70,
        "endTime": 87.68,
        "clipRel": "slices/bridges7_teardrop_bike_trailer.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "60 LBS VS 200 LBS FRAMED",
            "line2": "70% WEIGHT REDUCTION BY ELIMINATING RIBS",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 19,
        "chapterIndex": 4,
        "text": "And it's why an ordinary person can tow it on an ordinary bicycle up an ordinary hill.",
        "startTime": 87.68,
        "endTime": 93.76,
        "clipRel": "slices/kirsten_towing_camper_bike.mp4"
    },
    {
        "beatIndex": 20,
        "chapterIndex": 4,
        "text": "And there's a side effect nobody would have predicted.",
        "startTime": 93.76,
        "endTime": 96.86,
        "clipRel": "stock/stock_cyclist_pedaling.mp4"
    },
    {
        "beatIndex": 21,
        "chapterIndex": 4,
        "text": "The curved front wall ends up strong enough to lean on.",
        "startTime": 96.86,
        "endTime": 100.43,
        "clipRel": "slices/drew_clean_curved_roof.mp4"
    },
    {
        "beatIndex": 22,
        "chapterIndex": 4,
        "text": "You can sit up in bed and put your back against the wall of a plastic house.",
        "startTime": 100.43,
        "endTime": round(ch04_dur, 3),
        "clipRel": "slices/elkins_resting_against_arched_wall.mp4"
    }
]

def format_chapter(audio_path, total_dur, raw_beats, out_path):
    clips = []
    for b in raw_beats:
        clip_full = os.path.join(BASE_DIR, "uploads", "raw", "proj_camperbike", b["clipRel"])
        if not os.path.exists(clip_full):
            raise FileNotFoundError(f"Clip not found: {clip_full}")
        c = {
            "beatIndex": b["beatIndex"],
            "chapterIndex": b["chapterIndex"],
            "text": b["text"],
            "startTime": b["startTime"],
            "endTime": b["endTime"],
            "duration": round(b["endTime"] - b["startTime"], 3),
            "clipPath": clip_full,
            "layout": "full_bleed_cinematic",
            "kenBurns": True,
            "transitionType": "cut",
            "transitionDuration": 0
        }
        if "callout" in b:
            c["callout"] = b["callout"]
        clips.append(c)

    tl = {
        "masterAudioPath": audio_path,
        "totalDuration": total_dur,
        "clips": clips
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(tl, f, indent=2)
    print(f"Staged {out_path} ({len(clips)} clips, {total_dur:.2f}s)")

if __name__ == "__main__":
    format_chapter(ch01_audio, ch01_dur, ch01_beats, os.path.join(TIMELINE_DIR, "chapter_01_final.json"))
    format_chapter(ch02_audio, ch02_dur, ch02_beats, os.path.join(TIMELINE_DIR, "chapter_02_final.json"))
    format_chapter(ch03_audio, ch03_dur, ch03_beats, os.path.join(TIMELINE_DIR, "chapter_03_final.json"))
    format_chapter(ch04_audio, ch04_dur, ch04_beats, os.path.join(TIMELINE_DIR, "chapter_04_final.json"))
