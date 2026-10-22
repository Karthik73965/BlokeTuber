import os
import sys
import json
import datetime
import subprocess

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def abs_path(rel_path):
    return os.path.normpath(os.path.join(REPO_ROOT, rel_path)).replace("\\", "/")

def get_media_duration(path):
    cmd = ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", path]
    res = subprocess.check_output(cmd)
    data = json.loads(res)
    return float(data["format"]["duration"])

TIMELINE_DIR = os.path.join(REPO_ROOT, "uploads", "timelines", "camperbike")
os.makedirs(TIMELINE_DIR, exist_ok=True)

# -------------------------------------------------------------
# AUDIO SOURCES & DURATIONS
# -------------------------------------------------------------
CH05_AUDIO = abs_path("uploads/audio/camperbike/ch05_material.mp3")
CH06_AUDIO = abs_path("uploads/audio/camperbike/ch06_man_behind_it.mp3")
CH07_AUDIO = abs_path("uploads/audio/camperbike/ch07_family_of_designs.mp3")

CH05_DUR = get_media_duration(CH05_AUDIO)
CH06_DUR = get_media_duration(CH06_AUDIO)
CH07_DUR = get_media_duration(CH07_AUDIO)

print(f"Chapter 05 Duration: {CH05_DUR:.3f}s")
print(f"Chapter 06 Duration: {CH06_DUR:.3f}s")
print(f"Chapter 07 Duration: {CH07_DUR:.3f}s")

# -------------------------------------------------------------
# CHAPTER 05 BEATS DEFINITION
# -------------------------------------------------------------
CH05_BEATS = [
    {
        "beatIndex": 0,
        "chapterIndex": 5,
        "text": "Now the plastic itself. It goes by a few names.",
        "startTime": 0.0,
        "endTime": 3.76,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/kirsten_campaign_sign_lettering.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "COROPLAST • FLUTED POLYPROPYLENE",
            "line2": "4MM TWIN-WALL EXTRUDED SHEET",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 1,
        "chapterIndex": 5,
        "text": "Corroplast, fluted plastic, corrugated plastic.",
        "startTime": 3.76,
        "endTime": 7.32,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_utility_knife_cut.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 2,
        "chapterIndex": 5,
        "text": "Same thing, different labels. And I promise you've seen thousands of these.",
        "startTime": 7.32,
        "endTime": 12.28,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/elkins_campaign_signs_coroplast.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 3,
        "chapterIndex": 5,
        "text": "It's what political yard signs are made of. Think about that for a second. Every election,",
        "startTime": 12.28,
        "endTime": 18.24,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_yard_signs.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 4,
        "chapterIndex": 5,
        "text": "millions of them go into the ground. A few weeks later they come out and go into a dumpster.",
        "startTime": 18.24,
        "endTime": 23.62,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/drew_fastening_exterior_panels.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 5,
        "chapterIndex": 5,
        "text": "All those promises about a better future headed for the landfill.",
        "startTime": 23.62,
        "endTime": 28.80,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_landfill_waste.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 6,
        "chapterIndex": 5,
        "text": "Structurally, it's a plastic sandwich with vertical channels running through the middle.",
        "startTime": 28.80,
        "endTime": 33.20,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/kirsten_pine_floor_frame_signs.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "TWIN-WALL AIR CHANNELS",
            "line2": "INTERNAL FLUTE ARCHITECTURE",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 7,
        "chapterIndex": 5,
        "text": "Basically cardboard, but waterproof.",
        "startTime": 33.20,
        "endTime": 37.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_window_condensation.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 8,
        "chapterIndex": 5,
        "text": "And those channels aren't just there for strength. They're trapped air.",
        "startTime": 37.50,
        "endTime": 41.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/elkins_arcing_plastic_sheet.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 9,
        "chapterIndex": 5,
        "text": "And trapped air is insulation. This stuff is quietly a thermal panel. And nobody thinks of it that way.",
        "startTime": 41.50,
        "endTime": 46.64,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_insulation_panel.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 10,
        "chapterIndex": 5,
        "text": "You can also buy it new. A pack of 10 white sheets, 4 feet by 8 feet, 4 millimeters thick,",
        "startTime": 46.64,
        "endTime": 52.84,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/drew_foam_insulation_sheets.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 11,
        "chapterIndex": 5,
        "text": "is a standard item at home depot. And here's the number that changes how you think about the whole problem.",
        "startTime": 52.84,
        "endTime": 58.68,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_hardware_lumber.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 12,
        "chapterIndex": 5,
        "text": "From a stack of these sheets, 50 inches tall, you can build 50 houses.",
        "startTime": 58.68,
        "endTime": 63.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/kirsten_breadloaf_profile_exterior.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 13,
        "chapterIndex": 5,
        "text": "Zip ties hold them together.",
        "startTime": 63.50,
        "endTime": 67.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_cargo_van.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 14,
        "chapterIndex": 5,
        "text": "50 houses in a stack you could fit in the back of a van. Now the obvious objection.",
        "startTime": 67.50,
        "endTime": 72.80,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/elkins_zipties_rivets_seam.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "ZIP-TIE & POP-RIVET SEAMS",
            "line2": "HIGH-TENSILE MECHANICAL FASTENERS",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 15,
        "chapterIndex": 5,
        "text": "Plastic sheeting sounds like something that lasts one winter. The designer had the same worry.",
        "startTime": 72.80,
        "endTime": 78.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_winter_subway_steam.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 16,
        "chapterIndex": 5,
        "text": "So before he published his plans, he left one outside, fully exposed to the weather and waited.",
        "startTime": 78.50,
        "endTime": 83.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/bridges_winter_weather_protection.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "WATERPROOF & UV RESISTANT",
            "line2": "4-YEAR OUTDOOR WEATHER TEST",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 17,
        "chapterIndex": 5,
        "text": "After nearly four years, he says he can still give it a good punch without doing any damage.",
        "startTime": 83.00,
        "endTime": 87.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_freezing_rain.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 18,
        "chapterIndex": 5,
        "text": "He adds one honest caveat.",
        "startTime": 87.50,
        "endTime": 92.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/kirsten_arch_wall_strength_press.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 19,
        "chapterIndex": 5,
        "text": "He lives in a mild wet climate. If you're somewhere hot and dry,",
        "startTime": 92.50,
        "endTime": 97.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_bridge_overpass.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 20,
        "chapterIndex": 5,
        "text": "he'd be careful about leaving it",
        "startTime": 97.50,
        "endTime": 100.20,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/elkins_white_breadloaf_exterior.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 21,
        "chapterIndex": 5,
        "text": "in direct sun for too long.",
        "startTime": 100.20,
        "endTime": CH05_DUR,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_scorching_sun.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    }
]

