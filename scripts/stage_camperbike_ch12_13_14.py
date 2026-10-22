import os
import sys
import json
import subprocess

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = os.path.abspath(".")

RAW_SOURCES = {
    "nomad": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "paul_elkins_nomad.mp4"),
    "kirsten": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "kirsten_elkins_150.mp4"),
    "drew": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "drew_builds_stuff.mp4"),
    "homeless": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "beneath_bridges_homeless.mp4"),
    "designs7": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "beneath_bridges_7campers.mp4"),
}

def ensure_slice(source_key, start_time, duration, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    if os.path.exists(output_path) and os.path.getsize(output_path) > 50000:
        return output_path
    
    src_file = RAW_SOURCES.get(source_key)
    if not src_file or not os.path.exists(src_file):
        raise FileNotFoundError(f"Source file not found: {source_key} -> {src_file}")
    
    # Broadcast clean filters:
    # Kirsten, homeless, designs7: crop bottom 12% to remove subtitles / faircompanies logo
    # Drew: crop top 12% to remove /drewbuildsstuff watermark
    # Nomad: direct scale and crop to 16:9 1080p
    if source_key in ["kirsten", "homeless", "designs7"]:
        vf = "crop=in_w:in_h*0.88:0:0,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    elif source_key == "drew":
        vf = "crop=in_w:in_h*0.88:0:in_h*0.12,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
    else:
        vf = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"

    cmd = [
        "ffmpeg", "-nostdin", "-y",
        "-ss", str(start_time),
        "-i", src_file,
        "-t", str(duration),
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-an",
        output_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Sliced {source_key} [{start_time}s, {duration}s] -> {os.path.basename(output_path)}")
    return output_path

# Chapter 12 Beats
ch12_data = {
    "chapterIndex": 12,
    "title": "The Honest Part: Knives, Fire, Condensation & Moral Hazard",
    "audio": os.path.join(REPO_ROOT, "uploads", "audio", "camperbike", "ch12_honest_part.mp3"),
    "timeline": os.path.join(REPO_ROOT, "uploads", "timelines", "camperbike", "chapter_12_final.json"),
    "snapshot_dir": os.path.join(REPO_ROOT, "uploads", "beat_snapshots", "camperbike_ch12"),
    "totalDuration": 144.327,
    "beats": [
        {
            "beatIndex": 0,
            "startTime": 0.00,
            "endTime": 3.54,
            "text": "Here's the case against this thing, and it's a real case.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_homeless_encampment.mp4"),
        },
        {
            "beatIndex": 1,
            "startTime": 3.54,
            "endTime": 8.26,
            "text": "There's no toilet, no shower, no running water, no refrigeration.",
            "sourceType": "slice",
            "source": "nomad",
            "start": 254.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch12_beat01_nomad_pantry_sink.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "BASIC AMENITY DEFICIT",
                "line2": "NO RUNNING WATER • NO REFRIGERATION",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 2,
            "startTime": 8.26,
            "endTime": 12.52,
            "text": "The bike camper has a jug, and that's the extent of the plumbing.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_morning_coffee.mp4"),
        },
        {
            "beatIndex": 3,
            "startTime": 12.52,
            "endTime": 21.36,
            "text": "The lock is more symbolic than real, and the sharpest version of that criticism came from a reader responding to the design directly.",
            "sourceType": "slice",
            "source": "drew",
            "start": 1105.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch12_beat03_drew_door_latch.mp4"),
        },
        {
            "beatIndex": 4,
            "startTime": 21.36,
            "endTime": 26.64,
            "text": "A padlock is a little ridiculous when a pocket knife American hideaways on page 10",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_utility_knife_cut.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "SECURITY VULNERABILITY",
                "line2": "PLASTIC WALL CUT WITH POCKET KNIFE",
                "themeColor": "cyan"
            }
        },
        {
            "beatIndex": 5,
            "startTime": 26.64,
            "endTime": 33.58,
            "text": "or a pair of wire cutters gets you through the entire wall in about four seconds. That's completely true.",
            "sourceType": "slice",
            "source": "nomad",
            "start": 150.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch12_beat05_nomad_hole_punch.mp4"),
        },
        {
            "beatIndex": 6,
            "startTime": 33.58,
            "endTime": 39.04,
            "text": "What the bolt stops is the opportunist and the drunk stranger. It stops nothing else.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_barrel_bolt_lock.mp4"),
        },
        {
            "beatIndex": 7,
            "startTime": 39.04,
            "endTime": 45.74,
            "text": "Then there's fire. Anything with a flame inside a small sealed plastic box is dangerous.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_fire_flame_stove.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "COMBUSTION & ASPHYXIATION",
                "line2": "CARBON MONOXIDE & OPEN FLAME RISK",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 8,
            "startTime": 45.74,
            "endTime": 52.04,
            "text": "And this is where people actually die. Carbon monoxide has no smell and gives no warning.",
            "sourceType": "slice",
            "source": "kirsten",
            "start": 290.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch12_beat08_kirsten_counter_stove.mp4"),
        },
        {
            "beatIndex": 9,
            "startTime": 52.04,
            "endTime": 58.18,
            "text": "In an enclosed space with a burning stove or heater, it kills quietly and quickly.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_stove_cooking.mp4"),
        },
        {
            "beatIndex": 10,
            "startTime": 58.18,
            "endTime": 65.46,
            "text": "Vents high and low are not optional. Nobody should ever run a propane heater while sleeping in one of these,",
            "sourceType": "slice",
            "source": "nomad",
            "start": 240.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch12_beat10_nomad_skylight_vent.mp4"),
        },
        {
            "beatIndex": 11,
            "startTime": 65.46,
            "endTime": 69.68,
            "text": "or in a camper or in a car. People have died learning that.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_bridge_overpass.mp4"),
        },
        {
            "beatIndex": 12,
            "startTime": 69.68,
            "endTime": 76.16,
            "text": "And there's condensation, which isn't a design flaw, it's physics. You breathe all night.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_window_condensation.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "THERMAL DEFICIT",
                "line2": "CONDENSATION PHYSICS & HYPOTHERMIA",
                "themeColor": "cyan"
            }
        },
        {
            "beatIndex": 13,
            "startTime": 76.16,
            "endTime": 82.00,
            "text": "That moisture hits a plastic wall that's freezing on the other side, and it condenses.",
            "sourceType": "slice",
            "source": "nomad",
            "start": 35.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch12_beat13_nomad_curved_wall.mp4"),
        },
        {
            "beatIndex": 14,
            "startTime": 82.00,
            "endTime": 87.04,
            "text": "If the vent is shut, it rains back down on you by morning, and your sleeping bag gets damp.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_freezing_rain.mp4"),
        },
        {
            "beatIndex": 15,
            "startTime": 87.04,
            "endTime": 93.44,
            "text": "And damp in December is how hypothermia starts. Warm and dry are not the same problem.",
            "sourceType": "slice",
            "source": "homeless",
            "start": 120.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch12_beat15_bridges_winter_tarp.mp4"),
        },
        {
            "beatIndex": 16,
            "startTime": 93.44,
            "endTime": 96.96,
            "text": "This design solves the first much better than the second.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_frost_morning.mp4"),
        },
        {
            "beatIndex": 17,
            "startTime": 96.96,
            "endTime": 103.00,
            "text": "And then there's the argument from inside the homelessness sector. The one worth taking seriously.",
            "sourceType": "slice",
            "source": "drew",
            "start": 60.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch12_beat17_drew_wood_framing.mp4"),
        },
        {
            "beatIndex": 18,
            "startTime": 103.00,
            "endTime": 111.36,
            "text": "If the public sees people neatly tucked into small pods, the visible pressure that forces cities to build real housing goes down.",
            "sourceType": "slice",
            "source": "designs7",
            "start": 40.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch12_beat18_designs7_pushcart.mp4"),
        },
        {
            "beatIndex": 19,
            "startTime": 111.36,
            "endTime": 115.24,
            "text": "A temporary patch quietly becomes the permanent plan.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_courthouse_gavel.mp4"),
        },
        {
            "beatIndex": 20,
            "startTime": 115.24,
            "endTime": 121.86,
            "text": "And $150 object becomes the excuse for never building the $300,000 one.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_dollar_cash.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "HOUSING POLICY MORAL HAZARD",
                "line2": "THE $150 BAND-AID VS $300,000 HOUSING",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 21,
            "startTime": 121.86,
            "endTime": 128.26,
            "text": "Elkins doesn't oversell any of this. He framed the bike camper as an option for people who can't afford a pickup",
            "sourceType": "slice",
            "source": "nomad",
            "start": 120.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch12_beat21_nomad_frame_wheels.mp4"),
        },
        {
            "beatIndex": 22,
            "startTime": 128.26,
            "endTime": 133.98,
            "text": "and a tiny house on a trailer, and for adventurers who don't mind pulling a little weight.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_cyclist_pedaling.mp4"),
        },
        {
            "beatIndex": 23,
            "startTime": 133.98,
            "endTime": 139.54,
            "text": "Travel, not rescue. His own summary of the appeal was a shrug at a spreadsheet.",
            "sourceType": "slice",
            "source": "kirsten",
            "start": 690.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch12_beat23_kirsten_nosecone.mp4"),
        },
        {
            "beatIndex": 24,
            "startTime": 139.54,
            "endTime": 144.327,
            "text": "No car insurance, no home insurance. So what do you have left food?",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_sunrise_highway.mp4"),
        }
    ]
}

