import os
import sys
import json
import subprocess
from datetime import datetime, timezone

BASE_DIR = os.path.abspath(".")
SOURCES_DIR = os.path.join(BASE_DIR, "uploads", "raw", "proj_fishingtent", "sources")
SLICES_DIR = os.path.join(BASE_DIR, "uploads", "raw", "proj_fishingtent", "slices")
STOCK_DIR = os.path.join(BASE_DIR, "uploads", "raw", "proj_fishingtent", "stock")
TIMELINE_DIR = os.path.join(BASE_DIR, "uploads", "timelines", "fishingtent")
REGISTRY_FILE = os.path.join(BASE_DIR, "uploads", "raw", "proj_fishingtent", "used_slices.json")

os.makedirs(SLICES_DIR, exist_ok=True)
os.makedirs(TIMELINE_DIR, exist_ok=True)

def get_registry():
    if os.path.exists(REGISTRY_FILE):
        try:
            with open(REGISTRY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_registry(reg):
    with open(REGISTRY_FILE, "w", encoding="utf-8") as f:
        json.dump(reg, f, indent=2)

def slice_clip(source_name, start_time, duration, output_filename, crop_bottom=0.22):
    src_file = os.path.join(SOURCES_DIR, f"{source_name}.mp4")
    if not os.path.exists(src_file):
        raise FileNotFoundError(f"Source video not found: {src_file}")
    
    out_path = os.path.join(SLICES_DIR, output_filename)
    if os.path.exists(out_path):
        return out_path
    
    reg = get_registry()
    slice_id = f"{source_name}_{start_time}_{duration}"
    reg[slice_id] = out_path
    save_registry(reg)

    if crop_bottom > 0:
        h_ratio = 1.0 - crop_bottom
        vf = f"crop=in_w:in_h*{h_ratio:.2f}:0:0,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    else:
        vf = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"

    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-ss", str(start_time),
        "-i", src_file,
        "-t", str(duration),
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-an",
        out_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"  [SLICED] {source_name} ({start_time}s +{duration}s) -> {output_filename}")
    return out_path

# =========================================================================
# CHAPTER 1 DEFINITION
# =========================================================================
ch01_audio = os.path.join(BASE_DIR, "uploads", "audio", "fishingtent", "ch01_square_in_the_snow.mp3")
ch01_total_duration = 175.49

