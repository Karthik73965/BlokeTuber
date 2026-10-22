import os
import sys
import json
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

def fetch_stock_video(query, output_path):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    if os.path.exists(output_path) and os.path.getsize(output_path) > 100000:
        print(f"Already exists: {output_path}")
        return True
        
    # Try Pexels first
    if PEXELS_API_KEY:
        try:
            url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&per_page=15&orientation=landscape"
            req = urllib.request.Request(url, headers={"Authorization": PEXELS_API_KEY, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(req, timeout=15) as resp:
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
                    with urllib.request.urlopen(dl_req, timeout=30) as dl_resp, open(temp_file, "wb") as out_f:
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
            print(f"Pexels failed for '{query}': {e}, trying Pixabay...")

    # Fallback to Pixabay
    if PIXABAY_API_KEY:
        queries_to_try = [query]
        words = query.split()
        if len(words) > 2:
            queries_to_try.append(" ".join(words[:2]))
        if len(words) > 1:
            queries_to_try.append(words[0])

        for q in queries_to_try:
            try:
                url = f"https://pixabay.com/api/videos/?key={PIXABAY_API_KEY}&q={urllib.parse.quote(q)}&video_type=film&per_page=15"
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                with urllib.request.urlopen(req, timeout=15) as resp:
                    data = json.loads(resp.read().decode())
                hits = data.get("hits", [])
                for h in hits:
                    v_dict = h.get("videos", {})
                    v_obj = v_dict.get("large") or v_dict.get("medium") or v_dict.get("small")
                    if v_obj and v_obj.get("url"):
                        download_url = v_obj["url"]
                        temp_file = output_path + ".tmp.mp4"
                        dl_req = urllib.request.Request(download_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                        with urllib.request.urlopen(dl_req, timeout=30) as dl_resp, open(temp_file, "wb") as out_f:
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
                        print(f"Downloaded Pixabay video for '{q}' -> {output_path}")
                        return True
            except Exception as e:
                print(f"Pixabay failed for '{q}': {e}")
                
    raise RuntimeError(f"Could not fetch stock video for: {query}")

def verify_clip(path):
    if not os.path.exists(path):
        return False, f"File not found: {path}"
    if os.path.getsize(path) < 1000:
        return False, f"File too small: {path}"
    cmd = ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_name,width,height", "-of", "json", path]
    try:
        res = subprocess.check_output(cmd)
        data = json.loads(res)
        stream = data["streams"][0]
        if stream["codec_name"] != "h264":
            return False, f"Codec is {stream['codec_name']}, expected h264"
        return True, f"{stream['codec_name']} {stream['width']}x{stream['height']}"
    except Exception as e:
        return False, str(e)

def extract_snapshot(video_path, snapshot_path):
    os.makedirs(os.path.dirname(os.path.abspath(snapshot_path)), exist_ok=True)
    cmd = ["ffmpeg", "-y", "-ss", "1.5", "-i", video_path, "-vframes", "1", "-q:v", "3", snapshot_path]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
