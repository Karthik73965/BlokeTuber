import { execSync } from 'child_process';
import path from 'path';

const files = [
  "What It's Actually Like Living Inside the $2,000 D_G2MAIJzAUhE.mp4",
  "Finding Home: Community First! Village_Db8NHiCyGTw.mp4",
  "The Shelter - Honolulu HI Dome Project_RANEduRN9Ew.mp4",
  "TED HAEYES INTERVIEW AT DOM VILLAGE JUSTICE VILLE _RFEoofiCC_w.mp4",
  "Doorways to Dignity documentary trailer_B6n7rbKArAo.mp4",
  "InterShelter Dome Solution to Homelessness_d351ndbkJxY.mp4"
];

for (const f of files) {
  const p = path.resolve('uploads/raw/proj_dome_villages', f);
  try {
    const probe = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=p=0 "${p}"`, { encoding: 'utf-8' }).trim();
    console.log(`${f} --> ${probe}`);
  } catch (e: any) {
    console.log(`${f} --> error: ${e.message}`);
  }
}
