import os
import json

ch02_clips = [
    {
        "beatIndex": 0, "chapterIndex": 2,
        "text": "Start with the vehicle because none of this makes sense until you know what an ambulance really is.",
        "startTime": 0.0, "endTime": 5.8, "duration": 5.8,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch02_beat00_ambulance_vehicle.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "THE RETIRED AMBULANCE", "line2": "ANATOMY OF A SURPLUS RIG", "themeColor": "cyan"}
    },
    {
        "beatIndex": 1, "chapterIndex": 2,
        "text": "Strip off the light bar and the siren, and what's left is a small, insulated aluminum",
        "startTime": 5.8, "endTime": 11.4, "duration": 5.6,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch02_beat01_govdeals_box.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "INSULATED ALUMINUM BOX", "line2": "STRIPPED EMERGENCY LIVERY", "themeColor": "gold"}
    },
    {
        "beatIndex": 2, "chapterIndex": 2,
        "text": "room bolted to a heavy-duty truck chassis.",
        "startTime": 11.4, "endTime": 15.0, "duration": 3.6,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch02_beat02_truck_chassis.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "HEAVY-DUTY TRUCK CHASSIS", "line2": "CLASS 4 COMMERCIAL PLATFORM", "themeColor": "cyan"}
    },
    {
        "beatIndex": 3, "chapterIndex": 2,
        "text": "The $1,500 ambulance, video script, 3.5k words.",
        "startTime": 15.0, "endTime": 21.0, "duration": 6.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch02_beat03_cheaprv_profile.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "FORD F-450 TYPE III RIG", "line2": "ALL-WEATHER BOX CONVERSION", "themeColor": "gold"}
    },
    {
        "beatIndex": 4, "chapterIndex": 2,
        "text": "That box was engineered to hold a stable temperature while a paramedic works on a human being in the back,",
        "startTime": 21.0, "endTime": 26.5, "duration": 5.5,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch02_beat04_paramedic_module.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "PARAMEDIC COMPARTMENT", "line2": "CRITICAL LIFE-SUPPORT ENVELOPE", "themeColor": "cyan"}
    },
    {
        "beatIndex": 5, "chapterIndex": 2,
        "text": "which means there is real insulation packed into those walls.",
        "startTime": 26.5, "endTime": 31.5, "duration": 5.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch02_beat05_benemily_insulation.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "HIGH-DENSITY INSULATION", "line2": "EXTRUDED POLYSTYRENE & FOAM", "themeColor": "gold"}
    },
    {
        "beatIndex": 6, "chapterIndex": 2,
        "text": "And the floor is reinforced to carry weight that would flex the floor of an ordinary cargo van.",
        "startTime": 31.5, "endTime": 36.8, "duration": 5.3,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch02_beat06_reinforced_floor.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "REINFORCED CHASSIS FLOOR", "line2": "ZERO-FLEX DIAMOND SUBFRAME", "themeColor": "cyan"}
    },
    {
        "beatIndex": 7, "chapterIndex": 2,
        "text": "Then there's the electrical system, and this is the part that makes professional van converters go quiet with respect.",
        "startTime": 36.8, "endTime": 44.0, "duration": 7.2,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch02_beat07_benemily_electrical.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "ELECTRICAL SYSTEM OVERKILL", "line2": "COMMERCIAL-SPEC 12V / 120V BUS", "themeColor": "gold"}
    },
    {
        "beatIndex": 8, "chapterIndex": 2,
        "text": "An ambulance sits idling for hours in a hospital bay, running lights, radios, monitors, and a heater.",
        "startTime": 44.0, "endTime": 51.0, "duration": 7.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch02_beat08_hospital_bay.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0
    },
    {
        "beatIndex": 9, "chapterIndex": 2,
        "text": "So the factory builds it with an oversized alternator, sometimes too.",
        "startTime": 51.0, "endTime": 55.5, "duration": 4.5,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch02_beat09_govdeals_alternator.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "DUAL HIGH-OUTPUT ALTERNATORS", "line2": "250-AMP EXTENDED IDLE CHARGING", "themeColor": "gold"}
    },
    {
        "beatIndex": 10, "chapterIndex": 2,
        "text": "A bank of deep-cycle batteries, and a shore power inlet on the outside so the station can plug it into the wall overnight.",
        "startTime": 55.5, "endTime": 63.8, "duration": 8.3,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch02_beat10_cheaprv_shorepower.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "SHORE POWER & BATTERY BANK", "line2": "OVERNIGHT 120V MAINS INLET", "themeColor": "cyan"}
    },
    {
        "beatIndex": 11, "chapterIndex": 2,
        "text": "Someone converting a plain cargo van spends thousands of dollars and months of miserable weekends building all of that from nothing.",
        "startTime": 63.8, "endTime": 72.4, "duration": 8.6,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch02_beat11_van_conversion.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0
    },
    {
        "beatIndex": 12, "chapterIndex": 2,
        "text": "On an ambulance, it's already there, wired, fused, labeled, and there's more.",
        "startTime": 72.4, "endTime": 78.5, "duration": 6.1,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch02_beat12_benemily_wiring.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "FACTORY COLOR-CODED WIRING", "line2": "PRE-FUSED AUTOMOTIVE HARNESS", "themeColor": "gold"}
    },
    {
        "beatIndex": 13, "chapterIndex": 2,
        "text": "The outside compartments, the ones the crew used for backboards and oxygen bottles, have locking pedal handles and drain holes in the floor.",
        "startTime": 78.5, "endTime": 87.0, "duration": 8.5,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch02_beat13_govdeals_compartments.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "OUTSIDE STORAGE LOCKERS", "line2": "LOCKING PADDLE HANDLES & DRAINS", "themeColor": "cyan"}
    },
    {
        "beatIndex": 14, "chapterIndex": 2,
        "text": "That's dry outdoor storage for tools, water jugs, boots, a spare battery, all of it outside the living space.",
        "startTime": 87.0, "endTime": 94.6, "duration": 7.6,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch02_beat14_outdoor_storage.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0
    },
    {
        "beatIndex": 15, "chapterIndex": 2,
        "text": "There's a vent fan in the ceiling, and there are grab handles on every wall,",
        "startTime": 94.6, "endTime": 100.6, "duration": 6.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch02_beat15_benemily_ceiling_handles.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "ROOF VENT EXHAUST FAN", "line2": "INDUSTRIAL GRAB HANDLES", "themeColor": "gold"}
    },
    {
        "beatIndex": 16, "chapterIndex": 2,
        "text": "which matters far more than it sounds when the man living inside is 63 with a bad knee.",
        "startTime": 100.6, "endTime": 105.509, "duration": 4.909,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch02_beat16_senior_man_cabin.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "DALE • 63 YEARS OLD", "line2": "ARMY VETERAN WITH BAD KNEE", "themeColor": "cyan"}
    }
]

