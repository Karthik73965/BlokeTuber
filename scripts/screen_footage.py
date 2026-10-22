import os
import cv2
import glob

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

for img_path in sorted(glob.glob("temp_scene_catalog/ben_emily_scan/*.jpg")):
    img = cv2.imread(img_path)
    if img is None:
        continue
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    has_face = len(faces) > 0
    if not has_face:
        print(f"NO FACE: {os.path.basename(img_path)}")
