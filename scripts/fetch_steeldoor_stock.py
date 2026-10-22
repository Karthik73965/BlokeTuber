import os
import sys
import json
import urllib.request
import urllib.parse

PEXELS_API_KEY = None
for p in [".env", "apps/api/.env"]:
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("PEXELS_API_KEY="):
                    PEXELS_API_KEY = line.strip().split("=", 1)[1].strip('"').strip("'")
                    break
    if PEXELS_API_KEY:
        break

if not PEXELS_API_KEY:
    print("ERROR: PEXELS_API_KEY not found in .env files!")
    sys.exit(1)

OUT_DIR = os.path.abspath("uploads/raw/proj_steeldoor/stock")
os.makedirs(OUT_DIR, exist_ok=True)

STOCK_QUERIES = [
    # Ch 01
    ("ch01_rural_dirt_road_trees", "dirt road woods pine trees sunlight"),
    ("ch01_pickup_truck_rural", "pickup truck driving rural dirt road"),
    ("ch01_folding_chair_empty", "folding chair inside empty room simple"),
    
    # Ch 02
    ("ch02_cash_money_counting", "counting dollar bills hands cash money"),
    ("ch02_calculator_budget", "calculator pencil paper budget financial math"),
    ("ch02_cashier_scanning", "supermarket cashier scanning groceries retail"),
    ("ch02_eviction_notice_door", "eviction notice paper attached to front door"),
    
    # Ch 03
    ("ch03_homeless_shelter_beds", "homeless shelter beds empty room institutional"),
    ("ch03_motel_neon_sign", "motel sign night neon glowing roadside"),
    ("ch03_car_backseat_blankets", "blankets in car backseat cold winter night"),
    ("ch03_breath_cold_vapor", "breath vapor cold winter night air"),
    ("ch03_night_highway_driving", "driving night empty rural highway headlights"),
    
    # Ch 04
    ("ch04_food_pantry_shelves", "food pantry canned goods shelf volunteer"),
    ("ch04_rural_gas_station", "rural gas station pumps dusk night country"),
    ("ch04_library_books_reading", "public library reading books quiet desk"),
    ("ch04_computer_research", "person typing on computer keyboard screen research"),
    
    # Ch 05
    ("ch05_shipping_containers_yard", "shipping containers stacked harbor industrial port"),
    ("ch05_dented_metal_rust", "rusted corrugated metal sheet texture industrial"),
    ("ch05_plywood_floor_surface", "wooden plywood floor board texture woodgrain"),
    
    # Ch 06
    ("ch06_overgrown_rural_land", "overgrown field brush tall grass countryside"),
    ("ch06_elderly_farmer_porch", "elderly man sitting on wooden porch farm"),
    ("ch06_handshake_agreement", "two men shaking hands outdoor agreement deal"),
    ("ch06_red_clay_soil", "red dirt soil ground earth rural road"),
    
    # Ch 07
    ("ch07_measuring_tape_metal", "measuring tape measuring steel metal line"),
    ("ch07_welding_gloves_tools", "hands wearing heavy leather work gloves tools"),
    ("ch07_safety_glasses_eyes", "wearing safety glasses workshop face protection"),
    ("ch07_exterior_door_handle", "exterior residential door handle opening entrance"),
    
    # Ch 08
    ("ch08_construction_dumpster", "construction dumpster trash renovation debris"),
    ("ch08_utility_knife_cutting", "utility knife cutting insulation board foam"),
    ("ch08_plastic_sheeting_staple", "plastic sheeting moisture barrier construction wall"),
    ("ch08_pallet_wood_texture", "reclaimed pallet wood planks rustic wall"),
    ("ch08_water_condensation", "water condensation droplets cold glass metal"),
    
    # Ch 09
    ("ch09_solar_panel_sunlight", "solar panels ground mount shining sunlight sky"),
    ("ch09_car_battery_cables", "car battery jumper cables terminals copper wire"),
    ("ch09_blue_water_drum", "blue plastic water barrel drum rainwater garden"),
    ("ch09_rain_gutter_downspout", "rain gutter roof downspout clean water pouring"),
    ("ch09_camp_stove_blue_flame", "camping gas stove blue flame burning burner"),
    ("ch09_led_strip_light_glow", "warm led light strip glowing dark room cozy"),
    
    # Ch 10
    ("ch10_canned_food_shelf", "organized pantry shelf spices canned food wood"),
    ("ch10_child_drawing_crayons", "child drawing with crayons on paper desk"),
    ("ch10_homework_desk_lamp", "student doing homework notebook desk warm light"),
    ("ch10_raised_garden_tomatoes", "raised garden bed vegetables tomato plants sun"),
    ("ch10_wooden_porch_sunset", "wooden porch rocking chair peaceful countryside sunset"),
    
    # Ch 11
    ("ch11_rural_church_country", "rural church white wooden country road trees"),
    ("ch11_napkin_sketch_diagram", "hand sketching diagram pencil on paper napkin"),
    ("ch11_rain_on_metal_roof", "heavy rain falling on metal tin roof slow motion"),
    ("ch11_pine_forest_sunset", "pine forest trees golden hour sunset aerial cinematic")
]

print(f"=== FETCHING {len(STOCK_QUERIES)} CURATED STOCK CLIPS FROM PEXELS API ===")

headers = {
    "Authorization": PEXELS_API_KEY,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

fetched = 0
skipped = 0

for idx, (stem, query) in enumerate(STOCK_QUERIES, 1):
    out_file = os.path.join(OUT_DIR, f"{stem}.mp4")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 100000:
        print(f"[{idx}/{len(STOCK_QUERIES)}] Skipping {stem} (already exists)")
        skipped += 1
        continue
        
    print(f"[{idx}/{len(STOCK_QUERIES)}] Searching: '{query}' -> {stem}.mp4...")
    url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&orientation=landscape&size=medium&per_page=5"
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            videos = data.get("videos", [])
            if not videos:
                print(f"  -> No videos found for query: {query}")
                continue
            
            # Select best HD landscape file
            best_file_url = None
            for v in videos:
                files = v.get("video_files", [])
                # Prefer 1920x1080 mp4
                f1080 = [f for f in files if f.get("width") == 1920 and f.get("file_type") == "video/mp4"]
                if f1080:
                    best_file_url = f1080[0]["link"]
                    break
                f720 = [f for f in files if f.get("width") == 1280 and f.get("file_type") == "video/mp4"]
                if f720:
                    best_file_url = f720[0]["link"]
                    break
                if files and files[0].get("link"):
                    best_file_url = files[0]["link"]
                    break
                    
            if not best_file_url:
                print(f"  -> No valid download link for {query}")
                continue
                
            dl_req = urllib.request.Request(best_file_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(dl_req, timeout=30) as dl_resp, open(out_file, "wb") as out_fp:
                out_fp.write(dl_resp.read())
                
            sz_kb = os.path.getsize(out_file) // 1024
            print(f"  -> SAVED: {stem}.mp4 ({sz_kb} KB)")
            fetched += 1
    except Exception as e:
        print(f"  -> ERROR fetching {query}: {e}")

print(f"\n=== STOCK FETCH COMPLETE: {fetched} fetched, {skipped} skipped, total {len(STOCK_QUERIES)} ===")
