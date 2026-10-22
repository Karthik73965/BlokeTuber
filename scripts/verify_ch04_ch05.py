import os
import sys
import json
import subprocess

TIMELINES = [
    ("Chapter 04", "uploads/timelines/ambulance/chapter_04_final.json", "uploads/beat_snapshots/ambulance_ch04"),
    ("Chapter 05", "uploads/timelines/ambulance/chapter_05_final.json", "uploads/beat_snapshots/ambulance_ch05")
]

all_passed = True

for title, tpath, snap_dir in TIMELINES:
    print("\n" + "=" * 70)
    print(f" VERIFYING TIMELINE: {title} ({tpath})")
    print("=" * 70)
    
    if not os.path.exists(tpath):
        print(f"CRITICAL: Timeline file missing: {tpath}")
        all_passed = False
        continue
        
    with open(tpath, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    master_audio = data.get("masterAudioPath")
    if not master_audio or not os.path.exists(master_audio):
        print(f"CRITICAL: Master audio missing: {master_audio}")
        all_passed = False
        continue
        
    # Probe master audio duration
    probe_a = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', master_audio])
    audio_dur = float(json.loads(probe_a)['format']['duration'])
    timeline_total = float(data.get("totalDuration", 0))
    
    print(f"Master Audio: {os.path.basename(master_audio)} (dur: {audio_dur:.3f}s)")
    print(f"Timeline Total Duration: {timeline_total:.3f}s")
    
    if abs(timeline_total - audio_dur) > 0.05:
        print(f"CRITICAL: Timeline totalDuration ({timeline_total:.3f}s) mismatch with audio ({audio_dur:.3f}s)")
        all_passed = False
    else:
        print(f"[PASS] Timeline total duration aligns with master audio duration.")
        
    clips = data.get("clips", [])
    print(f"Clips Count: {len(clips)}")
    
    prev_end = 0.0
    prev_source = None
    
    for i, c in enumerate(clips):
        bidx = c.get("beatIndex")
        st = float(c.get("startTime", 0))
        et = float(c.get("endTime", 0))
        dur = float(c.get("duration", 0))
        layout = c.get("layout")
        trans_type = c.get("transitionType")
        trans_dur = c.get("transitionDuration")
        overlay = c.get("overlay")
        callout = c.get("callout")
        cpath = c.get("clipPath")
        
        # 1. Continuity check
        if abs(st - prev_end) > 0.001:
            print(f"  [FAIL] Beat {i:02d}: startTime {st} != prev_end {prev_end}")
            all_passed = False
        prev_end = et
        
        # 2. Duration check
        if abs(dur - (et - st)) > 0.005:
            print(f"  [FAIL] Beat {i:02d}: duration {dur} != endTime - startTime ({et - st})")
            all_passed = False
            
        # 3. Layout check: MUST be full_bleed_cinematic
        if layout != "full_bleed_cinematic":
            print(f"  [FAIL] Beat {i:02d}: layout is '{layout}' (MUST be 'full_bleed_cinematic')")
            all_passed = False
            
        # 4. Overlay check: zero overlays
        if overlay is not None:
            print(f"  [FAIL] Beat {i:02d}: overlay is present ({overlay})")
            all_passed = False
            
        # 5. Transition check: cut and 0
        if trans_type != "cut" or trans_dur != 0:
            print(f"  [FAIL] Beat {i:02d}: transitionType='{trans_type}', transitionDuration={trans_dur} (MUST be cut and 0)")
            all_passed = False
            
        # 6. File existence and H.264 check
        if not cpath or not os.path.exists(cpath):
            print(f"  [FAIL] Beat {i:02d}: clipPath missing ({cpath})")
            all_passed = False
            continue
            
        probe_v = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_name:format=duration', '-of', 'json', cpath])
        v_data = json.loads(probe_v)
        codec = v_data['streams'][0]['codec_name']
        v_dur = float(v_data['format']['duration'])
        
        if codec != "h264":
            print(f"  [FAIL] Beat {i:02d}: codec is '{codec}', expected 'h264'")
            all_passed = False
            
        if v_dur < dur - 0.05:
            print(f"  [FAIL] Beat {i:02d}: video duration ({v_dur:.2f}s) < beat duration ({dur:.2f}s)")
            all_passed = False
            
        # 7. Anti-YouTube Dump Guard: check consecutive slices from same source
        # identify source
        curr_source = None
        for sname in ["cheaprv", "govdeals", "ben_emily"]:
            if sname in os.path.basename(cpath).lower():
                curr_source = sname
                break
                
        if curr_source and curr_source == prev_source:
            print(f"  [FAIL] Beat {i:02d}: Consecutive slice from same source '{curr_source}'!")
            all_passed = False
        prev_source = curr_source
        
        # 8. Snapshot check
        snap_file = os.path.join(snap_dir, f"beat_{bidx:02d}.jpg")
        if not os.path.exists(snap_file) or os.path.getsize(snap_file) == 0:
            print(f"  [FAIL] Beat {i:02d}: missing snapshot {snap_file}")
            all_passed = False
            
        callout_desc = f" [{callout['themeColor']} CALLOUT: {callout['line1']}]" if callout else ""
        print(f"  [OK] Beat {i:02d}: {st:6.2f}->{et:6.2f} ({dur:5.2f}s) | codec: {codec} | file: {os.path.basename(cpath)}{callout_desc}")
        
    # Check end of chapter
    if abs(prev_end - timeline_total) > 0.01:
        print(f"CRITICAL: Final beat end ({prev_end:.3f}s) != timeline total ({timeline_total:.3f}s)")
        all_passed = False
    else:
        print(f"[PASS] Continuous coverage verified from 0.0s to {timeline_total:.3f}s.")

print("\n" + "=" * 70)
if all_passed:
    print(" >>> ALL TIMELINES AND BEAT SNAPSHOTS 100% VERIFIED AND VALIDATED! <<< ")
else:
    print(" >>> VERIFICATION FAILED - CHECK ERRORS ABOVE! <<< ")
print("=" * 70)
