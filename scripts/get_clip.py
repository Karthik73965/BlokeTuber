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
    "cheaprv": os.path.abspath("uploads/raw/proj_ambulance/cheaprv_ambulance.mp4"),
    "govdeals": os.path.abspath("uploads/raw/proj_ambulance/govdeals_ambulance.mp4"),
    "ben_emily": os.path.abspath("uploads/raw/proj_ambulance/ben_emily_tour.mp4"),
}

def slice_video(source_key, start_time, duration, output_path):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    src_file = RAW_SOURCES.get(source_key)
    if not src_file or not os.path.exists(src_file):
        raise FileNotFoundError(f"Source file not found: {source_key} -> {src_file}")
    
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(start_time),
        "-i", src_file,
        "-t", str(duration),
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-an",
        output_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Sliced {source_key} ({start_time}s, {duration}s) -> {output_path}")

def fetch_pixabay_video(query, output_path):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    if not PIXABAY_API_KEY:
        print("Missing PIXABAY_API_KEY")
        return False
    url = f"https://pixabay.com/api/videos/?key={PIXABAY_API_KEY}&q={urllib.parse.quote(query)}&video_type=film&per_page=15"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
    except Exception as e:
        print(f"Pixabay error: {e}")
        return False
        
    hits = data.get("hits", [])
    if not hits:
        # Retry with simpler single-word query if multi-word
        words = query.split()
        if len(words) > 1:
            return fetch_pixabay_video(words[0], output_path)
        print(f"No Pixabay videos found for query: {query}")
        return False
        
    for h in hits:
        videos = h.get("videos", {})
        v_obj = videos.get("large") or videos.get("medium") or videos.get("small")
        if v_obj and v_obj.get("url"):
            download_url = v_obj["url"]
            temp_file = output_path + ".tmp.mp4"
            dl_req = urllib.request.Request(download_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(dl_req) as dl_resp, open(temp_file, "wb") as out_f:
                out_f.write(dl_resp.read())
                
            cmd = [
                "ffmpeg", "-y",
                "-i", temp_file,
                "-c:v", "libx264",
                "-preset", "veryfast",
                "-crf", "18",
                "-pix_fmt", "yuv420p",
                "-an",
                output_path
            ]
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(temp_file):
                os.remove(temp_file)
            print(f"Downloaded Pixabay video for '{query}' -> {output_path}")
            return True
    return False

def fetch_pexels_video(query, output_path, min_duration=5):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    if PEXELS_API_KEY:
        try:
            url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&per_page=15&orientation=landscape"
            req = urllib.request.Request(url, headers={"Authorization": PEXELS_API_KEY, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode())
                
            videos = data.get("videos", [])
            for v in videos:
                files = v.get("video_files", [])
                hd_files = [f for f in files if f.get("width") == 1920 or f.get("width") == 1280]
                if not hd_files:
                    hd_files = files
                if hd_files:
                    download_url = hd_files[0]["link"]
                    temp_file = output_path + ".tmp.mp4"
                    dl_req = urllib.request.Request(download_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                    with urllib.request.urlopen(dl_req) as dl_resp, open(temp_file, "wb") as out_f:
                        out_f.write(dl_resp.read())
                    
                    cmd = [
                        "ffmpeg", "-y",
                        "-i", temp_file,
                        "-c:v", "libx264",
                        "-preset", "veryfast",
                        "-crf", "18",
                        "-pix_fmt", "yuv420p",
                        "-an",
                        output_path
                    ]
                    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    if os.path.exists(temp_file):
                        os.remove(temp_file)
                    print(f"Downloaded Pexels video for '{query}' -> {output_path}")
                    return True
        except Exception as e:
            print(f"Pexels fetch failed ({e}), falling back to Pixabay...")
    
    # Fallback to Pixabay
    return fetch_pixabay_video(query, output_path)

def fetch_pexels_photo(query, output_path):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    if not PEXELS_API_KEY:
        raise ValueError("Missing PEXELS_API_KEY")
        
    url = f"https://api.pexels.com/v1/search?query={urllib.parse.quote(query)}&per_page=10&orientation=landscape"
    req = urllib.request.Request(url, headers={"Authorization": PEXELS_API_KEY})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        
    photos = data.get("photos", [])
    if not photos:
        print(f"No Pexels photos found for query: {query}")
        return False
        
    img_url = photos[0]["src"]["large2x"]
    urllib.request.urlretrieve(img_url, output_path)
    print(f"Downloaded Pexels photo for '{query}' -> {output_path}")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["slice", "pexels_video", "pexels_photo"], required=True)
    parser.add_argument("--source", choices=["cheaprv", "govdeals", "ben_emily"])
    parser.add_argument("--start", type=float, default=0)
    parser.add_argument("--duration", type=float, default=6)
    parser.add_argument("--query", type=str)
    parser.add_argument("--output", type=str, required=True)
    args = parser.parse_args()
    
    if args.mode == "slice":
        slice_video(args.source, args.start, args.duration, args.output)
    elif args.mode == "pexels_video":
        fetch_pexels_video(args.query, args.output)
    elif args.mode == "pexels_photo":
        fetch_pexels_photo(args.query, args.output)