# Chapter 13 Beats
ch13_data = {
    "chapterIndex": 13,
    "title": "What It's Actually For: Surviving February Nights",
    "audio": os.path.join(REPO_ROOT, "uploads", "audio", "camperbike", "ch13_what_its_actually_for.mp3"),
    "timeline": os.path.join(REPO_ROOT, "uploads", "timelines", "camperbike", "chapter_13_final.json"),
    "snapshot_dir": os.path.join(REPO_ROOT, "uploads", "beat_snapshots", "camperbike_ch13"),
    "totalDuration": 79.726,
    "beats": [
        {
            "beatIndex": 0,
            "startTime": 0.00,
            "endTime": 5.66,
            "text": "So hold both things at once. This is not housing, and it never claimed to be.",
            "sourceType": "slice",
            "source": "kirsten",
            "start": 15.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch13_beat00_kirsten_grass_tow.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "INTERIM SURVIVAL REALITY",
                "line2": "NOT PERMANENT HOUSING • SURVIVAL SHELTER",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 1,
            "startTime": 5.66,
            "endTime": 11.84,
            "text": "Nobody serious calls a plastic shell a solution. But the argument over permanent affordable housing",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_homeless_encampment.mp4"),
        },
        {
            "beatIndex": 2,
            "startTime": 11.84,
            "endTime": 19.98,
            "text": "has been running longer than some of the people sleeping outside tonight have been alive, and it is not concluding this winter.",
            "sourceType": "slice",
            "source": "homeless",
            "start": 11.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch13_beat02_bridges_snow_camper.mp4"),
        },
        {
            "beatIndex": 3,
            "startTime": 19.98,
            "endTime": 25.50,
            "text": "American hideaways. Page 11. Permanent housing takes years.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_courthouse_gavel.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "MUNICIPAL TIMELINE",
                "line2": "PERMANENT HOUSING TAKES YEARS TO PERMIT",
                "themeColor": "cyan"
            }
        },
        {
            "beatIndex": 4,
            "startTime": 25.50,
            "endTime": 32.32,
            "text": "A cold, wet night takes about eight hours to kill somebody. A tiny house needs land, land needs permits,",
            "sourceType": "slice",
            "source": "designs7",
            "start": 185.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch13_beat04_designs7_teardrop.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "EXPOSURE RISK THRESHOLD",
                "line2": "A FREEZING FEBRUARY NIGHT TAKES 8 HOURS",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 5,
            "startTime": 32.32,
            "endTime": 38.46,
            "text": "permits need hearings, hearings need neighbors to agree, and neighbors generally don't.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_engineer_drafting.mp4"),
        },
        {
            "beatIndex": 6,
            "startTime": 38.46,
            "endTime": 42.92,
            "text": "Even a village can take years and a great deal of money to open.",
            "sourceType": "slice",
            "source": "drew",
            "start": 170.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch13_beat06_drew_jigsaw_framing.mp4"),
        },
        {
            "beatIndex": 7,
            "startTime": 42.92,
            "endTime": 48.90,
            "text": "Four sheets of plastic and a second hand bike take a weekend and need permission from nobody.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_hardware_lumber.mp4"),
        },
        {
            "beatIndex": 8,
            "startTime": 48.90,
            "endTime": 53.32,
            "text": "Against an apartment, this loses on every measure that exists.",
            "sourceType": "slice",
            "source": "kirsten",
            "start": 30.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch13_beat08_kirsten_foil_interior.mp4"),
        },
        {
            "beatIndex": 9,
            "startTime": 53.32,
            "endTime": 59.52,
            "text": "Against a tent in February, it isn't close. The gap is measured in whether somebody is still there",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_freezing_rain.mp4"),
        },
        {
            "beatIndex": 10,
            "startTime": 59.52,
            "endTime": 66.42,
            "text": "in March, and it scales in a way nothing else on this list does because the design was given away.",
            "sourceType": "slice",
            "source": "nomad",
            "start": 28.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch13_beat10_nomad_cutting_darts.mp4"),
        },
        {
            "beatIndex": 11,
            "startTime": 66.42,
            "endTime": 73.80,
            "text": "A stack 50 inches high makes 50 of these. The plans cost $20, and anyone can buy them.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_dollar_cash.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "RADICAL EFFICIENCY",
                "line2": "50 SHEETS OF PLASTIC = 50 HOMES",
                "themeColor": "cyan"
            }
        },
        {
            "beatIndex": 12,
            "startTime": 73.80,
            "endTime": 79.726,
            "text": "There's no factory, no waiting list, no procurement process, no city council vote.",
            "sourceType": "slice",
            "source": "drew",
            "start": 660.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch13_beat12_drew_white_panels.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "ZERO BUREAUCRACY",
                "line2": "NO PROCUREMENT • NO CITY COUNCIL VOTE",
                "themeColor": "gold"
            }
        }
    ]
}

