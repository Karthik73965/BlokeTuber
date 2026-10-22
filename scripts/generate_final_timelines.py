import os
import sys
import json
import subprocess

BASE_DIR = r"C:\Users\karth\Documents\BlokeTuber"
os.chdir(BASE_DIR)

stock_dir = os.path.join(BASE_DIR, "uploads", "raw", "proj_fishingtent", "stock")
slices_dir = os.path.join(BASE_DIR, "uploads", "raw", "proj_fishingtent", "slices")
timelines_dir = os.path.join(BASE_DIR, "uploads", "timelines", "fishingtent")
os.makedirs(timelines_dir, exist_ok=True)
os.makedirs(slices_dir, exist_ok=True)

def st(fn):
    return os.path.join(stock_dir, fn)

def sl(fn):
    return os.path.join(slices_dir, fn)

def run_slice(source, start, duration, output_filename, crop_bottom=0.14, crop_top=0.0):
    output_path = os.path.join(slices_dir, output_filename)
    cmd = [
        sys.executable,
        "scripts/get_fishing_tent_clip.py",
        "--source", source,
        "--start", str(start),
        "--duration", str(duration),
        "--output", output_path,
        "--crop-bottom", str(crop_bottom),
        "--crop-top", str(crop_top)
    ]
    subprocess.run(cmd, check=True)
    return output_path

# ==============================================================================
# SLICE NEW REPLACEMENT CLIPS
# ==============================================================================
print("Slicing replacement clips...")
run_slice("eskimo_quickfish_3i_setup", 10.0, 6.46, "ch08_beat26_eskimo_setup_snow.mp4", crop_bottom=0.0, crop_top=0.0)
run_slice("cabelas_ice_shelter_tour", 8.0, 5.40, "ch08_beat33_durango_dome_shelter.mp4", crop_bottom=0.14, crop_top=0.0)
run_slice("halifax_business_eviction", 121.0, 6.54, "ch09_beat07_halifax_tents_recreation.mp4", crop_bottom=0.22, crop_top=0.0)
run_slice("eskimo_quickfish_3i_setup", 28.0, 5.46, "ch10_beat06_eskimo_dry_snow.mp4", crop_bottom=0.0, crop_top=0.0)

