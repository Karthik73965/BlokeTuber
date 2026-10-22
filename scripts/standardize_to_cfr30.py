import os
import sys
import subprocess
import glob

def standardize_file(src_path, dst_path=None):
    if dst_path is None:
        dst_path = src_path
    
    tmp_path = dst_path.replace(".mp4", "_cfr30_tmp.mp4")
    
    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-i", src_path,
        "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080",
        "-r", "30",
        "-fps_mode", "cfr",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-g", "30",
        "-keyint_min", "30",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-c:a", "aac",
        "-ar", "48000",
        "-ac", "2",
        tmp_path
    ]
    
    try:
        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, check=True)
        if os.path.exists(tmp_path) and os.path.getsize(tmp_path) > 10000:
            if os.path.exists(dst_path):
                try: os.unlink(dst_path)
                except: pass
            os.replace(tmp_path, dst_path)
            return True
    except Exception as e:
        print(f"Error standardizing {src_path}: {e}")
        if os.path.exists(tmp_path):
            try: os.unlink(tmp_path)
            except: pass
        return False
    return False

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "uploads/raw/proj_fishingtent/slices"
    files = glob.glob(f"{target_dir}/*.mp4")
    print(f"Standardizing {len(files)} files in {target_dir} to CFR 30fps...")
    success = 0
    for f in files:
        if standardize_file(f):
            success += 1
            print(f"  [CFR30 OK] {os.path.basename(f)}")
    print(f"Done: {success}/{len(files)} files standardized to 30fps CFR.")