# Beats definition for Chapter 1
ch01_raw = [
    {
        "beatIndex": 0, "chapterIndex": 1,
        "text": "On the first Monday of December 2023, Halifax woke up to its first real snow of the winter.",
        "startTime": 0.00, "endTime": 6.50,
        "type": "stock", "stock": "ch01_snow_city_square.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "DECEMBER 2023 • FIRST WINTER SNOW",
            "line2": "NOVA SCOTIA PROVINCIAL STORM",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 1, "chapterIndex": 1,
        "text": "In the public square in front of City Hall, a man named Mike Baker zipped the door",
        "startTime": 6.50, "endTime": 11.90,
        "type": "slice", "source": "halifax_business_eviction", "start": 123.0, "dur": 5.4, "out": "ch01_b01_halifax_square_wide.mp4", "crop_b": 0.22,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "HALIFAX CITY HALL • GRAND PARADE",
            "line2": "DECEMBER 2023 ENCAMPMENT",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 2, "chapterIndex": 1,
        "text": "of a bright red, six-sided tent, and stepped out into it.",
        "startTime": 11.90, "endTime": 16.00,
        "type": "stock", "stock": "ch01_red_fabric_tent.mp4"
    },
    {
        "beatIndex": 3, "chapterIndex": 1,
        "text": "A few weeks earlier, he'd been living in an ordinary summer tent,",
        "startTime": 16.00, "endTime": 20.20,
        "type": "slice", "source": "halifax_eviction_day", "start": 30.0, "dur": 4.2, "out": "ch01_b03_halifax_summer_tent.mp4", "crop_b": 0.22
    },
    {
        "beatIndex": 4, "chapterIndex": 1,
        "text": "the kind sold for July weekends and campground cookouts. Then a windstorm came through and collapsed it.",
        "startTime": 20.20, "endTime": 26.80,
        "type": "stock", "stock": "ch06_blizzard_wind_howling.mp4"
    },
    {
        "beatIndex": 5, "chapterIndex": 1,
        "text": "So when winter arrived, he moved into something different, something that was never designed for him",
        "startTime": 26.80, "endTime": 33.02,
        "type": "slice", "source": "halifax_students_gifts", "start": 1.0, "dur": 6.22, "out": "ch01_b05_halifax_red_tents_row.mp4", "crop_b": 0.22
    },
    {
        "beatIndex": 6, "chapterIndex": 1,
        "text": "at all. It was an ice fishing shelter.",
        "startTime": 33.02, "endTime": 37.00,
        "type": "stock", "stock": "ch01_snow_footsteps.mp4"
    },
    {
        "beatIndex": 7, "chapterIndex": 1,
        "text": "An Eskimo quickfish built for people who sit over holes in frozen lakes.",
        "startTime": 37.00, "endTime": 43.50,
        "type": "slice", "source": "eskimo_quickfish_3i_setup", "start": 14.0, "dur": 6.5, "out": "ch01_b07_eskimo_lake_popup.mp4", "crop_b": 0.0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "ESKIMO QUICKFISH ICE SHELTER",
            "line2": "ENGINEERED SUB-ZERO PROTECTION",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 8, "chapterIndex": 1,
        "text": "And when a reporter asked him how it compared, his answer wasn't poetic.",
        "startTime": 43.50, "endTime": 48.00,
        "type": "stock", "stock": "ch04_frost_glass_freezing.mp4"
    },
    {
        "beatIndex": 9, "chapterIndex": 1,
        "text": "It was practical. It stayed drier in heavy snow and rain than the tent he'd had before.",
        "startTime": 48.00, "endTime": 54.00,
        "type": "slice", "source": "eskimo_quickfish_overview", "start": 16.0, "dur": 6.0, "out": "ch01_b09_eskimo_hole_fishing.mp4", "crop_b": 0.0
    },
    {
        "beatIndex": 10, "chapterIndex": 1,
        "text": "That's it. No miracle. A tent that didn't fold in the wind and didn't leak on his head.",
        "startTime": 54.00, "endTime": 59.50,
        "type": "stock", "stock": "ch01_red_fabric_tent.mp4"
    },
    {
        "beatIndex": 11, "chapterIndex": 1,
        "text": "And for a man sleeping outside in a Canadian winter, that was almost everything.",
        "startTime": 59.50, "endTime": 64.00,
        "type": "slice", "source": "halifax_business_eviction", "start": 99.0, "dur": 4.5, "out": "ch01_b11_halifax_tent_snow.mp4", "crop_b": 0.22
    },
    {
        "beatIndex": 12, "chapterIndex": 1,
        "text": "The red tents had gotten there because of two men and a white cargo van.",
        "startTime": 64.00, "endTime": 68.00,
        "type": "stock", "stock": "ch01_white_cargo_van.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "TWO MEN & A WHITE CARGO VAN",
            "line2": "COMMUNITY RESCUE INITIATIVE",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 13, "chapterIndex": 1,
        "text": "On November 18th, Steve Wilsack and Matt Grant pulled into that square and started handing out",
        "startTime": 68.00, "endTime": 74.50,
        "type": "slice", "source": "halifax_students_gifts", "start": 91.0, "dur": 6.5, "out": "ch01_b13_halifax_volunteers_work.mp4", "crop_b": 0.22
    },
    {
        "beatIndex": 14, "chapterIndex": 1,
        "text": "mattress pads and rain pants. Steve was a health and safety manager on film and TV sets.",
        "startTime": 74.50, "endTime": 80.50,
        "type": "stock", "stock": "ch06_moving_blankets_floor.mp4"
    },
    {
        "beatIndex": 15, "chapterIndex": 1,
        "text": "Matt had moved to Halifax from British Columbia two years earlier. Neither of them ran an organization",
        "startTime": 80.50, "endTime": 86.96,
        "type": "slice", "source": "halifax_eviction_day", "start": 1.0, "dur": 6.46, "out": "ch01_b15_halifax_square_morning.mp4", "crop_b": 0.22
    },
    {
        "beatIndex": 16, "chapterIndex": 1,
        "text": "neither had a grant. They'd simply watched the encampment in front of City Hall keep growing",
        "startTime": 86.96, "endTime": 92.54,
        "type": "stock", "stock": "ch01_snow_city_square.mp4"
    },
    {
        "beatIndex": 17, "chapterIndex": 1,
        "text": "and it bothered them enough to stop watching. They started posting about it, they started fundraising.",
        "startTime": 92.54, "endTime": 98.96,
        "type": "slice", "source": "halifax_business_eviction", "start": 170.0, "dur": 6.42, "out": "ch01_b17_halifax_encampment_view.mp4", "crop_b": 0.22
    },
    {
        "beatIndex": 18, "chapterIndex": 1,
        "text": "And over the next few months, they raised nearly $70,000, which they spent on red fishing",
        "startTime": 98.96, "endTime": 105.26,
        "type": "stock", "stock": "ch01_red_fabric_tent.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "$70,000 COMMUNITY FUNDRAISED",
            "line2": "DIRECT GRASSROOTS RELIEF",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 19, "chapterIndex": 1,
        "text": "huts on meals on overnight security for the square and on helping people get out of the encampment",
        "startTime": 105.26, "endTime": 111.44,
        "type": "slice", "source": "halifax_eviction_day", "start": 103.0, "dur": 6.18, "out": "ch01_b19_halifax_tents_fence.mp4", "crop_b": 0.22
    },
    {
        "beatIndex": 20, "chapterIndex": 1,
        "text": "altogether with bus tickets, rent and hotel rooms. They barely left that square from mid-November",
        "startTime": 111.44, "endTime": 118.10,
        "type": "stock", "stock": "ch02_homeless_shelter_urban.mp4"
    },
    {
        "beatIndex": 21, "chapterIndex": 1,
        "text": "until early March. By the end, neither of them had earned a paycheck since the fall. They said they",
        "startTime": 118.10, "endTime": 124.34,
        "type": "slice", "source": "halifax_business_eviction", "start": 300.0, "dur": 6.24, "out": "ch01_b21_halifax_winter_field.mp4", "crop_b": 0.22
    },
    {
        "beatIndex": 22, "chapterIndex": 1,
        "text": "were running on fumes. Matt said he couldn't even put a label on what he was doing beyond trying to",
        "startTime": 124.34, "endTime": 130.38,
        "type": "stock", "stock": "ch05_hot_mug_steam_hands.mp4"
    },
    {
        "beatIndex": 23, "chapterIndex": 1,
        "text": "get as many people as possible into four walls. He couldn't picture going back to an office job.",
        "startTime": 130.38, "endTime": 136.26,
        "type": "slice", "source": "halifax_eviction_day", "start": 21.0, "dur": 5.88, "out": "ch01_b23_halifax_civic_view.mp4", "crop_b": 0.22
    },
    {
        "beatIndex": 24, "chapterIndex": 1,
        "text": "That's the thing about this kind of work. Nobody applies for it. It just refuses to leave you alone",
        "startTime": 136.26, "endTime": 142.14,
        "type": "stock", "stock": "ch10_quiet_snowy_morning.mp4"
    },
    {
        "beatIndex": 25, "chapterIndex": 1,
        "text": "once you've seen it up close. By that winter, the red tents were everywhere. Across Halifax's encampments,",
        "startTime": 142.14, "endTime": 150.00,
        "type": "slice", "source": "halifax_eviction_day", "start": 55.0, "dur": 7.86, "out": "ch01_b25_halifax_encampment_hill.mp4", "crop_b": 0.22
    },
    {
        "beatIndex": 26, "chapterIndex": 1,
        "text": "they had become impossible to miss. But here's the question nobody on that square was asking out loud.",
        "startTime": 150.00, "endTime": 156.04,
        "type": "stock", "stock": "ch01_snow_city_square.mp4"
    },
    {
        "beatIndex": 27, "chapterIndex": 1,
        "text": "Why this tent? Out of every shelter sold in North America, why did a product made for fishing",
        "startTime": 156.04, "endTime": 162.58,
        "type": "slice", "source": "eskimo_quickfish_3i_setup", "start": 1.0, "dur": 6.54, "out": "ch01_b27_eskimo_lake_overview.mp4", "crop_b": 0.0
    },
    {
        "beatIndex": 28, "chapterIndex": 1,
        "text": "turn out to be the one that worked? The answer has almost nothing to do with fishing.",
        "startTime": 162.58, "endTime": 167.38,
        "type": "stock", "stock": "ch01_red_fabric_tent.mp4"
    },
    {
        "beatIndex": 29, "chapterIndex": 1,
        "text": "And it explains something much bigger about how America sells you protection from the cold and who it assumes will never need it.",
        "startTime": 167.38, "endTime": 175.49,
        "type": "slice", "source": "halifax_business_eviction", "start": 129.0, "dur": 8.11, "out": "ch01_b29_halifax_square_pan.mp4", "crop_b": 0.22
    }
]

