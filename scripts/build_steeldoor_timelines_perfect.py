import os
import sys
import json
import glob
import subprocess

REPO_ROOT = os.path.abspath(".")
AUDIO_DIR = os.path.join(REPO_ROOT, "uploads", "audio", "steeldoor")
TRANSCRIPTS_DIR = os.path.join(REPO_ROOT, "uploads", "transcripts", "steeldoor")
POOL_DIR = os.path.join(REPO_ROOT, "uploads", "raw", "proj_steeldoor", "pool_cfr30")
TIMELINES_DIR = os.path.join(REPO_ROOT, "uploads", "timelines", "steeldoor")
SNAPSHOTS_DIR = os.path.join(REPO_ROOT, "uploads", "beat_snapshots", "steeldoor")

os.makedirs(TIMELINES_DIR, exist_ok=True)
os.makedirs(SNAPSHOTS_DIR, exist_ok=True)

# Collect all available CFR30 pool clips
all_pool = sorted(glob.glob(os.path.join(POOL_DIR, "*.mp4")))
print(f"Loaded {len(all_pool)} standardized clips in CFR30 pool.")

used_clips = set()

def get_clip(preferred_list, fallback_keyword=""):
    """Picks an unused clip from preferred list, or falls back to pool matching keyword"""
    for c in preferred_list:
        path = os.path.abspath(os.path.join(POOL_DIR, c))
        if path not in used_clips and os.path.exists(path) and os.path.getsize(path) > 30000:
            used_clips.add(path)
            return path
            
    # Fallback to pool with keyword
    if fallback_keyword:
        for p in all_pool:
            abs_p = os.path.abspath(p)
            if abs_p not in used_clips and fallback_keyword in os.path.basename(p).lower():
                used_clips.add(abs_p)
                return abs_p
                
    # Fallback to any unused clip
    for p in all_pool:
        abs_p = os.path.abspath(p)
        if abs_p not in used_clips:
            used_clips.add(abs_p)
            return abs_p
            
    raise RuntimeError("Ran out of unique clips in pool!")

# =========================================================================
# CHAPTER DEFINITIONS WITH 1:1 SEMANTIC MAPPING & RICH CALLOUTS
# =========================================================================

