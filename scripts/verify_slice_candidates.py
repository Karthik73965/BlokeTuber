import os
import subprocess
import cv2

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def check_clip(source, start, duration, name):
    tmp_out = f"uploads/raw/proj_ambulance/scans/test_{name}.mp4"
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(start),
        "-i", f"uploads/raw/proj_ambulance/{source}.mp4",
        "-t", str(duration),
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "22", "-an",
        tmp_out
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Check 3 sample frames
    clean = True
    for frac in [0.25, 0.5, 0.75]:
        t = frac * duration
        f_jpg = f"uploads/raw/proj_ambulance/scans/test_{name}_{int(t*10)}.jpg"
        cmd2 = ["ffmpeg", "-y", "-ss", str(t), "-i", tmp_out, "-vframes", "1", "-q:v", "2", f_jpg]
        subprocess.run(cmd2, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        img = cv2.imread(f_jpg)
        if img is not None:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            if len(faces) > 0:
                print(f"[{name}] Face detected at {t:.1f}s ({len(faces)} faces)")
                clean = False
        if os.path.exists(f_jpg):
            os.remove(f_jpg)
    if os.path.exists(tmp_out):
        os.remove(tmp_out)
    return clean

test_slices = [
    # ch10
    ("govdeals_ambulance", 4.0, 7.08, "ch10_b01_govdeals"),
    ("cheaprv_ambulance", 20.0, 6.10, "ch10_b03_cheaprv"),
    ("ben_emily_tour", 648.0, 5.92, "ch10_b05_benemily"),
    ("cheaprv_ambulance", 214.0, 6.08, "ch10_b07_cheaprv"),
    ("govdeals_ambulance", 20.0, 6.30, "ch10_b09_govdeals"),
    
    # ch11
    ("cheaprv_ambulance", 180.0, 5.18, "ch11_b00_cheaprv"),
    ("ben_emily_tour", 268.0, 7.36, "ch11_b01_benemily"),
    ("ben_emily_tour", 870.0, 5.24, "ch11_b04_benemily"),
    ("govdeals_ambulance", 32.0, 6.74, "ch11_b06_govdeals"),
    
    # ch12
    ("cheaprv_ambulance", 30.0, 1.68, "ch12_b01_cheaprv"),
    ("ben_emily_tour", 50.0, 9.42, "ch12_b02_benemily"),
    ("govdeals_ambulance", 8.0, 6.06, "ch12_b04_govdeals"),
    ("ben_emily_tour", 350.0, 4.20, "ch12_b05_benemily"),
    ("cheaprv_ambulance", 40.0, 5.42, "ch12_b07_cheaprv"),
    ("ben_emily_tour", 760.0, 5.42, "ch12_b10_benemily")
]

for src, st, dur, nm in test_slices:
    is_clean = check_clip(src, st, dur, nm)
    print(f"Slice {nm} (start={st}, dur={dur}): CLEAN={is_clean}")