# Chapter 14 Beats
ch14_data = {
    "chapterIndex": 14,
    "title": "Closing: Legacy & Inflatable Heat Shelters",
    "audio": os.path.join(REPO_ROOT, "uploads", "audio", "camperbike", "ch14_closing.mp3"),
    "timeline": os.path.join(REPO_ROOT, "uploads", "timelines", "camperbike", "chapter_14_final.json"),
    "snapshot_dir": os.path.join(REPO_ROOT, "uploads", "beat_snapshots", "camperbike_ch14"),
    "totalDuration": 114.103,
    "beats": [
        {
            "beatIndex": 0,
            "startTime": 0.00,
            "endTime": 5.84,
            "text": "So let's go back to that white shape between the pillars, seven feet long, 60 pounds,",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_bridge_overpass.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "THE URBAN MONOLITH",
                "line2": "THE WHITE SHAPE BETWEEN THE PILLARS",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 1,
            "startTime": 5.84,
            "endTime": 10.08,
            "text": "no toilet, no water, no address, no legal standing.",
            "sourceType": "slice",
            "source": "nomad",
            "start": 130.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch14_beat01_nomad_frame_grass.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "MICRO POD SPECIFICATIONS",
                "line2": "7 FT LONG • 60 LBS • $150",
                "themeColor": "cyan"
            }
        },
        {
            "beatIndex": 2,
            "startTime": 10.08,
            "endTime": 16.62,
            "text": "Made from the same yard signs that were promising better things a few months ago and are now landfill.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_street_sweeper.mp4"),
        },
        {
            "beatIndex": 3,
            "startTime": 16.62,
            "endTime": 21.62,
            "text": "By every standard the housing market uses, it doesn't even register as a dwelling",
            "sourceType": "slice",
            "source": "drew",
            "start": 410.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch14_beat03_drew_foam_insulation.mp4"),
        },
        {
            "beatIndex": 4,
            "startTime": 21.62,
            "endTime": 26.24,
            "text": "and yet the man inside it slept. The rain stayed outside.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_warm_sleep.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "PSYCHOLOGICAL RECOVERY",
                "line2": "UNBROKEN NIGHT OF REST",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 5,
            "startTime": 26.24,
            "endTime": 31.84,
            "text": "His documents are dry in a plastic tub under the bed. Nobody walked up on him in the dark",
            "sourceType": "slice",
            "source": "homeless",
            "start": 255.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch14_beat05_bridges_possessions.mp4"),
        },
        {
            "beatIndex": 6,
            "startTime": 31.84,
            "endTime": 36.96,
            "text": "and in an hour he'll slide back a $2 bolt step out into the frost,",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_barrel_bolt_lock.mp4"),
        },
        {
            "beatIndex": 7,
            "startTime": 36.96,
            "endTime": 41.92,
            "text": "hook the tow bar to a $20 bicycle and move his entire house across town",
            "sourceType": "slice",
            "source": "kirsten",
            "start": 425.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch14_beat07_kirsten_hitch.mp4"),
        },
        {
            "beatIndex": 8,
            "startTime": 41.92,
            "endTime": 48.66,
            "text": "before anybody has the chance to complain about it. Paul Elkins never set out to solve homelessness.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_cyclist_pedaling.mp4"),
        },
        {
            "beatIndex": 9,
            "startTime": 48.66,
            "endTime": 56.64,
            "text": "He's never claimed he could. He asked one narrow question, what shape could you get by bending a plastic sheet lengthwise?",
            "sourceType": "slice",
            "source": "nomad",
            "start": 160.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch14_beat09_nomad_ziptie_drill.mp4"),
        },
        {
            "beatIndex": 10,
            "startTime": 56.64,
            "endTime": 63.36,
            "text": "And then he did the unusual thing before designing anything of his own. He read two books about the shelter's homeless people",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_eggshell_curve.mp4"),
        },
        {
            "beatIndex": 11,
            "startTime": 63.36,
            "endTime": 68.72,
            "text": "had already built for themselves. American Hideaways, page 12.",
            "sourceType": "slice",
            "source": "designs7",
            "start": 355.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch14_beat11_designs7_storage.mp4"),
        },
        {
            "beatIndex": 12,
            "startTime": 68.72,
            "endTime": 76.26,
            "text": "The answer to his question turned out to be a house that holds itself up, weighs 60 pounds, costs $150",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_sunrise_highway.mp4"),
        },
        {
            "beatIndex": 13,
            "startTime": 76.26,
            "endTime": 82.00,
            "text": "and can be peddled away from a clearance crew. If you want more true stories about ordinary people",
            "sourceType": "slice",
            "source": "drew",
            "start": 1410.0,
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "slices", "ch14_beat13_drew_axle_wheels.mp4"),
        },
        {
            "beatIndex": 14,
            "startTime": 82.00,
            "endTime": 88.32,
            "text": "solving problems, the system has been stuck on for decades, subscribe to American Hideaways.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_deep_sleep_dream.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "DISPATCHES FROM THE MARGINS",
                "line2": "SUBSCRIBE TO AMERICAN HIDEAWAYS",
                "themeColor": "gold"
            }
        },
        {
            "beatIndex": 15,
            "startTime": 88.32,
            "endTime": 94.36,
            "text": "Because next week we're going to Manhattan where an artist realized that every office building in the city",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_manhattan_winter_street.mp4"),
            "callout": {
                "type": "editorial_lower_third",
                "line1": "NEXT WEEK PREVIEW",
                "line2": "NEXT WEEK: NYC INFLATABLE STEAM SHELTER",
                "themeColor": "cyan"
            }
        },
        {
            "beatIndex": 16,
            "startTime": 94.36,
            "endTime": 101.30,
            "text": "pumps thousands of cubic feet of heated air into the street all winter and just throws it away.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_winter_subway_steam.mp4"),
        },
        {
            "beatIndex": 17,
            "startTime": 101.30,
            "endTime": 106.48,
            "text": "And he built a shelter out of five dollars of trash bags that plugs straight into the vent.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_plastic_tarp.mp4"),
        },
        {
            "beatIndex": 18,
            "startTime": 106.48,
            "endTime": 114.103,
            "text": "The building inflates it, the building heats it and the building has no idea anybody is out there. We'll see you there.",
            "sourceType": "stock",
            "file": os.path.join(REPO_ROOT, "uploads", "raw", "proj_camperbike", "stock", "stock_nyc_steam_vent.mp4"),
        }
    ]
}

