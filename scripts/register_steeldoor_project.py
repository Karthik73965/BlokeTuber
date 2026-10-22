import json
import os
import time

PROJECT_ID = "proj_steeldoor_hideaways"
TITLE = "American Hideaways: The Steel Door"

CHAPTERS = [
    (1, "The Cold Door", 84.3),
    (2, "The Number That Broke Her", 56.1),
    (3, "Where They Slept", 59.4),
    (4, "The Things Nobody Believed", 79.5),
    (5, "The Box Nobody Wanted", 67.0),
    (6, "Two Acres and a Handshake", 94.9),
    (7, "The Sound of a Grinder", 81.9),
    (8, "What Contractors Throw Away", 82.8),
    (9, "The Panels Behind the Warehouse", 143.0),
    (10, "What Was Behind the Door", 137.0),
    (11, "The Question She Never Asked", 172.6)
]

total_duration = sum(dur for _, _, dur in CHAPTERS)

project_entry = {
    "id": PROJECT_ID,
    "title": TITLE,
    "description": "Tamara, a 23-year-old Dollar General cashier evicted with her 4-year-old son, turns a $250 dented shipping container into an off-grid home in rural Mississippi for a total build cost of $412.",
    "status": "in_progress",
    "totalDuration": total_duration,
    "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "chapters": [
        {
            "id": f"ch_{idx:02d}",
            "projectId": PROJECT_ID,
            "chapterIndex": idx,
            "title": title,
            "duration": dur,
            "status": "ready_to_render",
            "timelinePath": os.path.abspath(f"uploads/timelines/steeldoor/chapter_{idx:02d}_final.json"),
            "audioPath": os.path.abspath(f"uploads/audio/steeldoor/ch{idx:02d}_{title.lower().replace(' ', '_')}.mp3"),
            "videoPath": os.path.abspath(f"output/steeldoor_rendered/chapter_{idx:02d}.mp4")
        }
        for idx, title, dur in CHAPTERS
    ]
}

for store_path in ["output/store/projects.json", "apps/api/output/store/projects.json"]:
    if os.path.exists(store_path):
        with open(store_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        # Remove old entry if exists
        data = [p for p in data if p["id"] != PROJECT_ID]
        data.append(project_entry)
        with open(store_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"Registered {PROJECT_ID} in {store_path}")

print("Project registration complete!")
