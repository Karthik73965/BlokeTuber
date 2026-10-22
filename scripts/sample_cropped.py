import os
import subprocess

def sample_video(src_name, start, end, interval, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    src_file = f"uploads/raw/proj_fishingtent/sources/{src_name}.mp4"
    for t in range(start, end, interval):
        out_jpg = os.path.join(out_dir, f"{t:04d}.jpg")
        if not os.path.exists(out_jpg):
            subprocess.run([
                "ffmpeg", "-nostdin", "-y",
                "-ss", str(t),
                "-i", src_file,
                "-vf", "crop=in_w:in_h*0.86:0:0,scale=640:360",
                "-vframes", "1",
                "-q:v", "3",
                out_jpg
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# Sample chicago
sample_video("chicago_ice_tents_robledo", 0, 500, 20, "uploads/raw/proj_fishingtent/samples/chicago")
# Sample halifax_fenced_off
sample_video("halifax_fenced_off", 0, 110, 10, "uploads/raw/proj_fishingtent/samples/halifax_fenced")
# Sample halifax_business_eviction
sample_video("halifax_business_eviction", 0, 400, 20, "uploads/raw/proj_fishingtent/samples/halifax_biz")
# Sample cabelas
sample_video("cabelas_ice_shelter_tour", 0, 460, 20, "uploads/raw/proj_fishingtent/samples/cabelas")

print("Sampling complete!")