def stage_and_validate(chapter_data):
    ch_idx = chapter_data["chapterIndex"]
    print(f"\n=======================================================")
    print(f"STAGING CHAPTER {ch_idx}: {chapter_data['title']}")
    print(f"=======================================================")
    
    os.makedirs(chapter_data["snapshot_dir"], exist_ok=True)
    os.makedirs(os.path.dirname(chapter_data["timeline"]), exist_ok=True)
    
    clips = []
    prev_source = None
    
    for beat in chapter_data["beats"]:
        b_idx = beat["beatIndex"]
        st = beat["startTime"]
        et = beat["endTime"]
        dur = round(et - st, 3)
        
        # 1. Prepare video file
        if beat["sourceType"] == "slice":
            src = beat["source"]
            if src == prev_source:
                raise ValueError(f"Anti-YouTube Dump Guard Violation at Beat {b_idx}: consecutive slices from '{src}'!")
            prev_source = src
            slice_dur = max(dur + 1.5, 6.0)
            clip_path = ensure_slice(src, beat["start"], slice_dur, beat["file"])
        else:
            prev_source = None
            clip_path = beat["file"]
            if not os.path.exists(clip_path):
                raise FileNotFoundError(f"Stock clip missing: {clip_path}")
                
        # 2. Probe video file
        probe_cmd = [
            "ffprobe", "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=codec_name,width,height,duration",
            "-of", "json",
            clip_path
        ]
        probe_res = subprocess.check_output(probe_cmd)
        probe_json = json.loads(probe_res)
        stream = probe_json["streams"][0]
        codec = stream.get("codec_name")
        w = int(stream.get("width"))
        h = int(stream.get("height"))
        file_dur = float(stream.get("duration", 0))
        
        if codec != "h264":
            raise ValueError(f"Beat {b_idx}: {clip_path} codec is {codec}, expected h264!")
        if file_dur < dur - 0.2:
            raise ValueError(f"Beat {b_idx}: {clip_path} duration {file_dur:.2f}s is shorter than beat {dur:.2f}s!")
            
        # 3. Extract 50% midpoint snapshot
        mid_point = round(dur / 2.0, 3)
        snap_path = os.path.join(chapter_data["snapshot_dir"], f"beat_{b_idx:02d}.jpg")
        snap_cmd = [
            "ffmpeg", "-nostdin", "-y",
            "-ss", str(mid_point),
            "-i", clip_path,
            "-vframes", "1",
            "-q:v", "2",
            snap_path
        ]
        subprocess.run(snap_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        if not os.path.exists(snap_path) or os.path.getsize(snap_path) == 0:
            raise RuntimeError(f"Beat {b_idx}: failed snapshot at {snap_path}")
            
        # 4. Construct clip object
        clip_obj = {
            "beatIndex": b_idx,
            "chapterIndex": ch_idx,
            "text": beat["text"],
            "startTime": st,
            "endTime": et,
            "duration": dur,
            "clipPath": clip_path,
            "mediaType": "video",
            "layout": "full_bleed_cinematic",
            "kenBurns": True,
            "transitionType": "cut",
            "transitionDuration": 0,
        }
        if "callout" in beat:
            clip_obj["callout"] = beat["callout"]
            
        clips.append(clip_obj)
        callout_str = f" [CALLOUT: {beat['callout']['line2']}]" if 'callout' in beat else ""
        print(f"  Beat {b_idx:02d} [{st:6.2f} - {et:6.2f}] ({dur:4.2f}s) -> {os.path.basename(clip_path)}{callout_str}")

    # Build final timeline
    timeline_dict = {
        "masterAudioPath": chapter_data["audio"],
        "totalDuration": chapter_data["totalDuration"],
        "clips": clips
    }
    
    with open(chapter_data["timeline"], "w", encoding="utf-8") as f:
        json.dump(timeline_dict, f, indent=2)
    print(f"\nWritten {len(clips)} beats to {chapter_data['timeline']}")
    return timeline_dict

def main():
    tl12 = stage_and_validate(ch12_data)
    tl13 = stage_and_validate(ch13_data)
    tl14 = stage_and_validate(ch14_data)
    
    # Sync to store files
    stores = [
        os.path.join(REPO_ROOT, "output", "store", "projects.json"),
        os.path.join(REPO_ROOT, "apps", "api", "output", "store", "projects.json")
    ]
    
    for s_path in stores:
        if not os.path.exists(s_path):
            continue
        with open(s_path, "r", encoding="utf-8") as f:
            projects = json.load(f)
            
        matched = False
        for p in projects:
            if p.get("id") == "proj_camperbike_hideaways":
                matched = True
                for ch in p.get("chapters", []):
                    idx = ch.get("chapterIndex")
                    if idx == 12:
                        ch["timelineFile"] = ch12_data["timeline"]
                        ch["timelineJson"] = tl12
                        ch["status"] = "staged"
                    elif idx == 13:
                        ch["timelineFile"] = ch13_data["timeline"]
                        ch["timelineJson"] = tl13
                        ch["status"] = "staged"
                    elif idx == 14:
                        ch["timelineFile"] = ch14_data["timeline"]
                        ch["timelineJson"] = tl14
                        ch["status"] = "staged"
        if matched:
            with open(s_path, "w", encoding="utf-8") as f:
                json.dump(projects, f, indent=2)
            print(f"Synced timelines to {s_path}")
        else:
            print(f"Warning: proj_camperbike_hideaways not found in {s_path}")

if __name__ == "__main__":
    main()