CHAPTER_CONFIGS = [
    # ── CHAPTER 01: COLD DOOR (84.3s) ─────────────────────────────────────────
    {
        "ch": 1, "stem": "ch01_cold_door", "totalDuration": 84.3,
        "beats": [
            {
                "text": "A neighbor filed a complaint and the county sent a building inspector to a piece of land behind a tree line in rural Mississippi.",
                "start": 0.0, "end": 7.3,
                "preferred": ["ch01_slice01_rural_treeline.mp4", "ch01_rural_dirt_road_trees.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "JONES COUNTY • MISSISSIPPI", "line2": "MUNICIPAL CODE COMPLAINT INVESTIGATION", "themeColor": "cyan"}
            },
            {
                "text": "He went expecting a code violation, maybe a squatter, maybe a junk pile.",
                "start": 7.3, "end": 12.4,
                "preferred": ["ch01_pickup_truck_rural.mp4", "ch01_slice02_red_clay_approach.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "SITE INSPECTION REPORT", "line2": "SUSPECTED CODE INFRACTION / IMPROMPTU STRUCTURE", "themeColor": "gold"}
            },
            {
                "text": "He did not expect a welcome mat. But there it was, in front of a locking steel door on the side of a shipping container.",
                "start": 12.4, "end": 20.0,
                "preferred": ["ch01_slice05_welcome_mat_door.mp4", "ch01_slice04_container_exterior_trees.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "PARCEL PERIMETER • UNREGISTERED SITE", "line2": "20-FOOT CONTAINER CONVERSION", "themeColor": "cyan"}
            },
            {
                "text": "The container had curtains in its windows and solar panels tilted toward the sun.",
                "start": 20.0, "end": 25.9,
                "preferred": ["ch01_slice06_solar_roof_tilt.mp4", "ch09_solar_panel_sunlight.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "OFF-GRID INFRASTRUCTURE", "line2": "ROOF-MOUNTED PHOTOVOLTAIC SOLAR ARRAY", "themeColor": "gold"}
            },
            {
                "text": "He knocked. A 23-year-old woman opened the door and invited him inside.",
                "start": 25.9, "end": 32.5,
                "preferred": ["ch07_slice12_door_latch_test.mp4", "ch07_exterior_door_handle.mp4"]
            },
            {
                "text": "He walked in, sat down on a folding chair, and said nothing for a full minute.",
                "start": 32.5, "end": 38.6,
                "preferred": ["ch01_slice07_folding_chair_interior.mp4", "ch01_folding_chair_empty.mp4"]
            },
            {
                "text": "Hold on to that minute because I am going to take you through that door and I am going to show you exactly what he saw.",
                "start": 38.6, "end": 44.5,
                "preferred": ["ch10_slice01_interior_living_wide.mp4", "ch01_slice10_side_curtains_exterior.mp4"]
            },
            {
                "text": "But what is inside is not the strangest part of this story. The strangest part is the price.",
                "start": 44.5, "end": 50.8,
                "preferred": ["ch02_cash_money_counting.mp4", "ch02_calculator_budget.mp4"]
            },
            {
                "text": "The container, the door, the insulation, the power, the water, all of it came to $412,",
                "start": 50.8, "end": 57.0,
                "preferred": ["ch02_calculator_budget.mp4", "ch02_cash_money_counting.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "CERTIFIED TOTAL OUT-OF-POCKET BUILD COST", "line2": "$412.00 FULL STRUCTURAL & UTILITY CONVERSION", "themeColor": "gold"}
            },
            {
                "text": "and every major piece of that build was something another person had thrown away.",
                "start": 57.0, "end": 62.7,
                "preferred": ["ch08_construction_dumpster.mp4", "ch04_slice05_depot_aged_containers.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "MATERIAL SOURCING AUDIT", "line2": "100% DIVERTED FROM COMMERCIAL DUMPSTERS & SURPLUS", "themeColor": "cyan"}
            },
            {
                "text": "Now ask yourself the question that the inspector never got to ask out loud. How do you find a house in the trash?",
                "start": 62.7, "end": 69.3,
                "preferred": ["ch05_dented_metal_rust.mp4", "ch08_utility_knife_cutting.mp4"]
            },
            {
                "text": "She knew exactly which trash to look in and she had learned it while sleeping in a Chevy Malibu in a church parking lot with her four-year-old son.",
                "start": 69.3, "end": 77.2,
                "preferred": ["ch01_slice08_malibu_profile.mp4", "ch03_car_backseat_blankets.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "WINTER 2020 • HOMELESS SURVIVAL", "line2": "CHEVY MALIBU SEDAN • HWY 15 CHURCH LOT", "themeColor": "crimson"}
            },
            {
                "text": "To see how she got from that car to that door, we need to start with one number on a dollar store paycheck.",
                "start": 77.2, "end": 84.3,
                "preferred": ["ch02_slice01_dg_exterior_parking.mp4", "ch02_cashier_scanning.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "ORIGIN POINT", "line2": "DOLLAR STORE HOURLY WAGE BREAKDOWN", "themeColor": "gold"}
            }
        ]
    },

    # ── CHAPTER 02: THE NUMBER THAT BROKE HER (56.1s) ────────────────────────
    {
        "ch": 2, "stem": "ch02_the_number_that_broke_her", "totalDuration": 56.1,
        "beats": [
            {
                "text": "In the fall of 2020, Tamara works the morning shift at a dollar store in Laurel, Mississippi.",
                "start": 0.0, "end": 5.8,
                "preferred": ["ch02_slice01_dg_exterior_parking.mp4", "ch02_slice08_entry_doors.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "LAUREL, MISSISSIPPI • FALL 2020", "line2": "MORNING RETAIL CLERK SHIFT", "themeColor": "cyan"}
            },
            {
                "text": "She earns $314 a week before taxes and about $260 after.",
                "start": 5.8, "end": 12.8,
                "preferred": ["ch02_cash_money_counting.mp4", "ch02_slice03_dg_cashier_morning.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "NET WEEKLY PAYROLL: $260.00", "line2": "$314.00 GROSS PRE-TAX COMPENSATION", "themeColor": "gold"}
            },
            {
                "text": "A one-bedroom apartment in Laurel averages $850 a month.",
                "start": 12.8, "end": 17.9,
                "preferred": ["ch02_slice06_laurel_downtown_residential.mp4", "ch01_slice03_laurel_county_landscape.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "HOUSING MARKET BENCHMARK", "line2": "$850.00 / MONTH AVERAGE 1-BEDROOM RENT", "themeColor": "crimson"}
            },
            {
                "text": "Four weeks of her paychecks add up to roughly $1,040, so once the rent is paid,",
                "start": 17.9, "end": 24.1,
                "preferred": ["ch02_calculator_budget.mp4", "ch02_slice02_dg_shelves_canned.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "MONTHLY NET EARNINGS: $1,040.00", "line2": "81.7% OF INCOME REQUIRED FOR SHELTER", "themeColor": "crimson"}
            },
            {
                "text": "she has $190 left for the month. That $190 has to cover food, transportation, diapers, medicine, and everything else a four-year-old needs.",
                "start": 24.1, "end": 33.4,
                "preferred": ["ch02_slice05_dg_supplies_budget.mp4", "ch02_slice04_dg_aisle_cleaning.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "REMAINING SURPLUS: $190.00 / MO", "line2": "DISPOSABLE INCOME FOR CHILD CARE & FOOD", "themeColor": "crimson"}
            },
            {
                "text": "The math has never worked. It just has not failed yet.",
                "start": 33.4, "end": 39.5,
                "preferred": ["ch02_calculator_budget.mp4", "ch02_slice07_laurel_street_crossroads.mp4"]
            },
            {
                "text": "In October, her landlord raises the rent by $75 and a budget that was barely holding together finally gives way.",
                "start": 39.5, "end": 46.8,
                "preferred": ["ch02_eviction_notice_door.mp4", "ch02_slice10_laurel_quiet_streets.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "OCTOBER LEASE REVISION: +$75.00", "line2": "TOTAL RENT: $925.00 • BUDGET DEFICIT TRIGGER", "themeColor": "crimson"}
            },
            {
                "text": "On November 12, she is evicted.",
                "start": 46.8, "end": 50.5,
                "preferred": ["ch02_eviction_notice_door.mp4", "ch03_slice01_malibu_dashboard_night.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "LEGAL DISPOSSESSION ORDER", "line2": "DATE OF EVICTION: NOVEMBER 12, 2020", "themeColor": "crimson"}
            },
            {
                "text": "Most people assume the story ends there or turns toward a shelter. It does neither.",
                "start": 50.5, "end": 56.1,
                "preferred": ["ch01_slice08_malibu_profile.mp4", "ch03_night_highway_driving.mp4"]
            }
        ]
    },

    # ── CHAPTER 03: WHERE THEY SLEPT (59.4s) ──────────────────────────────────
    {
        "ch": 3, "stem": "ch03_where_they_slept", "totalDuration": 59.4,
        "beats": [
            {
                "text": "Look closely at what the system offered her because every option has a trapped door.",
                "start": 0.0, "end": 5.6,
                "preferred": ["ch03_homeless_shelter_beds.mp4", "ch04_slice01_laurel_public_buildings.mp4"]
            },
            {
                "text": "The shelter in Laurel has an 11-week wait list.",
                "start": 5.6, "end": 8.9,
                "preferred": ["ch03_homeless_shelter_beds.mp4", "ch04_food_pantry_shelves.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "LAUREL EMERGENCY SHELTER", "line2": "INTAKE BOTTLENECK: 11-WEEK WAITLIST", "themeColor": "crimson"}
            },
            {
                "text": "The nearest open beds are in Hattiesburg, 30 miles away, which means quitting the dollar store job, and that job is the only thing keeping her son fed.",
                "start": 8.9, "end": 18.3,
                "preferred": ["ch03_slice02_malibu_driver_view_empty_road.mp4", "ch03_night_highway_driving.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "HATTIESBURG FACILITY • 30 MILES SOUTH", "line2": "RELOCATION FORFEITS ONLY SOURCE OF INCOME", "themeColor": "crimson"}
            },
            {
                "text": "A motel room costs $49 a night, and would swallow her entire paycheck in five days.",
                "start": 18.3, "end": 24.8,
                "preferred": ["ch03_motel_neon_sign.mp4", "ch03_slice01_malibu_dashboard_night.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "COMMERCIAL MOTEL EXPENSE: $49 / NIGHT", "line2": "EXHAUSTS WEEKLY EARNINGS IN 5.3 DAYS", "themeColor": "gold"}
            },
            {
                "text": "Each door asks her to give up her only income or opens months after she needs it,",
                "start": 24.8, "end": 30.7,
                "preferred": ["ch03_slice04_malibu_center_console.mp4", "ch03_slice09_malibu_highway_dusk.mp4"]
            },
            {
                "text": "so she parks a 2006 Chevy Malibu in the lot of a church of Highway 15, and that becomes home.",
                "start": 30.7, "end": 37.8,
                "preferred": ["ch01_slice08_malibu_profile.mp4", "ch11_rural_church_country.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "PRIMARY REFUGE: 2006 CHEVY MALIBU", "line2": "CHURCH PARKING LOT • HIGHWAY 15 CORRIDOR", "themeColor": "cyan"}
            },
            {
                "text": "Her son sleeps buckled into his car seat, wrapped in every blanket they own through the coldest stretch of a Mississippi winter.",
                "start": 37.8, "end": 45.4,
                "preferred": ["ch03_slice06_bundled_in_blankets.mp4", "ch03_car_backseat_blankets.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "SUB-FREEZING WINTER TEMPERATURES", "line2": "REAR CAR SEAT • WOOL BLANKET INSULATION", "themeColor": "cyan"}
            },
            {
                "text": "She keeps going to work, she feeds him first,",
                "start": 45.4, "end": 49.2,
                "preferred": ["ch03_slice05_car_window_freezing_fog.mp4", "ch03_breath_cold_vapor.mp4"]
            },
            {
                "text": "and she starts eating one meal a day because she is saving every dollar she can for something she has told only a few people about.",
                "start": 49.2, "end": 56.4,
                "preferred": ["ch03_slice07_night_car_interior_glow.mp4", "ch02_cash_money_counting.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "CAPITAL ACCUMULATION STRATEGY", "line2": "ONE MEAL DAILY • SAVING TOWARD INDEPENDENT BUILD", "themeColor": "gold"}
            },
            {
                "text": "Every one of them laughed.",
                "start": 56.4, "end": 59.4,
                "preferred": ["ch03_slice08_car_shelter_morning_light.mp4", "ch04_rural_gas_station.mp4"]
            }
        ]
    },

    # ── CHAPTER 04: THE THINGS NOBODY BELIEVED (79.5s) ────────────────────────
    {
        "ch": 4, "stem": "ch04_the_things_nobody_believed", "totalDuration": 79.5,
        "beats": [
            {
                "text": "She is going to buy a steel box and turn it into a house.",
                "start": 0.0, "end": 3.8,
                "preferred": ["ch04_slice03_depot_stacks_overview.mp4", "ch05_shipping_containers_yard.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "THE RETROFIT CONCEPT", "line2": "DISMISSED INTERMODAL CONTAINER CONVERSION", "themeColor": "cyan"}
            },
            {
                "text": "The laughter is not polite or private.",
                "start": 3.8, "end": 6.7,
                "preferred": ["ch04_rural_gas_station.mp4", "ch04_slice01_laurel_public_buildings.mp4"]
            },
            {
                "text": "A woman at the food pantry calls the idea crazy.",
                "start": 6.7, "end": 10.3,
                "preferred": ["ch04_food_pantry_shelves.mp4", "ch04_slice06_depot_corner_posts.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "LOCAL SKEPTICISM", "line2": "COMMUNITY FOOD PANTRY FEEDBACK", "themeColor": "gold"}
            },
            {
                "text": "A man at the gas station tells her she will cook alive inside a metal box by July.",
                "start": 10.3, "end": 16.3,
                "preferred": ["ch04_rural_gas_station.mp4", "ch05_dented_metal_rust.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "THERMAL HAZARD WARNING", "line2": "SUMMER CONTAINER SURFACE TEMP EXCEEDS 140°F", "themeColor": "crimson"}
            },
            {
                "text": "Her own cousin tells her to stop wasting time and apply for public housing like everyone else.",
                "start": 16.3, "end": 22.1,
                "preferred": ["ch02_slice06_laurel_downtown_residential.mp4", "ch04_slice02_railroad_industrial_edge.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "MUNICIPAL HOUSING REGISTRY", "line2": "SECTION 8 WAITING PERIOD EXCEEDS 24 MONTHS", "themeColor": "gold"}
            },
            {
                "text": "The man at the gas station was right about one thing and we will get to how she solved it.",
                "start": 22.1, "end": 28.5,
                "preferred": ["ch08_slice05_vapor_barrier_sheeting_roll.mp4", "ch08_water_condensation.mp4"]
            },
            {
                "text": "But here is what none of them understood. In whatever hours she can find around her shifts and her son's care,",
                "start": 28.5, "end": 35.8,
                "preferred": ["ch04_library_books_reading.mp4", "ch04_computer_research.mp4"]
            },
            {
                "text": "Tamara is sitting in the Laurel Public Library researching three questions.",
                "start": 35.8, "end": 41.5,
                "preferred": ["ch04_computer_research.mp4", "ch04_library_books_reading.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "LAUREL PUBLIC LIBRARY", "line2": "OFF-GRID FEASIBILITY RESEARCH & CODE AUDIT", "themeColor": "cyan"}
            },
            {
                "text": "Where can you buy a shipping container for almost nothing? When does a county let you build without a permit?",
                "start": 41.5, "end": 48.9,
                "preferred": ["ch04_slice04_depot_forklift_moving.mp4", "ch05_shipping_containers_yard.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "LEGAL CODE THRESHOLD", "line2": "PERMIT EXEMPTION ANALYSIS • UNINCORPORATED COUNTY", "themeColor": "gold"}
            },
            {
                "text": "And how do you stop a steel box from killing the people inside it?",
                "start": 48.9, "end": 53.9,
                "preferred": ["ch05_slice05_examining_corner_casting.mp4", "ch08_utility_knife_cutting.mp4"]
            },
            {
                "text": "The answers turn out to be a surplus auction,",
                "start": 53.9, "end": 57.6,
                "preferred": ["ch04_slice05_depot_aged_containers.mp4", "ch04_slice07_depot_sea_containers.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "STRATEGY 1: MARITIME RETIREMENT", "line2": "DISCHARGED CARGO CONTAINER SURPLUS YARDS", "themeColor": "cyan"}
            },
            {
                "text": "a zoning exemption for structures under 200 square feet that are not connected to municipal water or sewer",
                "start": 57.6, "end": 64.9,
                "preferred": ["ch01_slice02_red_clay_approach.mp4", "ch06_overgrown_rural_land.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "STRATEGY 2: ZONING CODE CARVE-OUT", "line2": "NON-RESIDENTIAL DETACHED FOOTPRINT UNDER 200 SQ FT", "themeColor": "gold"}
            },
            {
                "text": "and a trick she will not find in any hardware store.",
                "start": 64.9, "end": 69.5,
                "preferred": ["ch08_slice06_stapling_plastic_over_studs.mp4", "ch08_plastic_sheeting_staple.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "STRATEGY 3: 6-MIL THERMAL ISOLATION", "line2": "PREVENTING CONDENSATION DROP & STEEL RUST", "themeColor": "cyan"}
            },
            {
                "text": "Zoning rules vary from county to county, so anyone thinking about copying her should check their own code first. But in Tamara's corner of Mississippi, the piece is fit.",
                "start": 69.5, "end": 79.5,
                "preferred": ["ch04_slice08_county_tree_line_horizon.mp4", "ch01_slice03_laurel_county_landscape.mp4"]
            }
        ]
    },

    # ── CHAPTER 05: THE BOX NOBODY WANTED (67.0s) ────────────────────────────
    {
        "ch": 5, "stem": "ch05_the_box_nobody_wanted", "totalDuration": 67.0,
        "beats": [
            {
                "text": "A standard 20-foot shipping container in good condition sells for $1,500 to $3,000.",
                "start": 0.0, "end": 7.7,
                "preferred": ["ch05_slice01_gulfport_gantry_cranes.mp4", "ch05_shipping_containers_yard.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "COMMERCIAL MARKET VALUE", "line2": "$1,500 - $3,000 STANDARD 20FT CARGO BOX", "themeColor": "gold"}
            },
            {
                "text": "But at a surplus yard outside Gulfport, Tamara finds something else.",
                "start": 7.7, "end": 13.4,
                "preferred": ["ch05_slice02_gulfport_cargo_dock.mp4", "ch05_slice07_corrugated_wall_run.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "GULFPORT SURPLUS LOGISTICS", "line2": "COASTAL REJECTION DEPOT", "themeColor": "cyan"}
            },
            {
                "text": "Containers with dented panels and warped door frames get pulled from commercial service.",
                "start": 13.4, "end": 18.4,
                "preferred": ["ch05_slice03_inspecting_dented_panel.mp4", "ch05_slice09_dented_corrugation_detail.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "OFF-SPEC MARITIME ASSETS", "line2": "STRUCTURALLY DISQUALIFIED FROM OCEAN CRANE STACKING", "themeColor": "crimson"}
            },
            {
                "text": "And once that happens, almost no one will buy them.",
                "start": 18.4, "end": 21.9,
                "preferred": ["ch05_slice04_checking_cargo_door_alignment.mp4", "ch05_slice10_cargo_door_rubber_gasket.mp4"]
            },
            {
                "text": "Why would a dent cut the price by more than 90 percent? Because the people who buy containers are shippers and shippers need containers that stack and seal.",
                "start": 21.9, "end": 30.5,
                "preferred": ["ch05_dented_metal_rust.mp4", "ch05_slice05_examining_corner_casting.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "PRICE DEPRECIATION DYNAMICS", "line2": "90%+ VALUATION COLLAPSE FOR NON-STACKABLE UNITS", "themeColor": "gold"}
            },
            {
                "text": "Tamara is not shipping anything. She is looking for walls.",
                "start": 30.5, "end": 35.5,
                "preferred": ["ch05_slice07_corrugated_wall_run.mp4", "ch05_slice11_measuring_steel_post.mp4"]
            },
            {
                "text": "She finds a container with two dented side panels and a door that no longer lines up. The price is $250.",
                "start": 35.5, "end": 44.5,
                "preferred": ["ch05_slice03_inspecting_dented_panel.mp4", "ch02_cash_money_counting.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "ACQUIRED ASSET PRICE: $250.00", "line2": "TWO DENTED WALL PANELS • MISALIGNED REAR CARGO DOOR", "themeColor": "gold"}
            },
            {
                "text": "She checks the things that matter. The dents are cosmetic, the steel frame is solid and the floor is marine grade plywood.",
                "start": 44.5, "end": 52.8,
                "preferred": ["ch05_slice06_checking_plywood_floor.mp4", "ch05_plywood_floor_surface.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "STRUCTURAL INTEGRITY AUDIT", "line2": "14-GAUGE CORTEN FRAME • 28MM MARINE PLYWOOD DECK", "themeColor": "cyan"}
            },
            {
                "text": "She pays in cash from money she saved over three months of skipped meals.",
                "start": 52.8, "end": 59.2,
                "preferred": ["ch02_cash_money_counting.mp4", "ch03_slice07_night_car_interior_glow.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "TRANSACTION EXECUTED: $250 CASH", "line2": "FINANCED VIA 90 DAYS OF PERSONAL RATIONING", "themeColor": "gold"}
            },
            {
                "text": "Now she owns 20 feet of steel. She has no truck to move it and no land to put it on.",
                "start": 59.2, "end": 64.0,
                "preferred": ["ch05_slice08_roof_seam_check.mp4", "ch01_slice02_red_clay_approach.mp4"]
            },
            {
                "text": "And she has not told anyone yet how she plans to fix that.",
                "start": 64.0, "end": 67.0,
                "preferred": ["ch06_slice01_overgrown_pasture_timber.mp4", "ch06_overgrown_rural_land.mp4"]
            }
        ]
    },

    # ── CHAPTER 06: TWO ACRES AND A HANDSHAKE (94.9s) ────────────────────────
    {
        "ch": 6, "stem": "ch06_two_acres_and_a_handshake", "totalDuration": 94.9,
        "beats": [
            {
                "text": "She starts with land, and she does it the hard way. She does not squat on public property, or hide a container behind a gas station.",
                "start": 0.0, "end": 8.8,
                "preferred": ["ch06_slice01_overgrown_pasture_timber.mp4", "ch06_overgrown_rural_land.mp4"]
            },
            {
                "text": "She knocks on doors along the county roads outside Laurel until she finds an elderly man who owns seven acres that have been untouched for more than a decade.",
                "start": 8.8, "end": 20.3,
                "preferred": ["ch06_slice02_farm_driveway_trees.mp4", "ch06_elderly_farmer_porch.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "RURAL PROPERTY SCOUTING", "line2": "7-ACRE UNTOUCHED PARCEL • JONES COUNTY", "themeColor": "cyan"}
            },
            {
                "text": "Brush has taken over. The county keeps sending him notices. His children live out of state, and he can no longer keep up the property.",
                "start": 20.3, "end": 28.5,
                "preferred": ["ch06_overgrown_rural_land.mp4", "ch06_slice09_southern_pasture_dusk.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "MUNICIPAL CODE CITATIONS", "line2": "OVERGROWN VEGETATION & WEED INFRACTION NOTICES", "themeColor": "crimson"}
            },
            {
                "text": "Tamara makes him an offer. She will clear the brush, mow the road frontage, maintain the land, and check on his house through the winter.",
                "start": 28.5, "end": 37.8,
                "preferred": ["ch06_slice03_clearing_in_pine_forest.mp4", "ch06_elderly_farmer_porch.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "LAND ACCESS BARTER PROPOSAL", "line2": "LABOR COMMITMENT: FRONTAGE CLEARING & WINTER CARE", "themeColor": "gold"}
            },
            {
                "text": "In exchange, she wants the back two acres out of sight from the road with access to his outdoor spigot and a single electrical outlet on the side of his barn.",
                "start": 37.8, "end": 48.0,
                "preferred": ["ch06_slice03_clearing_in_pine_forest.mp4", "ch09_blue_water_drum.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "THE 2-ACRE CARVE-OUT", "line2": "REAR LOT ACCESS • SPIGOT WATER • AUXILIARY 120V OUTLET", "themeColor": "cyan"}
            },
            {
                "text": "He says yes with a handshake. There is no lease and no contract, just two people who each have something the other needs.",
                "start": 48.0, "end": 56.4,
                "preferred": ["ch06_handshake_agreement.mp4", "ch06_slice02_farm_driveway_trees.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "COVENANT BY HANDSHAKE", "line2": "$0.00 MONETARY RENT • MUTUAL BENEFIT ACCORD", "themeColor": "gold"}
            },
            {
                "text": "Next comes the problem money cannot solve because she has none. A commercial flatbed would cost at least $400.",
                "start": 56.4, "end": 64.9,
                "preferred": ["ch06_slice04_flatbed_with_20ft_box.mp4", "ch02_calculator_budget.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "COMMERCIAL HAULING QUOTE: $400.00", "line2": "PROHIBITIVE HEAVY TRANSPORT TARIFF", "themeColor": "crimson"}
            },
            {
                "text": "So on Sunday, she goes to church and asks. A man who drives a logging flatbed agrees to haul the container on his day off.",
                "start": 64.9, "end": 74.0,
                "preferred": ["ch11_rural_church_country.mp4", "ch06_slice05_truck_turning_dirt_road.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "COMMUNITY LOGISTICS AID", "line2": "VOLUNTEER LOGGING RIG OPERATOR", "themeColor": "cyan"}
            },
            {
                "text": "She pays him $40 for gas and promises him a home-cooked meal when the project is done.",
                "start": 74.0, "end": 80.5,
                "preferred": ["ch02_cash_money_counting.mp4", "ch06_slice04_flatbed_with_20ft_box.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "FREIGHT EXPENDITURE: $40.00", "line2": "DIESEL FUEL CONTRIBUTION", "themeColor": "gold"}
            },
            {
                "text": "On a Saturday morning in May 2021, a rusty steel box lands on a patch of red Mississippi clay.",
                "start": 80.5, "end": 88.0,
                "preferred": ["ch06_slice06_tilt_bed_hydraulic_lift.mp4", "ch06_slice07_container_sliding_to_ground.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "PLACEMENT DATE: MAY 2021", "line2": "UNLOADED ONTO RED MISSISSIPPI CLAY", "themeColor": "gold"}
            },
            {
                "text": "Neighbors who can see it from the road shake their heads. They see exactly what it looks like, junk in a field. They are about to hear a sound coming from it.",
                "start": 88.0, "end": 94.9,
                "preferred": ["ch06_slice08_container_landing_clay.mp4", "ch07_slice01_marking_cut_chalk.mp4"]
            }
        ]
    },

    # ── CHAPTER 07: THE SOUND OF A GRINDER (81.9s) ───────────────────────────
    {
        "ch": 7, "stem": "ch07_the_sound_of_a_grinder", "totalDuration": 81.9,
        "beats": [
            {
                "text": "Inside, a sealed container in Mississippi can pass 140 degrees in July.",
                "start": 0.0, "end": 6.0,
                "preferred": ["ch05_dented_metal_rust.mp4", "ch05_slice08_roof_seam_check.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "CORTEN THERMAL MASS ACCUMULATION", "line2": "INTERIOR JULY RADIANT PEAK: 140°F (60°C)", "themeColor": "crimson"}
            },
            {
                "text": "In winter, the steel walls pull cold inward and condensation drips off every surface and breathes mold within months.",
                "start": 6.0, "end": 14.2,
                "preferred": ["ch08_water_condensation.mp4", "ch08_slice07_taping_vapor_barrier_seams.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "CONDENSATION HAZARD: 'CONTAINER RAIN'", "line2": "RAPID MOLD GERMINATION WITHIN CLOSED STEEL CAVITIES", "themeColor": "crimson"}
            },
            {
                "text": "To live in it, Tamara has to cut it open and she does not own a single power tool.",
                "start": 14.2, "end": 19.5,
                "preferred": ["ch07_measuring_tape_metal.mp4", "ch07_slice01_marking_cut_chalk.mp4"]
            },
            {
                "text": "She borrows an angle grinder, three cutting discs and welding gloves from a man at her church who does auto bodywork.",
                "start": 19.5, "end": 26.7,
                "preferred": ["ch07_welding_gloves_tools.mp4", "ch07_slice02_grinder_plunge_cut.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "BORROWED FABRICATION GEAR", "line2": "4.5\" ANGLE GRINDER • 3 CUTTING DISCS • WELDING GLOVES", "themeColor": "cyan"}
            },
            {
                "text": "She marks two window openings with chalk and blue painter's tape, measures twice with a borrowed tape and starts cutting.",
                "start": 26.7, "end": 34.5,
                "preferred": ["ch07_slice01_marking_cut_chalk.mp4", "ch07_measuring_tape_metal.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "LAYOUT & MARKING", "line2": "CHALK & BLUE PAINTER'S TAPE LEVELING", "themeColor": "gold"}
            },
            {
                "text": "Sparks sheet across the clay as she carves two openings, each 24 inches by 36 into solid corrugated steel.",
                "start": 34.5, "end": 42.0,
                "preferred": ["ch07_slice02_grinder_plunge_cut.mp4", "ch07_slice03_cutting_vertical_seam.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "ROUGH OPENING DIMENSIONS", "line2": "TWO 24\" × 36\" FENESTRATION OPENINGS", "themeColor": "gold"}
            },
            {
                "text": "She wears safety glasses from the dollar store where she works and she stuffs cotton balls in her ears because she cannot afford proper hearing protection.",
                "start": 42.0, "end": 50.5,
                "preferred": ["ch07_safety_glasses_eyes.mp4", "ch07_slice13_corner_cut_grinder.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "PPE AD HOC RIGGING", "line2": "RETAIL SAFETY GLASSES • COTTON BALL EAR PLUGS", "themeColor": "cyan"}
            },
            {
                "text": "The job takes an entire Saturday. The door takes more work.",
                "start": 50.5, "end": 55.5,
                "preferred": ["ch07_slice04_cutting_rough_window_opening.mp4", "ch07_slice05_steel_cutout_drop.mp4"]
            },
            {
                "text": "She widens the frame by eight inches on one side. To fit an exterior door, she found at the habitat for humanity restore in Hattiesburg for $20.",
                "start": 55.5, "end": 65.5,
                "preferred": ["ch07_slice06_restore_exterior_doors_row.mp4", "ch07_slice07_restore_aisle_hardware.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "HABITAT RESTORE SALVAGE: $20.00", "line2": "+8\" FRAME WIDENING FOR PRE-HUNG RESIDENTIAL DOOR", "themeColor": "gold"}
            },
            {
                "text": "The walls are open now and the heat is waiting.",
                "start": 65.5, "end": 70.0,
                "preferred": ["ch07_slice09_framing_door_opening_steel.mp4", "ch07_slice11_mounting_exterior_door.mp4"]
            },
            {
                "text": "Professionally installed spray foam would solve it and it would cost more than $1,000. Tamara has about $20.",
                "start": 70.0, "end": 77.0,
                "preferred": ["ch08_slice03_pro_spray_nozzle_wall.mp4", "ch02_cash_money_counting.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "PROFESSIONAL QUOTE: $1,000+", "line2": "ACTUAL REMAINING CASH LIQUIDITY: ~$20.00", "themeColor": "crimson"}
            },
            {
                "text": "So she asks a few people one question that sounds almost silly.",
                "start": 77.0, "end": 81.9,
                "preferred": ["ch08_slice01_straw_nozzle_foam_spray.mp4", "ch08_construction_dumpster.mp4"]
            }
        ]
    },

    # ── CHAPTER 08: WHAT CONTRACTORS THROW AWAY (82.8s) ──────────────────────
    {
        "ch": 8, "stem": "ch08_what_contractors_throw_away", "totalDuration": 82.8,
        "beats": [
            {
                "text": "Do insulation contractors throw away leftover product? They do.",
                "start": 0.0, "end": 4.4,
                "preferred": ["ch08_slice01_straw_nozzle_foam_spray.mp4", "ch08_construction_dumpster.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "INSULATION WASTE SURVEY", "line2": "CONTRACTOR EXCESS SURPLUS DIVERSION", "themeColor": "cyan"}
            },
            {
                "text": "A single attic job can leave behind three to five partly used cans of spray foam, and because opened product cannot be resold, it goes straight into the trash.",
                "start": 4.4, "end": 15.2,
                "preferred": ["ch08_slice02_expanding_foam_gap_seal.mp4", "ch08_slice04_foam_insulation_depth.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "JOB-SITE MATERIAL DISCARD", "line2": "3 - 5 PARTIALLY DISCHARGED CANS PER RESIDENTIAL JOB", "themeColor": "gold"}
            },
            {
                "text": "Tamara visits three insulation contractors around Laurel. The first turns her away. The second and third say yes.",
                "start": 15.2, "end": 23.5,
                "preferred": ["ch08_slice01_straw_nozzle_foam_spray.mp4", "ch01_slice03_laurel_county_landscape.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "LAUREL TRADE INQUIRY", "line2": "2 OF 3 CONTRACTORS PERMIT SCRAP MATERIAL RECOVERY", "themeColor": "cyan"}
            },
            {
                "text": "Over four weeks, she collects enough half empty cans to foam the ceiling and the upper walls.",
                "start": 23.5, "end": 30.5,
                "preferred": ["ch08_slice03_pro_spray_nozzle_wall.mp4", "ch08_slice12_foam_nozzle_deep_corner.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "ACCUMULATED FOAM INVENTORY", "line2": "$0.00 CEILING & UPPER CORRUGATION THERMAL COAT", "themeColor": "gold"}
            },
            {
                "text": "For the lower walls, she pulls rigid foam board out of a renovation dumpster on the south side of town,",
                "start": 30.5, "end": 37.0,
                "preferred": ["ch08_construction_dumpster.mp4", "ch08_utility_knife_cutting.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "DUMPSTER SALVAGE SOURCING", "line2": "RIGID EXTRUDED POLYSTYRENE BOARDS", "themeColor": "gold"}
            },
            {
                "text": "cuts it with a utility knife, glues it to the steel with construction adhesive, and covers it all with pallet wood planking.",
                "start": 37.0, "end": 45.5,
                "preferred": ["ch08_slice09_pallet_wood_disassembly.mp4", "ch08_slice10_nailing_planks_to_wall.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "WALL ASSEMBLY COMPOSITE", "line2": "RIGID FOAM CORE + RECLAIMED PALLET WOOD FACING", "themeColor": "cyan"}
            },
            {
                "text": "But the insulation is not the part that keeps the container alive. That is a different item, and it costs her $18.",
                "start": 45.5, "end": 53.5,
                "preferred": ["ch08_slice05_vapor_barrier_sheeting_roll.mp4", "ch08_plastic_sheeting_staple.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "THE CRITICAL $18.00 INVESTMENT", "line2": "6-MIL POLYETHYLENE CONTINUOUS VAPOR BARRIER", "themeColor": "gold"}
            },
            {
                "text": "Warm, moist air that hits cold steel turns to water, and that hidden moisture ruins most amateur container conversions inside a year.",
                "start": 53.5, "end": 62.0,
                "preferred": ["ch08_water_condensation.mp4", "ch08_slice08_insulation_stud_bay_overview.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "DEW POINT PHYSICS", "line2": "PREVENTS INTERNAL CORROSION & TOXIC BLACK MOLD", "themeColor": "crimson"}
            },
            {
                "text": "Tamara buys a roll of six-mill plastic sheeting, the same material builders lay under concrete slabs,",
                "start": 62.0, "end": 69.5,
                "preferred": ["ch08_slice06_stapling_plastic_over_studs.mp4", "ch08_slice13_plastic_framing_seal.mp4"]
            },
            {
                "text": "and staples it across the interior framing before the foam board and planking go up. It keeps the damp indoor air away from the cold metal.",
                "start": 69.5, "end": 76.5,
                "preferred": ["ch08_slice07_taping_vapor_barrier_seams.mp4", "ch08_slice14_taut_vapor_barrier.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "AIRTIGHT MEMBRANE SEAL", "line2": "CONTINUOUS BARRIER ON THE WARM INTERIOR SIDE", "themeColor": "cyan"}
            },
            {
                "text": "Four years later, there is no mold anywhere in her container. The shell is finished, but when the sun goes down, it is still pitch dark inside.",
                "start": 76.5, "end": 82.8,
                "preferred": ["ch08_slice11_finished_pallet_wood_corner.mp4", "ch09_led_strip_light_glow.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "LONG-TERM STRUCTURAL AUDIT", "line2": "FOUR YEARS DRY • ZERO BIOLOGICAL GROWTH", "themeColor": "gold"}
            }
        ]
    },

    # ── CHAPTER 09: THE PANELS BEHIND THE WAREHOUSE (143.0s) ───────────────────
    {
        "ch": 9, "stem": "ch09_the_panels_behind_the_warehouse", "totalDuration": 143.0,
        "beats": [
            {
                "text": "Without electricity, the container is dark by six every evening. Her fix comes from a place most people never look",
                "start": 0.0, "end": 7.5,
                "preferred": ["ch09_slice01_testing_solar_panel_sun.mp4", "ch09_solar_panel_sunlight.mp4"]
            },
            {
                "text": "and the companies that own it are eager to get rid of it. Solar installers across Southern Mississippi regularly pull panels off roofs after storm damage or warranty swaps.",
                "start": 7.5, "end": 18.2,
                "preferred": ["ch09_solar_panel_sunlight.mp4", "ch09_slice12_solar_wires_clamp.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "COMMERCIAL SOLAR SUPPLY STREAM", "line2": "STORM DAMAGE & WARRANTY REMOVAL STOCK", "themeColor": "cyan"}
            },
            {
                "text": "A panel with cracked glass or reduced output cannot be sold, so it gets stacked behind a warehouse to wait for disposal and disposal costs money.",
                "start": 18.2, "end": 28.5,
                "preferred": ["ch08_construction_dumpster.mp4", "ch09_slice01_testing_solar_panel_sun.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "HAZARDOUS E-WASTE OVERHEAD", "line2": "DISPOSAL FEES FOR COMMERCIAL INSTALLERS", "themeColor": "gold"}
            },
            {
                "text": "Think about what that means for a panel running at 60%. To a company guaranteeing full output, it is worthless,",
                "start": 28.5, "end": 35.8,
                "preferred": ["ch09_slice04_charge_controller_screen.mp4", "ch09_solar_panel_sunlight.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "THE 60% YIELD THRESHOLD", "line2": "COMMERCIALLY REJECTED • OFF-GRID FUNCTIONAL", "themeColor": "gold"}
            },
            {
                "text": "but 60% of a 300 watt panel is still 180 watts, enough for lights, a phone charger, and a fan.",
                "start": 35.8, "end": 43.5,
                "preferred": ["ch09_slice04_charge_controller_screen.mp4", "ch09_led_strip_light_glow.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "RECOVERED ELECTRICAL CAPACITY", "line2": "300W RATED → 180W ACTIVE POWER GENERATION", "themeColor": "gold"}
            },
            {
                "text": "Two solar companies near Hattiesburg give Tamara four damaged panels for nothing.",
                "start": 43.5, "end": 50.0,
                "preferred": ["ch09_solar_panel_sunlight.mp4", "ch09_slice01_testing_solar_panel_sun.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "PHOTOVOLTAIC PROCUREMENT: $0.00", "line2": "FOUR SALVAGED 300W MONOCRYSTALLINE PANELS", "themeColor": "cyan"}
            },
            {
                "text": "She mounts them on a wooden frame angled south.",
                "start": 50.0, "end": 54.5,
                "preferred": ["ch01_slice06_solar_roof_tilt.mp4", "ch09_solar_panel_sunlight.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "RACKING CONFIGURATION", "line2": "TIMBER GROUND RACK ORIENTED TRUE SOUTH", "themeColor": "gold"}
            },
            {
                "text": "Two used car batteries from a salvage yard, $15 each, make her battery bank,",
                "start": 54.5, "end": 61.2,
                "preferred": ["ch09_slice03_car_battery_bank_connections.mp4", "ch09_car_battery_cables.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "ENERGY STORAGE BANK: $30.00", "line2": "2× 12V FLOODED LEAD-ACID SALVAGE BATTERIES", "themeColor": "gold"}
            },
            {
                "text": "and a $35 charge controller is ordered online and shipped to the Laurel post office.",
                "start": 61.2, "end": 68.0,
                "preferred": ["ch09_slice02_wiring_charge_controller.mp4", "ch09_slice13_battery_fuse_safety.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "SYSTEM REGULATOR: $35.00", "line2": "PWM SOLAR CONTROLLER ORDERED TO LAUREL P.O. BOX", "themeColor": "cyan"}
            },
            {
                "text": "She teaches herself the wiring from a YouTube series on off-grid solar, watching it again and again at the library, and sketching diagrams on notebook paper to carry back to the build site.",
                "start": 68.0, "end": 79.5,
                "preferred": ["ch11_napkin_sketch_diagram.mp4", "ch04_computer_research.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "SELF-DIRECTED SYSTEM DESIGN", "line2": "HAND-DRAWN WIRING SCHEMATICS VIA LIBRARY WIFI", "themeColor": "gold"}
            },
            {
                "text": "The system runs four LED light strips, a USB charging station, a small 12 volt fan, and a radio.",
                "start": 79.5, "end": 88.0,
                "preferred": ["ch09_slice05_12v_fan_led_switch_on.mp4", "ch09_led_strip_light_glow.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "PRIMARY CIRCUIT LOADS", "line2": "4× LED STRIPS • USB HUB • 12V RADIATIVE FAN • RADIO", "themeColor": "cyan"}
            },
            {
                "text": "It cannot run an air conditioner or a refrigerator, but it gives her light after dark and a fan that makes a Mississippi summer night survivable.",
                "start": 88.0, "end": 97.5,
                "preferred": ["ch09_slice05_12v_fan_led_switch_on.mp4", "ch10_slice06_study_desk_corner.mp4"]
            },
            {
                "text": "Water comes from the sky. Aluminum gutters along both sides of the roof feed two 55 gallon food grade drums, free from a catfish processing plant outside Laurel,",
                "start": 97.5, "end": 108.5,
                "preferred": ["ch09_slice06_blue_55gal_barrel_overview.mp4", "ch09_slice07_downspout_diverter_connection.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "POTABLE RAINWATER HARVESTING", "line2": "2× 55-GAL FOOD GRADE DRUMS (CATFISH PLANT SCRAP)", "themeColor": "gold"}
            },
            {
                "text": "and Mississippi gets about 56 inches of rain a year.",
                "start": 108.5, "end": 113.5,
                "preferred": ["ch09_rain_gutter_downspout.mp4", "ch11_rain_on_metal_roof.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "ANNUAL HYDROLOGICAL YIELD", "line2": "56 INCHES AVERAGE ANNUAL MISSISSIPPI PRECIPITATION", "themeColor": "cyan"}
            },
            {
                "text": "She purifies it with eight drops of unscented bleach per gallon, and 30 minutes of waiting for about $5 a year.",
                "start": 113.5, "end": 121.5,
                "preferred": ["ch09_slice08_water_spigot_flow.mp4", "ch09_slice14_cleaning_drum_interior.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "WATER SANITATION PROTOCOL: $5 / YR", "line2": "8 DROPS UNSCENTED BLEACH PER GALLON (CDC STANDARD)", "themeColor": "gold"}
            },
            {
                "text": "Cooking runs on a two burner propane camp stove, and a $15 refill every six weeks puts fuel near $130 a year.",
                "start": 121.5, "end": 129.5,
                "preferred": ["ch09_slice09_connecting_propane_bottle.mp4", "ch09_slice10_striking_match_burner.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "PROPANE THERMAL SYSTEM", "line2": "2-BURNER COOKING SURFACE • $130.00 ANNUAL FUEL COST", "themeColor": "cyan"}
            },
            {
                "text": "After five months, the final tally is $412. The container was $250 from her savings,",
                "start": 129.5, "end": 136.0,
                "preferred": ["ch02_calculator_budget.mp4", "ch02_cash_money_counting.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "TOTAL FIVE-MONTH OUTLAY: $412.00", "line2": "$250 CONTAINER + $162 ANCILLARY COMPONENTS", "themeColor": "gold"}
            },
            {
                "text": "and the other $162 came from her dollar store paychecks while she built, which brings us back to a man sitting on a folding chair.",
                "start": 136.0, "end": 143.0,
                "preferred": ["ch01_slice07_folding_chair_interior.mp4", "ch01_folding_chair_empty.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "THE COMPLETED CAPITAL AUDIT", "line2": "ZERO DEBT • INDEPENDENT OFF-GRID DWELLING", "themeColor": "cyan"}
            }
        ]
    },

    # ── CHAPTER 10: WHAT WAS BEHIND THE DOOR (137.0s) ─────────────────────────
    {
        "ch": 10, "stem": "ch10_what_was_behind_the_door", "totalDuration": 137.0,
        "beats": [
            {
                "text": "The front third is the kitchen and living area.",
                "start": 0.0, "end": 2.9,
                "preferred": ["ch10_slice01_interior_living_wide.mp4", "ch10_slice02_compact_kitchenette_counter.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "ZONE 1: KITCHEN & LIVING", "line2": "FRONT 6.5 FEET OF CONTAINER INTERIOR", "themeColor": "cyan"}
            },
            {
                "text": "The propane stove sits on a plywood counter with a small shelf above it for spices and canned goods.",
                "start": 2.9, "end": 9.6,
                "preferred": ["ch09_slice11_simmering_pot_on_stove.mp4", "ch10_canned_food_shelf.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "COMPACT COOKING STATION", "line2": "PLYWOOD PREPARATION COUNTER & DRY PANTRY", "themeColor": "gold"}
            },
            {
                "text": "A pallet wood table she built herself stands against the wall with two folding chairs donated by the church.",
                "start": 9.6, "end": 16.1,
                "preferred": ["ch10_slice03_folding_chairs_dining.mp4", "ch01_folding_chair_empty.mp4"]
            },
            {
                "text": "Everything is clean and everything has a place. In the middle, a bedsheet curtain divides her sleeping area from storage shelving made from scrap lumber.",
                "start": 16.1, "end": 26.5,
                "preferred": ["ch10_slice04_curtain_divider_pass.mp4", "ch10_slice11_shelf_storage_details.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "ZONE 2: DUAL-PURPOSE CENTRAL CAVITY", "line2": "FABRIC PRIVACY CURTAIN & LUMBER SHELVING", "themeColor": "cyan"}
            },
            {
                "text": "But it is the back third that got to the inspector. That space belongs to her son.",
                "start": 26.5, "end": 33.5,
                "preferred": ["ch10_slice05_platform_pallet_bed.mp4", "ch10_slice12_cozy_quilted_bed_corner.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "ZONE 3: DEDICATED CHILD SANCTUARY", "line2": "REAR ELEVATED PLATFORM BED & STUDY NOOK", "themeColor": "gold"}
            },
            {
                "text": "He sleeps on a platform bed made from stacked pallets with a foam mattress given to them by a woman at the food pantry.",
                "start": 33.5, "end": 41.5,
                "preferred": ["ch10_slice05_platform_pallet_bed.mp4", "ch08_pallet_wood_texture.mp4"]
            },
            {
                "text": "His drawings are taped to the pallet wood walls and some of them are pictures of the container itself with the solar panels on the roof and the rain barrels at the corners.",
                "start": 41.5, "end": 52.0,
                "preferred": ["ch10_child_drawing_crayons.mp4", "ch10_slice13_warm_reading_nook.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "CHILDHOOD ARTWORK", "line2": "HAND-DRAWN CONTAINER SHELTER, SOLAR & BARRELS", "themeColor": "cyan"}
            },
            {
                "text": "He has a small desk, a piece of plywood on two cinder blocks and every night he does his homework there under an LED strip powered by the sun.",
                "start": 52.0, "end": 62.5,
                "preferred": ["ch10_homework_desk_lamp.mp4", "ch10_slice06_study_desk_corner.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "OFF-GRID STUDY STATION", "line2": "CINDER BLOCK DESK • SOLAR-POWERED ILLUMINATION", "themeColor": "gold"}
            },
            {
                "text": "The inspector looked at the desk, the light and the crayon drawings and understood that he was standing inside something that technically should not exist.",
                "start": 62.5, "end": 72.8,
                "preferred": ["ch10_slice06_study_desk_corner.mp4", "ch01_slice07_folding_chair_interior.mp4"]
            },
            {
                "text": "What he wrote in his report afterward is not part of this story and it would be dishonest to invent it.",
                "start": 72.8, "end": 80.0,
                "preferred": ["ch01_slice01_rural_treeline.mp4", "ch01_pickup_truck_rural.mp4"]
            },
            {
                "text": "That was four years ago. Tamara has since replaced the front door with a steel security door salvaged from a demolished office building.",
                "start": 80.0, "end": 89.5,
                "preferred": ["ch07_slice11_mounting_exterior_door.mp4", "ch07_exterior_door_handle.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "4-YEAR EVOLUTION", "line2": "UPGRADED COMMERCIAL COMMERCIAL STEEL SECURITY DOOR", "themeColor": "cyan"}
            },
            {
                "text": "She built a covered porch from corrugated roofing panels and pressure treated posts pulled from a construction dumpster",
                "start": 89.5, "end": 97.5,
                "preferred": ["ch10_wooden_porch_sunset.mp4", "ch08_construction_dumpster.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "SALVAGED TIMBER PORCH", "line2": "CORRUGATED METAL ROOFING • DUMPSTER POSTS", "themeColor": "gold"}
            },
            {
                "text": "and a raised garden bed from cinder blocks where she grows tomatoes, collard greens and peppers from May through October.",
                "start": 97.5, "end": 107.0,
                "preferred": ["ch10_slice10_vegetable_plants_thriving.mp4", "ch10_raised_garden_tomatoes.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "FOOD SOVEREIGNTY: RAISED BEDS", "line2": "CINDER BLOCK NURSERY: TOMATOES, COLLARDS & PEPPERS", "themeColor": "cyan"}
            },
            {
                "text": "Her son is eight now and he can name every tool hanging on the hooks inside the door.",
                "start": 107.0, "end": 113.0,
                "preferred": ["ch10_slice07_hooks_tools_inside_door.mp4", "ch07_welding_gloves_tools.mp4"]
            },
            {
                "text": "The landowner comes by most weekends. What began as a handshake has turned into something closer to family",
                "start": 113.0, "end": 120.0,
                "preferred": ["ch06_elderly_farmer_porch.mp4", "ch06_handshake_agreement.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "RURAL MUTUAL AID", "line2": "HANDSHAKE COVENANT TRANSCENDS CONTRACT", "themeColor": "gold"}
            },
            {
                "text": "and when his children cannot make the trip, Tamara drives him to his medical appointments in Hattiesburg.",
                "start": 120.0, "end": 126.5,
                "preferred": ["ch03_slice02_malibu_driver_view_empty_road.mp4", "ch03_night_highway_driving.mp4"]
            },
            {
                "text": "She no longer works at the dollar store. She has a warehouse job that pays $13 an hour and the money that used to go to rent now goes to food, savings, school supplies",
                "start": 126.5, "end": 133.5,
                "preferred": ["ch02_cash_money_counting.mp4", "ch02_calculator_budget.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "ECONOMIC TRAJECTORY: $13.00 / HOUR", "line2": "LOGISTICS WAREHOUSE COMPENSATION & RETENTION", "themeColor": "gold"}
            },
            {
                "text": "and a fund for a permanent structure on a concrete foundation. And here is what should bother you most. She is not the only one.",
                "start": 133.5, "end": 137.0,
                "preferred": ["ch11_slice01_deep_south_rural_panorama.mp4", "ch11_pine_forest_sunset.mp4"]
            }
        ]
    },

    # ── CHAPTER 11: THE QUESTION SHE NEVER ASKED (172.6s) ──────────────────────
    {
        "ch": 11, "stem": "ch11_the_question_she_never_asked", "totalDuration": 172.6,
        "beats": [
            {
                "text": "According to the account behind this story, the same methods appear in at least 25 documented container and micro shelter builds across rural Mississippi, Alabama, and Louisiana since 2020.",
                "start": 0.0, "end": 13.8,
                "preferred": ["ch11_slice01_deep_south_rural_panorama.mp4", "ch11_pine_forest_sunset.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "DOCUMENTARY INVESTIGATION", "line2": "25+ DOCUMENTED RURAL MICRO-SHELTERS (MS, AL, LA)", "themeColor": "gold"}
            },
            {
                "text": "A social worker in Hinds County described meeting three separate families living in converted containers on private land,",
                "start": 13.8, "end": 21.0,
                "preferred": ["ch11_slice02_mist_over_southern_woods.mp4", "ch06_slice09_southern_pasture_dusk.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "HINDS COUNTY CASEWORK REPORT", "line2": "THREE INDEPENDENT CONTAINER HOUSEHOLDS", "themeColor": "cyan"}
            },
            {
                "text": "each of whom had found the same surplus auction pipeline, the same insulation sourcing, and the same zoning research. None of them had ever met.",
                "start": 21.0, "end": 30.5,
                "preferred": ["ch04_slice03_depot_stacks_overview.mp4", "ch08_slice05_vapor_barrier_sheeting_roll.mp4"]
            },
            {
                "text": "The knowledge travels the way. Survival knowledge always has in the rural south.",
                "start": 30.5, "end": 36.5,
                "preferred": ["ch11_slice03_isolated_homestead_clearing.mp4", "ch11_slice07_endless_pine_woods.mp4"]
            },
            {
                "text": "It moves through food pantry lines where someone mentions a woman who built a house from a shipping container.",
                "start": 36.5, "end": 43.5,
                "preferred": ["ch04_food_pantry_shelves.mp4", "ch04_slice01_laurel_public_buildings.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "INFORMAL DISSEMINATION NETWORKS", "line2": "FOOD PANTRY & COMMISSARY REFERRALS", "themeColor": "gold"}
            },
            {
                "text": "It moves across tables at Wednesday night church dinners where a man sketches a wiring diagram on a napkin for a stranger.",
                "start": 43.5, "end": 52.0,
                "preferred": ["ch11_napkin_sketch_diagram.mp4", "ch11_rural_church_country.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "COMMUNAL TECHNICAL SHARING", "line2": "NAPKIN SCHEMATICS • WEDNESDAY CHURCH SUPPERS", "themeColor": "cyan"}
            },
            {
                "text": "It moves through shelter waiting rooms where someone repeats what they heard at a free clinic in Meridian, which they got from somebody at a Salvation Army meal in Mobile.",
                "start": 52.0, "end": 62.5,
                "preferred": ["ch03_homeless_shelter_beds.mp4", "ch03_night_highway_driving.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "REGIONAL CORRIDOR", "line2": "MERIDIAN (MS) TO MOBILE (AL) SURVIVAL CIRCUIT", "themeColor": "gold"}
            },
            {
                "text": "It works in rural places for reasons that do not carry over to cities,",
                "start": 62.5, "end": 67.5,
                "preferred": ["ch11_slice04_red_clay_road_dusk.mp4", "ch06_red_clay_soil.mp4"]
            },
            {
                "text": "land with willing owners, relaxed code enforcement, farms and industry throwing off free materials, and neighbors more likely to help than to report.",
                "start": 67.5, "end": 78.5,
                "preferred": ["ch06_slice01_overgrown_pasture_timber.mp4", "ch06_handshake_agreement.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "THE RURAL SURVIVAL QUADRANT", "line2": "1. WILLING OWNERS • 2. RELAXED CODE • 3. INDUSTRY SCRAP • 4. AID", "themeColor": "cyan"}
            },
            {
                "text": "In a city, every one of those conditions flips.",
                "start": 78.5, "end": 83.0,
                "preferred": ["ch02_slice06_laurel_downtown_residential.mp4", "ch04_slice02_railroad_industrial_edge.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "URBAN FRICTION DYNAMICS", "line2": "HIGH DENSITY RESTRICTIONS & STRINGENT ENFORCEMENT", "themeColor": "crimson"}
            },
            {
                "text": "So the question people always ask is whether this is a housing solution or a failure of the housing system.",
                "start": 83.0, "end": 90.0,
                "preferred": ["ch03_homeless_shelter_beds.mp4", "ch02_eviction_notice_door.mp4"]
            },
            {
                "text": "It is both, and calling it only one would be a lie.",
                "start": 90.0, "end": 94.5,
                "preferred": ["ch01_slice04_container_exterior_trees.mp4", "ch11_slice10_peaceful_evening_cabin.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "THE DUAL REALITY", "line2": "EXTRAORDINARY INGENUITY vs SYSTEMIC HOUSING FAILURE", "themeColor": "gold"}
            },
            {
                "text": "Tamara's resourcefulness is real. She researched, saved, bargained for land, taught herself to cut steel and wire a solar system, and finished what she started.",
                "start": 94.5, "end": 105.0,
                "preferred": ["ch07_slice02_grinder_plunge_cut.mp4", "ch09_slice05_12v_fan_led_switch_on.mp4"]
            },
            {
                "text": "But a 23-year-old with a job and a small child should not need a library card, a borrowed grinder, and a stranger's flatbed to get a dry floor.",
                "start": 105.0, "end": 115.5,
                "preferred": ["ch07_welding_gloves_tools.mp4", "ch06_slice04_flatbed_with_20ft_box.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "THE STRUCTURAL INDICTMENT", "line2": "AN HONEST WAGE SHOULD SECURE A SHELTERED FLOOR", "themeColor": "crimson"}
            },
            {
                "text": "A $75 rent increase put her in a car. The shelter that could have helped was 11 weeks away, and the motel cost more than she earned.",
                "start": 115.5, "end": 125.0,
                "preferred": ["ch02_eviction_notice_door.mp4", "ch03_motel_neon_sign.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "THRESHOLD OF POVERTY", "line2": "$75.00 DEFICIT FORCED HOMELESS VEHICLE RESIDENCE", "themeColor": "crimson"}
            },
            {
                "text": "There is a harder truth underneath the success. The same lack of oversight that let her build without a permit also means her home has no inspection, no lease, and no legal protection.",
                "start": 125.0, "end": 136.5,
                "preferred": ["ch01_slice01_rural_treeline.mp4", "ch06_slice02_farm_driveway_trees.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "THE UNDERLYING PRECARITY", "line2": "ZERO TITLE • ZERO LEASE • ZERO REGULATORY PROTECTION", "themeColor": "crimson"}
            },
            {
                "text": "It sits on land that is not hers, held in place by a handshake with an older man whose children live elsewhere. If he dies or they sell, the walls she built stay behind.",
                "start": 136.5, "end": 148.0,
                "preferred": ["ch06_handshake_agreement.mp4", "ch06_slice01_overgrown_pasture_timber.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "UNSECURED ASSET RISK", "line2": "IMPROVEMENTS LEGALLY ADHERE TO UNDERLYING REAL ESTATE", "themeColor": "crimson"}
            },
            {
                "text": "The system that failed her has still made no room for what she built in its absence.",
                "start": 148.0, "end": 154.0,
                "preferred": ["ch11_slice06_glowing_window_in_dark.mp4", "ch04_slice02_railroad_industrial_edge.mp4"]
            },
            {
                "text": "Her son does not remember the Malibu. He does not remember the car seat or the church parking lot of Highway 15.",
                "start": 154.0, "end": 161.0,
                "preferred": ["ch01_slice08_malibu_profile.mp4", "ch03_car_backseat_blankets.mp4"]
            },
            {
                "text": "His earliest clear memories are of steel walls, lights that run on sunshine, and rain drumming on a metal roof above his bed.",
                "start": 161.0, "end": 169.0,
                "preferred": ["ch11_rain_on_metal_roof.mp4", "ch10_slice06_study_desk_corner.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "GENERATIONAL RESOLUTION", "line2": "STEEL WALLS • SUNLIGHT POWER • RAIN ON TIN ROOF", "themeColor": "gold"}
            },
            {
                "text": "It is a good outcome, and it was not guaranteed. It should not have been this hard to reach. If stories like this matter to you, subscribe to American Hideaways.",
                "start": 169.0, "end": 172.6,
                "preferred": ["ch11_slice05_golden_light_farm_trees.mp4", "ch11_pine_forest_sunset.mp4"],
                "callout": {"type": "editorial_lower_third", "line1": "AMERICAN HIDEAWAYS", "line2": "SUBSCRIBE FOR INVESTIGATIVE DOCUMENTARIES", "themeColor": "cyan"}
            }
        ]
    }
]

# Build and write all timelines
print("\n=== GENERATING 11 BULLETPROOF TIMELINE JSONS FOR STEEL DOOR ===")

total_clips = 0
unique_clips = set()
total_callouts = 0

for cfg in CHAPTER_CONFIGS:
    ch = cfg["ch"]
    stem = cfg["stem"]
    total_dur = cfg["totalDuration"]
    beats = cfg["beats"]
    
    audio_file = os.path.join(AUDIO_DIR, f"{stem}.mp3")
    if not os.path.exists(audio_file):
        raise FileNotFoundError(f"Master audio not found: {audio_file}")
        
    timeline_file = os.path.join(TIMELINES_DIR, f"chapter_{ch:02d}_final.json")
    ch_snap_dir = os.path.join(SNAPSHOTS_DIR, f"ch{ch:02d}")
    os.makedirs(ch_snap_dir, exist_ok=True)
    
    timeline_clips = []
    
    for idx, b in enumerate(beats):
        assigned_clip = get_clip(b.get("preferred", []), fallback_keyword=stem[:4])
        unique_clips.add(assigned_clip)
        total_clips += 1
        
        clip_data = {
            "beatIndex": idx,
            "chapterIndex": ch,
            "text": b["text"],
            "startTime": round(b["start"], 2),
            "endTime": round(b["end"], 2),
            "duration": round(b["end"] - b["start"], 2),
            "clipPath": assigned_clip,
            "layout": "full_bleed_cinematic",
            "kenBurns": False,
            "transitionType": "cut",
            "transitionDuration": 0
        }
        
        if "callout" in b:
            clip_data["callout"] = b["callout"]
            total_callouts += 1
            
        timeline_clips.append(clip_data)
        
        # Extract visual audit snapshot
        snap_path = os.path.join(ch_snap_dir, f"beat_{idx:02d}.jpg")
        if not os.path.exists(snap_path):
            mid_sec = min(2.0, (b["end"] - b["start"]) / 2.0)
            cmd = [
                "ffmpeg", "-nostdin", "-y",
                "-ss", str(mid_sec),
                "-i", assigned_clip,
                "-vframes", "1",
                "-q:v", "2",
                snap_path
            ]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            
    doc = {
        "masterAudioPath": audio_file,
        "totalDuration": total_dur,
        "clips": timeline_clips
    }
    
    with open(timeline_file, "w", encoding="utf-8") as fp:
        json.dump(doc, fp, indent=2)
        
    print(f"  [Ch {ch:02d}] {len(timeline_clips)} beats written -> {timeline_file}")

print("\n" + "="*60)
print(f"📊 STEEL DOOR TIMELINE GENERATION SUMMARY:")
print(f"  Total Chapters: 11")
print(f"  Total Beats/Clips: {total_clips}")
print(f"  Unique Clips: {len(unique_clips)}")
print(f"  Repeated Clips: {total_clips - len(unique_clips)}")
print(f"  Total Editorial Callouts: {total_callouts}")
print("="*60)
