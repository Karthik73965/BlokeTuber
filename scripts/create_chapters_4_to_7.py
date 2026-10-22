import os
import sys
import json
import subprocess

REPO_ROOT = os.path.abspath(".")
TIMELINES_DIR = os.path.join(REPO_ROOT, "uploads", "timelines", "fishingtent")
SLICES_DIR = os.path.join(REPO_ROOT, "uploads", "raw", "proj_fishingtent", "slices")
SNAPSHOTS_ROOT = os.path.join(REPO_ROOT, "uploads", "beat_snapshots")

os.makedirs(TIMELINES_DIR, exist_ok=True)
os.makedirs(SLICES_DIR, exist_ok=True)
os.makedirs(SNAPSHOTS_ROOT, exist_ok=True)

# Remove used_slices.json to start clean
used_slices_reg = os.path.join(REPO_ROOT, "uploads", "raw", "proj_fishingtent", "used_slices.json")
if os.path.exists(used_slices_reg):
    os.remove(used_slices_reg)

def get_slice(source_name, start, duration, output_rel, crop_bottom=0.12, crop_top=0.0):
    output_abs = os.path.join(REPO_ROOT, output_rel)
    # delete prior slice to ensure fresh slice
    if os.path.exists(output_abs):
        try: os.remove(output_abs)
        except: pass
    cmd = [
        sys.executable,
        os.path.join(REPO_ROOT, "scripts", "get_fishing_tent_clip.py"),
        "--source", source_name,
        "--start", str(start),
        "--duration", str(duration),
        "--output", output_abs,
        "--crop-bottom", str(crop_bottom),
        "--crop-top", str(crop_top)
    ]
    subprocess.run(cmd, check=True)
    if not os.path.exists(output_abs) or os.path.getsize(output_abs) < 5000:
        raise RuntimeError(f"Slice failed or empty: {output_abs}")
    return output_abs

def stock(rel):
    p = os.path.join(REPO_ROOT, "uploads", "raw", "proj_fishingtent", "stock", rel)
    if not os.path.exists(p):
        raise FileNotFoundError(f"Stock not found: {p}")
    return p

