import os
import subprocess

SOURCES = [
    "clam_thermal_features",
    "condensation_single_vs_double",
    "ice_shelter_floor_ideas",
    "arctic_ice_anchor_drill",
    "mr_heater_co_test",
    "eskimo_quickfish_3i_setup"
]

os.makedirs("uploads/beat_snapshots/source_probes", exist_ok=True)

for src in SOURCES:
    src_file = f"uploads/raw/proj_fishingtent/sources/{src}.mp4"
    dur = float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", src_file
    ]).decode().strip())
    print(f"\nSource: {src} (Duration: {dur:.1f}s)")
    # Extract snapshots every 15-30s to check content
    step = max(5, int(dur / 10))
    for t in range(5, int(dur), step):
        out_jpg = f"uploads/beat_snapshots/source_probes/{src}_{t:03d}s.jpg"
        subprocess.run([
            "ffmpeg", "-nostdin", "-y", "-ss", str(t), "-i", src_file,
            "-vframes", "1", "-vf", "scale=640:360", "-q:v", "5", out_jpg
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Sampled {src} every {step}s")
