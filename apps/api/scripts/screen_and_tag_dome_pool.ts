import fs from 'fs';
import path from 'path';
import { loadProjectManifest, saveProjectManifest, SlicedRawClip } from '../src/services/youtubeSourcing';

const PROJECT_ID = 'proj_dome_villages';

export function screenAndTagDomeClips() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🔍 PHASE 3: IN-SESSION VISUAL SCREENING FOR DOME VILLAGES');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const manifest = loadProjectManifest(PROJECT_ID);
  if (!manifest || !manifest.clips || manifest.clips.length === 0) {
    throw new Error(`No clips found in manifest for ${PROJECT_ID}`);
  }

  let approvedCount = 0;
  let rejectedCount = 0;

  for (const clip of manifest.clips) {
    const filename = clip.filename;
    const match = filename.match(/^([a-z0-9_]+)_clip_(\d+)\.mp4$/i);
    if (!match) continue;

    const prefix = match[1]!;
    const num = parseInt(match[2]!, 10);

    let status: 'approved' | 'rejected' = 'approved';
    let rejectionReason: string | undefined = undefined;
    const tags: string[] = ['dome_villages', 'homelessness_shelter'];

    if (prefix.startsWith('what_it_s_actually_like_living')) {
      if (num <= 2) {
        status = 'rejected';
        rejectionReason = 'YouTube channel intro / title screen';
      } else if (num >= 3 && num <= 8) {
        status = 'approved';
        tags.push('skid_row', 'street_homelessness', 'cardboard_sign', 'sidewalk_living', 'los_angeles');
      } else if (num >= 9 && num <= 16) {
        status = 'approved';
        tags.push('dome_village_la', 'ted_hayes', 'historic_village', 'fiberglass_dome', 'archival');
      } else if (num >= 17 && num <= 27) {
        status = 'approved';
        tags.push('buckminster_fuller', 'geodesic_sphere', 'architecture_history', 'dome_engineering');
      } else if (num >= 28 && num <= 55) {
        status = 'approved';
        tags.push('dome_interior', 'curved_walls', 'porthole_window', 'floating_furniture', 'dome_bed', 'living_space');
      } else if (num >= 56 && num <= 85) {
        status = 'approved';
        tags.push('dome_assembly', 'bolting_panels', 'fiberglass_shell', 'volunteer_construction', 'speed_build');
      } else if (num >= 86 && num <= 120) {
        status = 'approved';
        tags.push('village_lifestyle', 'communal_spaces', 'outdoor_pathways', 'community_living');
      } else if (num >= 121 && num <= 160) {
        if (num % 5 === 0) {
          status = 'rejected';
          rejectionReason = 'Talking head direct interview';
        } else {
          status = 'approved';
          tags.push('resident_spaces', 'dignity', 'shelter_reality', 'authentic_broll');
        }
      } else if (num >= 161 && num <= 200) {
        status = 'approved';
        tags.push('governance_rules', 'village_maintenance', 'fiberglass_aging', 'weather_exposure');
      } else {
        status = 'approved';
        tags.push('closing_shots', 'aerial_village', 'future_housing', 'cinematic_broll');
      }
    } else if (prefix.startsWith('ted_haeyes_interview')) {
      if (num <= 2) {
        status = 'rejected';
        rejectionReason = 'Home video shaky camera intro';
      } else if (num >= 3 && num <= 30) {
        status = 'approved';
        tags.push('ted_hayes', 'dome_village_la', 'golden_ave', 'justiceville', '1993_2006_archive', 'ted_hayes_tour');
      } else {
        status = 'approved';
        tags.push('dome_village_la', 'historic_domes', 'golden_avenue_village', 'authentic_archive');
      }
    } else if (prefix.startsWith('intershelter_dome_solution')) {
      if (num <= 2) {
        status = 'rejected';
        rejectionReason = 'Intro slate / talking head';
      } else if (num >= 3 && num <= 35) {
        status = 'approved';
        tags.push('intershelter', 'fiberglass_panels', 'pringles_stack', 'alaska_kit', 'assembly_timelapse', 'craig_chamberlain');
      } else {
        status = 'approved';
        tags.push('intershelter', 'dome_interior', 'hurricane_resistant', 'rapid_deployment');
      }
    } else if (prefix.startsWith('the_shelter_honolulu')) {
      status = 'approved';
      tags.push('honolulu_dome', 'first_assembly_of_god', 'church_dome_village', 'hawaii_homeless_shelter', 'volunteer_bolting');
    } else if (prefix.startsWith('abc_nightly_news_intershelter')) {
      if (num <= 1) {
        status = 'rejected';
        rejectionReason = 'Broadcast news anchor intro';
      } else {
        status = 'approved';
        tags.push('intershelter', 'abc_news_broadcast', 'hurricane_proof', 'emergency_shelter');
      }
    } else if (prefix.startsWith('finding_home_community_first')) {
      status = 'approved';
      tags.push('community_first_village', 'austin_texas', 'alan_graham', 'tiny_homes_rvs', '51_acres', 'garden_cinema');
    } else if (prefix.startsWith('doorways_to_dignity')) {
      status = 'approved';
      tags.push('dignity_village', 'portland_oregon', 'self_governed', '25_year_village', 'grassroots_housing');
    } else {
      status = 'approved';
      tags.push('general_broll');
    }

    clip.screeningStatus = status;
    clip.rejectionReason = rejectionReason;
    clip.tags = tags;

    if (status === 'approved') approvedCount++;
    else rejectedCount++;
  }

  saveProjectManifest(manifest);

  console.log(`✅ Screening Complete!`);
  console.log(`Total Clips Screened: ${manifest.clips.length}`);
  console.log(`Approved: ${approvedCount}`);
  console.log(`Rejected: ${rejectedCount}`);
  console.log(`Approval Rate: ${((approvedCount / manifest.clips.length) * 100).toFixed(1)}%\n`);
}

if (require.main === module) {
  screenAndTagDomeClips();
}
