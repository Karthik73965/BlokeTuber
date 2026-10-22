import os
import sys
import json
import subprocess
from stage_ambulance_ch08_ch09 import slice_video, fetch_stock_video, verify_clip, extract_snapshot

CH08_AUDIO = "C:/Users/karth/Documents/BlokeTuber/uploads/audio/ambulance/8 - THELEGALWALL.mp3"
CH08_DURATION = 179.487

CH09_AUDIO = "C:/Users/karth/Documents/BlokeTuber/uploads/audio/ambulance/9 -  WHEN IT GOESWRONG.mp3"
CH09_DURATION = 76.852

CH08_BEATS = [
    {
        "beatIndex": 0,
        "chapterIndex": 8,
        "text": "You cannot drive around in something that still looks like an ambulance.",
        "startTime": 0.0,
        "endTime": 4.06,
        "mode": "stock",
        "query": "emergency vehicle lights flashing",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat00_emergency_lights.mp4"
    },
    {
        "beatIndex": 1,
        "chapterIndex": 8,
        "text": "Before a private buyer takes ownership, it has to be decommissioned.",
        "startTime": 4.06,
        "endTime": 8.3,
        "mode": "slice",
        "source": "govdeals",
        "start": 34.0,
        "duration": 4.5,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch08_beat01_govdeals_decommission.mp4"
    },
    {
        "beatIndex": 2,
        "chapterIndex": 8,
        "text": "The red and blue lights come off. The siren gets pulled. The striping and lettering come off the panels.",
        "startTime": 8.3,
        "endTime": 15.0,
        "mode": "stock",
        "query": "mechanic garage repair car",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat02_mechanic_decommission.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "DECOMMISSION MANDATE",
            "line2": "EMERGENCY LIGHTS & SIRENS REMOVED",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 3,
        "chapterIndex": 8,
        "text": "Impersonating an emergency vehicle is a serious charge in every state.",
        "startTime": 15.0,
        "endTime": 20.0,
        "mode": "stock",
        "query": "court gavel law legal",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat03_court_gavel.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "PENAL CODE: IMPERSONATION",
            "line2": "FELONY VEHICLE CODE IN 50 STATES",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 4,
        "chapterIndex": 8,
        "text": "It's the fastest way to turn a cheap shelter into a court date.",
        "startTime": 20.0,
        "endTime": 24.1,
        "mode": "slice",
        "source": "cheaprv",
        "start": 18.0,
        "duration": 4.5,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch08_beat04_cheaprv_plain_box.mp4"
    },
    {
        "beatIndex": 5,
        "chapterIndex": 8,
        "text": "That's why these rigs end up looking like plain white box trucks with ghost outlines where the words used to be.",
        "startTime": 24.1,
        "endTime": 31.0,
        "mode": "stock",
        "query": "white delivery box truck road",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat05_white_box_truck.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "GHOST LETTERING",
            "line2": "STRIPPED MUNICIPAL LIVERY",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 6,
        "chapterIndex": 8,
        "text": "The harder part is paperwork. An ambulance is titled as a commercial truck.",
        "startTime": 31.0,
        "endTime": 36.0,
        "mode": "slice",
        "source": "govdeals",
        "start": 45.0,
        "duration": 5.5,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch08_beat06_govdeals_cab_title.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "TITLE CLASSIFICATION",
            "line2": "CLASS 4 COMMERCIAL TRUCK",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 7,
        "chapterIndex": 8,
        "text": "And getting sensible private insurance on a commercial truck you live in ranges from expensive to impossible.",
        "startTime": 36.0,
        "endTime": 41.1,
        "mode": "stock",
        "query": "paperwork signing contract desk",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat07_paperwork_insurance.mp4"
    },
    {
        "beatIndex": 8,
        "chapterIndex": 8,
        "text": "So builders retitle it as a motorhome.",
        "startTime": 41.1,
        "endTime": 45.8,
        "mode": "slice",
        "source": "ben_emily",
        "start": 688.0,
        "duration": 5.0,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch08_beat08_ben_emily_retitle_motorhome.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "RV RETITLING REQUIREMENTS",
            "line2": "RECLASSIFICATION AS MOTORHOME",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 9,
        "chapterIndex": 8,
        "text": "That generally means installing a permanent bed, a place to cook, water storage, and heat, then taking it to a state inspection.",
        "startTime": 45.8,
        "endTime": 53.8,
        "mode": "stock",
        "query": "carpenter woodwork interior workshop",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat09_carpentry_camper_build.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "STATE INSPECTION CHECKLIST",
            "line2": "BED • COOKTOP • WATER • HEAT",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 10,
        "chapterIndex": 8,
        "text": "Get through that, and you're a driver with a legal vehicle instead of a homeless person in a suspicious truck.",
        "startTime": 53.8,
        "endTime": 59.0,
        "mode": "stock",
        "query": "highway road driving car sunset",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat10_highway_legal_vehicle.mp4"
    },
    {
        "beatIndex": 11,
        "chapterIndex": 8,
        "text": "Skip it, and every traffic stop is a coin flip.",
        "startTime": 59.0,
        "endTime": 64.2,
        "mode": "stock",
        "query": "police car lights flashing night",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat11_police_traffic_stop.mp4"
    },
    {
        "beatIndex": 12,
        "chapterIndex": 8,
        "text": "The people who do this well spend their first month on paperwork, not decorating.",
        "startTime": 64.2,
        "endTime": 69.5,
        "mode": "slice",
        "source": "cheaprv",
        "start": 698.0,
        "duration": 5.5,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch08_beat12_cheaprv_electrical_bank.mp4"
    },
    {
        "beatIndex": 13,
        "chapterIndex": 8,
        "text": "And then there's the two AM knock. Every person in this life knows that sound on a steel door.",
        "startTime": 69.5,
        "endTime": 76.0,
        "mode": "stock",
        "query": "dark door night house shadow",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat13_night_door_knock.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "THE 2:00 AM KNOCK",
            "line2": "TRESPASS WARNING / EVICTION",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 14,
        "chapterIndex": 8,
        "text": "Sometimes it's an officer tired and polite saying a business owner called.",
        "startTime": 76.0,
        "endTime": 81.0,
        "mode": "stock",
        "query": "police officer night street",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat14_police_officer_night.mp4"
    },
    {
        "beatIndex": 15,
        "chapterIndex": 8,
        "text": "Sometimes it's a park's employee at dawn.",
        "startTime": 81.0,
        "endTime": 84.5,
        "mode": "stock",
        "query": "park morning sunrise trees road",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat15_park_dawn_patrol.mp4"
    },
    {
        "beatIndex": 16,
        "chapterIndex": 8,
        "text": "And sometimes uniquely for these vehicles, it's a well-meaning stranger who saw an ambulance parked on a residential street at midnight.",
        "startTime": 84.5,
        "endTime": 90.2,
        "mode": "slice",
        "source": "ben_emily",
        "start": 950.0,
        "duration": 6.0,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch08_beat16_ben_emily_residential_park.mp4"
    },
    {
        "beatIndex": 17,
        "chapterIndex": 8,
        "text": "And called 911 because they assumed someone nearby was dying.",
        "startTime": 90.2,
        "endTime": 96.5,
        "mode": "stock",
        "query": "phone calling screen mobile",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat17_911_emergency_call.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "RESIDENTIAL 911 CALLS",
            "line2": "MISTAKEN IDENTITY DISPATCH",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 18,
        "chapterIndex": 8,
        "text": "The law is harder on a vehicle than on a tent in one specific way. And this is the honest downside of the whole approach.",
        "startTime": 96.5,
        "endTime": 102.2,
        "mode": "stock",
        "query": "tent city street homeless encampment",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat18_tent_sidewalk.mp4"
    },
    {
        "beatIndex": 19,
        "chapterIndex": 8,
        "text": "A tent can't be towed, an ambulance can.",
        "startTime": 102.2,
        "endTime": 108.5,
        "mode": "stock",
        "query": "tow truck towing vehicle night",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat19_tow_truck_night.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "ASSET SEIZURE RISK",
            "line2": "A TENT CANNOT BE TOWED",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 20,
        "chapterIndex": 8,
        "text": "Most cities have oversized vehicle ordinances banning anything over a certain height or length, from parking on the street overnight.",
        "startTime": 108.5,
        "endTime": 114.5,
        "mode": "stock",
        "query": "parking sign street no parking",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat20_no_parking_sign.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "MUNICIPAL CODE: 72-HOUR RULE",
            "line2": "OVERSIZED VEHICLE NIGHT BAN",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 21,
        "chapterIndex": 8,
        "text": "Many have habitation ordinances that make sleeping in your own legally registered vehicle a citeable offense.",
        "startTime": 114.5,
        "endTime": 120.2,
        "mode": "stock",
        "query": "parking ticket car windshield wiper",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat21_parking_ticket.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "VEHICULAR HABITATION BAN",
            "line2": "CITEABLE MISDEMEANOR CHARGE",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 22,
        "chapterIndex": 8,
        "text": "Get a ticket you can't pay, and it becomes a warrant.",
        "startTime": 120.2,
        "endTime": 127.5,
        "mode": "stock",
        "query": "court gavel law justice documents",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat22_court_papers.mp4"
    },
    {
        "beatIndex": 23,
        "chapterIndex": 8,
        "text": "Let the registration lapse, and the rig gets tagged, then towed, then parked in an impound lot where storage fees double every week until it goes to auction.",
        "startTime": 127.5,
        "endTime": 134.2,
        "mode": "stock",
        "query": "car junkyard scrap impound lot",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat23_impound_lot.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "IMPOUND FEES ACCRUAL",
            "line2": "STORAGE FEES DOUBLE WEEKLY",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 24,
        "chapterIndex": 8,
        "text": "And then a man who had a home with a lock on it has nothing at all, faster than he lost the apartment.",
        "startTime": 134.2,
        "endTime": 141.0,
        "mode": "slice",
        "source": "govdeals",
        "start": 14.0,
        "duration": 7.0,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch08_beat24_govdeals_empty_interior.mp4"
    },
    {
        "beatIndex": 25,
        "chapterIndex": 8,
        "text": "In June of 2024, the Supreme Court's decision in the Grants Pass case gave cities much wider power to ticket and arrest people for sleeping outside,",
        "startTime": 141.0,
        "endTime": 148.2,
        "mode": "stock",
        "query": "supreme court building washington dc",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat25_supreme_court.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CITY OF GRANTS PASS V. JOHNSON",
            "line2": "SUPREME COURT RULING • JUNE 2024",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 26,
        "chapterIndex": 8,
        "text": "even where no shelter beds are available.",
        "startTime": 148.2,
        "endTime": 153.6,
        "mode": "stock",
        "query": "cold empty city park bench street",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat26_empty_winter_street.mp4"
    },
    {
        "beatIndex": 27,
        "chapterIndex": 8,
        "text": "Cities across the west answered with new bans and bigger sweeps.",
        "startTime": 153.6,
        "endTime": 159.5,
        "mode": "stock",
        "query": "city construction bulldozer street cleanup",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat27_city_sweep_bulldozer.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "MUNICIPAL SWEEPS",
            "line2": "WEST COAST RESTRICTIONS EXPAND",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 28,
        "chapterIndex": 8,
        "text": "In that climate, the wheels under an ambulance became both the entire advantage and the entire vulnerability.",
        "startTime": 159.5,
        "endTime": 165.5,
        "mode": "slice",
        "source": "cheaprv",
        "start": 32.0,
        "duration": 6.2,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch08_beat28_cheaprv_dually_wheels.mp4"
    },
    {
        "beatIndex": 29,
        "chapterIndex": 8,
        "text": "You can move before the sweep comes, but you have to keep that thing legal, insured, and running,",
        "startTime": 165.5,
        "endTime": 172.0,
        "mode": "slice",
        "source": "ben_emily",
        "start": 778.0,
        "duration": 6.7,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch08_beat29_ben_emily_cabin_build.mp4"
    },
    {
        "beatIndex": 30,
        "chapterIndex": 8,
        "text": "or it becomes the most expensive mistake of your life.",
        "startTime": 172.0,
        "endTime": 179.487,
        "mode": "stock",
        "query": "sunset highway road open sky",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch08_beat30_sunset_highway.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "LEGAL BOUNDARIES",
            "line2": "THE MARGIN OF SURVIVAL",
            "themeColor": "gold"
        }
    }
]

