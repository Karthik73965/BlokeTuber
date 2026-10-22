import os
import sys
import json
import urllib.request
import urllib.parse

try:
    from dotenv import load_dotenv
    load_dotenv(".env")
    load_dotenv("apps/api/.env")
except ImportError:
    pass

PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")
if not PEXELS_API_KEY:
    # Try reading directly from files
    for p in [".env", "apps/api/.env"]:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("PEXELS_API_KEY="):
                        PEXELS_API_KEY = line.strip().split("=", 1)[1].strip('"').strip("'")

out_dir = os.path.abspath("uploads/raw/proj_fishingtent/stock")
os.makedirs(out_dir, exist_ok=True)

# List of precise queries mapped to chapters
STOCK_QUERIES = [
    # Ch 01: Halifax snow, red tent, cargo van
    ("ch01_snow_city_square", "snow falling on city square winter"),
    ("ch01_red_fabric_tent", "red tent winter snow cold"),
    ("ch01_white_cargo_van", "white cargo van driving winter snow"),
    ("ch01_snow_footsteps", "footsteps in deep snow winter boots"),

    # Ch 02: Homeless census, winter grid blackout, emergency kit
    ("ch02_homeless_shelter_urban", "homeless shelter city winter night"),
    ("ch02_power_lines_ice", "power lines winter storm ice snow"),
    ("ch02_winter_blackout_dark", "dark house window winter cold blizzard"),
    ("ch02_candles_flashlight_table", "candle burning dark room flashlight"),

    # Ch 03: Eskimo Quickfish hub shelter specs & mechanism
    ("ch03_tent_hub_mechanism", "camping tent unfolding mechanism setup"),
    ("ch03_fiberglass_pole_bend", "fiberglass rod flexible bending"),
    ("ch03_carry_bag_shoulder", "carrying duffle bag winter heavy"),
    ("ch03_hands_cold_gloves", "numb hands winter cold gloves"),

    # Ch 04: Insulation physics, quilted walls, condensation
    ("ch04_quilted_fabric_jacket", "quilted fabric texture sewing stitch"),
    ("ch04_synthetic_loft_insulation", "insulation fiber wool close up"),
    ("ch04_frost_glass_freezing", "frost forming on glass window cold"),
    ("ch04_condensation_water_dripping", "water droplets on surface condensation"),
    ("ch04_breath_vapor_cold", "breath vapor cold winter air"),

    # Ch 05: Awake, seated, still, 100W bulb
    ("ch05_seated_winter_chair", "person sitting in folding chair winter"),
    ("ch05_hot_mug_steam_hands", "holding steaming mug coffee winter cold"),
    ("ch05_incandescent_bulb_filament", "incandescent light bulb filament glowing"),
    ("ch05_looking_out_tent_winter", "looking through tent window winter night"),

    # Ch 06: Floor, foam mats, pallets, weights, wind
    ("ch06_foam_mat_tiles", "foam floor tiles puzzle gym"),
    ("ch06_moving_blankets_floor", "heavy blanket folded on ground"),
    ("ch06_cinderblock_sandbag_weight", "sandbags ground weight construction"),
    ("ch06_blizzard_wind_howling", "blizzard snow blowing severe wind"),

    # Ch 07: Heating, propane, carbon monoxide detector, fire
    ("ch07_propane_camping_heater", "propane camping stove blue flame"),
    ("ch07_digital_co_detector", "smoke detector carbon monoxide wall"),
    ("ch07_tent_ventilation_zipper", "zipping tent flap winter window"),
    ("ch07_fire_truck_emergency", "fire truck emergency flashing lights snow"),

    # Ch 08: Red notices, metal fences, PEI, Durango
    ("ch08_red_warning_notice", "warning notice sign paper posted wall"),
    ("ch08_chainlink_metal_fence", "temporary construction metal chainlink fence"),
    ("ch08_hotel_room_solitude", "empty hotel room bed quiet"),
    ("ch08_snowy_hillside_tent", "winter tent camping snowy mountain hillside"),

    # Ch 09: Fishing aisle, recreation label, candles
    ("ch09_sporting_goods_aisle", "outdoor store sporting goods aisle retail"),
    ("ch09_shelf_price_tag", "store shelf price tag label retail"),
    ("ch09_winter_shopping_cart", "shopping cart outside winter retail store"),

    # Ch 10: Halifax dawn, red tent quiet, van driving
    ("ch10_winter_sunrise_city", "winter sunrise frozen city morning dawn"),
    ("ch10_quiet_snowy_morning", "quiet snow covered park morning sunlight"),
    ("ch10_van_driving_morning", "van driving away snowy road morning")
]

def fetch_clip(name, query):
    out_file = os.path.join(out_dir, f"{name}.mp4")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 100000:
        print(f"[EXISTS] {name}")
        return True

    url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&per_page=6&orientation=landscape"
    req = urllib.request.Request(url, headers={
        "Authorization": PEXELS_API_KEY,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            videos = data.get('videos', [])
            if not videos:
                print(f"[NO_RESULTS] {query}")
                return False
            for vid in videos:
                for vf in vid.get('video_files', []):
                    # Prefer 1080p, else 720p
                    if (vf.get('height') or 0) >= 720 and vf.get('link'):
                        link = vf['link']
                        dl_req = urllib.request.Request(link, headers={"User-Agent": "Mozilla/5.0"})
                        with urllib.request.urlopen(dl_req, timeout=15) as dl_resp, open(out_file, 'wb') as out_f:
                            while True:
                                chunk = dl_resp.read(128 * 1024)
                                if not chunk:
                                    break
                                out_f.write(chunk)
                        print(f"[DOWNLOADED] {name} ({os.path.getsize(out_file)/1024/1024:.2f} MB)")
                        return True
    except Exception as e:
        print(f"[ERROR] {name}: {e}")
        return False
    return False

if __name__ == "__main__":
    print(f"Starting fetch of {len(STOCK_QUERIES)} curated stock clips...")
    success = 0
    for name, q in STOCK_QUERIES:
        if fetch_clip(name, q):
            success += 1
    print(f"Finished: {success}/{len(STOCK_QUERIES)} stock clips fetched successfully.")
