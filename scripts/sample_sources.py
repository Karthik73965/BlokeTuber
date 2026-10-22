import os
import subprocess

SOURCES = [
    "chicago_ice_tents_robledo",
    "halifax_fenced_off",
    "halifax_business_eviction",
    "cabelas_ice_shelter_tour"
]

out_dir = "uploads/raw/proj_fishingtent/source_samples"
os.makedirs(out_dir, exist_ok=True)

for src in SOURCES:
    src_file = f"uploads/raw/proj_fishingtent/sources/{src}.mp4"
    sub_dir = os.path.join(out_dir, src)
    os.makedirs(sub_dir, exist_ok=True)
    
    # Get duration
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", src_file]
    dur = float(subprocess.check_output(cmd).decode().strip())
    print(f"Sampling {src} (dur {dur:.1f}s)...")
    
    # Sample every 15-30s depending on length
    step = 20 if dur < 200 else 45
    for t in range(5, int(dur) - 5, step):
        img_out = os.path.join(sub_dir, f"t_{t:04d}.jpg")
        if not os.path.exists(img_out):
            subprocess.run([
                "ffmpeg", "-nostdin", "-y",
                "-ss", str(t),
                "-i", src_file,
                "-vframes", "1",
                "-vf", "scale=640:360",
                "-q:v", "3",
                img_out
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("Done sampling!")
