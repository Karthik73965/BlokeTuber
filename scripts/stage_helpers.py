import os
import sys
import json
import subprocess
import urllib.request
import urllib.parse
def load_env_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k not in os.environ:
                    os.environ[k] = v

load_env_file(".env")
load_env_file("apps/api/.env")

PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")

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
    
    if os.path.exists(output_path) and os.path.getsize(output_path) > 10000:
        print(f"Slice already exists: {output_path}")
        return
        
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

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

def download_file(url, out_path):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp, open(out_path, "wb") as f:
        while True:
            chunk = resp.read(65536)
            if not chunk:
                break
            f.write(chunk)

def fetch_pexels_video(query_list, output_path, min_duration=5):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    if os.path.exists(output_path) and os.path.getsize(output_path) > 10000:
        print(f"Stock already exists: {output_path}")
        return True

    if not PEXELS_API_KEY:
        raise ValueError("Missing PEXELS_API_KEY")
        
    if isinstance(query_list, str):
        query_list = [query_list]
        
    for query in query_list:
        try:
            url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&per_page=15&orientation=landscape"
            req = urllib.request.Request(url, headers={"Authorization": PEXELS_API_KEY, "User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode())
                
            videos = data.get("videos", [])
            if not videos:
                print(f"No Pexels videos found for query: '{query}', trying fallback...")
                continue
                
            for v in videos:
                files = v.get("video_files", [])
                hd_files = [f for f in files if f.get("width") == 1920 or f.get("width") == 1280]
                if not hd_files:
                    hd_files = files
                if hd_files:
                    download_url = hd_files[0]["link"]
                    temp_file = output_path + ".tmp.mp4"
                    download_file(download_url, temp_file)
                    
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
            print(f"Error querying Pexels for '{query}': {e}")
            continue
            
    raise RuntimeError(f"Failed to fetch any Pexels video for queries: {query_list}")

print("Staging helper loaded.")
