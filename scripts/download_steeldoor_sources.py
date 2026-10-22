import os
import sys
import subprocess
import json

SOURCES_DIR = os.path.abspath("uploads/raw/proj_steeldoor/sources")
os.makedirs(SOURCES_DIR, exist_ok=True)

# Curated high-relevance source videos with targeted time sections where appropriate
VIDEOS = [
    # 1. Laurel & Rural Mississippi Aerials / Farm / Woods
    {
        "name": "laurel_ms_drone",
        "url": "https://www.youtube.com/watch?v=M9-EtY2eP4o",
        "section": None # 3:46
    },
    {
        "name": "jasper_county_farm_drone",
        "url": "https://www.youtube.com/watch?v=oWLbdfLAbeo",
        "section": None # 2:52
    },
    {
        "name": "mississippi_8k_scenic",
        "url": "https://www.youtube.com/watch?v=N6bPpfVEkm0",
        "section": None # 1:41
    },
    {
        "name": "rural_mississippi_driving",
        "url": "https://www.youtube.com/watch?v=zBewfUHd74Y",
        "section": "*00:00:00-00:04:00"
    },
    
    # 2. Dollar General & Town Life
    {
        "name": "dollar_general_ms",
        "url": "https://www.youtube.com/watch?v=0dRy6iGowX8",
        "section": "*00:00:00-00:04:00"
    },
    {
        "name": "dollar_general_rural",
        "url": "https://www.youtube.com/watch?v=Jib2iO8HNSU",
        "section": None # 2:16
    },

    # 3. Car Living / Chevy Malibu / Winter Sleeping
    {
        "name": "chevy_malibu_pov",
        "url": "https://www.youtube.com/watch?v=MzEcfF_SRB8",
        "section": "*00:00:30-00:04:30"
    },
    {
        "name": "chevy_malibu_overview",
        "url": "https://www.youtube.com/watch?v=Yh_o-txACtc",
        "section": None # 1:39
    },
    {
        "name": "storm_camping_tiny_car",
        "url": "https://www.youtube.com/watch?v=LNmUcudFCF8",
        "section": "*00:00:00-00:04:30"
    },

    # 4. Port of Gulfport / Container Depots / Used Container Inspection
    {
        "name": "port_gulfport_cranes",
        "url": "https://www.youtube.com/watch?v=uMLHxrlrumg",
        "section": None # 0:59
    },
    {
        "name": "port_gulfport_ship",
        "url": "https://www.youtube.com/watch?v=PzmXwq5LOvM",
        "section": None # 1:04
    },
    {
        "name": "used_container_inspection_andy",
        "url": "https://www.youtube.com/watch?v=VqDsmYWrO6I",
        "section": "*00:00:00-00:04:00"
    },
    {
        "name": "used_container_inspection_quick",
        "url": "https://www.youtube.com/watch?v=NL5UU5huW7E",
        "section": None # 0:56
    },
    {
        "name": "container_depot_yard",
        "url": "https://www.youtube.com/watch?v=MSCLPGpxe-o",
        "section": None # 1:22
    },

    # 5. Container Delivery & Rural Offloading
    {
        "name": "container_delivery_20ft",
        "url": "https://www.youtube.com/watch?v=XsSlbxuRVlw",
        "section": None # 0:48
    },
    {
        "name": "container_delivery_offload",
        "url": "https://www.youtube.com/watch?v=GvEWrqO-_kg",
        "section": None # 2:59
    },

    # 6. Angle Grinder Cutting Corrugated Steel (Sparks, Windows)
    {
        "name": "grinder_cut_container_sparks",
        "url": "https://www.youtube.com/watch?v=7wYBi5TRhfY",
        "section": None # 2:27
    },
    {
        "name": "window_angle_grind_cut",
        "url": "https://www.youtube.com/watch?v=s7njbHhnWLw",
        "section": None # 0:58
    },
    {
        "name": "container_cutting_stages",
        "url": "https://www.youtube.com/watch?v=rLKjHXjC4o8",
        "section": None # 1:07
    },

    # 7. Exterior Door Framing & Installation
    {
        "name": "container_door_frame_hand",
        "url": "https://www.youtube.com/watch?v=bPtM0LlINtQ",
        "section": "*00:00:00-00:04:30"
    },
    {
        "name": "container_install_door_guide",
        "url": "https://www.youtube.com/watch?v=lgxuwmKzvyQ",
        "section": "*00:01:00-00:05:00"
    },
    {
        "name": "habitat_restore_doors",
        "url": "https://www.youtube.com/watch?v=TIESAgMbLZY",
        "section": None # 3:51
    },

    # 8. Insulation: Spray Foam, Rigid Foam, 6-Mil Vapor Barrier, Pallet Walls
    {
        "name": "touch_n_foam_can_app",
        "url": "https://www.youtube.com/watch?v=xv5gbDfxwvs",
        "section": None # 2:46
    },
    {
        "name": "touch_n_foam_pro_kit",
        "url": "https://www.youtube.com/watch?v=iNMthBh2h7Y",
        "section": None # 2:09
    },
    {
        "name": "container_vapor_barrier_guide",
        "url": "https://www.youtube.com/watch?v=UXwkQ6jLqTk",
        "section": "*00:00:00-00:04:00"
    },
    {
        "name": "pallet_walls_tiny_home",
        "url": "https://www.youtube.com/watch?v=K4Qu0Nyu2Rk",
        "section": "*00:00:30-00:04:30"
    },

    # 9. Off-Grid Solar & Car Battery & Rainwater Drums & Stove
    {
        "name": "diy_solar_car_battery_setup",
        "url": "https://www.youtube.com/watch?v=pYSUl9qfkgw",
        "section": None # 5:04
    },
    {
        "name": "rainwater_55gal_drum_setup",
        "url": "https://www.youtube.com/watch?v=6CSE0__qUoU",
        "section": None # 2:28
    },
    {
        "name": "rainwater_barrel_system_homestead",
        "url": "https://www.youtube.com/watch?v=BI6LPNxFPdU",
        "section": "*00:00:30-00:04:30"
    },
    {
        "name": "coleman_camp_stove_demo",
        "url": "https://www.youtube.com/watch?v=1c7wrHm3VOY",
        "section": None # 2:15
    },

    # 10. Container Interior, Cinder Block Raised Garden & Rain on Metal Roof
    {
        "name": "wilson_container_interior_tour",
        "url": "https://www.youtube.com/watch?v=KL7LyXa8jag",
        "section": "*00:00:30-00:05:00"
    },
    {
        "name": "cinder_block_raised_garden",
        "url": "https://www.youtube.com/watch?v=CRyQFNgraOo",
        "section": None # 3:50
    },
    {
        "name": "rain_on_metal_roof_4k",
        "url": "https://www.youtube.com/watch?v=mltbKyCjob8",
        "section": "*00:00:00-00:03:00" # First 3 minutes of 4K rain on metal shed roof
    }
]

