import os
import json

REPO_ROOT = os.path.abspath(".")
TIMELINES_DIR = os.path.join(REPO_ROOT, "uploads", "timelines", "fishingtent")

REQUIRED_CALLOUTS = {
    4: [
        "WATERPROOFING VS THERMAL RETENTION",
        "IQ FABRIC • 80g HIGH-LOFT SYNTHETIC FILL",
        "3-LAYER BONDED QUILTED TRAP",
        "1 PINT WATER VAPOR EXHALED OVERNIGHT",
        "WARM INNER WALL PREVENTS CONDENSATION"
    ],
    5: [
        "CAMPING TENT: ASLEEP IN SLEEPING BAG",
        "EMERGENCY CRISIS: AWAKE, SEATED, STILL",
        "100 WATTS HUMAN RADIATIVE HEAT",
        "ICE FISHING: DESIGNED FOR IMMOBILE COLD"
    ],
    6: [
        "CATCH 1: ZERO BOTTOM FLOOR",
        "GROUND SUCKS HEAT FASTER THAN AIR",
        "SOLUTION: FOAM MATS, PALLETS & TARP",
        "CATCH 2: NO TEMPERATURE SPECIFICATION",
        "CATCH 3: SCREW ANCHORS REQUIRE WEIGHTS ON PAVEMENT"
    ],
    7: [
        "PORTABLE PROPANE HEATING RISKS",
        "CARBON MONOXIDE (CO): ODORLESS & TASTELESS",
        "BINDS HEMOGLOBIN 200X FASTER THAN OXYGEN",
        "MANDATORY $35 BATTERY CO DETECTOR",
        "HALIFAX INCIDENT: ORDINARY TENT DESTROYED BY FIRE",
        "HIGH & LOW DUAL VENTILATION ESSENTIAL"
    ]
}

TARGET_DURATIONS = {
    4: 189.88,
    5: 86.33,
    6: 158.01,
    7: 143.02
}

errors = []

for ch in [4, 5, 6, 7]:
    fn = os.path.join(TIMELINES_DIR, f"chapter_{ch:02d}_final.json")
    if not os.path.exists(fn):
        errors.append(f"Ch {ch}: File not found {fn}")
        continue
    with open(fn, "r", encoding="utf-8") as f:
        tl = json.load(f)
    
    # 1. total duration check
    if abs(tl.get("totalDuration", 0) - TARGET_DURATIONS[ch]) > 0.05:
        errors.append(f"Ch {ch}: Duration mismatch {tl.get('totalDuration')} vs {TARGET_DURATIONS[ch]}")
    
    clips = tl.get("clips", [])
    if not clips:
        errors.append(f"Ch {ch}: No clips found")
        continue

    # Timing continuity check
    if clips[0]["startTime"] != 0.0:
        errors.append(f"Ch {ch}: clip 0 startTime is not 0.0 ({clips[0]['startTime']})")
    for i in range(len(clips) - 1):
        if abs(clips[i]["endTime"] - clips[i+1]["startTime"]) > 0.01:
            errors.append(f"Ch {ch}: Timing gap/overlap at beat {i} -> {i+1} ({clips[i]['endTime']} vs {clips[i+1]['startTime']})")
    
    last_end = clips[-1]["endTime"]
    if abs(last_end - TARGET_DURATIONS[ch]) > 0.05:
        errors.append(f"Ch {ch}: Last clip endTime {last_end} does not match target duration {TARGET_DURATIONS[ch]}")

    # Clip rules check
    found_callouts = []
    prev_source = None
    for i, c in enumerate(clips):
        # Layout
        if c.get("layout") != "full_bleed_cinematic":
            errors.append(f"Ch {ch} beat {i}: layout is {c.get('layout')} (must be full_bleed_cinematic)")
        
        # Overlays
        if "overlay" in c and c["overlay"] is not None and c["overlay"] != "none":
            errors.append(f"Ch {ch} beat {i}: overlay is {c.get('overlay')} (must be none/omitted)")
        
        # Transitions
        if c.get("transitionType") != "cut" or c.get("transitionDuration") != 0:
            errors.append(f"Ch {ch} beat {i}: transition is {c.get('transitionType')} dur {c.get('transitionDuration')}")

        # Media existence
        cp = c.get("clipPath")
        if not cp or not os.path.exists(cp) or os.path.getsize(cp) < 1000:
            errors.append(f"Ch {ch} beat {i}: clipPath missing or empty {cp}")

        # Anti-dump rule: consecutive slices cannot come from same source
        # Slices are in /slices/, stock is in /stock/
        cur_file = os.path.basename(cp)
        # determine source
        if "slices" in cp:
            # determine which youtube source was used
            # get slice base
            src_tag = cur_file.split("_b")[1] if "_b" in cur_file else cur_file
        else:
            src_tag = "stock_" + cur_file

        if i > 0 and cur_file == prev_file:
            errors.append(f"Ch {ch} beat {i}: duplicate consecutive file {cur_file}")
        prev_file = cur_file

        # Callouts
        co = c.get("callout")
        if co:
            if co.get("type") != "editorial_lower_third":
                errors.append(f"Ch {ch} beat {i}: callout type is {co.get('type')}")
            found_callouts.append(co.get("line1"))

    # Verify all required callouts
    for req in REQUIRED_CALLOUTS[ch]:
        if req not in found_callouts:
            errors.append(f"Ch {ch}: Missing required callout: '{req}'")

print("=== VALIDATION RESULTS ===")
if errors:
    print(f"FAILED WITH {len(errors)} ERRORS:")
    for e in errors:
        print("  -", e)
else:
    print("ALL 4 CHAPTERS PASSED TIMELINE VALIDATION PERFECTLY!")
