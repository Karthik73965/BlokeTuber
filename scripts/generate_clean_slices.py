import os
import subprocess

def slice_clean(src_path, start, dur, crop_vf, out_path):
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(start),
        "-i", src_path,
        "-t", str(dur),
        "-vf", f"{crop_vf},scale=1920:1080",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-an",
        out_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    snap = out_path.replace(".mp4", ".jpg")
    subprocess.run(["ffmpeg", "-y", "-ss", "1", "-i", out_path, "-vframes", "1", "-q:v", "2", snap],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Generated clean slice: {out_path} ({dur}s)")

slices = [
    # 1. Towing camper bike: Kirsten at 8s
    ("uploads/raw/proj_camperbike/kirsten_elkins_150.mp4", 8, 7.5,
     "crop=in_w:in_h*0.88:0:0",
     "uploads/raw/proj_camperbike/slices/kirsten_towing_camper_bike.mp4"),

    # 2. Pine floor frame with signs: Kirsten at 178s
    ("uploads/raw/proj_camperbike/kirsten_elkins_150.mp4", 178, 7.5,
     "crop=in_w:in_h*0.88:0:0",
     "uploads/raw/proj_camperbike/slices/kirsten_pine_floor_frame_signs.mp4"),

    # 3. Campaign signs triangles & arch: Kirsten at 147s
    ("uploads/raw/proj_camperbike/kirsten_elkins_150.mp4", 147, 7.5,
     "crop=in_w:in_h*0.88:0:0",
     "uploads/raw/proj_camperbike/slices/kirsten_triangle_signs_coroplast.mp4"),

    # 4. White breadloaf camper on grass: Bridges7 at 148s
    ("uploads/raw/proj_camperbike/beneath_bridges_7campers.mp4", 148, 7.5,
     "crop=in_w:in_h*0.84:0:0",
     "uploads/raw/proj_camperbike/slices/bridges7_white_breadloaf_build.mp4"),

    # 5. Teardrop bike trailer: Bridges7 at 248s
    ("uploads/raw/proj_camperbike/beneath_bridges_7campers.mp4", 248, 7.5,
     "crop=in_w:in_h*0.84:0:0",
     "uploads/raw/proj_camperbike/slices/bridges7_teardrop_bike_trailer.mp4"),

    # 6. Drew curved roof assembly with top logo cropped out:
    ("uploads/raw/proj_camperbike/drew_builds_stuff.mp4", 1820, 7.5,
     "crop=in_w:in_h*0.84:0:in_h*0.16",
     "uploads/raw/proj_camperbike/slices/drew_clean_curved_roof.mp4"),

    # 7. Drew jigsaw cutting with top logo cropped out:
    ("uploads/raw/proj_camperbike/drew_builds_stuff.mp4", 320, 7.5,
     "crop=in_w:in_h*0.84:0:in_h*0.16",
     "uploads/raw/proj_camperbike/slices/drew_clean_jigsaw_cutting.mp4"),

    # 8. Drew woodworking framing with top logo cropped out:
    ("uploads/raw/proj_camperbike/drew_builds_stuff.mp4", 450, 7.5,
     "crop=in_w:in_h*0.84:0:in_h*0.16",
     "uploads/raw/proj_camperbike/slices/drew_clean_wood_framing.mp4"),

    # 9. Drew door frame hinges with top logo cropped out:
    ("uploads/raw/proj_camperbike/drew_builds_stuff.mp4", 1950, 7.5,
     "crop=in_w:in_h*0.84:0:in_h*0.16",
     "uploads/raw/proj_camperbike/slices/drew_clean_door_hinges.mp4"),

    # 10. Drew fastening panels with top logo cropped out:
    ("uploads/raw/proj_camperbike/drew_builds_stuff.mp4", 1400, 7.5,
     "crop=in_w:in_h*0.84:0:in_h*0.16",
     "uploads/raw/proj_camperbike/slices/drew_clean_fastening_panels.mp4"),
]

for src, start, dur, crop_vf, out in slices:
    slice_clean(src, start, dur, crop_vf, out)
