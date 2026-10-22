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
out_dir = os.path.abspath("uploads/raw/proj_fishingtent/stock_expanded")
os.makedirs(out_dir, exist_ok=True)

QUERIES = [
    ("exp_snow_blizzard_trees", "snow storm winter blizzard tree"),
    ("exp_winter_mountain_cold", "freezing winter mountain landscape"),
    ("exp_homeless_man_walking", "homeless man walking winter cold"),
    ("exp_subzero_hands_rubbing", "subzero winter gloves cold hands"),
    ("exp_winter_tent_forest", "winter tent camping mountain forest"),
    ("exp_glowing_lantern_dark", "glowing gas lantern camping dark"),
    ("exp_boots_snow_ice", "winter boots snow ice walking"),
    ("exp_frozen_lake_ice", "frozen lake ice cracked blue"),
    ("exp_red_flashing_warning", "emergency red flashing warning light"),
    ("exp_thermometer_cold", "thermometer subzero cold freezing"),
    ("exp_steam_mug_winter", "steam rising from cup winter cold"),
    ("exp_burning_embers_fire", "fireplace wood burning glowing embers"),
    ("exp_sleeping_bag_camping", "sleeping bag winter camping cozy"),
    ("exp_zipping_winter_jacket", "zipping jacket zipper winter coat"),
    ("exp_blizzard_howling_night", "heavy blizzard howling wind dark night"),
    ("exp_power_grid_sparks", "power grid electrical tower sparks"),
    ("exp_city_skyline_overcast", "city skyline winter overcast gray"),
    ("exp_canvas_military_tent", "canvas tent military winter shelter"),
    ("exp_cardboard_warehouse", "cardboard box flattened warehouse"),
    ("exp_drill_drilling_ice", "drill drilling into hard wood concrete"),
    ("exp_sandbags_barrier", "sandbags stacking flood defense barrier"),
    ("exp_hotel_hallway_empty", "hotel room hallway empty quiet"),
    ("exp_winter_dawn_sunrise", "winter dawn golden sunrise clouds"),
    ("exp_retail_shopping_store", "retail shopping bags store mall"),
    ("exp_supermarket_shelves", "supermarket aisle goods shelves retail"),
    ("exp_hands_warming_fire", "hands warming over fire winter"),
    ("exp_frost_spreading_macro", "frost spreading on ice window macro"),
    ("exp_water_boiling_kettle", "water boiling kettle steam winter"),
    ("exp_puffer_jacket_down", "winter jacket down puffer insulation"),
    ("exp_digital_counter_clock", "digital countdown clock digits display"),
    ("exp_ambulance_winter_snow", "emergency vehicle ambulance snow winter"),
    ("exp_police_tape_barrier", "police line caution barrier tape"),
    ("exp_cargo_truck_snowstorm", "cargo truck highway snow storm"),
    ("exp_city_hall_columns", "city hall government building columns"),
    ("exp_aerial_snowy_city", "aerial view winter snowy city roads"),
    ("exp_dark_house_candle", "dark house interior candle illumination"),
    ("exp_gas_burner_blue_flame", "gas stove flame blue burner kitchen"),
    ("exp_snowy_window_lookout", "person looking out snowy window winter"),
    ("exp_wool_blanket_folded", "heavy wool blanket folded texture"),
    ("exp_camping_backpack_duffle", "camping gear backpack duffle floor"),
    ("exp_icicles_roof_winter", "ice icicles hanging from roof winter"),
    ("exp_snowdrift_road_wind", "winter wind blowing snow drift road"),
    ("exp_flashlight_dark_search", "flashlight beam dark woods search"),
    ("exp_journal_writing_pen", "handwriting in journal pen paper"),
    ("exp_measuring_tape_ruler", "measuring tape metal ruler workshop"),
    ("exp_padlock_gate_chain", "padlock locking chain gate metal"),
    ("exp_snowplow_clearing_road", "snowplow truck clearing snowy road"),
    ("exp_steaming_hot_soup", "hot bowl of soup steaming winter"),
    ("exp_silhouette_snowy_alley", "silhouette person walking dark snowy alley"),
    ("exp_sunrise_snowy_pines", "sunrise over snowy pine forest golden hour")
]

print(f"Starting fetch of {len(QUERIES)} expanded stock clips...", flush=True)

success = 0
for name, q in QUERIES:
    out_file = os.path.join(out_dir, f"{name}.mp4")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 100000:
        print(f"[EXISTS] {name}", flush=True)
        success += 1
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
                        success += 1
                        break
                if downloaded:
                    break
    except Exception as e:
        print(f"[FAIL] {name}: {e}", flush=True)

print(f"Finished: {success}/{len(QUERIES)} expanded stock clips ready in {out_dir}", flush=True)
