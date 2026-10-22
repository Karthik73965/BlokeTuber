import os
import sys
import json
import urllib.request
import urllib.parse

def load_env(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            for l in f:
                if "=" in l and not l.startswith("#"):
                    k, v = l.strip().split("=", 1)
                    if k.strip() == "PEXELS_API_KEY":
                        return v.strip().strip('"').strip("'")
    return None

key = load_env(".env") or load_env("apps/api/.env")
out_dir = os.path.abspath("uploads/raw/proj_fishingtent/stock")
os.makedirs(out_dir, exist_ok=True)

remaining = [
    ("ch08_red_warning_notice", "warning notice sign"),
    ("ch08_chainlink_metal_fence", "chainlink fence wire mesh"),
    ("ch08_hotel_room_solitude", "empty hotel room bed"),
    ("ch08_snowy_hillside_tent", "winter tent camping snowy mountain"),
    ("ch09_sporting_goods_aisle", "outdoor store aisle"),
    ("ch09_shelf_price_tag", "store shelf price tag"),
    ("ch09_winter_shopping_cart", "shopping cart outside winter"),
    ("ch10_winter_sunrise_city", "winter sunrise city morning"),
    ("ch10_quiet_snowy_morning", "snow covered park morning sunlight"),
    ("ch10_van_driving_morning", "car driving snowy road morning")
]

for name, q in remaining:
    out_file = os.path.join(out_dir, f"{name}.mp4")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 100000:
        print(f"[EXISTS] {name}", flush=True)
        continue
    url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(q)}&per_page=5&orientation=landscape"
    req = urllib.request.Request(url, headers={"Authorization": key, "User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            vids = data.get("videos", [])
            downloaded = False
            for v in vids:
                for vf in v.get("video_files", []):
                    if (vf.get("height") or 0) >= 720 and vf.get("link"):
                        dl_req = urllib.request.Request(vf["link"], headers={"User-Agent": "Mozilla/5.0"})
                        with urllib.request.urlopen(dl_req, timeout=15) as dl_resp, open(out_file, "wb") as out_f:
                            while True:
                                chunk = dl_resp.read(128*1024)
                                if not chunk:
                                    break
                                out_f.write(chunk)
                        print(f"[OK] {name} ({os.path.getsize(out_file)/1024/1024:.2f} MB)", flush=True)
                        downloaded = True
                        break
                if downloaded:
                    break
    except Exception as e:
        print(f"[FAIL] {name}: {e}", flush=True)

print("All remaining stock finished.", flush=True)