print(f"=== DOWNLOADING {len(VIDEOS)} TARGET SOURCES FOR STEEL DOOR DOCUMENTARY ===")

downloaded = 0
skipped = 0

for idx, v in enumerate(VIDEOS, 1):
    out_file = os.path.join(SOURCES_DIR, f"{v['name']}.mp4")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 200000:
        print(f"[{idx}/{len(VIDEOS)}] Skipping {v['name']} (already exists, {os.path.getsize(out_file)//1024} KB)")
        skipped += 1
        continue
    
    print(f"\n[{idx}/{len(VIDEOS)}] Downloading: {v['name']} -> {v['url']}")
    cmd = [
        "yt-dlp", "--js-runtimes", "node",
        "--no-playlist",
        "-f", "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best",
        "--merge-output-format", "mp4",
        "-o", out_file
    ]
    if v.get("section"):
        cmd.extend(["--download-sections", v["section"]])
    
    cmd.append(v["url"])
    
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        if os.path.exists(out_file) and os.path.getsize(out_file) > 100000:
            sz_mb = os.path.getsize(out_file) / (1024 * 1024)
            print(f"  -> SUCCESS: {v['name']}.mp4 ({sz_mb:.1f} MB)")
            downloaded += 1
        else:
            print(f"  -> WARNING: Download command failed or produced empty file: {v['name']}")
            print("  STDERR:", proc.stderr[-200:] if proc.stderr else "None")
    except Exception as e:
        print(f"  -> ERROR: {e}")

print(f"\n=== DOWNLOAD SUMMARY: {downloaded} downloaded, {skipped} skipped, total {len(VIDEOS)} ===")