# =========================================================================
# CHAPTER 2 DEFINITION
# =========================================================================
ch02_audio = os.path.join(BASE_DIR, "uploads", "audio", "fishingtent", "ch02_size_of_the_problem.mp3")
ch02_total_duration = 93.94

ch02_raw = [
    {
        "beatIndex": 0, "chapterIndex": 2,
        "text": "To understand it, you first have to understand how many people are standing where Mike Baker stood.",
        "startTime": 0.00, "endTime": 6.20,
        "type": "stock", "stock": "ch02_homeless_shelter_urban.mp4"
    },
    {
        "beatIndex": 1, "chapterIndex": 2,
        "text": "On a single night in January 2024, the federal government counted 771,480 people experiencing homelessness in the United States.",
        "startTime": 6.20, "endTime": 12.00,
        "type": "slice", "source": "halifax_business_eviction", "start": 310.0, "dur": 5.8, "out": "ch02_b01_halifax_encampment_tents.mp4", "crop_b": 0.22,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "JANUARY 2024 HUD CENSUS",
            "line2": "ANNUAL POINT-IN-TIME COUNT",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 2, "chapterIndex": 2,
        "text": "That's the most recent full national count, and it was an increase of roughly 18% over the year before.",
        "startTime": 12.00, "endTime": 18.00,
        "type": "stock", "stock": "ch02_homeless_shelter_urban.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "771,480 HOMELESS IN AMERICA (+18%)",
            "line2": "RECORD NATIONAL HIGH",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 3, "chapterIndex": 2,
        "text": "More than 274,000 of them were unsheltered, not in a bed, not in a program, outside.",
        "startTime": 18.00, "endTime": 25.50,
        "type": "slice", "source": "halifax_eviction_day", "start": 100.0, "dur": 7.5, "out": "ch02_b03_halifax_snow_urban.mp4", "crop_b": 0.22,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "274,000+ LIVING UNSHELTERED",
            "line2": "SIDEWALKS, VEHICLES & TENTS",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 4, "chapterIndex": 2,
        "text": "And those are only the people with nowhere to go on a normal night. Then there's everyone else.",
        "startTime": 25.50, "endTime": 33.50,
        "type": "stock", "stock": "ch08_chainlink_metal_fence.mp4"
    },
    {
        "beatIndex": 5, "chapterIndex": 2,
        "text": "In 2024, the average American electricity customer lost power for about 11 hours, nearly double the yearly average of the decade before.",
        "startTime": 33.50, "endTime": 41.00,
        "type": "slice", "source": "halifax_business_eviction", "start": 104.0, "dur": 7.5, "out": "ch02_b05_halifax_notice_winter.mp4", "crop_b": 0.22
    },
    {
        "beatIndex": 6, "chapterIndex": 2,
        "text": "Hurricane's barrel, Helene, and Milton alone accounted for roughly 80% of those lost hours.",
        "startTime": 41.00, "endTime": 50.30,
        "type": "stock", "stock": "ch02_power_lines_ice.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "HURRICANES BERYL, HELENE & MILTON",
            "line2": "80% OF RECORD POWER OUTAGES",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 7, "chapterIndex": 2,
        "text": "In South Carolina, the average customer went without power for around 53 hours.",
        "startTime": 50.30, "endTime": 57.00,
        "type": "stock", "stock": "ch02_winter_blackout_dark.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "SC CUSTOMERS: 53 HOURS WITHOUT POWER",
            "line2": "GRID INFRASTRUCTURE FAILURE",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 8, "chapterIndex": 2,
        "text": "In a hot southern September, that's an inconvenience. In a Midwestern January, with the furnace dead and the roads iced over, it's something else.",
        "startTime": 57.00, "endTime": 66.00,
        "type": "stock", "stock": "ch04_frost_glass_freezing.mp4"
    },
    {
        "beatIndex": 9, "chapterIndex": 2,
        "text": "And what does America sell you for that moment? A box of candles, a couple of flashlights, a hand-crank radio.",
        "startTime": 66.00, "endTime": 73.00,
        "type": "stock", "stock": "ch02_candles_flashlight_table.mp4"
    },
    {
        "beatIndex": 10, "chapterIndex": 2,
        "text": "So the real story isn't that someone invented a better shelter.",
        "startTime": 73.00, "endTime": 80.00,
        "type": "slice", "source": "eskimo_quickfish_overview", "start": 4.0, "dur": 7.0, "out": "ch02_b10_eskimo_overview_exterior.mp4", "crop_b": 0.0
    },
    {
        "beatIndex": 11, "chapterIndex": 2,
        "text": "It's that someone already did decades ago for a completely different customer.",
        "startTime": 80.00, "endTime": 86.50,
        "type": "stock", "stock": "ch01_red_fabric_tent.mp4"
    },
    {
        "beatIndex": 12, "chapterIndex": 2,
        "text": "And it's been sitting in the sporting goods aisle ever since.",
        "startTime": 86.50, "endTime": 90.14,
        "type": "slice", "source": "eskimo_quickfish_3i_setup", "start": 40.0, "dur": 3.64, "out": "ch02_b12_eskimo_3i_hub_ice.mp4", "crop_b": 0.0
    },
    {
        "beatIndex": 13, "chapterIndex": 2,
        "text": "ever since.",
        "startTime": 90.14, "endTime": 93.94,
        "type": "stock", "stock": "ch09_sporting_goods_aisle.mp4"
    }
]

