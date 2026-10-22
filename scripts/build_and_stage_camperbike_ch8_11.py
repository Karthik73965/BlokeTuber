import os
import sys
import json
import subprocess

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def abs_path(rel_path):
    return os.path.normpath(os.path.join(REPO_ROOT, rel_path)).replace("\\", "/")

def get_media_duration(path):
    cmd = ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", path]
    res = subprocess.check_output(cmd)
    data = json.loads(res)
    return float(data["format"]["duration"])

CH8_AUDIO = abs_path("uploads/audio/camperbike/ch08_bolt.mp3")
CH9_AUDIO = abs_path("uploads/audio/camperbike/ch09_wheels.mp3")
CH10_AUDIO = abs_path("uploads/audio/camperbike/ch10_stove.mp3")
CH11_AUDIO = abs_path("uploads/audio/camperbike/ch11_why_beds_stay_empty.mp3")

CH8_DUR = get_media_duration(CH8_AUDIO)
CH9_DUR = get_media_duration(CH9_AUDIO)
CH10_DUR = get_media_duration(CH10_AUDIO)
CH11_DUR = get_media_duration(CH11_AUDIO)

print(f"Ch 08 Audio Duration: {CH8_DUR:.6f}s")
print(f"Ch 09 Audio Duration: {CH9_DUR:.6f}s")
print(f"Ch 10 Audio Duration: {CH10_DUR:.6f}s")
print(f"Ch 11 Audio Duration: {CH11_DUR:.6f}s")

# Chapter 08 Beats definition
CH08_BEATS = [
    {
        "text": "Okay, now to the three things that actually matter.",
        "startTime": 0.0,
        "endTime": 3.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_cyclist_pedaling.mp4")
    },
    {
        "text": "And the first one is going to sound too small to count.",
        "startTime": 3.50,
        "endTime": 7.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/kirsten_ch08_towing_park.mp4")
    },
    {
        "text": "It's a barrel bolt, two dollars. At any hardware store.",
        "startTime": 7.00,
        "endTime": 11.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/clean_camper_barrel_bolt_macro.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "$2 HARDWARE BARREL BOLT",
            "line2": "STANDARD HARDWARE STORE PURCHASE",
            "themeColor": "gold"
        }
    },
    {
        "text": "On a build that costs 150, the single most important component",
        "startTime": 11.50,
        "endTime": 15.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/bridges_ch08_door_latch_clean.mp4")
    },
    {
        "text": "is about one and a half percent of the total. Here's why.",
        "startTime": 15.50,
        "endTime": 20.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_dollar_cash.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "1.5% OF TOTAL BUILD COST",
            "line2": "$2 OF A $150 TOTAL CAMPER",
            "themeColor": "cyan"
        }
    },
    {
        "text": "Somebody who's been sleeping in a tent doesn't really sleep.",
        "startTime": 20.50,
        "endTime": 24.35,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_man_sleeping_rough.mp4")
    },
    {
        "text": "Part of their mind stays posted at the door all night, listening.",
        "startTime": 24.35,
        "endTime": 28.60,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_homeless_encampment.mp4")
    },
    {
        "text": "Because fabric can be opened with a fingernail and people sleeping outside get robbed and worse.",
        "startTime": 28.60,
        "endTime": 35.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_freezing_rain.mp4")
    },
    {
        "text": "When that goes on for months or years, the damage is real, memory, temper, judgment.",
        "startTime": 35.00,
        "endTime": 41.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_deep_sleep_dream.mp4")
    },
    {
        "text": "The ability to hold a plan in your head for more than an hour.",
        "startTime": 41.50,
        "endTime": 45.60,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/elkins_ch08_riveting_floor.mp4")
    },
    {
        "text": "Now put that same person behind a hard wall and a bolt.",
        "startTime": 45.60,
        "endTime": 50.10,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_hardware_lumber.mp4")
    },
    {
        "text": "And what they tell you isn't that they feel comfortable.",
        "startTime": 50.10,
        "endTime": 53.40,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/bridges_ch08_man_waking_inside.mp4")
    },
    {
        "text": "It's that they slept straight through the night for the first time in years.",
        "startTime": 53.40,
        "endTime": 58.20,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_warm_sleep.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "PSYCHOLOGICAL UNBROKEN SLEEP",
            "line2": "FIRST UNBROKEN REST IN YEARS",
            "themeColor": "gold"
        }
    },
    {
        "text": "Everything else depends on that. Nobody sits through a housing appointment,",
        "startTime": 58.20,
        "endTime": 62.80,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/kirsten_ch08_mattress_frame.mp4")
    },
    {
        "text": "holds down a day labor shift, or fills out benefits paperwork correctly on four broken hours of sleep.",
        "startTime": 62.80,
        "endTime": 68.80,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_engineer_drafting.mp4")
    },
    {
        "text": "Imagine what that does to a person.",
        "startTime": 68.80,
        "endTime": 72.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/designs7_ch08_camper_autumn_road.mp4")
    },
    {
        "text": "Imagine going years without one full night of trust",
        "startTime": 72.00,
        "endTime": 75.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_sunrise_highway.mp4")
    },
    {
        "text": "and then getting it back for two dollars.",
        "startTime": 75.00,
        "endTime": 77.60,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_barrel_bolt_lock.mp4")
    },
    {
        "text": "The bolt isn't about security. It's about being able to think again.",
        "startTime": 77.60,
        "endTime": CH8_DUR,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/elkins_ch08_door_close_outside.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "COGNITIVE RECOVERY & AGENCY",
            "line2": "RESTORING MENTAL BANDWIDTH",
            "themeColor": "cyan"
        }
    }
]