# CHAPTER 04
print("\n>>> SLICING & ASSEMBLING CHAPTER 04 (BROADCAST CLEAN)...")
ch04_clips_raw = [
    {
        "text": "Walk into any outdoor store and look at how tents are sold. Millimeters of waterproofing, taped seams, coated floors.",
        "startTime": 0.0, "endTime": 7.86,
        "clipPath": stock("ch09_sporting_goods_aisle.mp4")
    },
    {
        "text": "Every number on the box is about keeping water out. Water resistance is real and it matters,",
        "startTime": 7.86, "endTime": 14.42,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 0.0, 7.0, "uploads/raw/proj_fishingtent/slices/ch04_b01_eskimo_bag_open.mp4", crop_bottom=0.12)
    },
    {
        "text": "but it has almost nothing to do with heat. Waterproof and warm are two completely different properties,",
        "startTime": 14.42, "endTime": 20.98,
        "clipPath": stock("ch04_frost_glass_freezing.mp4")
    },
    {
        "text": "and most of the camping industry quietly counts on you not noticing. The ice fishing aisle is the exception.",
        "startTime": 20.98, "endTime": 27.84,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 12.0, 7.0, "uploads/raw/proj_fishingtent/slices/ch04_b03_eskimo_snow_unroll.mp4", crop_bottom=0.12),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "WATERPROOFING VS THERMAL RETENTION",
            "line2": "CAMPING TENTS SEAL RAIN • NOT COLD",
            "themeColor": "gold"
        }
    },
    {
        "text": "There, insulation is in the product name. Eskimo calls its fabric IQ short for insulated quilted.",
        "startTime": 27.84, "endTime": 35.44,
        "clipPath": stock("ch04_quilted_fabric_jacket.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "IQ FABRIC • 80g HIGH-LOFT SYNTHETIC FILL",
            "line2": "TRIPLE-LAYER BONDED THERMAL SHELL",
            "themeColor": "cyan"
        }
    },
    {
        "text": "Another major manufacturer calls its version thermal trap. On some of the larger models,",
        "startTime": 35.44, "endTime": 40.96,
        "clipPath": get_slice("clam_thermal_features", 7.0, 6.0, "uploads/raw/proj_fishingtent/slices/ch04_b05_clam_hub_clean.mp4", crop_bottom=0.12)
    },
    {
        "text": "the specification is a three-layer bonded fabric with 80 grams of high-loft insulation, which is a real checkable number.",
        "startTime": 40.96, "endTime": 48.64,
        "clipPath": stock("ch04_synthetic_loft_insulation.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "3-LAYER BONDED QUILTED TRAP",
            "line2": "QUILTED MICRO-FIBER AIR RETENTION",
            "themeColor": "gold"
        }
    },
    {
        "text": "Grams per square meter is how the whole outdoor clothing industry measures synthetic fill.",
        "startTime": 48.64, "endTime": 55.06,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 24.0, 7.0, "uploads/raw/proj_fishingtent/slices/ch04_b07_eskimo_hub.mp4", crop_bottom=0.12)
    },
    {
        "text": "80 grams is about what's in a decent winter jacket, wrapped around a room instead of a person.",
        "startTime": 55.06, "endTime": 60.66,
        "clipPath": stock("ch01_red_fabric_tent.mp4")
    },
    {
        "text": "So what is that fill actually doing? Here's the thing about insulation that most people never learn.",
        "startTime": 60.66, "endTime": 67.38,
        "clipPath": stock("ch03_tent_hub_mechanism.mp4")
    },
    {
        "text": "Nothing you own is warm, not your coat, not your sleeping bag, not your fleece. None of them produce a single watt.",
        "startTime": 67.38, "endTime": 75.10,
        "clipPath": stock("ch04_breath_vapor_cold.mp4")
    },
    {
        "text": "What they do is trap air in millions of tiny pockets so it can't circulate and carry your heat away.",
        "startTime": 75.10, "endTime": 82.26,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 34.0, 8.0, "uploads/raw/proj_fishingtent/slices/ch04_b11_eskimo_unfold.mp4", crop_bottom=0.12)
    },
    {
        "text": "Heat moves through moving air quickly and through trapped air slowly. That's the entire trick",
        "startTime": 82.26, "endTime": 88.88,
        "clipPath": stock("ch06_blizzard_wind_howling.mp4")
    },
    {
        "text": "and it hasn't changed since the first person stuffed straw into a jacket. A thin tent wall stops the wind",
        "startTime": 88.88, "endTime": 95.66,
        "clipPath": stock("ch02_power_lines_ice.mp4")
    },
    {
        "text": "and lets your heat walk straight through. A quilted wall slows that heat down on its way out.",
        "startTime": 95.66, "endTime": 101.54,
        "clipPath": stock("ch03_fiberglass_pole_bend.mp4")
    },
    {
        "text": "And there's a second thing both major manufacturers advertise that almost no one else in portable shelter does.",
        "startTime": 101.54, "endTime": 108.52,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 70.0, 7.0, "uploads/raw/proj_fishingtent/slices/ch04_b15_eskimo_wall.mp4", crop_bottom=0.12)
    },
    {
        "text": "They claim the insulation reduces condensation. That might be the most important line on either product page.",
        "startTime": 108.52, "endTime": 115.94,
        "clipPath": stock("ch04_condensation_water_dripping.mp4")
    },
    {
        "text": "A sleeping adult breathes roughly a pint of water into the air overnight. An awake adult puts out more.",
        "startTime": 115.94, "endTime": 122.54,
        "clipPath": stock("ch04_breath_vapor_cold.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "1 PINT WATER VAPOR EXHALED OVERNIGHT",
            "line2": "HUMAN RESPIRATION IN CLOSED SHELTER",
            "themeColor": "gold"
        }
    },
    {
        "text": "In a thin walled tent, all that moisture drifts to the cold wall, turns back into liquid,",
        "startTime": 122.54, "endTime": 128.62,
        "clipPath": stock("ch04_frost_glass_freezing.mp4")
    },
    {
        "text": "and drips onto whatever's below, onto a sleeping bag, onto a jacket, onto a person.",
        "startTime": 128.62, "endTime": 134.72,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 80.0, 7.0, "uploads/raw/proj_fishingtent/slices/ch04_b19_eskimo_door.mp4", crop_bottom=0.12)
    },
    {
        "text": "And once your bedding is damp, it loses most of its ability to keep you warm because water pulls heat away many times faster than air.",
        "startTime": 134.72, "endTime": 143.28,
        "clipPath": stock("ch04_condensation_water_dripping.mp4")
    },
    {
        "text": "Wet insulation isn't insulation, it's a cold flannel. This is how winter often does its damage.",
        "startTime": 143.28, "endTime": 150.56,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 150.0, 8.0, "uploads/raw/proj_fishingtent/slices/ch04_b21_eskimo_ice.mp4", crop_bottom=0.12)
    },
    {
        "text": "Not with a dramatic white out, but slowly from the inside when someone does everything right and still ends up wet.",
        "startTime": 150.56, "endTime": 158.06,
        "clipPath": stock("ch06_blizzard_wind_howling.mp4")
    },
    {
        "text": "An insulated wall stays warmer on its inner face so the vapor has nothing cold to condense against.",
        "startTime": 158.06, "endTime": 164.78,
        "clipPath": get_slice("clam_thermal_features", 11.0, 7.0, "uploads/raw/proj_fishingtent/slices/ch04_b23_clam_quilted_clean.mp4", crop_bottom=0.12),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "WARM INNER WALL PREVENTS CONDENSATION",
            "line2": "ELIMINATES INTERIOR PRECIPITATION HAZARD",
            "themeColor": "cyan"
        }
    },
    {
        "text": "The ice fishing industry had to solve this because its customer sits inside for eight hours,",
        "startTime": 164.78, "endTime": 170.90,
        "clipPath": stock("ch05_looking_out_tent_winter.mp4")
    },
    {
        "text": "breathing over an open hole in the ice. That's about the most humid enclosed space you can build on purpose.",
        "startTime": 170.90, "endTime": 178.10,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 160.0, 8.0, "uploads/raw/proj_fishingtent/slices/ch04_b25_eskimo_standing.mp4", crop_bottom=0.12)
    },
    {
        "text": "They didn't fix it out of kindness. They fixed it because a tent that rains on its own customer doesn't sell twice.",
        "startTime": 178.10, "endTime": 185.28,
        "clipPath": stock("ch01_snow_city_square.mp4")
    },
    {
        "text": "Nobody in the emergency aisle has ever had to pass that test.",
        "startTime": 185.28, "endTime": 189.88,
        "clipPath": get_slice("eskimo_quickfish_overview", 15.0, 5.0, "uploads/raw/proj_fishingtent/slices/ch04_b27_eskimo_test.mp4", crop_bottom=0.12)
    }
]

