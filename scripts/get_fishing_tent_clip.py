import os
import sys
import json
import argparse
import subprocess

SOURCES_DIR = os.path.abspath("uploads/raw/proj_fishingtent/sources")
SLICES_DIR = os.path.abspath("uploads/raw/proj_fishingtent/slices")
REGISTRY_FILE = os.path.abspath("uploads/raw/proj_fishingtent/used_slices.json")

os.makedirs(SLICES_DIR, exist_ok=True)

# Load or init used slices registry
def get_registry():
    if os.path.exists(REGISTRY_FILE):
        try:
            with open(REGISTRY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_registry(reg):
    with open(REGISTRY_FILE, "w", encoding="utf-8") as f:
        json.dump(reg, f, indent=2)

def slice_clip(source_name, start_time, duration, output_path, crop_bottom=0.12, crop_top=0.0):
    src_file = os.path.join(SOURCES_DIR, f"{source_name}.mp4")
    if not os.path.exists(src_file):
        raise FileNotFoundError(f"Source video not found: {src_file}")

    # Register usage to guarantee ZERO repeats
    reg = get_registry()
    slice_id = f"{source_name}_{start_time}_{duration}"
    if slice_id in reg:
        print(f"[WARNING] Slice {slice_id} was already used in {reg[slice_id]}! Forcing unique assignment.")
    reg[slice_id] = output_path
    save_registry(reg)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    # Smart crop filter
    if crop_bottom > 0 and crop_top == 0:
        h_ratio = 1.0 - crop_bottom
        vf = f"crop=in_w:in_h*{h_ratio:.2f}:0:0,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    elif crop_top > 0 and crop_bottom == 0:
        h_ratio = 1.0 - crop_top
        vf = f"crop=in_w:in_h*{h_ratio:.2f}:0:in_h*{crop_top:.2f},scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    elif crop_top > 0 and crop_bottom > 0:
        h_ratio = 1.0 - crop_top - crop_bottom
        vf = f"crop=in_w:in_h*{h_ratio:.2f}:0:in_h*{crop_top:.2f},scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    else:
        vf = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"

    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-ss", str(start_time),
        "-i", src_file,
        "-t", str(duration),
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-an",
        output_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Snapshot
    snap_path = output_path.replace(".mp4", ".jpg")
    try:
        subprocess.run([
            "ffmpeg", "-nostdin", "-y",
            "-ss", str(min(1.0, duration / 2)),
            "-i", output_path,
            "-vframes", "1",
            "-q:v", "2",
            snap_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except:
        pass

    print(f"[SLICED] {source_name} ({start_time}s +{duration}s) -> {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--start", type=float, required=True)
    parser.add_argument("--duration", type=float, required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--crop-bottom", type=float, default=0.12)
    parser.add_argument("--crop-top", type=float, default=0.0)
    args = parser.parse_args()

    slice_clip(args.source, args.start, args.duration, args.output, args.crop_bottom, args.crop_top)
