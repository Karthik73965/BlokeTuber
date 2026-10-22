import os
import sys
import cv2
import glob

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

for ch_name in ["ambulance_ch06", "ambulance_ch07"]:
    snap_dir = os.path.join("uploads", "beat_snapshots", ch_name)
    snaps = sorted(glob.glob(os.path.join(snap_dir, "*.jpg")))
    print(f"\n--- Checking {ch_name} ({len(snaps)} snapshots) ---")
    for s in snaps:
        img = cv2.imread(s)
        if img is None:
            continue
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        if len(faces) > 0:
            print(f"[FACE DETECTED] in {os.path.basename(s)} ({len(faces)} faces)")