# CHAPTER 05
print("\n>>> SLICING & ASSEMBLING CHAPTER 05 (BROADCAST CLEAN)...")
ch05_clips_raw = [
    {
        "text": "And there's one more reason this product category exists, and it's the reason it fits a crisis better than anything marketed for one.",
        "startTime": 0.0, "endTime": 8.08,
        "clipPath": stock("ch01_red_fabric_tent.mp4")
    },
    {
        "text": "Camping gear is designed around someone asleep in a sleeping bag.",
        "startTime": 8.08, "endTime": 14.00,
        "clipPath": stock("ch03_carry_bag_shoulder.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CAMPING TENT: ASLEEP IN SLEEPING BAG",
            "line2": "DESIGN ASSUMPTION: 8 HOURS IN MUMMY BAG",
            "themeColor": "gold"
        }
    },
    {
        "text": "If you're in a bag, the bag does the insulating, and the tent only has to stop wind and rain.",
        "startTime": 14.00, "endTime": 20.00,
        "clipPath": stock("ch03_hands_cold_gloves.mp4")
    },
    {
        "text": "That's why a $200 camping tent can have no insulation at all and nobody complains. The warmth was handed off to the bag before the tent was designed.",
        "startTime": 20.00, "endTime": 28.10,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 44.0, 8.5, "uploads/raw/proj_fishingtent/slices/ch05_b03_eskimo_roof_pull.mp4", crop_bottom=0.12)
    },
    {
        "text": "But a crisis isn't that situation. A blackout isn't. A dead furnace isn't.",
        "startTime": 28.10, "endTime": 34.00,
        "clipPath": stock("ch02_winter_blackout_dark.mp4")
    },
    {
        "text": "And living outside certainly isn't. You're awake, you're sitting, or standing, or watching over a child,",
        "startTime": 34.00, "endTime": 41.18,
        "clipPath": stock("ch02_homeless_shelter_urban.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "EMERGENCY CRISIS: AWAKE, SEATED, STILL",
            "line2": "SURVIVAL REQUIRES ACTIVE CONSCIOUS LIVING",
            "themeColor": "cyan"
        }
    },
    {
        "text": "or just trying to get through a long, dark afternoon. You aren't zipped into a bag and you can't be.",
        "startTime": 41.18, "endTime": 47.76,
        "clipPath": stock("ch05_hot_mug_steam_hands.mp4")
    },
    {
        "text": "A seated adult doing nothing gives off about 100 watts of heat. That's one old incandescent bulb.",
        "startTime": 47.76, "endTime": 54.36,
        "clipPath": stock("ch05_incandescent_bulb_filament.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "100 WATTS HUMAN RADIATIVE HEAT",
            "line2": "THERMAL EMISSION OF RESTING ADULT",
            "themeColor": "gold"
        }
    },
    {
        "text": "In that tent, it's the entire heat source.",
        "startTime": 54.36, "endTime": 60.00,
        "clipPath": get_slice("eskimo_quickfish_overview", 0.0, 5.64, "uploads/raw/proj_fishingtent/slices/ch05_b08_eskimo_lineup.mp4", crop_bottom=0.12)
    },
    {
        "text": "Ice fishing is the only cold weather activity in America built around that exact posture.",
        "startTime": 60.00, "endTime": 66.00,
        "clipPath": stock("ch05_looking_out_tent_winter.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "ICE FISHING: DESIGNED FOR IMMOBILE COLD",
            "line2": "ENGINEERED FOR EXTENDED IMMOBILE SITTING",
            "themeColor": "cyan"
        }
    },
    {
        "text": "Awake, still, for hours, not moving enough to warm up and not wrapped in a bag.",
        "startTime": 66.00, "endTime": 72.00,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 170.0, 6.5, "uploads/raw/proj_fishingtent/slices/ch05_b10_eskimo_snow_vast.mp4", crop_bottom=0.12)
    },
    {
        "text": "So that market evolved insulated walls, and the camping market never did.",
        "startTime": 72.00, "endTime": 77.00,
        "clipPath": stock("ch04_synthetic_loft_insulation.mp4")
    },
    {
        "text": "Two markets, two assumptions, two completely different products.",
        "startTime": 77.00, "endTime": 81.00,
        "clipPath": get_slice("clam_thermal_features", 8.0, 4.5, "uploads/raw/proj_fishingtent/slices/ch05_b12_clam_roof_pole.mp4", crop_bottom=0.12)
    },
    {
        "text": "And only one of them matches what actually happens to a person in a freezing room on the third night.",
        "startTime": 81.00, "endTime": 86.33,
        "clipPath": stock("ch02_candles_flashlight_table.mp4")
    }
]