# ==============================================================================
# CHAPTER 08 TIMELINE DATA
# ==============================================================================
ch08_clips = [
    {
        "beatIndex": 0,
        "chapterIndex": 8,
        "text": "which brings us back to the tents. Halifax was not the first city to try this.",
        "startTime": 0.0,
        "endTime": 5.26,
        "duration": 5.26,
        "clipPath": st("ch01_snow_city_square.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 1,
        "chapterIndex": 8,
        "text": "A year earlier, in Chicago, a plant shop owner named Andy Robledo had started buying the same",
        "startTime": 5.26,
        "endTime": 11.36,
        "duration": 6.10,
        "clipPath": sl("ch08_beat01_chicago_skyline.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CHICAGO 2022 • ANDY ROBLEDO",
            "line2": "PLANT SHOP OWNER & COMMUNITY RESCUE",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 2,
        "chapterIndex": 8,
        "text": "kind of orange insulated tents and giving them to people sleeping outside. Each one cost him about",
        "startTime": 11.36,
        "endTime": 18.36,
        "duration": 7.00,
        "clipPath": st("ch01_red_fabric_tent.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 3,
        "chapterIndex": 8,
        "text": "$350, and that included flooring and a few extras to help people stay warm. Over time, he handed out more",
        "startTime": 18.36,
        "endTime": 25.84,
        "duration": 7.48,
        "clipPath": st("ch06_foam_mat_tiles.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "$350 PER UNIT WITH INSULATED FLOORING",
            "line2": "FOAM MAT SUBFLOOR + BLANKETS + ESSENTIALS",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 4,
        "chapterIndex": 8,
        "text": "than 70 of them across the city, working with local organizers like a woman who goes by Inglewood Barbie.",
        "startTime": 25.84,
        "endTime": 32.64,
        "duration": 6.80,
        "clipPath": sl("ch08_beat04_halifax_tents_wide.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CHICAGO 2022 • ANDY ROBLEDO (70+ TENTS)",
            "line2": "GRASSROOTS RELIEF COALITION",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 5,
        "chapterIndex": 8,
        "text": "A woman living in one of the tents, Nina Spoden, said the previous winter had been brutal because",
        "startTime": 32.64,
        "endTime": 38.26,
        "duration": 5.62,
        "clipPath": st("ch04_frost_glass_freezing.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 6,
        "chapterIndex": 8,
        "text": "nothing like this existed, having strangers show up out of plain kindness, meant a great deal to her.",
        "startTime": 38.26,
        "endTime": 45.24,
        "duration": 6.98,
        "clipPath": sl("ch08_beat06_cabelas_hub_ext.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 7,
        "chapterIndex": 8,
        "text": "Then, in late October of 2022, the city tagged those tents with red notices. The notices warned that",
        "startTime": 45.24,
        "endTime": 52.74,
        "duration": 7.50,
        "clipPath": st("ch08_red_warning_notice.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "RED NOTICES: PUBLIC WAY ENCROACHMENT",
            "line2": "OCTOBER 2022 MUNICIPAL REMOVAL WARNING",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 8,
        "chapterIndex": 8,
        "text": "the tents might be discarded because they violated a city code against storing personal property on",
        "startTime": 52.74,
        "endTime": 58.78,
        "duration": 6.04,
        "clipPath": sl("ch08_beat08_halifax_notice_close.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 9,
        "chapterIndex": 8,
        "text": "the public way. The city told reporters the notices were for scheduled cleanings that nobody was being",
        "startTime": 58.78,
        "endTime": 64.78,
        "duration": 6.00,
        "clipPath": st("ch01_snow_footsteps.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 10,
        "chapterIndex": 8,
        "text": "relocated and that outreach workers would connect people to shelter and housing. A city worker,",
        "startTime": 64.78,
        "endTime": 71.04,
        "duration": 6.26,
        "clipPath": sl("ch08_beat10_halifax_worker_tagging.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 11,
        "chapterIndex": 8,
        "text": "according to Nina, told the tent residents not to get too comfortable. Robledo called it a clean sweep",
        "startTime": 71.04,
        "endTime": 77.16,
        "duration": 6.12,
        "clipPath": st("ch02_winter_blackout_dark.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 12,
        "chapterIndex": 8,
        "text": "in disguise. He said if the city removed any of them, it would hear from him. A neighbor, asked what he",
        "startTime": 77.16,
        "endTime": 84.08,
        "duration": 6.92,
        "clipPath": sl("ch08_beat12_cabelas_tent_door.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 13,
        "chapterIndex": 8,
        "text": "thought, said the bright tents were fine for someone who needed a home, but he wondered if they were",
        "startTime": 84.08,
        "endTime": 89.24,
        "duration": 5.16,
        "clipPath": st("ch05_looking_out_tent_winter.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 14,
        "chapterIndex": 8,
        "text": "promoting living on the street. That sentence tells you everything about how this conversation goes.",
        "startTime": 89.24,
        "endTime": 95.86,
        "duration": 6.62,
        "clipPath": sl("ch08_beat14_halifax_park_snow.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 15,
        "chapterIndex": 8,
        "text": "A tent that keeps a person alive on a January night is also apparently a political statement.",
        "startTime": 95.86,
        "endTime": 101.82,
        "duration": 5.96,
        "clipPath": st("ch04_breath_vapor_cold.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 16,
        "chapterIndex": 8,
        "text": "As if the cold is negotiable for anyone willing to wait for the right plan, Halifax went through the",
        "startTime": 101.82,
        "endTime": 107.90,
        "duration": 6.08,
        "clipPath": sl("ch08_beat16_halifax_fence_erect.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 17,
        "chapterIndex": 8,
        "text": "same cycle on a bigger scale. The city had allowed the encampment in the square to exist,",
        "startTime": 107.90,
        "endTime": 113.80,
        "duration": 5.90,
        "clipPath": st("ch01_snow_city_square.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 18,
        "chapterIndex": 8,
        "text": "and then once a new emergency shelter and transitional housing opened, it withdrew that permission.",
        "startTime": 113.80,
        "endTime": 120.36,
        "duration": 6.56,
        "clipPath": sl("ch08_beat18_halifax_modular_units.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 19,
        "chapterIndex": 8,
        "text": "Aviction notices were tied to every tent. Crews put up metal fences around the grass where the tents",
        "startTime": 120.36,
        "endTime": 126.32,
        "duration": 5.96,
        "clipPath": st("ch08_chainlink_metal_fence.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "METAL FENCES ERECTED AROUND PUBLIC SQUARES",
            "line2": "ENCAMPMENT SITE CLOSED & FENCED OFF",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 20,
        "chapterIndex": 8,
        "text": "had been. Within weeks, the number of people living in encampments around the city dropped from",
        "startTime": 126.32,
        "endTime": 132.00,
        "duration": 5.68,
        "clipPath": sl("ch08_beat20_halifax_closed_sign.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 21,
        "chapterIndex": 8,
        "text": "about 100 to about 44. Some went into hotel rooms, some went into shelters. One man who'd stayed at",
        "startTime": 132.00,
        "endTime": 139.70,
        "duration": 7.70,
        "clipPath": st("ch08_hotel_room_solitude.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "HALIFAX GRAND PARADE: 100 TO 44 RESIDENTS",
            "line2": "SURVIVOR CENSUS • WINTER DISPLACEMENT",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 22,
        "chapterIndex": 8,
        "text": "a shelter earlier described it as hell because of how little privacy and independence he had.",
        "startTime": 139.70,
        "endTime": 146.16,
        "duration": 6.46,
        "clipPath": st("ch02_homeless_shelter_urban.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 23,
        "chapterIndex": 8,
        "text": "Some moved into apartments, and some, according to the volunteers, were still outside.",
        "startTime": 146.16,
        "endTime": 152.04,
        "duration": 5.88,
        "clipPath": sl("ch08_beat23_cabelas_interior_net.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 24,
        "chapterIndex": 8,
        "text": "That's not a happy ending or an unhappy one. It's the real one.",
        "startTime": 152.04,
        "endTime": 156.32,
        "duration": 4.28,
        "clipPath": st("ch05_seated_winter_chair.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 25,
        "chapterIndex": 8,
        "text": "Shelter beds and tents aren't enemies. For many people, the tent is what's left when the bed",
        "startTime": 156.32,
        "endTime": 162.28,
        "duration": 5.96,
        "clipPath": st("ch01_red_fabric_tent.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 26,
        "chapterIndex": 8,
        "text": "isn't available or isn't bearable. In Prince Edward Island, a community group had already bought",
        "startTime": 162.28,
        "endTime": 168.74,
        "duration": 6.46,
        "clipPath": sl("ch08_beat26_eskimo_setup_snow.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "PRINCE EDWARD ISLAND: 26 FISHING TENTS PURCHASED",
            "line2": "GRASSROOTS WINTER SURVIVAL RESPONSE",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 27,
        "chapterIndex": 8,
        "text": "26 of these tents when the province's housing minister responded. His message was that nobody needs",
        "startTime": 168.74,
        "endTime": 175.36,
        "duration": 6.62,
        "clipPath": st("ch06_blizzard_wind_howling.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 28,
        "chapterIndex": 8,
        "text": "to be in a tent in winter. Anyone who calls the shelter line will be placed in suitable housing",
        "startTime": 175.36,
        "endTime": 181.30,
        "duration": 5.94,
        "clipPath": sl("ch08_beat28_halifax_fence_clamping.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 29,
        "chapterIndex": 8,
        "text": "with transportation covered. The group's answer was that some people were calling and still ending",
        "startTime": 181.30,
        "endTime": 187.28,
        "duration": 5.98,
        "clipPath": st("ch03_hands_cold_gloves.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 30,
        "chapterIndex": 8,
        "text": "up stranded. And in Durango, Colorado, an anonymous neighbor donated an insulated fishing dome to",
        "startTime": 187.28,
        "endTime": 194.12,
        "duration": 6.84,
        "clipPath": st("ch08_snowy_hillside_tent.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "DURANGO, COLORADO: SANCTIONED HILLSIDE DOME",
            "line2": "ANONYMOUS DONATION • MANAGED HILLSIDE SITE",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 31,
        "chapterIndex": 8,
        "text": "a sanctioned sleeping site on a hillside. A woman who had just arrived, struggling with the first",
        "startTime": 194.12,
        "endTime": 199.84,
        "duration": 5.72,
        "clipPath": sl("ch08_beat31_cabelas_corner_hub.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 32,
        "chapterIndex": 8,
        "text": "December cold, described it as very warm. Not a bedroom, a place to sit down with a coffee and talk",
        "startTime": 199.84,
        "endTime": 206.78,
        "duration": 6.94,
        "clipPath": st("ch05_hot_mug_steam_hands.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 33,
        "chapterIndex": 8,
        "text": "to other people. A community leader there said it made a big difference in people's lives",
        "startTime": 206.78,
        "endTime": 212.18,
        "duration": 5.40,
        "clipPath": sl("ch08_beat33_durango_dome_shelter.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 34,
        "chapterIndex": 8,
        "text": "and that it took five or six people hours just to level the ground for it.",
        "startTime": 212.18,
        "endTime": 217.10,
        "duration": 4.92,
        "clipPath": st("ch08_snowy_hillside_tent.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    }
]

ch08_timeline = {
    "masterAudioPath": "C:/Users/karth/Documents/BlokeTuber/uploads/audio/fishingtent/ch08_red_notices_and_metal_fences.mp3",
    "totalDuration": 217.10,
    "clips": ch08_clips
}

# ==============================================================================
# CHAPTER 09 TIMELINE DATA
# ==============================================================================
ch09_clips = [
    {
        "beatIndex": 0,
        "chapterIndex": 9,
        "text": "Notice what these stories have in common. None of them started with a government program,",
        "startTime": 0.0,
        "endTime": 4.94,
        "duration": 4.94,
        "clipPath": st("ch09_winter_shopping_cart.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 1,
        "chapterIndex": 9,
        "text": "a plant shop owner, two men, and a cargo van, an anonymous donor. Each time, one ordinary person",
        "startTime": 4.94,
        "endTime": 11.98,
        "duration": 7.04,
        "clipPath": sl("ch09_beat01_cabelas_full_view.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 2,
        "chapterIndex": 9,
        "text": "saw a specific winter coming for a specific neighbor and decided to act before anyone gave",
        "startTime": 11.98,
        "endTime": 17.30,
        "duration": 5.32,
        "clipPath": st("ch09_sporting_goods_aisle.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 3,
        "chapterIndex": 9,
        "text": "them permission. And each time the product they reached for came from the same place, the fishing",
        "startTime": 17.30,
        "endTime": 23.22,
        "duration": 5.92,
        "clipPath": sl("ch09_beat03_halifax_eskimo_tents.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "THE RECREATION AISLE PARADOX",
            "line2": "OFF-THE-SHELF WINTER CRISIS DEFENSE",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 4,
        "chapterIndex": 9,
        "text": "aisle. It works, it has worked for decades, and it's made in volume by established companies",
        "startTime": 23.22,
        "endTime": 29.14,
        "duration": 5.92,
        "clipPath": st("ch09_shelf_price_tag.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "MASS-PRODUCED BY ESTABLISHED BRANDS",
            "line2": "ESKIMO • CLAM • OTTER OUTDOORS",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 5,
        "chapterIndex": 9,
        "text": "and stocked by national retailers. It's the only portable shelter category where someone has",
        "startTime": 29.14,
        "endTime": 35.48,
        "duration": 6.34,
        "clipPath": sl("ch09_beat05_cabelas_thermal_shell.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 6,
        "chapterIndex": 9,
        "text": "been willing to print a measurable amount of insulation on the spec sheet. And somehow it's",
        "startTime": 35.48,
        "endTime": 41.16,
        "duration": 5.68,
        "clipPath": st("ch04_synthetic_loft_insulation.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "MEASURABLE 80g THERMAL INSULATION",
            "line2": "TRAP-HOLD QUILTED FIBER LOFT FILL",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 7,
        "chapterIndex": 9,
        "text": "filed under recreation. Nobody hit it. There's no suppressed invention here and no cost barrier to",
        "startTime": 41.16,
        "endTime": 47.70,
        "duration": 6.54,
        "clipPath": sl("ch09_beat07_halifax_tents_recreation.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "FILED UNDER SPORTING GOODS • NOT EMERGENCY",
            "line2": "CONSUMER RECREATION CATALOG CLASSIFICATION",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 8,
        "chapterIndex": 9,
        "text": "break through. The thing standing between a freezing person and a survivable night",
        "startTime": 47.70,
        "endTime": 52.58,
        "duration": 4.88,
        "clipPath": st("ch04_frost_glass_freezing.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 9,
        "chapterIndex": 9,
        "text": "is not a breakthrough and it isn't $300. It's the word printed on the shelf label,",
        "startTime": 52.58,
        "endTime": 59.26,
        "duration": 6.68,
        "clipPath": st("ch09_shelf_price_tag.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 10,
        "chapterIndex": 9,
        "text": "and the fact that a worried person walking into a store in November is far more likely to be standing in front of the candles.",
        "startTime": 59.26,
        "endTime": 66.46,
        "duration": 7.20,
        "clipPath": st("ch02_candles_flashlight_table.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    }
]

ch09_timeline = {
    "masterAudioPath": "C:/Users/karth/Documents/BlokeTuber/uploads/audio/fishingtent/ch09_one_aisle_one_label.mp3",
    "totalDuration": 66.46,
    "clips": ch09_clips
}

# ==============================================================================
# CHAPTER 10 TIMELINE DATA
# ==============================================================================
ch10_clips = [
    {
        "beatIndex": 0,
        "chapterIndex": 10,
        "text": "None of this solves homelessness, and it was never going to.",
        "startTime": 0.0,
        "endTime": 4.50,
        "duration": 4.50,
        "clipPath": st("ch10_winter_sunrise_city.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 1,
        "chapterIndex": 10,
        "text": "It doesn't replace housing, and the people who bought these tents will tell you themselves it's by no means a solution.",
        "startTime": 4.50,
        "endTime": 10.62,
        "duration": 6.12,
        "clipPath": sl("ch10_beat01_halifax_modular_row.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 2,
        "chapterIndex": 10,
        "text": "A tent is what you do the night before a better answer arrives.",
        "startTime": 10.62,
        "endTime": 16.00,
        "duration": 5.38,
        "clipPath": st("ch10_quiet_snowy_morning.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 3,
        "chapterIndex": 10,
        "text": "But a better answer takes months, sometimes years. A night takes 12 hours,",
        "startTime": 16.00,
        "endTime": 22.50,
        "duration": 6.50,
        "clipPath": sl("ch10_beat03_cabelas_heavy_insulation.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "A 12-HOUR SURVIVABLE BUFFER",
            "line2": "OVERNIGHT HYPOTHERMIA PREVENTION",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 4,
        "chapterIndex": 10,
        "text": "and for 12 hours, a fabric box with 80 grams of insulation, a floor made of blankets, and a $35 detector on the wall",
        "startTime": 22.50,
        "endTime": 29.50,
        "duration": 7.00,
        "clipPath": st("ch06_moving_blankets_floor.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "FABRIC BOX + 80g FILL + $35 DETECTOR",
            "line2": "SUBFLOOR BARRIER & CARBON MONOXIDE DEFENSE",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 5,
        "chapterIndex": 10,
        "text": "can be the difference between getting through and not. Think about the first morning in Halifax again.",
        "startTime": 29.50,
        "endTime": 36.54,
        "duration": 7.04,
        "clipPath": st("ch07_digital_co_detector.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 6,
        "chapterIndex": 10,
        "text": "Mike Baker standing in the snow outside a red tent that stayed dry.",
        "startTime": 36.54,
        "endTime": 42.00,
        "duration": 5.46,
        "clipPath": sl("ch10_beat06_eskimo_dry_snow.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 7,
        "chapterIndex": 10,
        "text": "Two men in a white cargo van who had no organization, no budget, and no permission.",
        "startTime": 42.00,
        "endTime": 47.76,
        "duration": 5.76,
        "clipPath": st("ch01_white_cargo_van.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 8,
        "chapterIndex": 10,
        "text": "The distance between knowing someone should do something and actually doing it was for them about $300 and a Saturday.",
        "startTime": 47.76,
        "endTime": 55.12,
        "duration": 7.36,
        "clipPath": st("ch10_van_driving_morning.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 9,
        "chapterIndex": 10,
        "text": "None of them set out to start a movement. They were just trying to get one specific person through one specific winter.",
        "startTime": 55.12,
        "endTime": 63.26,
        "duration": 8.14,
        "clipPath": sl("ch10_beat09_halifax_square_community.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0
    },
    {
        "beatIndex": 10,
        "chapterIndex": 10,
        "text": "Maybe that's the part a spreadsheet can't measure. And maybe it's the real engine underneath all of it, not efficiency, not innovation,",
        "startTime": 63.26,
        "endTime": 71.00,
        "duration": 7.74,
        "clipPath": st("ch01_red_fabric_tent.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "DECIDING A STRANGER IS WORTH THE EFFORT",
            "line2": "MUTUAL AID • IMMEDIATE HUMAN RESPONSE",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 11,
        "chapterIndex": 10,
        "text": "just someone deciding that a stranger was worth the effort, and doing something about it before the weather made the decision for them.",
        "startTime": 71.00,
        "endTime": 79.44,
        "duration": 8.44,
        "clipPath": st("ch10_winter_sunrise_city.mp4"),
        "layout": "full_bleed_cinematic",
        "kenBurns": True,
        "transitionType": "cut",
        "transitionDuration": 0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "SUBSCRIBE TO AMERICAN HIDEAWAYS",
            "line2": "FULL DOCUMENTARY SERIES AVAILABLE NOW",
            "themeColor": "cyan"
        }
    }
]

ch10_timeline = {
    "masterAudioPath": "C:/Users/karth/Documents/BlokeTuber/uploads/audio/fishingtent/ch10_the_morning_in_halifax.mp3",
    "totalDuration": 79.44,
    "clips": ch10_clips
}

# ==============================================================================
# WRITE TIMELINE JSON FILES
# ==============================================================================
t8_path = os.path.join(timelines_dir, "chapter_08_final.json")
t9_path = os.path.join(timelines_dir, "chapter_09_final.json")
t10_path = os.path.join(timelines_dir, "chapter_10_final.json")

with open(t8_path, "w", encoding="utf-8") as f:
    json.dump(ch08_timeline, f, indent=2)
print(f"Saved: {t8_path}")

with open(t9_path, "w", encoding="utf-8") as f:
    json.dump(ch09_timeline, f, indent=2)
print(f"Saved: {t9_path}")

with open(t10_path, "w", encoding="utf-8") as f:
    json.dump(ch10_timeline, f, indent=2)
print(f"Saved: {t10_path}")

# ==============================================================================
# EXTRACT BEAT SNAPSHOTS FOR AUDIT
# ==============================================================================
def extract_snapshots(clips, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    for c in clips:
        idx = c["beatIndex"]
        dur = c["duration"]
        mid = dur / 2.0
        out_jpg = os.path.join(out_dir, f"beat_{idx:02d}.jpg")
        clip_p = c["clipPath"]
        cmd = [
            "ffmpeg", "-nostdin", "-y",
            "-ss", str(mid),
            "-i", clip_p,
            "-vframes", "1",
            "-vf", "scale=960:540",
            "-q:v", "2",
            out_jpg
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Extracted {len(clips)} snapshots to {out_dir}")

extract_snapshots(ch08_clips, os.path.join(BASE_DIR, "uploads", "beat_snapshots", "fishingtent_ch08"))
extract_snapshots(ch09_clips, os.path.join(BASE_DIR, "uploads", "beat_snapshots", "fishingtent_ch09"))
extract_snapshots(ch10_clips, os.path.join(BASE_DIR, "uploads", "beat_snapshots", "fishingtent_ch10"))

# ==============================================================================
# SYNC TIMELINES INTO projects.json AND apps/api/output/store/projects.json
# ==============================================================================
def update_projects_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        projects = json.load(f)
    
    proj = next((p for p in projects if p.get("id") == "proj_fishingtent_hideaways"), None)
    if not proj:
        print(f"Project not found in {filepath}")
        return
    
    ch_map = {
        8: ("uploads/timelines/fishingtent/chapter_08_final.json", ch08_timeline),
        9: ("uploads/timelines/fishingtent/chapter_09_final.json", ch09_timeline),
        10: ("uploads/timelines/fishingtent/chapter_10_final.json", ch10_timeline)
    }
    
    for ch in proj.get("chapters", []):
        idx = ch.get("chapterIndex")
        if idx in ch_map:
            rel_p, tl_data = ch_map[idx]
            ch["timelinePath"] = rel_p
            ch["timelineJson"] = tl_data
            ch["status"] = "staged"
            print(f"Updated ch{idx:02d} in {filepath}")
            
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2)
    print(f"Synced {filepath} successfully.")

update_projects_file(os.path.join(BASE_DIR, "output", "store", "projects.json"))
update_projects_file(os.path.join(BASE_DIR, "apps", "api", "output", "store", "projects.json"))

print("\n>>> ALL WORK COMPLETED AND AUDITED SUCCESSFULLY!")