# -------------------------------------------------------------
# CHAPTER 06 BEATS DEFINITION
# -------------------------------------------------------------
CH06_BEATS = [
    {
        "beatIndex": 0,
        "chapterIndex": 6,
        "text": "His name is Paul Elkins. He's from Washington State,",
        "startTime": 0.0,
        "endTime": 3.46,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/elkins_towing_bike_field.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 1,
        "chapterIndex": 6,
        "text": "and he spent his working life as an engineer at Boeing.",
        "startTime": 3.46,
        "endTime": 7.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_airplane_boeing.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "PAUL ELKINS • BOEING ENGINEER",
            "line2": "AEROSPACE CAD & STRUCTURAL BACKGROUND",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 2,
        "chapterIndex": 6,
        "text": "American hideaways. True page five.",
        "startTime": 7.50,
        "endTime": 11.10,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/kirsten_towing_camper_bike.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 3,
        "chapterIndex": 6,
        "text": "But here's what matters. Paul didn't come to small spaces as a designer.",
        "startTime": 11.10,
        "endTime": 15.60,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_engineer_drafting.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 4,
        "chapterIndex": 6,
        "text": "He came to them as a person who had lived in them.",
        "startTime": 15.60,
        "endTime": 19.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/drew_woodworking_framing.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 5,
        "chapterIndex": 6,
        "text": "At 19, he moved into a winterized bread delivery truck.",
        "startTime": 19.50,
        "endTime": 24.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_delivery_truck.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "1970s BREAD TRUCK CAMPER",
            "line2": "FIRST EXTENDED WINTER HABITATION",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 6,
        "chapterIndex": 6,
        "text": "Years later, he got laid off, and he built himself a stealth camper on the back of his pickup.",
        "startTime": 24.50,
        "endTime": 28.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_pickup_truck.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 7,
        "chapterIndex": 6,
        "text": "Out of half-inch plywood, and whatever hardware was lying around, he lived in it.",
        "startTime": 28.50,
        "endTime": 33.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/elkins_cozy_interior_bed.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 8,
        "chapterIndex": 6,
        "text": "In 2002, he toured the entire country in it.",
        "startTime": 33.50,
        "endTime": 38.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_sunrise_highway.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 9,
        "chapterIndex": 6,
        "text": "So when he finally started designing shelters, he wasn't an architect imagining what it might be like.",
        "startTime": 38.50,
        "endTime": 43.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/kirsten_table_counter_foldout.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 10,
        "chapterIndex": 6,
        "text": "He was a man who had already spent big stretches of his adult life sleeping in a box he built himself.",
        "startTime": 43.50,
        "endTime": 49.80,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_warm_sleep.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 11,
        "chapterIndex": 6,
        "text": "And he knew exactly what he wished that box had done better.",
        "startTime": 49.80,
        "endTime": 54.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/elkins_resting_against_arched_wall.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 12,
        "chapterIndex": 6,
        "text": "His first burning man build tells you everything about how he thinks.",
        "startTime": 54.00,
        "endTime": 58.40,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_desert_festival.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "BURNING MAN DESERT PROTOTYPE",
            "line2": "PLAYA TESTED • 60-MPH WINDS",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 13,
        "chapterIndex": 6,
        "text": "The skin was quarter-inch fluted plastic, riveted onto aluminum tubing, salvaged from an old satellite dish.",
        "startTime": 58.40,
        "endTime": 63.14,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/kirsten_arch_wall_strength_press.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 14,
        "chapterIndex": 6,
        "text": "The base was fur. The corner supports a recycled card table.",
        "startTime": 63.14,
        "endTime": 67.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_hardware_lumber.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 15,
        "chapterIndex": 6,
        "text": "The wheels came off a wheelbarrow.",
        "startTime": 67.50,
        "endTime": 72.20,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/drew_wheels_axle_mounting.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 16,
        "chapterIndex": 6,
        "text": "It survived 60 mile-an-hour winds and temperatures over 100 degrees.",
        "startTime": 72.20,
        "endTime": 77.02,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_bike_wheel_roll.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 17,
        "chapterIndex": 6,
        "text": "And his own description of that parts list might be the most useful line in this whole story.",
        "startTime": 77.02,
        "endTime": 82.30,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/elkins_white_breadloaf_exterior.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 18,
        "chapterIndex": 6,
        "text": "He said it was whatever he had kicking around at the time,",
        "startTime": 82.30,
        "endTime": 86.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_utility_knife_cut.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 19,
        "chapterIndex": 6,
        "text": "and that this is how anyone would have to do it if worse came to worst.",
        "startTime": 86.50,
        "endTime": 90.54,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/kirsten_skylight_vent_detail.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 20,
        "chapterIndex": 6,
        "text": "He sells the plans for about $20, 64 pages,",
        "startTime": 90.54,
        "endTime": 95.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_blueprints_plans.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "$20 BUILD PLANS • 64 PAGES",
            "line2": "OPEN-SOURCE SHELTER SCHEMATICS",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 21,
        "chapterIndex": 6,
        "text": "plans for dog houses, kayaks, even a teepee, all from the same material.",
        "startTime": 95.00,
        "endTime": 100.18,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_kayak_water.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 22,
        "chapterIndex": 6,
        "text": "He gave away the knowledge instead of the object, and it traveled.",
        "startTime": 100.18,
        "endTime": 104.96,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/elkins_towing_bike_field.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 23,
        "chapterIndex": 6,
        "text": "In Germany, his bike campers started an entire movement.",
        "startTime": 104.96,
        "endTime": 108.86,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_bicycle_touring.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "FAHRRAD-WOHNWAGEN MOVEMENT",
            "line2": "EUROPEAN DIY CAMPER COMMUNITY",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 24,
        "chapterIndex": 6,
        "text": "They call them Farad Wohnwagen.",
        "startTime": 108.86,
        "endTime": CH06_DUR,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_cyclist_pedaling.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    }
]

