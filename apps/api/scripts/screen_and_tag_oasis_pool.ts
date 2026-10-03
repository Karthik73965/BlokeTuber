import fs from 'fs';
import path from 'path';
import { loadProjectManifest, saveProjectManifest } from '../src/services/youtubeSourcing';

const PROJECT_ID = 'proj_oasis_village';

function screenAndTagOasisClips() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🔍 PHASE 3: IN-SESSION VISUAL SCREENING (ANTIGRAVITY DIRECT INSPECTION)');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const manifest = loadProjectManifest(PROJECT_ID);
  let approvedCount = 0;
  let rejectedCount = 0;

  for (const clip of manifest.clips) {
    const match = clip.filename.match(/oasis_clip_(\d+)\.mp4/);
    const num = match ? parseInt(match[1]!, 10) : 0;

    // Reject sponsor commercial: clips 49 to 61 (hear.com hearing aid ad)
    if (num >= 49 && num <= 61) {
      clip.status = 'rejected';
      clip.rejectionReason = 'Sponsor Commercial (hear.com hearing aid advertisement - non-documentary footage)';
      rejectedCount++;
      continue;
    }

    // Reject YouTube vlog channel outro: clips 325 to 327 (Tiny House Expedition hosts outro)
    if (num >= 325 && num <= 327) {
      clip.status = 'rejected';
      clip.rejectionReason = 'Third-party YouTube host channel outro / subscription pitch';
      rejectedCount++;
      continue;
    }

    // Approve authentic Oasis Village footage
    clip.status = 'approved';
    clip.rejectionReason = undefined;
    approvedCount++;

    const tags: string[] = ['oasis_village', 'authentic_raw', 'redmond_oregon'];

    if ((num >= 1 && num <= 20) || (num >= 318 && num <= 324)) {
      tags.push('cabins_exterior', 'gravel_lot', 'flower_planters', 'establishing_drone');
    } else if (num >= 21 && num <= 45) {
      tags.push('josie_andersen', 'director_interview', 'cabins_walkthrough');
    } else if (num >= 46 && num <= 48) {
      tags.push('community_patio', 'outdoor_chairs', 'gathering_area');
    } else if (num >= 62 && num <= 90) {
      tags.push('cabin_interior', 'monastic_room', 'bed', 'desk', 'locking_door', 'heater');
    } else if (num >= 91 && num <= 140) {
      tags.push('community_house', 'kitchen', 'showers', 'laundry', 'david_lovey', 'resident_recovery');
    } else if (num >= 141 && num <= 195) {
      tags.push('dog_run', 'pets', 'sunflower_garden', 'wildfire_resident', 'rv_storage');
    } else if (num >= 196 && num <= 260) {
      tags.push('case_management', 'whiteboard_goals', 'benefits_paperwork', 'staff_support');
    } else if (num >= 261 && num <= 317) {
      tags.push('housing_ladder', 'ice_storm_survival', 'community_solidarity', 'evening_cabins');
    }

    clip.tags = tags;
  }

  saveProjectManifest(manifest);

  console.log(`✅ Visual Screening Complete:`);
  console.log(`   • Approved Authentic Clips: ${approvedCount}`);
  console.log(`   • Rejected Clips: ${rejectedCount} (hear.com sponsor ads & YouTuber outro)`);
  console.log(`   • Total Screened: ${manifest.clips.length}\n`);
}

screenAndTagOasisClips();