# CHAPTER 06
print("\n>>> SLICING & ASSEMBLING CHAPTER 06 (BROADCAST CLEAN)...")
ch06_clips_raw = [
    {
        "text": "Now I'd be lying if I told you this is a perfect solution. There are catches and they're serious.",
        "startTime": 0.0, "endTime": 7.10,
        "clipPath": stock("ch06_blizzard_wind_howling.mp4")
    },
    {
        "text": "The first is the floor. These tents don't have one.",
        "startTime": 7.10, "endTime": 11.04,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 84.0, 4.5, "uploads/raw/proj_fishingtent/slices/ch06_b01_eskimo_snow_floor.mp4", crop_bottom=0.12),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CATCH 1: ZERO BOTTOM FLOOR",
            "line2": "OPEN-BOTTOM DESIGN EXPOSES ICE & GROUND",
            "themeColor": "gold"
        }
    },
    {
        "text": "On a lake that's deliberate because the ice is the floor.",
        "startTime": 11.04, "endTime": 15.28,
        "clipPath": stock("ch01_snow_footsteps.mp4")
    },
    {
        "text": "On a sidewalk or a garage slab, it means an open-bottomed tent sitting directly on ground that pulls heat out of a body far faster than air does.",
        "startTime": 15.28, "endTime": 24.58,
        "clipPath": stock("ch02_homeless_shelter_urban.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "GROUND SUCKS HEAT FASTER THAN AIR",
            "line2": "CONDUCTIVE HEAT LOSS DECIMATES BODY TEMP",
            "themeColor": "cyan"
        }
    },
    {
        "text": "Reporters in Prince Edward Island noted the exact same thing.",
        "startTime": 24.58, "endTime": 31.00,
        "clipPath": stock("ch08_chainlink_metal_fence.mp4")
    },
    {
        "text": "The tents are insulated but they have no floor, so they need a platform or a tarp underneath.",
        "startTime": 31.00, "endTime": 37.00,
        "clipPath": stock("ch06_moving_blankets_floor.mp4")
    },
    {
        "text": "In practice, everything you own that's soft goes underneath you before it goes on top of you. Moving blankets, foam mats, pallets, even flattened cardboard.",
        "startTime": 37.00, "endTime": 45.18,
        "clipPath": get_slice("ice_shelter_floor_ideas", 282.0, 8.5, "uploads/raw/proj_fishingtent/slices/ch06_b06_ice_floor_mat.mp4", crop_top=0.42, crop_bottom=0.05),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "SOLUTION: FOAM MATS, PALLETS & TARP",
            "line2": "MANDATORY THERMAL GROUND BARRIER",
            "themeColor": "gold"
        }
    },
    {
        "text": "That's the part that costs extra, and it's the part that decides whether the $300 actually works.",
        "startTime": 45.18, "endTime": 52.64,
        "clipPath": stock("ch06_foam_mat_tiles.mp4")
    },
    {
        "text": "The second catch is that there's no temperature rating. Not on this model, not on any of them.",
        "startTime": 52.64, "endTime": 58.84,
        "clipPath": get_slice("eskimo_quickfish_overview", 5.0, 6.5, "uploads/raw/proj_fishingtent/slices/ch06_b08_eskimo_specs.mp4", crop_bottom=0.12),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CATCH 2: NO TEMPERATURE SPECIFICATION",
            "line2": "ZERO LAB-RATED COLD METRICS PUBLISHED",
            "themeColor": "cyan"
        }
    },
    {
        "text": "The closest thing to a number is a claim you'll see on retail listings that the insulated fabric is up to 35% warmer than comparable non-insulated shelters,",
        "startTime": 58.84, "endTime": 66.00,
        "clipPath": stock("ch09_shelf_price_tag.mp4")
    },
    {
        "text": "which sounds like data, but read it again, warmer by how much? At what outside temperature measured how?",
        "startTime": 66.00, "endTime": 74.16,
        "clipPath": stock("ch03_tent_hub_mechanism.mp4")
    },
    {
        "text": "A relative number with no reference point is not a specification. It's the shape of one.",
        "startTime": 74.16, "endTime": 82.68,
        "clipPath": stock("ch04_frost_glass_freezing.mp4")
    },
    {
        "text": "I'm not saying the insulation isn't real. It is. I'm saying nobody in this market will tell you how cold is too cold.",
        "startTime": 82.68, "endTime": 90.46,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 110.0, 8.0, "uploads/raw/proj_fishingtent/slices/ch06_b12_eskimo_quilted_wall.mp4", crop_bottom=0.12)
    },
    {
        "text": "So treat it as a tool that slows heat loss, not a guarantee of any particular temperature.",
        "startTime": 90.46, "endTime": 97.16,
        "clipPath": stock("ch04_synthetic_loft_insulation.mp4")
    },
    {
        "text": "The third catch is anchoring. The design assumes you'll screw anchors through the skirt into solid ice.",
        "startTime": 97.16, "endTime": 103.92,
        "clipPath": get_slice("arctic_ice_anchor_drill", 45.0, 7.0, "uploads/raw/proj_fishingtent/slices/ch06_b14_arctic_anchor_test.mp4", crop_bottom=0.12),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CATCH 3: SCREW ANCHORS REQUIRE WEIGHTS ON PAVEMENT",
            "line2": "ICE SCREWS INOPERABLE ON CONCRETE & ASPHALT",
            "themeColor": "gold"
        }
    },
    {
        "text": "On pavement, there's nothing to screw into. Wind becomes a real problem, and you'll need to weigh the corners down with something heavy.",
        "startTime": 103.92, "endTime": 111.66,
        "clipPath": stock("ch06_cinderblock_sandbag_weight.mp4")
    },
    {
        "text": "And the fourth is simply supply. This is a seasonal product. The good models empty out as winter gets closer.",
        "startTime": 111.66, "endTime": 119.14,
        "clipPath": stock("ch09_winter_shopping_cart.mp4")
    },
    {
        "text": "And by mid-season, the cheap ones are usually the only ones left, if any are. If you want one, the time to buy is autumn.",
        "startTime": 119.14, "endTime": 127.06,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 178.0, 8.2, "uploads/raw/proj_fishingtent/slices/ch06_b17_eskimo_end_ice.mp4", crop_bottom=0.12)
    },
    {
        "text": "Not the week the storm arrives. So if you take only one thing from the catches, take this.",
        "startTime": 127.06, "endTime": 133.00,
        "clipPath": stock("ch06_blizzard_wind_howling.mp4")
    },
    {
        "text": "Buy before the season, not during the storm. Put the tent up once in daylight in a yard or a garage",
        "startTime": 133.00, "endTime": 139.98,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 18.0, 7.2, "uploads/raw/proj_fishingtent/slices/ch06_b19_eskimo_daylight_pitch.mp4", crop_bottom=0.12)
    },
    {
        "text": "so you can do it in the dark when it counts.",
        "startTime": 139.98, "endTime": 145.00,
        "clipPath": stock("ch02_candles_flashlight_table.mp4")
    },
    {
        "text": "Solve the floor on the same day you buy the shelter, not afterward.",
        "startTime": 145.00, "endTime": 149.00,
        "clipPath": stock("ch06_foam_mat_tiles.mp4")
    },
    {
        "text": "And if any flame is ever involved, the detector goes in first.",
        "startTime": 149.00, "endTime": 153.00,
        "clipPath": get_slice("mr_heater_co_test", 109.0, 4.2, "uploads/raw/proj_fishingtent/slices/ch06_b22_mr_heater_detector_safe.mp4", crop_top=0.25, crop_bottom=0.12)
    },
    {
        "text": "$300 of shelter is only worth something if the floor, the airflow, and the alarm come with it.",
        "startTime": 153.00, "endTime": 158.01,
        "clipPath": stock("ch01_snow_city_square.mp4")
    }
]