# -------------------------------------------------------------
# CHAPTER 07 BEATS DEFINITION
# -------------------------------------------------------------
CH07_BEATS = [
    {
        "beatIndex": 0,
        "chapterIndex": 7,
        "text": "Now, the bike camper is the famous one, but it isn't the one built for homelessness.",
        "startTime": 0.0,
        "endTime": 5.58,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/elkins_white_breadloaf_exterior.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 1,
        "chapterIndex": 7,
        "text": "It's actually the third in a family, and the other two are worth knowing.",
        "startTime": 5.58,
        "endTime": 10.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_stone_arch.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 2,
        "chapterIndex": 7,
        "text": "The first is the homeless emergency shelter. The bike camper is its direct descendant,",
        "startTime": 10.00,
        "endTime": 14.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/bridges7_emergency_shelter_pod.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "EMERGENCY HOMELESS SHELTER (22.5 SQ FT)",
            "line2": "FLUTED PLASTIC RAPID DEPLOYMENT POD",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 3,
        "chapterIndex": 7,
        "text": "with the same arched panels, the same trick, and the same total absence of a frame.",
        "startTime": 14.50,
        "endTime": 18.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_eggshell_curve.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 4,
        "chapterIndex": 7,
        "text": "22 and a half square feet, 40 inches wide, 81 long,",
        "startTime": 18.50,
        "endTime": 22.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/kirsten_arch_wall_strength_press.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 5,
        "chapterIndex": 7,
        "text": "built for under $100. American hideaways. Page 6.",
        "startTime": 22.50,
        "endTime": 27.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_dollar_cash.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 6,
        "chapterIndex": 7,
        "text": "And what inspired it is not what you'd expect from a design object.",
        "startTime": 27.50,
        "endTime": 32.14,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/drew_fastening_exterior_panels.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 7,
        "chapterIndex": 7,
        "text": "Two books, Zero Yen Houses, by Kyohe Sakaguchi,",
        "startTime": 32.14,
        "endTime": 36.48,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_reading_book.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "INSPIRED BY 'ZERO YEN HOUSES'",
            "line2": "KYOHEI SAKAGUCHI JAPANESE STUDY",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 8,
        "chapterIndex": 7,
        "text": "a study of the homes that homeless people in Japan build for themselves.",
        "startTime": 36.48,
        "endTime": 41.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_tokyo_street.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 9,
        "chapterIndex": 7,
        "text": "And fragile dwelling by Margaret Morton, a photographic record of the shelter's people built in New York.",
        "startTime": 41.50,
        "endTime": 46.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_manhattan_winter_street.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 10,
        "chapterIndex": 7,
        "text": "Read that again. Before he designed anything, this engineer went and looked",
        "startTime": 46.50,
        "endTime": 51.20,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_engineer_drafting.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 11,
        "chapterIndex": 7,
        "text": "at what people with no money had already worked out on their own.",
        "startTime": 51.20,
        "endTime": 56.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/bridges_storage_of_possessions.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 12,
        "chapterIndex": 7,
        "text": "The second design is a push cart, and honestly, it shouldn't be possible.",
        "startTime": 56.50,
        "endTime": 61.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_bridge_overpass.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 13,
        "chapterIndex": 7,
        "text": "19 and a half square feet, 78 inches long, 36 wide.",
        "startTime": 61.50,
        "endTime": 66.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/bridges7_pushcart_shelter.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "PUSHCART WITH SHOWER & TOILET (19.5 SQ FT)",
            "line2": "SELF-CONTAINED MOBILE SANITATION POD",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 14,
        "chapterIndex": 7,
        "text": "Inside that, an indoor shower fed by rainwater catchment, a gravity-fed sink,",
        "startTime": 66.50,
        "endTime": 71.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_hardware_lumber.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 15,
        "chapterIndex": 7,
        "text": "a one-burner propane stove, and a toilet bucket with kitty litter,",
        "startTime": 71.00,
        "endTime": 75.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/elkins_breadpan_sink_water.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 16,
        "chapterIndex": 7,
        "text": "a shower and a toilet in 19 square feet on a cart you push.",
        "startTime": 75.50,
        "endTime": 80.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_fire_flame_stove.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 17,
        "chapterIndex": 7,
        "text": "There's even a fourth design, heavier, around 225 pounds.",
        "startTime": 80.00,
        "endTime": 85.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/bridges7_vending_business_stall.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "VENDING & GOODS STALL (225 LBS)",
            "line2": "DAYTIME RETAIL • NIGHTTIME SLEEPER",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 18,
        "chapterIndex": 7,
        "text": "It's watertight for sleeping at night, and in the daytime,",
        "startTime": 85.00,
        "endTime": 90.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_deep_sleep_dream.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 19,
        "chapterIndex": 7,
        "text": "it opens up into a stall for displaying and selling goods.",
        "startTime": 90.00,
        "endTime": 95.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/kirsten_table_counter_foldout.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 20,
        "chapterIndex": 7,
        "text": "Because a lot of people on the street earn money by selling or collecting.",
        "startTime": 95.00,
        "endTime": 99.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_street_vendor.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 21,
        "chapterIndex": 7,
        "text": "And a shelter that can't also be a workplace",
        "startTime": 99.50,
        "endTime": 102.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices/bridges_urban_sidewalk_campers.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 22,
        "chapterIndex": 7,
        "text": "costs you your income.",
        "startTime": 102.50,
        "endTime": CH07_DUR,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_homeless_encampment.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    }
]

