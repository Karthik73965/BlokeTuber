import os
import subprocess

def probe_video_segments(src_name, start, end, step, prefix):
    src_file = f"uploads/raw/proj_fishingtent/sources/{src_name}.mp4"
    os.makedirs(f"uploads/beat_snapshots/probes_{prefix}", exist_ok=True)
    for t in range(start, end, step):
        out_jpg = f"uploads/beat_snapshots/probes_{prefix}/{src_name}_{t:03d}s.jpg"
        subprocess.run([
            "ffmpeg", "-nostdin", "-y", "-ss", str(t), "-i", src_file,
            "-vframes", "1", "-vf", "scale=640:360", "-q:v", "5", out_jpg
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# Floor ideas:
probe_video_segments("ice_shelter_floor_ideas", 180, 440, 20, "floor")
# MR heater CO test:
probe_video_segments("mr_heater_co_test", 10, 400, 25, "heater")
# Arctic anchor drill:
probe_video_segments("arctic_ice_anchor_drill", 5, 180, 15, "anchor")
# Condensation single vs double:
probe_video_segments("condensation_single_vs_double", 10, 400, 30, "condensation")
print("Probed all sources")