# CHAPTER 07
print("\n>>> SLICING & ASSEMBLING CHAPTER 07 (BROADCAST CLEAN)...")
ch07_clips_raw = [
    {
        "text": "But there's a fifth catch, and it's the one that can kill you.",
        "startTime": 0.0, "endTime": 6.00,
        "clipPath": stock("ch07_propane_camping_heater.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "PORTABLE PROPANE HEATING RISKS",
            "line2": "OPEN FLAME IN A SEALED ENCLOSURE",
            "themeColor": "gold"
        }
    },
    {
        "text": "Every person who has ever stayed warm in one of these tents eventually asks the same question. How do you heat it? And in the ice-fishing world, the answer is simple.",
        "startTime": 6.00, "endTime": 14.80,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 90.0, 9.0, "uploads/raw/proj_fishingtent/slices/ch07_b01_eskimo_shelter_zip.mp4", crop_bottom=0.12)
    },
    {
        "text": "Small, portable propane heaters used inside these shelters for decades.",
        "startTime": 14.80, "endTime": 20.38,
        "clipPath": get_slice("mr_heater_co_test", 114.0, 6.0, "uploads/raw/proj_fishingtent/slices/ch07_b02_mr_heater_co_bench.mp4", crop_top=0.25, crop_bottom=0.12)
    },
    {
        "text": "The problem is that the safety knowledge around those heaters lives inside that hobby. It doesn't travel with the tent when someone with a very different life buys it.",
        "startTime": 20.38, "endTime": 29.68,
        "clipPath": stock("ch02_homeless_shelter_urban.mp4")
    },
    {
        "text": "So, let me carry it across.",
        "startTime": 29.68, "endTime": 34.00,
        "clipPath": stock("ch08_red_warning_notice.mp4")
    },
    {
        "text": "Carbon monoxide binds to the hemoglobin in your blood roughly 200 times more readily than oxygen does.",
        "startTime": 34.00, "endTime": 41.00,
        "clipPath": stock("ch07_digital_co_detector.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "BINDS HEMOGLOBIN 200X FASTER THAN OXYGEN",
            "line2": "CHEMICAL ASPHYXIATION MECHANISM",
            "themeColor": "cyan"
        }
    },
    {
        "text": "It has no smell, no color, and no taste. And the reflex that wakes you up gasping isn't triggered by falling oxygen.",
        "startTime": 41.00, "endTime": 47.00,
        "clipPath": stock("ch04_breath_vapor_cold.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CARBON MONOXIDE (CO): ODORLESS & TASTELESS",
            "line2": "SILENT TOXIC ACCUMULATION",
            "themeColor": "gold"
        }
    },
    {
        "text": "It's triggered by rising carbon dioxide, which is a different molecule entirely. So, in a carbon monoxide event, there is no alarm, no choking, no panic, no urge to get out.",
        "startTime": 47.00, "endTime": 55.00,
        "clipPath": stock("ch02_winter_blackout_dark.mp4")
    },
    {
        "text": "You get a headache, you get drowsy, and you decide to lie down.",
        "startTime": 55.00, "endTime": 64.00,
        "clipPath": stock("ch08_hotel_room_solitude.mp4")
    },
    {
        "text": "Now, put that next to everything I just told you about insulation.",
        "startTime": 64.00, "endTime": 70.00,
        "clipPath": get_slice("clam_thermal_features", 10.0, 6.2, "uploads/raw/proj_fishingtent/slices/ch07_b09_clam_bonded_wall.mp4", crop_bottom=0.12)
    },
    {
        "text": "Every single thing that makes this tent better at holding heat also makes it better at holding exhaust. The quilted walls, the sealed seams, the reduced airflow.",
        "startTime": 70.00, "endTime": 77.92,
        "clipPath": stock("ch04_quilted_fabric_jacket.mp4")
    },
    {
        "text": "All of it works in both directions. The better the shelter, the thinner the safety margin gets.",
        "startTime": 77.92, "endTime": 84.52,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 102.0, 7.0, "uploads/raw/proj_fishingtent/slices/ch07_b11_eskimo_hub_seam.mp4", crop_bottom=0.12)
    },
    {
        "text": "That's why a battery-powered carbon monoxide detector, around $35 for a reliable one, is not an accessory.",
        "startTime": 84.52, "endTime": 92.42,
        "clipPath": get_slice("mr_heater_co_test", 124.0, 8.2, "uploads/raw/proj_fishingtent/slices/ch07_b12_mr_heater_detector_digital.mp4", crop_top=0.25, crop_bottom=0.12),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "MANDATORY $35 BATTERY CO DETECTOR",
            "line2": "NON-NEGOTIABLE LIFE SAFETY DEVICE",
            "themeColor": "gold"
        }
    },
    {
        "text": "It is the condition under which any flame is allowed in that tent at all.",
        "startTime": 92.42, "endTime": 97.22,
        "clipPath": stock("ch07_propane_camping_heater.mp4")
    },
    {
        "text": "You ventilate on purpose, with an opening low and one high, even though it feels wrong to let the cold in.",
        "startTime": 97.22, "endTime": 104.16,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 130.0, 7.2, "uploads/raw/proj_fishingtent/slices/ch07_b14_eskimo_vent_mesh.mp4", crop_bottom=0.12),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "HIGH & LOW DUAL VENTILATION ESSENTIAL",
            "line2": "CONTINUOUS CROSS-FLOW AIR EXHAUST",
            "themeColor": "cyan"
        }
    },
    {
        "text": "You never run a fuel burning heater while you sleep.",
        "startTime": 104.16, "endTime": 110.00,
        "clipPath": stock("ch02_candles_flashlight_table.mp4")
    },
    {
        "text": "You never bring in a charcoal grill or a camp stove for warmth, and you never run a generator near the openings. There's a reason I'm being this direct.",
        "startTime": 110.00, "endTime": 117.04,
        "clipPath": stock("ch06_blizzard_wind_howling.mp4")
    },
    {
        "text": "In Halifax, one man's ordinary camping tent caught fire one December morning and was destroyed from the inside.",
        "startTime": 117.04, "endTime": 124.12,
        "clipPath": stock("ch07_fire_truck_emergency.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "HALIFAX INCIDENT: ORDINARY TENT DESTROYED BY FIRE",
            "line2": "IMPROVISED OPEN FLAME IN ENCLOSED NYLON",
            "themeColor": "gold"
        }
    },
    {
        "text": "He survived, and he moved into one of the red huts.",
        "startTime": 124.12, "endTime": 128.00,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 162.0, 4.5, "uploads/raw/proj_fishingtent/slices/ch07_b18_eskimo_red_hut_lake.mp4", crop_bottom=0.12)
    },
    {
        "text": "But it's a reminder of what happens when cold, desperation, and open flame share a few square feet of fabric.",
        "startTime": 128.00, "endTime": 134.28,
        "clipPath": stock("ch01_snow_city_square.mp4")
    },
    {
        "text": "The safest heat in any shelter like this isn't a heater at all.",
        "startTime": 134.28, "endTime": 138.98,
        "clipPath": stock("ch05_looking_out_tent_winter.mp4")
    },
    {
        "text": "It's tight walls, an insulated floor, and the people inside it.",
        "startTime": 138.98, "endTime": 143.02,
        "clipPath": get_slice("eskimo_quickfish_3i_setup", 186.0, 4.04, "uploads/raw/proj_fishingtent/slices/ch07_b21_eskimo_quilted_exterior.mp4", crop_bottom=0.12)
    }
]

