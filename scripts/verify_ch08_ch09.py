import os
import json
import subprocess

def verify_timeline(json_path, snapshot_dir, expected_clips):
    print(f"\n=======================================================")
    print(f"VERIFYING TIMELINE: {json_path}")
    print(f"=======================================================")
    
    assert os.path.exists(json_path), f"Timeline file not found: {json_path}"
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    master_audio = data.get("masterAudioPath")
    assert master_audio, "Missing masterAudioPath"
    assert os.path.exists(master_audio), f"Master audio does not exist: {master_audio}"
    print(f"Master audio exists: {master_audio}")
    
    clips = data.get("clips", [])
    assert len(clips) == expected_clips, f"Expected {expected_clips} clips, found {len(clips)}"
    print(f"Clips count: {len(clips)}")
    
    prev_source_origin = None
    callout_count = 0
    
    for i, c in enumerate(clips):
        beat_idx = c["beatIndex"]
        assert beat_idx == i, f"Beat index mismatch: {beat_idx} != {i}"
        
        # Rule 1: Layout must be full_bleed_cinematic
        layout = c.get("layout")
        assert layout == "full_bleed_cinematic", f"Beat {i} layout is {layout}, expected full_bleed_cinematic"
        
        # Rule 2: No overlays
        assert "overlay" not in c or c["overlay"] is None, f"Beat {i} has overlay: {c.get('overlay')}"
        
        # Rule 3: Transitions cut & duration 0
        assert c.get("transitionType") == "cut", f"Beat {i} transitionType is {c.get('transitionType')}"
        assert c.get("transitionDuration") == 0, f"Beat {i} transitionDuration is {c.get('transitionDuration')}"
        
        # Clip path check
        clip_path = c["clipPath"]
        assert os.path.exists(clip_path), f"Beat {i} clip does not exist: {clip_path}"
        assert os.path.getsize(clip_path) > 10000, f"Beat {i} clip too small: {clip_path}"
        
        # ffprobe verify H.264
        cmd = ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_name,width,height", "-of", "json", clip_path]
        probe_res = subprocess.check_output(cmd)
        probe_data = json.loads(probe_res)
        stream = probe_data["streams"][0]
        assert stream["codec_name"] == "h264", f"Beat {i} codec is {stream['codec_name']}, expected h264"
        
        # Snapshot check
        snap_path = os.path.join(snapshot_dir, f"beat_{i:02d}.jpg")
        assert os.path.exists(snap_path), f"Beat {i} snapshot missing: {snap_path}"
        assert os.path.getsize(snap_path) > 1000, f"Beat {i} snapshot too small: {snap_path}"
        
        # Source anti-consecutive dump guard
        # Identify source
        lower_p = clip_path.lower()
        if "cheaprv" in lower_p:
            src = "cheaprv"
        elif "govdeals" in lower_p:
            src = "govdeals"
        elif "ben_emily" in lower_p:
            src = "ben_emily"
        elif "stock" in lower_p:
            src = "stock"
        else:
            src = "unknown"
            
        if src in ["cheaprv", "govdeals", "ben_emily"]:
            assert prev_source_origin != src, f"CONSECUTIVE SLICES from {src} at beats {i-1} and {i}!"
        prev_source_origin = src
        
        # Callouts
        if "callout" in c:
            callout_count += 1
            co = c["callout"]
            assert co.get("type") == "editorial_lower_third", f"Beat {i} callout type: {co.get('type')}"
            assert co.get("themeColor") in ["gold", "crimson", "cyan"], f"Beat {i} color: {co.get('themeColor')}"
            assert co.get("line1") and co.get("line2"), f"Beat {i} callout missing lines: {co}"
            print(f"  Beat {i:02d} [{src}]: Callout: '{co['line1']}' / '{co['line2']}' ({co['themeColor']})")
        else:
            print(f"  Beat {i:02d} [{src}]: {c['text'][:40]}...")
            
    print(f"Total callouts: {callout_count}")
    print(f"All {len(clips)} beats verified successfully!")

verify_timeline("uploads/timelines/ambulance/chapter_08_final.json", "uploads/beat_snapshots/ambulance_ch08", 31)
verify_timeline("uploads/timelines/ambulance/chapter_09_final.json", "uploads/beat_snapshots/ambulance_ch09", 17)
print("\nALL VERIFICATIONS PASSED WITH FLYING COLORS!")
