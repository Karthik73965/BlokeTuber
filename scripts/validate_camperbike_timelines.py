import os
import sys
import json

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

TIMELINE_DIR = "uploads/timelines/camperbike"

def get_source_category(path):
    fn = os.path.basename(path).lower()
    if fn.startswith("stock_"):
        return "stock"
    elif fn.startswith("elkins_"):
        return "elkins"
    elif fn.startswith("kirsten_"):
        return "kirsten"
    elif fn.startswith("drew_"):
        return "drew"
    elif fn.startswith("bridges7_"):
        return "bridges7"
    elif fn.startswith("bridges_"):
        return "bridges"
    else:
        return "other"

all_pass = True

required_callouts = {
    1: ["PACIFIC NORTHWEST • 06:00 AM", "7 FT LENGTH • BREAD-LOAF SHAPE", "+20°F TO +30°F WARMER INSIDE", "$150 TOTAL BUILD COST"],
    2: ["$150 BICYCLE SHELTER", "FRAMELESS ARCHITECTURE", "THE $2 BOLT & BICYCLE WHEELS", "NO FANTASIES • HONEST LIMITS"],
    3: ["4 RECYCLED CAMPAIGN SIGNS", "6 PINE 1x2 BOARDS ($1 EACH)", "1-GALLON TUB SKYLIGHT", "TOTAL RIG WEIGHT: 60 LBS"],
    4: ["ZERO STUDS • ZERO RIBS", "ARCED FLUTED POLYPROPYLENE", "NATURAL BARREL VAULT PHYSICS", "60 LBS VS 200 LBS FRAMED"],
    5: ["COROPLAST • FLUTED POLYPROPYLENE", "TWIN-WALL AIR CHANNELS", "WATERPROOF & UV RESISTANT", "ZIP-TIE & POP-RIVET SEAMS"],
    6: ["PAUL ELKINS • BOEING ENGINEER", "1970s BREAD TRUCK CAMPER", "BURNING MAN DESERT PROTOTYPE", "$20 BUILD PLANS • 64 PAGES", "FAHRRAD-WOHNWAGEN MOVEMENT"],
    7: ["EMERGENCY HOMELESS SHELTER (22.5 SQ FT)", "PUSHCART WITH SHOWER & TOILET (19.5 SQ FT)", "VENDING & GOODS STALL (225 LBS)", "INSPIRED BY 'ZERO YEN HOUSES'"]
}

print("========================================================================")
print("VALIDATING CAMPERBIKE CHAPTERS 01-07 TIMELINES")
print("========================================================================")

for ch in [1, 2, 3, 4, 5, 6, 7]:
    fname = f"chapter_0{ch}_final.json"
    p = os.path.join(TIMELINE_DIR, fname)
    if not os.path.exists(p):
        print(f"❌ Missing timeline file: {p}")
        all_pass = False
        continue
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    clips = data.get("clips", [])
    
    bad_layout = [c for c in clips if c.get("layout") != "full_bleed_cinematic"]
    with_overlay = [c for c in clips if "overlay" in c and c["overlay"]]
    bad_trans = [c for c in clips if c.get("transitionType") != "cut" or c.get("transitionDuration") != 0]
    missing_clips = [c for c in clips if not os.path.exists(c.get("clipPath", ""))]
    
    # Timing continuity check
    timing_errors = []
    prev_end = 0.0
    for i, c in enumerate(clips):
        if abs(c["startTime"] - prev_end) > 0.001:
            timing_errors.append(f"Beat {i} startTime ({c['startTime']}) != prev_end ({prev_end})")
        prev_end = c["endTime"]
    if abs(prev_end - data["totalDuration"]) > 0.01:
        timing_errors.append(f"Last beat endTime ({prev_end}) != totalDuration ({data['totalDuration']})")
        
    # Anti-YouTube Dump Guard check: no consecutive slices from same source
    dump_errors = []
    prev_source = None
    for i, c in enumerate(clips):
        src = get_source_category(c["clipPath"])
        if src != "stock" and src == prev_source:
            dump_errors.append(f"Beat {i} ({src}) is consecutive slice from same source as Beat {i-1}")
        prev_source = src
        
    # Callout verification
    found_callouts = [c["callout"]["line1"] for c in clips if "callout" in c and "line1" in c["callout"]]
    missing_callouts = [req for req in required_callouts[ch] if req not in found_callouts]

    ok = (len(bad_layout) == 0 and len(with_overlay) == 0 and len(bad_trans) == 0 and 
          len(missing_clips) == 0 and len(timing_errors) == 0 and len(dump_errors) == 0 and
          len(missing_callouts) == 0)
    
    if not ok:
        all_pass = False
        
    print(f"{'✅' if ok else '❌'} [{fname}]")
    print(f"   Clips: {len(clips)} | Dur: {data['totalDuration']:.2f}s | Callouts: {len(found_callouts)}/4")
    print(f"   BadLayout: {len(bad_layout)} | Overlays: {len(with_overlay)} | BadTrans: {len(bad_trans)} | MissingClips: {len(missing_clips)}")
    if timing_errors:
        print(f"   ⚠️ Timing Errors: {timing_errors}")
    if dump_errors:
        print(f"   ⚠️ Dump Violations: {dump_errors}")
    if missing_callouts:
        print(f"   ⚠️ Missing Callouts: {missing_callouts}")

print("========================================================================")
print("🎉 ALL TIMELINES FULLY VALIDATED AND COMPLIANT!" if all_pass else "⚠️ SOME TIMELINES NEED FIXING")
print("========================================================================")