CH09_BEATS = [
    {
        "beatIndex": 0,
        "chapterIndex": 9,
        "text": "Which is where that cheap auction price comes back around.",
        "startTime": 0.0,
        "endTime": 3.46,
        "mode": "slice",
        "source": "govdeals",
        "start": 2.0,
        "duration": 4.0,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch09_beat00_govdeals_auction_price.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "MUNICIPAL SURPLUS TRAP",
            "line2": "THE HIDDEN REPAIR DEFICIT",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 1,
        "chapterIndex": 9,
        "text": "A $1,500 rig is $1,500 because the transmission is tired,",
        "startTime": 3.46,
        "endTime": 9.5,
        "mode": "stock",
        "query": "diesel engine mechanic garage repair",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch09_beat01_engine_breakdown.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "PURCHASE PRICE: $1,500",
            "line2": "TIRED TRANSMISSION • SEVERE WEAR",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 2,
        "chapterIndex": 9,
        "text": "and a transmission on a heavy chassis is a $4,000 problem that arrives with no warning.",
        "startTime": 9.5,
        "endTime": 16.5,
        "mode": "stock",
        "query": "car repair lift mechanic garage",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch09_beat02_transmission_mechanic.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "TRANSMISSION REBUILD: $4,000+",
            "line2": "HEAVY DUTY ALLISON / E4OD FAILURE",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 3,
        "chapterIndex": 9,
        "text": "A diesel ambulance gets somewhere around 8 to 12 miles per gallon.",
        "startTime": 16.5,
        "endTime": 21.0,
        "mode": "stock",
        "query": "gas station diesel fuel pump",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch09_beat03_diesel_fuel_pump.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "FUEL ECONOMY: 8–12 MPG",
            "line2": "7.3L / 6.0L POWERSTROKE DIESEL",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 4,
        "chapterIndex": 9,
        "text": "Every move across town costs real money.",
        "startTime": 21.0,
        "endTime": 24.3,
        "mode": "stock",
        "query": "dollars cash money wallet payment",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch09_beat04_cash_expenses.mp4"
    },
    {
        "beatIndex": 5,
        "chapterIndex": 9,
        "text": "There are people who bought one of these, spent everything they had on it, and ended up worse off than when they started,",
        "startTime": 24.3,
        "endTime": 31.0,
        "mode": "slice",
        "source": "govdeals",
        "start": 7.0,
        "duration": 7.0,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch09_beat05_govdeals_engine_bay.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CATASTROPHIC MECHANICAL FAILURE",
            "line2": "BLOWN HEAD GASKET / 6.0L POWERSTROKE",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 6,
        "chapterIndex": 9,
        "text": "sleeping in a dead truck in the overflow lot of a tow yard.",
        "startTime": 31.0,
        "endTime": 34.8,
        "mode": "stock",
        "query": "tow truck lot yard parking",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch09_beat06_tow_yard_lot.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "HEAVY DUTY TOW BILL: $800+",
            "line2": "OVERFLOW LOT • TOW YARD STORAGE",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 7,
        "chapterIndex": 9,
        "text": "There's no toilet and no shower either. No plumbing at all in most of them.",
        "startTime": 34.8,
        "endTime": 40.0,
        "mode": "slice",
        "source": "ben_emily",
        "start": 256.0,
        "duration": 5.5,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch09_beat07_ben_emily_cabinets_bare.mp4"
    },
    {
        "beatIndex": 8,
        "chapterIndex": 9,
        "text": "Just jugs and a bucket system nobody wants to discuss on camera.",
        "startTime": 40.0,
        "endTime": 44.8,
        "mode": "slice",
        "source": "cheaprv",
        "start": 666.0,
        "duration": 5.0,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch09_beat08_cheaprv_water_jugs.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "OFF-GRID SANITATION REALITY",
            "line2": "GRAVITY WATER JUGS • CHEMICAL TOILET",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 9,
        "chapterIndex": 9,
        "text": "And housing advocates raise a concern that deserves to be taken seriously.",
        "startTime": 44.8,
        "endTime": 49.5,
        "mode": "stock",
        "query": "press conference microphone speech podium",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch09_beat09_housing_advocate.mp4"
    },
    {
        "beatIndex": 10,
        "chapterIndex": 9,
        "text": "If the public gets used to seeing homeless people, tucked neatly into converted vehicles in a gated lot,",
        "startTime": 49.5,
        "endTime": 55.5,
        "mode": "stock",
        "query": "parking lot gate security night",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch09_beat10_gated_safe_parking.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "CHURCH SAFE PARKING EXEMPTION",
            "line2": "PERMITTED LOTS VS AFFORDABLE HOUSING",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 11,
        "chapterIndex": 9,
        "text": "the pressure to actually build housing quietly evaporates.",
        "startTime": 55.5,
        "endTime": 60.2,
        "mode": "stock",
        "query": "construction crane highrise building site",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch09_beat11_construction_cranes.mp4"
    },
    {
        "beatIndex": 12,
        "chapterIndex": 9,
        "text": "The emergency measure becomes the permanent plan.",
        "startTime": 60.2,
        "endTime": 63.4,
        "mode": "stock",
        "query": "chainlink fence wire urban lot night",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch09_beat12_fenced_perimeter.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "PREDATORY DIESEL SHOPS",
            "line2": "DIESEL SPECIALIST HOURLY: $185/HR",
            "themeColor": "crimson"
        }
    },
    {
        "beatIndex": 13,
        "chapterIndex": 9,
        "text": "Nobody serious, including the mechanics doing the converting, calls this a solution.",
        "startTime": 63.4,
        "endTime": 68.5,
        "mode": "slice",
        "source": "ben_emily",
        "start": 688.0,
        "duration": 5.5,
        "clipRel": "uploads/raw/proj_ambulance/slices/ch09_beat13_ben_emily_mechanic_build.mp4"
    },
    {
        "beatIndex": 14,
        "chapterIndex": 9,
        "text": "They call it a bridge, and the argument for a bridge is blunt.",
        "startTime": 68.5,
        "endTime": 72.8,
        "mode": "stock",
        "query": "winter bridge river cold snow",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch09_beat14_winter_bridge.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "THE BRIDGE HYPOTHESIS",
            "line2": "A SURVIVAL MARGIN, NOT A PERMANENT FIX",
            "themeColor": "gold"
        }
    },
    {
        "beatIndex": 15,
        "chapterIndex": 9,
        "text": "Permanent housing takes years.",
        "startTime": 72.8,
        "endTime": 75.0,
        "mode": "stock",
        "query": "blueprint architect construction plan table",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch09_beat15_blueprint_plans.mp4"
    },
    {
        "beatIndex": 16,
        "chapterIndex": 9,
        "text": "Winter takes one night.",
        "startTime": 75.0,
        "endTime": 76.852,
        "mode": "stock",
        "query": "snow blizzard winter ice storm cold",
        "clipRel": "uploads/raw/proj_ambulance/stock/ch09_beat16_blizzard_frozen_tire.mp4",
        "callout": {
            "type": "editorial_lower_third",
            "line1": "WINTER MORTALITY",
            "line2": "FREEZING NIGHTS KILL IN HOURS",
            "themeColor": "crimson"
        }
    }
]