# Chapter 09 Beats definition
CH09_BEATS = [
    {
        "text": "The second one is the wheels. This is the part most people miss.",
        "startTime": 0.0,
        "endTime": 4.20,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/elkins_ch09_wheel_installation.mp4")
    },
    {
        "text": "And lately, it's become more important, not less.",
        "startTime": 4.20,
        "endTime": 8.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_bike_wheel_roll.mp4")
    },
    {
        "text": "A structure sitting on land is a structure. It can be declared debris and hauled away.",
        "startTime": 8.00,
        "endTime": 14.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/bridges_ch09_sweep_crew_clearing.mp4")
    },
    {
        "text": "And everything inside it goes with it. Medication, documents, photographs.",
        "startTime": 14.00,
        "endTime": 19.30,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_street_sweeper.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "ENCAMPMENT SWEEPS & SEIZURES",
            "line2": "IMMEDIATE LOSS OF ESSENTIAL PAPERS",
            "themeColor": "gold"
        }
    },
    {
        "text": "People lose their birth certificates and discharge papers in clearances all the time.",
        "startTime": 19.30,
        "endTime": 24.80,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/designs7_ch09_interior_storage_shelves.mp4")
    },
    {
        "text": "And replacing those without an address can cost somebody years of their life. But a thing on wheels behaves differently.",
        "startTime": 24.80,
        "endTime": 31.90,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_nyc_steam_vent.mp4")
    },
    {
        "text": "It isn't obviously a building. There's no motor, so there's no registration,",
        "startTime": 31.90,
        "endTime": 36.90,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/kirsten_ch09_towing_freely.mp4")
    },
    {
        "text": "no insurance, no plate to run, and no impound lot.",
        "startTime": 36.90,
        "endTime": 41.20,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_bridge_overpass.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "NO MOTOR • NO REGISTRATION • NO IMPOUND",
            "line2": "LEGAL STATUS OF BICYCLE TOW",
            "themeColor": "cyan"
        }
    },
    {
        "text": "So when somebody knocks and says you can't stay here, the answer isn't that you lose your home.",
        "startTime": 41.20,
        "endTime": 47.10,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/designs7_ch09_bike_camper_fence.mp4")
    },
    {
        "text": "The answer is that you move it. And the timing here matters.",
        "startTime": 47.10,
        "endTime": 51.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_cyclist_pedaling.mp4")
    },
    {
        "text": "In June 2024, the Supreme Court decided a case out of Grants Pass, Oregon,",
        "startTime": 51.00,
        "endTime": 57.40,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_courthouse_gavel.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "JUNE 2024 SUPREME COURT: GRANTS PASS",
            "line2": "BROAD MUNICIPAL TICKETING & SWEEPS",
            "themeColor": "gold"
        }
    },
    {
        "text": "that gave cities far wider power to ticket and arrest people",
        "startTime": 57.40,
        "endTime": 61.30,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/bridges_ch09_camper_under_bridge.mp4")
    },
    {
        "text": "for sleeping outside, even where no shelter beds were available.",
        "startTime": 61.30,
        "endTime": 65.20,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_freezing_rain.mp4")
    },
    {
        "text": "Cities across the West responded with new ordinances and bigger clearances.",
        "startTime": 65.20,
        "endTime": 70.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_homeless_encampment.mp4")
    },
    {
        "text": "In that world, the wheels stopped being a convenience feature. It became the entire strategy.",
        "startTime": 70.50,
        "endTime": 76.90,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/designs7_ch09_rolling_open_road.mp4")
    },
    {
        "text": "Picture the difference at five in the morning when the knock comes.",
        "startTime": 76.90,
        "endTime": 81.10,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_sunrise_highway.mp4")
    },
    {
        "text": "One person has a tent, and 60 seconds to grab what they can carry.",
        "startTime": 81.10,
        "endTime": 85.80,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/bridges_ch09_wet_tent_sweep.mp4")
    },
    {
        "text": "Another has a house and a tow bar.",
        "startTime": 85.80,
        "endTime": 88.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/elkins_ch09_tow_hitch_mount.mp4")
    },
    {
        "text": "Same knock. Completely different morning.",
        "startTime": 88.50,
        "endTime": CH9_DUR,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/kirsten_ch09_yellow_camper_parked.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "THE 5:00 AM KNOCK: TOW BAR READY",
            "line2": "MOBILITY AS SURVIVAL STRATEGY",
            "themeColor": "cyan"
        }
    }
]

