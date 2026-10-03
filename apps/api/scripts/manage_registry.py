import os
import json
import datetime

REGISTRY_PATH = "uploads/registry/proj_oasis_village_media_registry.json"
RAW_CLIPS_DIR = "uploads/raw/proj_oasis_village"

def load_registry():
    if os.path.exists(REGISTRY_PATH):
        with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "projectId": "proj_oasis_village",
        "lockedClips": [],
        "chapterUsage": {},
        "updatedAt": datetime.datetime.now().isoformat()
    }

def save_registry(reg):
    reg["updatedAt"] = datetime.datetime.now().isoformat()
    reg["lockedCount"] = len(reg["lockedClips"])
    os.makedirs(os.path.dirname(REGISTRY_PATH), exist_ok=True)
    with open(REGISTRY_PATH, "w", encoding="utf-8") as f:
        json.dump(reg, f, indent=2)

def set_chapter_clips(chapter_key, clips):
    reg = load_registry()
    if "chapterUsage" not in reg:
        reg["chapterUsage"] = {}
    
    # Extract simple filenames
    clean_clips = [os.path.basename(c) for c in clips]
    reg["chapterUsage"][chapter_key] = clean_clips
    
    # Recompute lockedClips as union of all chapterUsages
    all_locked = set()
    for ch, c_list in reg["chapterUsage"].items():
        for c in c_list:
            all_locked.add(c)
    
    reg["lockedClips"] = sorted(list(all_locked))
    save_registry(reg)
    print(f"Locked {len(clean_clips)} clips for {chapter_key}. Total locked across all chapters: {len(reg['lockedClips'])}")

def get_available_raw_clips():
    reg = load_registry()
    locked = set(reg.get("lockedClips", []))
    all_files = sorted(os.listdir(RAW_CLIPS_DIR))
    available = [f for f in all_files if f.endswith(".mp4") and f not in locked]
    return available

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "init_ch01":
        # Initialize with Chapter 1 actual final clips
        with open("uploads/timelines/oasis_village/chapter_01_final.json", "r", encoding="utf-8") as f:
            t = json.load(f)
        ch01_clips = [c["clipPath"] for c in t["clips"]]
        set_chapter_clips("chapter_01", ch01_clips)
        print("Chapter 1 initialized.")
        avail = get_available_raw_clips()
        print(f"Available raw clips remaining: {len(avail)}")
    elif len(sys.argv) > 1 and sys.argv[1] == "status":
        reg = load_registry()
        print("Chapters registered:", list(reg.get("chapterUsage", {}).keys()))
        print("Total locked items:", len(reg.get("lockedClips", [])))
        avail = get_available_raw_clips()
        print("Available raw clips:", len(avail))
