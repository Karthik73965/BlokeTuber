import os
import sys
import json
import urllib.request
import urllib.parse
import subprocess

# Load .env
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

def download_pexels_video(query, output_path, target_duration=5.0):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    if os.path.exists(output_path) and os.path.getsize(output_path) > 100000:
        print(f"Already exists: {output_path}")
        return True
        
    url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&per_page=15&orientation=landscape"
    req = urllib.request.Request(url, headers={"Authorization": PEXELS_API_KEY, "User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        
    videos = data.get("videos", [])
    if not videos:
        print(f"No videos found for query: {query}")
        return False
        
    for v in videos:
        files = v.get("video_files", [])
        # Prefer 1920x1080 or 1280x720
        hd_files = [f for f in files if f.get("width") == 1920 or f.get("width") == 1280]
        if not hd_files:
            hd_files = files
        if hd_files:
            download_url = hd_files[0]["link"]
            temp_file = output_path + ".tmp.mp4"
            file_req = urllib.request.Request(download_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(file_req) as resp, open(temp_file, "wb") as f:
                while True:
                    chunk = resp.read(65536)
                    if not chunk:
                        break
                    f.write(chunk)
            
            # Re-encode clean H.264 with stream loop if needed to cover target_duration
            cmd = [
                "ffmpeg", "-nostdin", "-y",
                "-stream_loop", "3",
                "-i", temp_file,
                "-t", str(target_duration + 1.0),
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
            print(f"Success ({os.path.getsize(output_path)} bytes): {output_path}")
            return True
    return False

if __name__ == "__main__":
    download_pexels_video("winter night parking lot", "temp_scene_catalog/test_winter_night.mp4", 5.0)