print("\n>>> FORMATTING AND FINALIZING TIMELINE JSON FILES...")

def build_timeline(ch_num, duration, audio_filename, raw_clips):
    clips = []
    for i, c in enumerate(raw_clips):
        clip_obj = {
            "beatIndex": i,
            "chapterIndex": ch_num,
            "text": c["text"],
            "startTime": round(c["startTime"], 2),
            "endTime": round(c["endTime"], 2),
            "duration": round(c["endTime"] - c["startTime"], 2),
            "clipPath": c["clipPath"],
            "mediaType": "video",
            "layout": "full_bleed_cinematic",
            "kenBurns": True,
            "transitionType": "cut",
            "transitionDuration": 0,
            "numberOverlays": []
        }
        if "callout" in c:
            clip_obj["callout"] = c["callout"]
        clips.append(clip_obj)
    
    tl = {
        "masterAudioPath": f"uploads/audio/fishingtent/{audio_filename}",
        "totalDuration": duration,
        "outputPath": f"output/fishingtent_rendered/chapter_{ch_num:02d}.mp4",
        "clips": clips
    }
    return tl

t4 = build_timeline(4, 189.88, "ch04_whats_inside_the_walls.mp3", ch04_clips_raw)
t5 = build_timeline(5, 86.33, "ch05_awake_seated_still.mp3", ch05_clips_raw)
t6 = build_timeline(6, 158.01, "ch06_the_catches.mp3", ch06_clips_raw)
t7 = build_timeline(7, 143.02, "ch07_the_part_that_can_kill_you.mp3", ch07_clips_raw)

