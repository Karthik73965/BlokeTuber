import subprocess
import json

QUERIES = [
    # Ch 1 & 2: Laurel MS, Jones County, Dollar General, Rural Woods
    ("ch01_02_laurel_drone", "Laurel Mississippi drone 4k aerial"),
    ("ch01_02_rural_ms_drone", "rural Mississippi pine woods red clay road drone"),
    ("ch01_02_dollar_general", "dollar general exterior rural mississippi"),
    
    # Ch 3: Car living, Chevy Malibu, Church parking lot winter
    ("ch03_car_camping_winter", "living in car winter freezing cold car camping"),
    ("ch03_chevy_malibu", "2006 chevy malibu interior driving"),
    ("ch03_rural_highway_night", "rural highway 15 mississippi night driving"),
    
    # Ch 4: Laurel library, zoning, surplus auction
    ("ch04_laurel_library", "laurel public library mississippi or downtown laurel ms"),
    ("ch04_shipping_container_auction", "shipping container surplus auction depot yard"),
    
    # Ch 5: Gulfport shipping container yard, dented containers
    ("ch05_gulfport_containers", "port of gulfport shipping containers drone"),
    ("ch05_dented_container", "used damaged shipping container buying inspection"),
    
    # Ch 6: Logging flatbed hauling container, rural land handshake
    ("ch06_flatbed_delivery", "shipping container delivery flatbed offload rural"),
    ("ch06_land_clearing", "clearing brush overgrown land mississippi pine"),
    
    # Ch 7: Angle grinder cutting shipping container, Habitat ReStore
    ("ch07_grinder_cutting", "cutting window in shipping container angle grinder sparks"),
    ("ch07_door_install", "installing exterior door shipping container house"),
    ("ch07_habitat_restore", "habitat for humanity restore building materials doors"),
    
    # Ch 8: Spray foam, rigid foam, 6-mil plastic vapor barrier, pallet wood
    ("ch08_spray_foam_cans", "spray foam insulation touch n foam cans DIY"),
    ("ch08_vapor_barrier_container", "shipping container condensation vapor barrier insulation"),
    ("ch08_pallet_wood_wall", "pallet wood wall installation tiny house"),
    
    # Ch 9: Off-grid solar car battery, rainwater collection 55 gal drum
    ("ch09_diy_solar_car_battery", "DIY solar system car battery charge controller 12v"),
    ("ch09_rainwater_55gal", "rainwater collection 55 gallon drum gutter off grid"),
    ("ch09_camp_stove", "two burner propane camp stove cooking off grid"),
    
    # Ch 10: Container tiny house interior tour, pallet bed, desk, garden
    ("ch10_container_interior", "shipping container tiny house interior tour budget pallet"),
    ("ch10_raised_garden_bed", "cinder block raised garden bed vegetables"),
    
    # Ch 11: Rural South poverty, off grid survival, drone Gulf South
    ("ch11_rural_south_drone", "rural Mississippi Alabama landscape drone cinematic 4k"),
    ("ch11_rain_metal_roof", "rain falling on tin metal roof shipping container 4k"),
]

results = {}

for tag, query in QUERIES:
    print(f"Searching: {tag} -> {query}...")
    cmd = [
        "yt-dlp", "--js-runtimes", "node",
        f"ytsearch3:{query}",
        "--dump-json", "--flat-playlist"
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    items = []
    for line in proc.stdout.strip().split("\n"):
        if not line:
            continue
        try:
            d = json.loads(line)
            items.append({
                "id": d.get("id"),
                "title": d.get("title"),
                "uploader": d.get("uploader"),
                "duration": d.get("duration"),
                "url": f"https://www.youtube.com/watch?v={d.get('id')}"
            })
        except:
            pass
    results[tag] = items
    print(f"  Found {len(items)} videos")

with open("scratch/steeldoor_source_candidates.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("\nDone searching! Saved to scratch/steeldoor_source_candidates.json")
