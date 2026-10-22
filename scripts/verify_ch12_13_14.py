import os
import sys
import json

REPO = os.path.abspath(".")

timelines = [
    (12, os.path.join(REPO, "uploads", "timelines", "camperbike", "chapter_12_final.json"), 144.327, 25, "uploads/beat_snapshots/camperbike_ch12"),
    (13, os.path.join(REPO, "uploads", "timelines", "camperbike", "chapter_13_final.json"), 79.726, 13, "uploads/beat_snapshots/camperbike_ch13"),
    (14, os.path.join(REPO, "uploads", "timelines", "camperbike", "chapter_14_final.json"), 114.103, 19, "uploads/beat_snapshots/camperbike_ch14"),
]

errors = []

for ch_idx, tl_path, expected_dur, expected_beats, snap_dir in timelines:
    print(f"=== Validating Chapter {ch_idx} ===")
    if not os.path.exists(tl_path):
        errors.append(f"Ch {ch_idx}: Timeline file missing: {tl_path}")
        continue
    with open(tl_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    clips = data.get("clips", [])
    if len(clips) != expected_beats:
        errors.append(f"Ch {ch_idx}: Expected {expected_beats} beats, found {len(clips)}")
    tot_dur = data.get("totalDuration", 0)
    if abs(tot_dur - expected_dur) > 0.01:
        errors.append(f"Ch {ch_idx}: Total duration {tot_dur} != {expected_dur}")
        
    callout_count = 0
    prev_end = 0.0
    
    for i, c in enumerate(clips):
        st = c["startTime"]
        et = c["endTime"]
        dur = c["duration"]
        if abs(st - prev_end) > 0.01:
            errors.append(f"Ch {ch_idx} Beat {i}: Gap/overlap {prev_end} -> {st}")
        prev_end = et
        if abs((et - st) - dur) > 0.01:
            errors.append(f"Ch {ch_idx} Beat {i}: duration mismatch {dur} vs {et - st}")
            
        # Layout & overlay checks
        if c.get("layout") != "full_bleed_cinematic":
            errors.append(f"Ch {ch_idx} Beat {i}: layout is {c.get('layout')}, expected full_bleed_cinematic")
        if "overlay" in c and c["overlay"] is not None:
            errors.append(f"Ch {ch_idx} Beat {i}: overlay is present ({c.get('overlay')})")
        if c.get("transitionType") != "cut":
            errors.append(f"Ch {ch_idx} Beat {i}: transitionType is {c.get('transitionType')}, expected cut")
        if c.get("transitionDuration") != 0:
            errors.append(f"Ch {ch_idx} Beat {i}: transitionDuration is {c.get('transitionDuration')}, expected 0")
            
        # Callouts
        if "callout" in c:
            callout_count += 1
            co = c["callout"]
            if co.get("type") != "editorial_lower_third":
                errors.append(f"Ch {ch_idx} Beat {i}: callout type {co.get('type')}")
            if co.get("themeColor") not in ["gold", "cyan"]:
                errors.append(f"Ch {ch_idx} Beat {i}: callout themeColor {co.get('themeColor')}")
            if not co.get("line1") or not co.get("line2"):
                errors.append(f"Ch {ch_idx} Beat {i}: callout missing line1 or line2")
                
        # Media clip check
        c_path = c.get("clipPath")
        if not os.path.exists(c_path):
            errors.append(f"Ch {ch_idx} Beat {i}: clipPath missing: {c_path}")
        else:
            if os.path.getsize(c_path) < 10000:
                errors.append(f"Ch {ch_idx} Beat {i}: clip file too small: {c_path}")
                
        # Snapshot check
        s_file = os.path.join(REPO, snap_dir, f"beat_{i:02d}.jpg")
        if not os.path.exists(s_file) or os.path.getsize(s_file) < 5000:
            errors.append(f"Ch {ch_idx} Beat {i}: snapshot missing or empty: {s_file}")
            
    if callout_count != 5:
        errors.append(f"Ch {ch_idx}: Expected exactly 5 callouts, found {callout_count}")
    else:
        print(f"  Callouts: Exactly 5 validated")
    print(f"  Beats count: {len(clips)} validated")
    print(f"  Total duration: {tot_dur}s validated")

# Check project stores
for s_rel in ["output/store/projects.json", "apps/api/output/store/projects.json"]:
    full_s = os.path.join(REPO, s_rel)
    if not os.path.exists(full_s):
        errors.append(f"Store missing: {s_rel}")
        continue
    with open(full_s, "r", encoding="utf-8") as f:
        projects = json.load(f)
    proj = next((p for p in projects if p.get("id") == "proj_camperbike_hideaways"), None)
    if not proj:
        errors.append(f"Project proj_camperbike_hideaways missing in {s_rel}")
        continue
    ch_map = {ch.get("chapterIndex"): ch for ch in proj.get("chapters", [])}
    for c_idx in [12, 13, 14]:
        if c_idx not in ch_map:
            errors.append(f"Chapter {c_idx} missing from project in {s_rel}")
        else:
            ch_entry = ch_map[c_idx]
            if ch_entry.get("status") != "staged":
                errors.append(f"Chapter {c_idx} status is {ch_entry.get('status')} in {s_rel}")
            if not ch_entry.get("timelineJson"):
                errors.append(f"Chapter {c_idx} timelineJson empty in {s_rel}")
    print(f"Store validated: {s_rel}")

if errors:
    print("\nVALIDATION FAILED:")
    for e in errors:
        print(f"  - {e}")
    sys.exit(1)
else:
    print("\nALL VALIDATION CHECKS PASSED WITH ZERO ERRORS!")
