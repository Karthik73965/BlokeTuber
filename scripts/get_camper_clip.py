import os
import sys
import json
import argparse
import subprocess
import urllib.request
import urllib.parse
try:
    from dotenv import load_dotenv
    load_dotenv(".env")
    load_dotenv("apps/api/.env")
except ImportError:
    def load_env_manually(path):
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        if k.strip() not in os.environ:
                            os.environ[k.strip()] = v.strip().strip('"').strip("'")
    load_env_manually(".env")
    load_env_manually("apps/api/.env")

PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")
PIXABAY_API_KEY = os.getenv("PIXABAY_API_KEY")

RAW_SOURCES = {
    "nomad": os.path.abspath("uploads/raw/proj_camperbike/paul_elkins_nomad.mp4"),
    "kirsten": os.path.abspath("uploads/raw/proj_camperbike/kirsten_elkins_150.mp4"),
    "drew": os.path.abspath("uploads/raw/proj_camperbike/drew_builds_stuff.mp4"),
    "homeless": os.path.abspath("uploads/raw/proj_camperbike/beneath_bridges_homeless.mp4"),
    "designs7": os.path.abspath("uploads/raw/proj_camperbike/beneath_bridges_7campers.mp4"),
}

def slice_video(source_key, start_time, duration, output_path):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    src_file = RAW_SOURCES.get(source_key)
    if not src_file or not os.path.exists(src_file):
        raise FileNotFoundError(f"Source file not found: {source_key} -> {src_file}")
    
    if source_key in ["kirsten", "homeless", "designs7"]:
        vf = "crop=in_w:in_h*0.88:0:0,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    elif source_key == "drew":
        vf = "crop=in_w:in_h*0.88:0:in_h*0.12,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
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
    snap = output_path.replace(".mp4", ".jpg")
    try:
        subprocess.run(["ffmpeg", "-nostdin", "-y", "-ss", "1", "-i", output_path, "-vframes", "1", "-q:v", "2", snap],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except:
        pass
    print(f"Sliced {source_key} ({start_time}s, {duration}s) -> {output_path}")

def fetch_pexels_video(query, output_path):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    if not PEXELS_API_KEY:
        print("Missing PEXELS_API_KEY")
        return False
    url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&per_page=6&orientation=landscape"
    req = urllib.request.Request(url, headers={
        "Authorization": PEXELS_API_KEY,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    })
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            videos = data.get('videos', [])
            if not videos:
                return False
            for vid in videos:
                for vf in vid.get('video_files', []):
                    if (vf.get('height') or 0) >= 720 and vf.get('link'):
                        dl_req = urllib.request.Request(vf['link'], headers={
                            "User-Agent": "Mozilla/5.0"
                        })
                        with urllib.request.urlopen(dl_req) as dl_resp, open(output_path, 'wb') as out_f:
                            while True:
                                chunk = dl_resp.read(128 * 1024)
                                if not chunk:
                                    break
                                out_f.write(chunk)
                        snap = output_path.replace(".mp4", ".jpg")
                        try:
                            subprocess.run(["ffmpeg", "-nostdin", "-y", "-ss", "1", "-i", output_path, "-vframes", "1", "-q:v", "2", snap],
                                           check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                        except:
                            pass
                        print(f"Downloaded Pexels '{query}' -> {output_path}")
                        return True
    except Exception as e:
        print(f"Pexels fetch failed: {e}")
    return False

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["slice", "pexels_video"], required=True)
    parser.add_argument("--source", choices=list(RAW_SOURCES.keys()))
    parser.add_argument("--start", type=float)
    parser.add_argument("--duration", type=float, default=6.0)
    parser.add_argument("--query", type=str)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    if args.mode == "slice":
        slice_video(args.source, args.start, args.duration, args.output)
    elif args.mode == "pexels_video":
        if not fetch_pexels_video(args.query, args.output):
            sys.exit(1)

if __name__ == "__main__":
    main()