# Calculate duration for each beat
for beats in [CH05_BEATS, CH06_BEATS, CH07_BEATS]:
    for b in beats:
        b["duration"] = round(b["endTime"] - b["startTime"], 3)

# -------------------------------------------------------------
# SAVE TIMELINES
# -------------------------------------------------------------
timeline_specs = [
    (5, CH05_AUDIO, CH05_DUR, CH05_BEATS, "chapter_05_final.json"),
    (6, CH06_AUDIO, CH06_DUR, CH06_BEATS, "chapter_06_final.json"),
    (7, CH07_AUDIO, CH07_DUR, CH07_BEATS, "chapter_07_final.json")
]

for ch_idx, audio_path, dur, beats, fname in timeline_specs:
    timeline_doc = {
        "masterAudioPath": audio_path,
        "totalDuration": dur,
        "clips": beats
    }
    out_file = os.path.join(TIMELINE_DIR, fname)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(timeline_doc, f, indent=2, ensure_ascii=False)
    print(f"Saved timeline {fname} ({len(beats)} beats, {dur:.2f}s)")

# -------------------------------------------------------------
# EXTRACT BEAT SNAPSHOTS (50% midpoint)
# -------------------------------------------------------------
for ch_idx, _, _, beats, _ in timeline_specs:
    snap_dir = os.path.join(REPO_ROOT, "uploads", "beat_snapshots", f"camperbike_ch{ch_idx:02d}")
    os.makedirs(snap_dir, exist_ok=True)
    print(f"Extracting beat snapshots to {snap_dir}...")
    for b in beats:
        idx = b["beatIndex"]
        b_dur = b["duration"]
        mid_ss = max(0.5, b_dur / 2.0)
        out_snap = os.path.join(snap_dir, f"beat_{idx:02d}.jpg")
        cmd = [
            "ffmpeg", "-nostdin", "-y",
            "-ss", str(mid_ss),
            "-i", b["clipPath"],
            "-vframes", "1",
            "-q:v", "2",
            out_snap
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Extracted {len(beats)} snapshots for Ch {ch_idx:02d}")

# -------------------------------------------------------------
# SYNC TIMELINES INTO projects.json (Both root and apps/api)
# -------------------------------------------------------------
stores = [
    os.path.join(REPO_ROOT, "output", "store", "projects.json"),
    os.path.join(REPO_ROOT, "apps", "api", "output", "store", "projects.json")
]

for store_path in stores:
    if not os.path.exists(store_path):
        print(f"Store not found: {store_path}")
        continue
    with open(store_path, "r", encoding="utf-8") as f:
        projects = json.load(f)
    
    # Locate proj_camperbike_hideaways
    found_proj = False
    for p in projects:
        if p.get("id") == "proj_camperbike_hideaways":
            found_proj = True
            chapters = p.get("chapters", [])
            for ch in chapters:
                c_idx = ch.get("chapterIndex")
                if c_idx in [5, 6, 7]:
                    # Find corresponding timeline spec
                    spec = [s for s in timeline_specs if s[0] == c_idx][0]
                    dur, beats, fname = spec[2], spec[3], spec[4]
                    ch["timelineJson"] = {
                        "masterAudioPath": spec[1],
                        "totalDuration": dur,
                        "clips": beats
                    }
                    ch["clips"] = beats
                    ch["status"] = "staged"
                    ch["updatedAt"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
                    print(f"Updated ch{c_idx:02d} in {os.path.relpath(store_path, REPO_ROOT)}")
    if found_proj:
        with open(store_path, "w", encoding="utf-8") as f:
            json.dump(projects, f, indent=2, ensure_ascii=False)
        print(f"Successfully synced {os.path.relpath(store_path, REPO_ROOT)}")
    else:
        print(f"proj_camperbike_hideaways not found in {store_path}")

print("Staging and syncing complete!")