# Chapter 10 Beats definition
CH10_BEATS = [
    {
        "text": "The third thing is the stove.",
        "startTime": 0.0,
        "endTime": 2.20,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_fire_flame_stove.mp4")
    },
    {
        "text": "On that fold-down counter, there's a butane burner.",
        "startTime": 2.20,
        "endTime": 5.40,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/kirsten_ch10_counter_butane_stove.mp4")
    },
    {
        "text": "About $12, and the difference it makes has nothing to do with nutrition.",
        "startTime": 5.40,
        "endTime": 10.40,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_portable_butane_stove.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "$12 PORTABLE BUTANE STOVE",
            "line2": "COUNTERTOP SINGLE-BURNER UNIT",
            "themeColor": "gold"
        }
    },
    {
        "text": "Standing in a meal line, somebody feeds you.",
        "startTime": 10.40,
        "endTime": 13.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_homeless_encampment.mp4")
    },
    {
        "text": "On that counter, you make breakfast, same calories, completely different place in the world.",
        "startTime": 13.50,
        "endTime": 19.30,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_stove_cooking.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "COOKING VS MEAL LINE INDIGNITY",
            "line2": "THE AUTONOMY GAP",
            "themeColor": "cyan"
        }
    },
    {
        "text": "Think about what a meal line asks of you.",
        "startTime": 19.30,
        "endTime": 22.10,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/bridges_ch10_sidewalk_meal_wait.mp4")
    },
    {
        "text": "You show up at the right hour, you take what's handed over, you say thank you, whether or not you're hungry for it.",
        "startTime": 22.10,
        "endTime": 28.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_nyc_steam_vent.mp4")
    },
    {
        "text": "It's kindness, and a lot of people are grateful for it,",
        "startTime": 28.50,
        "endTime": 32.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_couple_comfort.mp4")
    },
    {
        "text": "but it's also a place where your day is decided by someone else.",
        "startTime": 32.50,
        "endTime": 36.60,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_manhattan_winter_street.mp4")
    },
    {
        "text": "Now, think about standing at a counter in your own space with the smell of something frying.",
        "startTime": 36.60,
        "endTime": 42.60,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_morning_coffee.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "THE SMELL OF BREAKFAST IN YOUR HOME",
            "line2": "A PRIVATE DOMESTIC SANCTUARY",
            "themeColor": "gold"
        }
    },
    {
        "text": "Deciding how you want your eggs, that small choice is the first thing many people have had in years.",
        "startTime": 42.60,
        "endTime": 49.30,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/elkins_ch10_breadpan_sink_water.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "RESTORING PERSONAL CHOICE",
            "line2": "FIRST PERSONAL AGENCY IN YEARS",
            "themeColor": "cyan"
        }
    },
    {
        "text": "People who've lived both describe that gap as one of the biggest in the whole experience,",
        "startTime": 49.30,
        "endTime": 54.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_dollar_cash.mp4")
    },
    {
        "text": "and it costs $12 to cross it.",
        "startTime": 54.50,
        "endTime": CH10_DUR,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/kirsten_ch10_peaceful_camper_sun.mp4")
    }
]

