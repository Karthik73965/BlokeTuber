import os
import subprocess

slices = [f for f in os.listdir('uploads/raw/proj_camperbike/slices') if f.endswith('.jpg')]

print("Audit of slice snapshots:")
for s in slices:
    p = os.path.join('uploads/raw/proj_camperbike/slices', s)
    sz = os.path.getsize(p)
    print(f"{s:45s}: {sz} bytes")