ch03_clips = [
    {
        "beatIndex": 0, "chapterIndex": 3,
        "text": "So why is a machine like that selling for the price of a decent-used refrigerator?",
        "startTime": 0.0, "endTime": 5.0, "duration": 5.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch03_beat00_govdeals_yard.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "AUCTION ECONOMICS", "line2": "WHY ARE AMBULANCES SO CHEAP?", "themeColor": "gold"}
    },
    {
        "beatIndex": 1, "chapterIndex": 3,
        "text": "Because fire districts and county services don't sell ambulances based on condition. They sell them on a schedule.",
        "startTime": 5.0, "endTime": 13.0, "duration": 8.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch03_beat01_fire_district.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "MUNICIPAL SCHEDULE RETIREMENT", "line2": "REPLACED BY CALENDAR, NOT WEAR", "themeColor": "cyan"}
    },
    {
        "beatIndex": 2, "chapterIndex": 3,
        "text": "A rig comes off the road at a set mileage or a set number of engine hours. A new one replaces it.",
        "startTime": 13.0, "endTime": 19.8, "duration": 6.8,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch03_beat02_cheaprv_wheels.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0
    },
    {
        "beatIndex": 3, "chapterIndex": 3,
        "text": "The old one goes to an auction site, which means the price has almost nothing to do with what's wrong with the truck.",
        "startTime": 19.8, "endTime": 26.2, "duration": 6.4,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch03_beat03_auction_site.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "PUBLIC SURPLUS LIQUIDATION", "line2": "UNRESERVED GOVERNMENT AUCTIONS", "themeColor": "gold"}
    },
    {
        "beatIndex": 4, "chapterIndex": 3,
        "text": "That cuts both ways, and we'll come back to it because it's exactly where most of these stories end badly.",
        "startTime": 26.2, "endTime": 33.4, "duration": 7.2,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch03_beat04_govdeals_rear.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0
    },
    {
        "beatIndex": 5, "chapterIndex": 3,
        "text": "Here's what the people who buy these actually know before they bid. One, the odometer lies. Ambulances spend enormous stretches parked and idling, so the engine hour meter tells the truth.",
        "startTime": 33.4, "endTime": 46.4, "duration": 13.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch03_beat05_odometer.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "THE ODOMETER LIES", "line2": "ENGINE HOUR METER TELLS TRUTH", "themeColor": "gold"}
    },
    {
        "beatIndex": 6, "chapterIndex": 3,
        "text": "A rig with low miles and 4,000 hours has effectively done 120,000 more.",
        "startTime": 46.4, "endTime": 53.0, "duration": 6.6,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch03_beat06_cheaprv_cab.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "4,000 IDLE HOURS", "line2": "EQUIVALENT TO 120,000 ROAD MILES", "themeColor": "cyan"}
    },
    {
        "beatIndex": 7, "chapterIndex": 3,
        "text": "Two, they want a diesel on a heavy chassis, not a gas engine on a light one. The light chassis rigs are the ones that got run hard on short city calls.",
        "startTime": 53.0, "endTime": 63.2, "duration": 10.2,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch03_beat07_diesel_engine.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "DIESEL ON HEAVY CHASSIS", "line2": "POWERSTROKE / CUMMINS ENGINES", "themeColor": "gold"}
    },
    {
        "beatIndex": 8, "chapterIndex": 3,
        "text": "Three, they read the maintenance sheet, the district posts with the listing, and they walk away from anything with a skipped transmission service.",
        "startTime": 63.2, "endTime": 72.0, "duration": 8.8,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch03_beat08_govdeals_diesel_hood.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "MAINTENANCE SHEET AUDIT", "line2": "WALK FROM SKIPPED TRANSMISSIONS", "themeColor": "cyan"}
    },
    {
        "beatIndex": 9, "chapterIndex": 3,
        "text": "Four, they check whether the seller already pulled the lights and the striping or left that job to the buyer.",
        "startTime": 72.0, "endTime": 79.0, "duration": 7.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch03_beat09_maintenance_sheet.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0
    },
    {
        "beatIndex": 10, "chapterIndex": 3,
        "text": "Because that's a weekend of work and a bill either way.",
        "startTime": 79.0, "endTime": 82.5, "duration": 3.5,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch03_beat10_benemily_striping.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "STRIPING & LIGHT REMOVAL", "line2": "WEEKEND OVERHEAD & REPAIR BILL", "themeColor": "gold"}
    },
    {
        "beatIndex": 11, "chapterIndex": 3,
        "text": "A city in New Jersey recently listed a 90s Ford ambulance. First bid, $550.",
        "startTime": 82.5, "endTime": 89.5, "duration": 7.0,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/slices/ch03_beat11_cheaprv_ford_amb.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "NEW JERSEY MUNICIPAL AUCTION", "line2": "OPENING BID: $550", "themeColor": "gold"}
    },
    {
        "beatIndex": 12, "chapterIndex": 3,
        "text": "Keep that number in your head because the vehicle is not the story. Dale is.",
        "startTime": 89.5, "endTime": 95.843, "duration": 6.343,
        "clipPath": os.path.abspath("uploads/raw/proj_ambulance/stock/ch03_beat12_dale_portrait.mp4"),
        "layout": "full_bleed_cinematic", "kenBurns": True, "transitionType": "cut", "transitionDuration": 0,
        "callout": {"type": "editorial_lower_third", "line1": "DALE IS THE STORY", "line2": "63-YEAR-OLD ARMY VETERAN", "themeColor": "cyan"}
    }
]

out_dir = os.path.abspath("uploads/timelines/ambulance")
os.makedirs(out_dir, exist_ok=True)

ch02_final = {
    "masterAudioPath": "C:/Users/karth/Documents/BlokeTuber/uploads/audio/ambulance/2 - WHAT AN AMBULANCE.mp3",
    "totalDuration": 105.509,
    "clips": ch02_clips
}

ch03_final = {
    "masterAudioPath": "C:/Users/karth/Documents/BlokeTuber/uploads/audio/ambulance/3- WHY IS ITSO CHEAP.mp3",
    "totalDuration": 95.843,
    "clips": ch03_clips
}

with open(os.path.join(out_dir, "chapter_02_final.json"), "w", encoding="utf-8") as f:
    json.dump(ch02_final, f, indent=2)

with open(os.path.join(out_dir, "chapter_03_final.json"), "w", encoding="utf-8") as f:
    json.dump(ch03_final, f, indent=2)

print("Saved chapter_02_final.json and chapter_03_final.json successfully!")