# Chapter 11 Beats definition
CH11_BEATS = [
    {
        "text": "Now, there's a fair question hiding in here. Cities have shelters.",
        "startTime": 0.0,
        "endTime": 4.20,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_bridge_overpass.mp4")
    },
    {
        "text": "So why is anybody sleeping in a plastic box under a bridge?",
        "startTime": 4.20,
        "endTime": 8.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/bridges_ch11_pod_under_bridge.mp4")
    },
    {
        "text": "Outreach workers who've spent years getting turned down will tell you it almost always comes down to the same short list.",
        "startTime": 8.50,
        "endTime": 15.80,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_homeless_encampment.mp4")
    },
    {
        "text": "A dog, a big share of people sleeping outside have an animal.",
        "startTime": 15.80,
        "endTime": 20.10,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_stray_dog_pavement.mp4")
    },
    {
        "text": "And for many of them, it's the only living thing that stayed.",
        "startTime": 20.10,
        "endTime": 23.60,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_dog_companion.mp4")
    },
    {
        "text": "Most emergency shelters can't take pets. So the person stays outside and the bed stays empty.",
        "startTime": 23.60,
        "endTime": 30.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/bridges_ch11_walking_away_street.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "SHELTER RULE: NO PETS ALLOWED",
            "line2": "BARRIER 01 • FORCED ANIMAL ABANDONMENT",
            "themeColor": "gold"
        }
    },
    {
        "text": "A partner, traditional shelters separate by gender.",
        "startTime": 30.00,
        "endTime": 33.60,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_couple_comfort.mp4")
    },
    {
        "text": "So a couple who've kept each other alive through two winters",
        "startTime": 33.60,
        "endTime": 37.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/designs7_ch11_tandem_camper_couple.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "SHELTER RULE: GENDER SEPARATION",
            "line2": "BARRIER 02 • COUPLE FORCED PARTING",
            "themeColor": "cyan"
        }
    },
    {
        "text": "get told at the door they'll be sleeping in different buildings.",
        "startTime": 37.00,
        "endTime": 40.50,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_freezing_rain.mp4")
    },
    {
        "text": "A lot of them turn around.",
        "startTime": 40.50,
        "endTime": 42.60,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_nyc_steam_vent.mp4")
    },
    {
        "text": "American hideaways, page nine, and everything they own. A cart, a bike, four bags.",
        "startTime": 42.60,
        "endTime": 49.30,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/designs7_ch11_cart_bags_storage.mp4")
    },
    {
        "text": "None of it fits under a cot in an open room. And if it's left outside overnight, it's gone by morning.",
        "startTime": 49.30,
        "endTime": 55.70,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/bridges_ch11_belongings_wet_pavement.mp4")
    },
    {
        "text": "So the choice becomes a bed or your possessions.",
        "startTime": 55.70,
        "endTime": 60.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_hardware_lumber.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "LOSS OF POSSESSIONS & IDENTIFICATION",
            "line2": "BARRIER 03 • STRICT INVENTORY LIMITS",
            "themeColor": "gold"
        }
    },
    {
        "text": "And people choose the possessions because those possessions are the last physical evidence that they had a life.",
        "startTime": 60.00,
        "endTime": 66.00,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/kirsten_ch11_mobile_pod_moving.mp4")
    },
    {
        "text": "A hard-walled box with a bolt and wheels answers all three at once,",
        "startTime": 66.00,
        "endTime": 70.60,
        "clipPath": abs_path("uploads/raw/proj_camperbike/slices_clean/elkins_ch11_proud_camper_exterior.mp4"),
        "callout": {
            "type": "editorial_lower_third",
            "line1": "A HARD-WALLED BOX ANSWERS ALL THREE",
            "line2": "PETS • PARTNERS • POSSESSIONS PRESERVED",
            "themeColor": "cyan"
        }
    },
    {
        "text": "which is exactly why people use it.",
        "startTime": 70.60,
        "endTime": CH11_DUR,
        "clipPath": abs_path("uploads/raw/proj_camperbike/stock/stock_sunrise_highway.mp4")
    }
]