# =========================================================================
# CHAPTER 3 DEFINITION
# =========================================================================
ch03_audio = os.path.join(BASE_DIR, "uploads", "audio", "fishingtent", "ch03_the_object.mp3")
ch03_total_duration = 79.73

ch03_raw = [
    {
        "beatIndex": 0, "chapterIndex": 3,
        "text": "It's called a hub shelter. It looks like a six-sided pop-up tent, dark on the outside,",
        "startTime": 0.00, "endTime": 5.80,
        "type": "stock", "stock": "ch03_tent_hub_mechanism.mp4"
    },
    {
        "beatIndex": 1, "chapterIndex": 3,
        "text": "and it stands on its own without ropes or stakes.",
        "startTime": 5.80, "endTime": 9.20,
        "type": "slice", "source": "eskimo_quickfish_3i_setup", "start": 20.0, "dur": 3.4, "out": "ch03_b01_eskimo_standing_ice.mp4", "crop_b": 0.0
    },
    {
        "beatIndex": 2, "chapterIndex": 3,
        "text": "The one in Halifax was the Eskimo Quickfish 3i, the insulated version.",
        "startTime": 9.20, "endTime": 14.50,
        "type": "stock", "stock": "ch01_red_fabric_tent.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "ESKIMO QUICKFISH 3i ($300 RETAIL)",
            "line2": "COMMERCIAL SUB-ZERO RATING",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 3, "chapterIndex": 3,
        "text": "Right now, it sells for around $300 at major retailers, though the price swings with the season and with sales.",
        "startTime": 14.50, "endTime": 22.40,
        "type": "stock", "stock": "ch09_shelf_price_tag.mp4"
    },
    {
        "beatIndex": 4, "chapterIndex": 3,
        "text": "The shelter is 80 inches tall at the center, so an adult can stand up inside it.",
        "startTime": 22.40, "endTime": 27.50,
        "type": "slice", "source": "eskimo_quickfish_3i_setup", "start": 75.0, "dur": 5.1, "out": "ch03_b04_eskimo_interior_standing.mp4", "crop_b": 0.0,
        "callout": {
            "type": "editorial_lower_third",
            "line1": "80 INCHES TALL • FULL STANDING HEIGHT",
            "line2": "CENTER CLEARANCE (6'8\")",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 5, "chapterIndex": 3,
        "text": "It has about 34 square feet of floor space. It weighs 34 pounds,",
        "startTime": 27.50, "endTime": 33.20,
        "type": "stock", "stock": "ch01_red_fabric_tent.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "34 SQ FT FLOOR • 34 LBS RIG WEIGHT",
            "line2": "PACKS TO 4 FT CARRY BAG",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 6, "chapterIndex": 3,
        "text": "and it folds down into a carry bag about four feet long.",
        "startTime": 33.20, "endTime": 37.50,
        "type": "slice", "source": "eskimo_quickfish_overview", "start": 75.0, "dur": 4.3, "out": "ch03_b06_eskimo_carry_bag_pack.mp4", "crop_b": 0.0
    },
    {
        "beatIndex": 7, "chapterIndex": 3,
        "text": "The manufacturer says one person can set it up in 60 seconds.",
        "startTime": 37.50, "endTime": 43.50,
        "type": "stock", "stock": "ch03_tent_hub_mechanism.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "60-SECOND QUICK-LOCK HUB DEPLOYMENT",
            "line2": "RAPID COLD-WEATHER RIGGING",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 8, "chapterIndex": 3,
        "text": "That claim isn't a gimmick. It comes from the design.",
        "startTime": 43.50, "endTime": 48.00,
        "type": "slice", "source": "eskimo_quickfish_3i_setup", "start": 5.0, "dur": 4.5, "out": "ch03_b08_eskimo_hub_rapid_deploy.mp4", "crop_b": 0.0
    },
    {
        "beatIndex": 9, "chapterIndex": 3,
        "text": "A hub shelter isn't assembled. It's unfolded. The poles live permanently inside the fabric,",
        "startTime": 48.00, "endTime": 54.00,
        "type": "stock", "stock": "ch03_fiberglass_pole_bend.mp4"
    },
    {
        "beatIndex": 10, "chapterIndex": 3,
        "text": "and the whole structure pops outward from the center until it locks.",
        "startTime": 54.00, "endTime": 58.50,
        "type": "slice", "source": "eskimo_quickfish_overview", "start": 40.0, "dur": 4.5, "out": "ch03_b10_eskimo_corner_joints.mp4", "crop_b": 0.0
    },
    {
        "beatIndex": 11, "chapterIndex": 3,
        "text": "There's nothing to thread through a sleeve, nothing to match to a color-coded corner, nothing to lose in the snow at nine o'clock at night.",
        "startTime": 58.50, "endTime": 64.50,
        "type": "stock", "stock": "ch03_tent_hub_mechanism.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "ZERO SLEEVES • ZERO THREADING",
            "line2": "PRE-INSTALLED FIBERGLASS POLES",
            "themeColor": "cyan"
        }
    },
    {
        "beatIndex": 12, "chapterIndex": 3,
        "text": "Think about who that matters to. Someone with numb fingers in the dark in the wind who may have already had one tent destroyed.",
        "startTime": 64.50, "endTime": 71.50,
        "type": "stock", "stock": "ch03_hands_cold_gloves.mp4"
    },
    {
        "beatIndex": 13, "chapterIndex": 3,
        "text": "A shelter that arrives already knowing what shape it is is not a small thing, but the shape isn't the secret, the walls are.",
        "startTime": 71.50, "endTime": 79.73,
        "type": "slice", "source": "eskimo_quickfish_overview", "start": 46.0, "dur": 8.23, "out": "ch03_b13_eskimo_fabric_walls.mp4", "crop_b": 0.0
    }
]