timelines = {
    4: t4,
    5: t5,
    6: t6,
    7: t7
}

for ch_num, tl in timelines.items():
    fn = os.path.join(TIMELINES_DIR, f"chapter_{ch_num:02d}_final.json")
    with open(fn, "w", encoding="utf-8") as f:
        json.dump(tl, f, indent=2)
    print(f"Saved: {fn} ({len(tl['clips'])} clips, totalDuration: {tl['totalDuration']})")

print("\n>>> EXTRACTING BEAT SNAPSHOTS...")
for ch_num, tl in timelines.items():
    snap_dir = os.path.join(SNAPSHOTS_ROOT, f"fishingtent_ch{ch_num:02d}")
    os.makedirs(snap_dir, exist_ok=True)
    for c in tl["clips"]:
        b_idx = c["beatIndex"]
        clip_file = c["clipPath"]
        out_snap = os.path.join(snap_dir, f"beat_{b_idx:02d}.jpg")
        
        dur_str = subprocess.check_output([
            "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", clip_file
        ]).decode().strip()
        clip_dur = float(dur_str)
        mid_time = min(clip_dur / 2.0, c["duration"] / 2.0)
        
        subprocess.run([
            "ffmpeg", "-nostdin", "-y",
            "-ss", str(mid_time),
            "-i", clip_file,
            "-vframes", "1",
            "-vf", "scale=960:540",
            "-q:v", "2",
            out_snap
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Extracted snapshots for Chapter {ch_num:02d} -> {snap_dir}")

print("\n>>> SYNCING INTO PROJECTS.JSON...")
store_paths = [
    os.path.join(REPO_ROOT, "output", "store", "projects.json"),
    os.path.join(REPO_ROOT, "apps", "api", "output", "store", "projects.json")
]

for sp in store_paths:
    if os.path.exists(sp):
        with open(sp, "r", encoding="utf-8") as f:
            all_projects = json.load(f)
        for proj in all_projects:
            if proj.get("id") == "proj_fishingtent_hideaways":
                for ch in proj.get("chapters", []):
                    idx = ch.get("chapterIndex")
                    if idx in timelines:
                        tl = timelines[idx]
                        final_json_path = os.path.join(TIMELINES_DIR, f"chapter_{idx:02d}_final.json")
                        ch["timelineFile"] = final_json_path
                        ch["timelinePath"] = final_json_path
                        ch["timelineJson"] = tl
                        ch["status"] = "staged"
        with open(sp, "w", encoding="utf-8") as f:
            json.dump(all_projects, f, indent=2)
        print(f"Updated store: {sp}")

print("\nALL TASKS FINISHED SUCCESSFULLY!")