def build_chapter_timeline(ch_idx, master_audio, total_dur, raw_beats):
    clips = []
    for i, b in enumerate(raw_beats):
        st = b["startTime"]
        et = b["endTime"]
        dur = round(et - st, 4)
        clip_obj = {
            "beatIndex": i,
            "chapterIndex": ch_idx,
            "text": b["text"],
            "startTime": st,
            "endTime": et,
            "duration": dur,
            "clipPath": b["clipPath"],
            "mediaType": "video",
            "layout": "full_bleed_cinematic",
            "kenBurns": True,
            "transitionType": "cut",
            "transitionDuration": 0
        }
        if "callout" in b:
            clip_obj["callout"] = b["callout"]
        clips.append(clip_obj)
    
    return {
        "masterAudioPath": master_audio,
        "totalDuration": total_dur,
        "clips": clips
    }

def main():
    chapters = [
        (8, CH8_AUDIO, CH8_DUR, CH08_BEATS, "uploads/timelines/camperbike/chapter_08_final.json", "camperbike_ch08"),
        (9, CH9_AUDIO, CH9_DUR, CH09_BEATS, "uploads/timelines/camperbike/chapter_09_final.json", "camperbike_ch09"),
        (10, CH10_AUDIO, CH10_DUR, CH10_BEATS, "uploads/timelines/camperbike/chapter_10_final.json", "camperbike_ch10"),
        (11, CH11_AUDIO, CH11_DUR, CH11_BEATS, "uploads/timelines/camperbike/chapter_11_final.json", "camperbike_ch11"),
    ]

    for ch_idx, audio_path, dur, beats, out_json_rel, snap_dir_name in chapters:
        print(f"\n================ Chapter {ch_idx:02d} ================")
        out_json = abs_path(out_json_rel)
        os.makedirs(os.path.dirname(out_json), exist_ok=True)
        
        timeline = build_chapter_timeline(ch_idx, audio_path, dur, beats)
        
        # Validation
        clips = timeline["clips"]
        assert len(clips) > 0, "No clips in timeline!"
        assert clips[0]["startTime"] == 0.0, f"Chapter {ch_idx} does not start at 0.0"
        assert abs(clips[-1]["endTime"] - dur) < 0.001, f"Chapter {ch_idx} end time {clips[-1]['endTime']} != {dur}"
        
        for i in range(len(clips)):
            c = clips[i]
            # Continuity
            if i > 0:
                assert abs(clips[i-1]["endTime"] - c["startTime"]) < 0.001, f"Gap before clip {i}!"
            # Clip exists
            if not os.path.exists(c["clipPath"]):
                raise FileNotFoundError(f"Clip not found: {c['clipPath']}")
            
            # Anti-dump guard: No consecutive slices from same source
            if i > 0:
                prev_p = os.path.basename(clips[i-1]["clipPath"])
                curr_p = os.path.basename(c["clipPath"])
                prev_prefix = prev_p.split("_")[0]
                curr_prefix = curr_p.split("_")[0]
                if prev_prefix in ["elkins", "kirsten", "drew", "bridges", "designs7", "clean"] and prev_prefix == curr_prefix:
                    raise ValueError(f"Anti-Dump Violation: consecutive slices from same source '{prev_prefix}' at beats {i-1} & {i}!")
            
            # Rules: full_bleed_cinematic, cut, transitionDuration=0, overlay omitted
            assert c["layout"] == "full_bleed_cinematic", f"Bad layout in beat {i}"
            assert c["transitionType"] == "cut", f"Bad transition in beat {i}"
            assert c["transitionDuration"] == 0, f"Non-zero transition duration in beat {i}"
            assert "overlay" not in c, f"Overlay present in beat {i}"

        # Write timeline JSON
        with open(out_json, "w", encoding="utf-8") as f:
            json.dump(timeline, f, indent=2)
        print(f"Saved timeline: {out_json} ({len(clips)} beats)")

        # Extract 50% midpoint snapshots
        snap_dir = abs_path(f"uploads/beat_snapshots/{snap_dir_name}")
        os.makedirs(snap_dir, exist_ok=True)
        print(f"Extracting snapshots to: {snap_dir}")
        for c in clips:
            idx = c["beatIndex"]
            # 50% midpoint of clip duration
            ss = max(0.5, c["duration"] / 2.0)
            snap_file = os.path.join(snap_dir, f"beat_{idx:02d}.jpg")
            cmd = [
                "ffmpeg", "-nostdin", "-y",
                "-ss", str(ss),
                "-i", c["clipPath"],
                "-vframes", "1",
                "-q:v", "2",
                snap_file
            ]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        print(f"Extracted {len(clips)} snapshots for Chapter {ch_idx:02d}.")

    # Sync to projects.json
    store_paths = [
        abs_path("output/store/projects.json"),
        abs_path("apps/api/output/store/projects.json")
    ]
    
    for sp in store_paths:
        if not os.path.exists(sp):
            print(f"Warning: Store file not found: {sp}")
            continue
        with open(sp, "r", encoding="utf-8") as f:
            projects = json.load(f)
        
        proj = next((p for p in projects if p.get("id") == "proj_camperbike_hideaways"), None)
        if not proj:
            print(f"Warning: proj_camperbike_hideaways not found in {sp}")
            continue
        
        for ch_idx, _, _, _, out_json_rel, _ in chapters:
            timeline_file = abs_path(out_json_rel)
            with open(timeline_file, "r", encoding="utf-8") as f:
                tl_data = json.load(f)
            
            chap = next((c for c in proj.get("chapters", []) if c.get("chapterIndex") == ch_idx), None)
            if chap:
                chap["timelineJson"] = tl_data
                chap["status"] = "completed"
                print(f"Synced Chapter {ch_idx} into {sp}")
            else:
                print(f"Chapter {ch_idx} not found in project chapters for {sp}")

        with open(sp, "w", encoding="utf-8") as f:
            json.dump(projects, f, indent=2)
        print(f"Successfully updated {sp}")

if __name__ == "__main__":
    main()