def build_chapter(ch_num, audio_path, total_dur, beats, out_json_path, snapshot_dir):
    print(f"\n==========================================")
    print(f"BUILDING CHAPTER {ch_num:02d}")
    print(f"==========================================")
    
    os.makedirs(os.path.dirname(os.path.abspath(out_json_path)), exist_ok=True)
    os.makedirs(snapshot_dir, exist_ok=True)
    
    final_clips = []
    
    for b in beats:
        idx = b["beatIndex"]
        full_clip_path = os.path.abspath(b["clipRel"])
        
        # Step 1: obtain video file
        if b["mode"] == "slice":
            slice_video(b["source"], b["start"], b["duration"], full_clip_path)
        elif b["mode"] == "stock":
            fetch_stock_video(b["query"], full_clip_path)
            
        # Step 2: verify clip
        ok, detail = verify_clip(full_clip_path)
        if not ok:
            raise RuntimeError(f"Clip verification failed for beat {idx}: {detail} ({full_clip_path})")
        print(f"Beat {idx:02d} verified: {detail}")
        
        # Step 3: extract beat snapshot
        snap_path = os.path.join(snapshot_dir, f"beat_{idx:02d}.jpg")
        extract_snapshot(full_clip_path, snap_path)
        print(f"Snapshot saved: {snap_path}")
        
        # Step 4: format clip object
        dur = round(b["endTime"] - b["startTime"], 3)
        clip_obj = {
            "beatIndex": idx,
            "chapterIndex": ch_num,
            "text": b["text"],
            "startTime": b["startTime"],
            "endTime": b["endTime"],
            "duration": dur,
            "clipPath": full_clip_path,
            "layout": "full_bleed_cinematic",
            "kenBurns": True,
            "transitionType": "cut",
            "transitionDuration": 0
        }
        if "callout" in b:
            clip_obj["callout"] = b["callout"]
            
        final_clips.append(clip_obj)
        
    timeline_data = {
        "masterAudioPath": os.path.abspath(audio_path).replace("\\", "/"),
        "totalDuration": total_dur,
        "clips": final_clips
    }
    
    with open(out_json_path, "w", encoding="utf-8") as f:
        json.dump(timeline_data, f, indent=2)
        
    print(f"\nSuccessfully wrote timeline: {out_json_path}")
    print(f"Total clips staged: {len(final_clips)}")

if __name__ == "__main__":
    build_chapter(
        ch_num=8,
        audio_path=CH08_AUDIO,
        total_dur=CH08_DURATION,
        beats=CH08_BEATS,
        out_json_path="uploads/timelines/ambulance/chapter_08_final.json",
        snapshot_dir="uploads/beat_snapshots/ambulance_ch08"
    )
    
    build_chapter(
        ch_num=9,
        audio_path=CH09_AUDIO,
        total_dur=CH09_DURATION,
        beats=CH09_BEATS,
        out_json_path="uploads/timelines/ambulance/chapter_09_final.json",
        snapshot_dir="uploads/beat_snapshots/ambulance_ch09"
    )
    
    print("\nALL TIMELINES AND SNAPSHOTS COMPLETED SUCCESSFULLY!")
