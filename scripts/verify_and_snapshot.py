import os
import subprocess
import json

ch02_clips = [
    ("uploads/raw/proj_ambulance/stock/ch02_beat00_ambulance_vehicle.mp4", 0),
    ("uploads/raw/proj_ambulance/slices/ch02_beat01_govdeals_box.mp4", 1),
    ("uploads/raw/proj_ambulance/stock/ch02_beat02_truck_chassis.mp4", 2),
    ("uploads/raw/proj_ambulance/slices/ch02_beat03_cheaprv_profile.mp4", 3),
    ("uploads/raw/proj_ambulance/stock/ch02_beat04_paramedic_module.mp4", 4),
    ("uploads/raw/proj_ambulance/slices/ch02_beat05_benemily_insulation.mp4", 5),
    ("uploads/raw/proj_ambulance/stock/ch02_beat06_reinforced_floor.mp4", 6),
    ("uploads/raw/proj_ambulance/stock/ch02_beat07_electrical_panel.mp4", 7),
    ("uploads/raw/proj_ambulance/stock/ch02_beat08_hospital_bay.mp4", 8),
    ("uploads/raw/proj_ambulance/slices/ch02_beat09_govdeals_alternator.mp4", 9),
    ("uploads/raw/proj_ambulance/stock/ch02_beat10_shore_power.mp4", 10),
    ("uploads/raw/proj_ambulance/stock/ch02_beat11_van_conversion.mp4", 11),
    ("uploads/raw/proj_ambulance/slices/ch02_beat12_benemily_wiring.mp4", 12),
    ("uploads/raw/proj_ambulance/slices/ch02_beat13_govdeals_compartments.mp4", 13),
    ("uploads/raw/proj_ambulance/stock/ch02_beat14_outdoor_storage.mp4", 14),
    ("uploads/raw/proj_ambulance/stock/ch02_beat15_ceiling_fan.mp4", 15),
    ("uploads/raw/proj_ambulance/stock/ch02_beat16_senior_man_cabin.mp4", 16),
]

ch03_clips = [
    ("uploads/raw/proj_ambulance/slices/ch03_beat00_govdeals_yard.mp4", 0),
    ("uploads/raw/proj_ambulance/stock/ch03_beat01_fire_district.mp4", 1),
    ("uploads/raw/proj_ambulance/slices/ch03_beat02_cheaprv_wheels.mp4", 2),
    ("uploads/raw/proj_ambulance/stock/ch03_beat03_auction_site.mp4", 3),
    ("uploads/raw/proj_ambulance/slices/ch03_beat04_govdeals_rear.mp4", 4),
    ("uploads/raw/proj_ambulance/stock/ch03_beat05_odometer.mp4", 5),
    ("uploads/raw/proj_ambulance/stock/ch03_beat06_engine_idling.mp4", 6),
    ("uploads/raw/proj_ambulance/stock/ch03_beat07_diesel_engine.mp4", 7),
    ("uploads/raw/proj_ambulance/slices/ch03_beat08_govdeals_diesel_hood.mp4", 8),
    ("uploads/raw/proj_ambulance/stock/ch03_beat09_maintenance_sheet.mp4", 9),
    ("uploads/raw/proj_ambulance/stock/ch03_beat10_vinyl_striping.mp4", 10),
    ("uploads/raw/proj_ambulance/slices/ch03_beat11_cheaprv_ford_amb.mp4", 11),
    ("uploads/raw/proj_ambulance/stock/ch03_beat12_dale_portrait.mp4", 12),
]

def verify_and_snapshot(clips, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    all_ok = True
    print(f"\nVerifying {len(clips)} clips for {out_dir}:")
    for clip_rel, i in clips:
        clip_path = os.path.abspath(clip_rel)
        if not os.path.exists(clip_path):
            print(f"  [ERROR] Missing: {clip_path}")
            all_ok = False
            continue
            
        cmd = [
            "ffprobe", "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=codec_name,width,height,duration",
            "-of", "json",
            clip_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        probe_data = json.loads(res.stdout)
        stream = probe_data["streams"][0]
        codec = stream.get("codec_name")
        w = stream.get("width")
        h = stream.get("height")
        dur = float(stream.get("duration", 0))
        
        snap_time = min(1.5, dur / 2.0)
        snap_path = os.path.join(out_dir, f"beat_{i:02d}.jpg")
        cmd_snap = [
            "ffmpeg", "-y",
            "-ss", str(snap_time),
            "-i", clip_path,
            "-vframes", "1",
            "-q:v", "2",
            snap_path
        ]
        subprocess.run(cmd_snap, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        snap_size = os.path.getsize(snap_path) if os.path.exists(snap_path) else 0
        is_h264 = (codec == "h264")
        if not is_h264:
            print(f"  [FAIL] Beat {i:02d}: {os.path.basename(clip_path)} - Codec {codec} != h264")
            all_ok = False
        else:
            print(f"  [OK] Beat {i:02d}: {os.path.basename(clip_path)} | {codec} {w}x{h} | {dur:.2f}s | snapshot {snap_size} bytes")
            
    return all_ok

ok2 = verify_and_snapshot(ch02_clips, "uploads/beat_snapshots/ambulance_ch02")
ok3 = verify_and_snapshot(ch03_clips, "uploads/beat_snapshots/ambulance_ch03")

if ok2 and ok3:
    print("\nALL CLIPS VERIFIED AS VALID H.264 AND ALL SNAPSHOTS EXTRACTED!")
else:
    print("\nVERIFICATION HAD ISSUES!")
