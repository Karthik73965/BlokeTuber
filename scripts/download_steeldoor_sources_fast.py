import os
import sys
import subprocess
from concurrent.futures import ThreadPoolExecutor

SOURCES_DIR = os.path.abspath("uploads/raw/proj_steeldoor/sources")
os.makedirs(SOURCES_DIR, exist_ok=True)

# Curated list of targeted YouTube videos (titles & direct URLs)
VIDEOS = [
    # 1. Laurel & Rural MS
    ("mississippi_8k_scenic", "https://www.youtube.com/watch?v=N6bPpfVEkm0"),
    ("dollar_general_rural", "https://www.youtube.com/watch?v=Jib2iO8HNSU"),
    ("dollar_general_ms", "https://www.youtube.com/watch?v=0dRy6iGowX8"),
    
    # 2. Car Living / Chevy Malibu
    ("chevy_malibu_overview", "https://www.youtube.com/watch?v=Yh_o-txACtc"),
    ("chevy_malibu_pov", "https://www.youtube.com/watch?v=u1RtcsRYOI8"),
    ("storm_camping_tiny_car", "https://www.youtube.com/watch?v=LNmUcudFCF8"),
    
    # 3. Port of Gulfport / Container Inspection
    ("port_gulfport_cranes", "https://www.youtube.com/watch?v=uMLHxrlrumg"),
    ("port_gulfport_ship", "https://www.youtube.com/watch?v=PzmXwq5LOvM"),
    ("used_container_inspection_andy", "https://www.youtube.com/watch?v=VqDsmYWrO6I"),
    ("used_container_inspection_quick", "https://www.youtube.com/watch?v=NL5UU5huW7E"),
    ("container_depot_yard", "https://www.youtube.com/watch?v=MSCLPGpxe-o"),
    
    # 4. Delivery & Rural Offloading
    ("container_delivery_20ft", "https://www.youtube.com/watch?v=XsSlbxuRVlw"),
    ("container_delivery_offload", "https://www.youtube.com/watch?v=GvEWrqO-_kg"),
    
    # 5. Cutting Corten Steel with Angle Grinder (Sparks)
    ("grinder_cut_container_sparks", "https://www.youtube.com/watch?v=7wYBi5TRhfY"),
    ("window_angle_grind_cut", "https://www.youtube.com/watch?v=s7njbHhnWLw"),
    ("container_cutting_stages", "https://www.youtube.com/watch?v=rLKjHXjC4o8"),
    
    # 6. Door Installation & Habitat ReStore
    ("container_door_frame_hand", "https://www.youtube.com/watch?v=bPtM0LlINtQ"),
    ("container_install_door_guide", "https://www.youtube.com/watch?v=lgxuwmKzvyQ"),
    ("habitat_restore_doors", "https://www.youtube.com/watch?v=TIESAgMbLZY"),
    
    # 7. Insulation & Pallet Wood
    ("touch_n_foam_can_app", "https://www.youtube.com/watch?v=xv5gbDfxwvs"),
    ("touch_n_foam_pro_kit", "https://www.youtube.com/watch?v=iNMthBh2h7Y"),
    ("container_vapor_barrier_guide", "https://www.youtube.com/watch?v=UXwkQ6jLqTk"),
    ("pallet_walls_tiny_home", "https://www.youtube.com/watch?v=K4Qu0Nyu2Rk"),
    
    # 8. Solar Car Battery & Rainwater & Stove
    ("diy_solar_car_battery_setup", "https://www.youtube.com/watch?v=pYSUl9qfkgw"),
    ("rainwater_55gal_drum_setup", "https://www.youtube.com/watch?v=6CSE0__qUoU"),
    ("coleman_camp_stove_demo", "https://www.youtube.com/watch?v=1c7wrHm3VOY"),
    
    # 9. Finished Interior & Garden Bed
    ("wilson_container_interior_tour", "https://www.youtube.com/watch?v=KL7LyXa8jag"),
    ("cinder_block_raised_garden", "https://www.youtube.com/watch?v=CRyQFNgraOo")
]

def download_one(item):
    name, url = item
    out_file = os.path.join(SOURCES_DIR, f"{name}.mp4")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 100000:
        print(f"[SKIP] {name} already exists ({os.path.getsize(out_file)//1024} KB)")
        return name, "skipped"
        
    print(f"[START] Downloading {name}...")
    cmd = [
        "yt-dlp", "--js-runtimes", "node",
        "--no-playlist",
        "-N", "4",
        "-f", "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best",
        "--merge-output-format", "mp4",
        "-o", out_file,
        url
    ]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if os.path.exists(out_file) and os.path.getsize(out_file) > 50000:
            sz_mb = os.path.getsize(out_file) / (1024 * 1024)
            print(f"[SUCCESS] {name} ({sz_mb:.1f} MB)")
            return name, "success"
        else:
            print(f"[FAIL] {name} - output missing or too small")
            return name, "failed"
    except subprocess.TimeoutExpired:
        print(f"[TIMEOUT] {name} exceeded 120s limit")
        return name, "timeout"
    except Exception as e:
        print(f"[ERROR] {name}: {e}")
        return name, "error"

print(f"=== PARALLEL FAST DOWNLOAD OF {len(VIDEOS)} SOURCES (2 WORKERS, -N 4) ===")
with ThreadPoolExecutor(max_workers=2) as executor:
    results = list(executor.map(download_one, VIDEOS))

print("\n=== DOWNLOAD BATCH COMPLETE ===")
for name, status in results:
    print(f"  {name}: {status}")