def build_chapter(audio_path, total_dur, raw_beats, out_path):
    print(f"\nBuilding timeline: {os.path.basename(out_path)}")
    clips = []
    for b in raw_beats:
        if b["type"] == "stock":
            clip_full = os.path.join(STOCK_DIR, b["stock"])
        elif b["type"] == "slice":
            clip_full = slice_clip(b["source"], b["start"], b["dur"], b["out"], b.get("crop_b", 0.22))
        else:
            raise ValueError(f"Unknown beat type: {b['type']}")

        if not os.path.exists(clip_full):
            raise FileNotFoundError(f"Missing clip: {clip_full}")

        clip_obj = {
            "beatIndex": b["beatIndex"],
            "chapterIndex": b["chapterIndex"],
            "text": b["text"],
            "startTime": round(b["startTime"], 3),
            "endTime": round(b["endTime"], 3),
            "duration": round(b["endTime"] - b["startTime"], 3),
            "clipPath": clip_full,
            "layout": "full_bleed_cinematic",
            "kenBurns": True,
            "transitionType": "cut",
            "transitionDuration": 0
        }
        if "callout" in b:
            clip_obj["callout"] = b["callout"]
        clips.append(clip_obj)

    tl = {
        "masterAudioPath": audio_path,
        "totalDuration": total_dur,
        "clips": clips
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(tl, f, indent=2)
    print(f"Saved {out_path} ({len(clips)} clips, {total_dur:.2f}s)")
    return tl

def extract_snapshots(timeline_path, snap_dir):
    os.makedirs(snap_dir, exist_ok=True)
    with open(timeline_path, "r", encoding="utf-8") as f:
        tl = json.load(f)
    print(f"\nExtracting snapshots for {os.path.basename(timeline_path)} -> {snap_dir}...")
    for c in tl["clips"]:
        idx = c["beatIndex"]
        vpath = c["clipPath"]
        dur = c["duration"]
        mid = min(1.0, dur / 2.0)
        out_jpg = os.path.join(snap_dir, f"beat_{idx:02d}.jpg")
        cmd = [
            "ffmpeg", "-nostdin", "-y",
            "-ss", str(mid),
            "-i", vpath,
            "-vframes", "1",
            "-q:v", "2",
            out_jpg
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"Extracted {len(tl['clips'])} snapshots to {snap_dir}")

def sync_to_stores():
    print("\nSyncing timelines to project stores...")
    base_dir = r"C:\Users\karth\Documents\BlokeTuber"
    store_files = [
        os.path.join(base_dir, "output", "store", "projects.json"),
        os.path.join(base_dir, "apps", "api", "output", "store", "projects.json")
    ]
    chapters_to_sync = [
        (1, "chapter_01_final.json"),
        (2, "chapter_02_final.json"),
        (3, "chapter_03_final.json")
    ]
    timelines_data = {}
    for ch_idx, fname in chapters_to_sync:
        fpath = os.path.join(TIMELINE_DIR, fname)
        with open(fpath, "r", encoding="utf-8") as f:
            t_data = json.load(f)
        timelines_data[ch_idx] = {
            "path": fpath,
            "data": t_data
        }

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    for store_path in store_files:
        if not os.path.exists(store_path):
            print(f"Warning: {store_path} not found")
            continue
        with open(store_path, "r", encoding="utf-8") as f:
            projects = json.load(f)

        found = False
        for proj in projects:
            if proj.get("id") == "proj_fishingtent_hideaways":
                found = True
                for ch in proj.get("chapters", []):
                    c_idx = ch.get("chapterIndex")
                    if c_idx in timelines_data:
                        ch["status"] = "staged"
                        ch["timelineFile"] = timelines_data[c_idx]["path"]
                        ch["timelineJson"] = timelines_data[c_idx]["data"]
                        ch["updatedAt"] = now_iso
                        print(f"Updated {os.path.basename(store_path)} Ch {c_idx:02d} -> 'staged'")
                break
        if not found:
            print(f"Error: proj_fishingtent_hideaways not found in {store_path}")
            continue

        with open(store_path, "w", encoding="utf-8") as f:
            json.dump(projects, f, indent=2, ensure_ascii=False)
        print(f"Saved store {store_path}")

if __name__ == "__main__":
    t1 = build_chapter(ch01_audio, ch01_total_duration, ch01_raw, os.path.join(TIMELINE_DIR, "chapter_01_final.json"))
    t2 = build_chapter(ch02_audio, ch02_total_duration, ch02_raw, os.path.join(TIMELINE_DIR, "chapter_02_final.json"))
    t3 = build_chapter(ch03_audio, ch03_total_duration, ch03_raw, os.path.join(TIMELINE_DIR, "chapter_03_final.json"))

    extract_snapshots(os.path.join(TIMELINE_DIR, "chapter_01_final.json"), os.path.join(BASE_DIR, "uploads", "beat_snapshots", "fishingtent_ch01"))
    extract_snapshots(os.path.join(TIMELINE_DIR, "chapter_02_final.json"), os.path.join(BASE_DIR, "uploads", "beat_snapshots", "fishingtent_ch02"))
    extract_snapshots(os.path.join(TIMELINE_DIR, "chapter_03_final.json"), os.path.join(BASE_DIR, "uploads", "beat_snapshots", "fishingtent_ch03"))

    sync_to_stores()
