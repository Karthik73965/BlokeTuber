import os
import sys
import json

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.abspath(".")
TIMELINE_DIR = os.path.join(BASE_DIR, "uploads", "timelines", "fishingtent")

required_callouts = {
    1: [
        "HALIFAX CITY HALL • GRAND PARADE",
        "DECEMBER 2023 • FIRST WINTER SNOW",
        "ESKIMO QUICKFISH ICE SHELTER",
        "$70,000 COMMUNITY FUNDRAISED",
        "TWO MEN & A WHITE CARGO VAN"
    ],
    2: [
        "JANUARY 2024 HUD CENSUS",
        "771,480 HOMELESS IN AMERICA (+18%)",
        "274,000+ LIVING UNSHELTERED",
        "HURRICANES BERYL, HELENE & MILTON",
        "SC CUSTOMERS: 53 HOURS WITHOUT POWER"
    ],
    3: [
        "ESKIMO QUICKFISH 3i ($300 RETAIL)",
        "80 INCHES TALL • FULL STANDING HEIGHT",
        "34 SQ FT FLOOR • 34 LBS RIG WEIGHT",
        "60-SECOND QUICK-LOCK HUB DEPLOYMENT",
        "ZERO SLEEVES • ZERO THREADING"
    ]
}

def get_source_category(path):
    fn = os.path.basename(path).lower()
    if "stock" in path.lower() or fn.startswith("ch0") or fn.startswith("stock_"):
        # Check if it's in stock dir
        if "uploads\\raw\\proj_fishingtent\\stock" in path or "uploads/raw/proj_fishingtent/stock" in path:
            return "stock"
    if "halifax_business_eviction" in fn:
        return "halifax_business_eviction"
    elif "halifax_eviction_day" in fn:
        return "halifax_eviction_day"
    elif "halifax_students_gifts" in fn:
        return "halifax_students_gifts"
    elif "eskimo_quickfish_3i" in fn:
        return "eskimo_quickfish_3i"
    elif "eskimo_quickfish_overview" in fn:
        return "eskimo_quickfish_overview"
    elif "stock" in path.lower():
        return "stock"
    else:
        return "other"

all_pass = True

print("========================================================================")
print("VALIDATING FISHING TENT CHAPTERS 01, 02, 03 TIMELINES")
print("========================================================================")

for ch in [1, 2, 3]:
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
    print(f"   Clips: {len(clips)} | Dur: {data['totalDuration']:.2f}s | Callouts: {len(found_callouts)}/{len(required_callouts[ch])}")
    print(f"   BadLayout: {len(bad_layout)} | Overlays: {len(with_overlay)} | BadTrans: {len(bad_trans)} | MissingClips: {len(missing_clips)}")
    if timing_errors:
        print(f"   ⚠️ Timing Errors: {timing_errors}")
    if dump_errors:
        print(f"   ⚠️ Dump Violations: {dump_errors}")
    if missing_callouts:
        print(f"   ⚠️ Missing Callouts: {missing_callouts}")

print("\n========================================================================")
print("PROJECT STORE SYNC VERIFICATION")
print("========================================================================")
store_files = [
    os.path.join(BASE_DIR, "output", "store", "projects.json"),
    os.path.join(BASE_DIR, "apps", "api", "output", "store", "projects.json")
]

for s_path in store_files:
    if not os.path.exists(s_path):
        print(f"❌ Missing store: {s_path}")
        all_pass = False
        continue
    with open(s_path, "r", encoding="utf-8") as f:
        projects = json.load(f)
    proj = next((p for p in projects if p.get("id") == "proj_fishingtent_hideaways"), None)
    if not proj:
        print(f"❌ proj_fishingtent_hideaways not found in {s_path}")
        all_pass = False
        continue
    ch_map = {c["chapterIndex"]: c for c in proj.get("chapters", [])}
    for ch_idx in [1, 2, 3]:
        c_obj = ch_map.get(ch_idx)
        if not c_obj or c_obj.get("status") != "staged":
            print(f"❌ {os.path.basename(s_path)}: Ch {ch_idx} is not 'staged' (status: {c_obj.get('status') if c_obj else 'None'})")
            all_pass = False
        else:
            print(f"✅ {os.path.basename(os.path.dirname(os.path.dirname(s_path)))}/{os.path.basename(s_path)} Ch {ch_idx:02d} -> 'staged' ({len(c_obj.get('timelineJson', {}).get('clips', []))} clips)")

print("========================================================================")
print("🎉 ALL TIMELINES AND STORES FULLY VALIDATED!" if all_pass else "⚠️ SOME CHECKS FAILED")
print("========================================================================")
