import cv2
import subprocess
import os

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
upperbody_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_upperbody.xml')

def check_time(t):
    out = "uploads/raw/proj_ambulance/scans/test_be.jpg"
    cmd = ["ffmpeg", "-y", "-ss", str(t), "-i", "uploads/raw/proj_ambulance/ben_emily_tour.mp4", "-vframes", "1", "-q:v", "2", out]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    img = cv2.imread(out)
    if img is None:
        return False
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    bodies = upperbody_cascade.detectMultiScale(gray, 1.1, 4)
    os.remove(out)
    return len(faces) == 0 and len(bodies) == 0

clean_ranges = []
# test from 50 to 1400 every 5 seconds
curr_clean_start = None
curr_clean_len = 0

for t in range(50, 1400, 5):
    is_c = check_time(t)
    if is_c:
        if curr_clean_start is None:
            curr_clean_start = t
            curr_clean_len = 5
        else:
            curr_clean_len += 5
    else:
        if curr_clean_start is not None and curr_clean_len >= 10:
            clean_ranges.append((curr_clean_start, curr_clean_len))
        curr_clean_start = None
        curr_clean_len = 0

if curr_clean_start is not None and curr_clean_len >= 10:
    clean_ranges.append((curr_clean_start, curr_clean_len))

print("Clean ranges (start, duration):")
for r in clean_ranges:
    print(r)
