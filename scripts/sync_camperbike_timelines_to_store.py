import os
import json
from datetime import datetime, timezone

def sync_timelines():
    base_dir = r"C:\Users\karth\Documents\BlokeTuber"
    timeline_dir = os.path.join(base_dir, "uploads", "timelines", "camperbike")
    store_files = [
        os.path.join(base_dir, "output", "store", "projects.json"),
        os.path.join(base_dir, "apps", "api", "output", "store", "projects.json")
    ]

    chapters_to_sync = [
        (1, "chapter_01_final.json"),
        (2, "chapter_02_final.json"),
        (3, "chapter_03_final.json"),
        (4, "chapter_04_final.json")
    ]

    timelines_data = {}
    for ch_idx, fname in chapters_to_sync:
        fpath = os.path.join(timeline_dir, fname)
        if not os.path.exists(fpath):
            raise FileNotFoundError(f"Timeline file not found: {fpath}")
        with open(fpath, "r", encoding="utf-8") as f:
            t_data = json.load(f)
        timelines_data[ch_idx] = {
            "path": fpath,
            "data": t_data
        }
        print(f"Loaded Ch {ch_idx:02d}: {fname} ({len(t_data.get('clips', []))} clips, {t_data.get('totalDuration'):.2f}s)")

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")

    for store_path in store_files:
        if not os.path.exists(store_path):
            print(f"Warning: Store file does not exist: {store_path}")
            continue

        with open(store_path, "r", encoding="utf-8") as f:
            projects = json.load(f)

        found = False
        for proj in projects:
            if proj.get("id") == "proj_camperbike_hideaways":
                found = True
                chapters = proj.get("chapters", [])
                for ch in chapters:
                    c_idx = ch.get("chapterIndex")
                    if c_idx in timelines_data:
                        ch["status"] = "staged"
                        ch["timelineFile"] = timelines_data[c_idx]["path"]
                        ch["timelineJson"] = timelines_data[c_idx]["data"]
                        ch["updatedAt"] = now_iso
                        print(f"Updated store '{os.path.basename(os.path.dirname(os.path.dirname(store_path)))}/{os.path.basename(store_path)}' Ch {c_idx:02d} -> 'staged'")
                break

        if not found:
            print(f"Error: proj_camperbike_hideaways not found in {store_path}")
            continue

        with open(store_path, "w", encoding="utf-8") as f:
            json.dump(projects, f, indent=2, ensure_ascii=False)
        print(f"Saved {store_path}")

if __name__ == "__main__":
    sync_timelines()
