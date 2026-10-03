import fs from 'fs';
import path from 'path';
import { loadProjectManifest, saveProjectManifest, SlicedRawClip } from '../src/services/youtubeSourcing';

const PROJECT_ID = 'proj_1790101325660';

function screenAndTagClips() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🔍 PHASE 3: IN-SESSION VISUAL SCREENING FOR PORTABLE TOILETS');
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
    const tags: string[] = ['portable_toilets', 'los_angeles_homelessness'];

    switch (prefix) {
      // 1. Pot Growing Fire: Completely unrelated commercial fire with Loudlabs watermark
      case 'pot_growing_fire_sun_valley_ra':
        status = 'rejected';
        rejectionReason = 'Unrelated Sun Valley commercial warehouse fire with prominent Loudlabs watermark';
        break;

      // 2. Jose Fuentes Hillside Estate (FOX 11)
      case 'gardener_experiencing_homeless':
        if (num <= 2) {
          status = 'rejected';
          rejectionReason = 'News reporter night standup; non-b-roll anchor intro';
        } else if (num >= 24 && num <= 26) {
          status = 'approved';
          tags.push('jose_fuentes', 'shelter_tour', 'shelter_interior', 'bed_and_salvage', 'walkthrough');
        } else {
          status = 'approved';
          tags.push('jose_fuentes', 'hillside_estate', 'pacoima_118', 'rock_gardens', 'green_slide', 'authentic_broll');
        }
        break;

      // 3. Jose Fuentes Mini Mansion (FOX 11)
      case 'homeless_man_creates_mini_mans':
        if (num <= 2) {
          status = 'rejected';
          rejectionReason = 'News studio anchor desk';
        } else if (num >= 3 && num <= 24) {
          status = 'approved';
          tags.push('jose_fuentes', 'hillside_estate', 'pacoima_118', 'toy_cars', 'pink_flamingo_clock', 'retaining_rocks', 'freeway_overpass');
        } else if (num === 26 || num === 30) {
          // Keep two specific broadcast clips for Chapter 6 virality / media coverage beats
          status = 'approved';
          tags.push('jose_fuentes', 'viral_media_coverage', 'news_report', 'fox11_broadcast');
        } else if (num >= 25 && num <= 34) {
          status = 'rejected';
          rejectionReason = 'Redundant reporter standup / talking head';
        } else {
          status = 'approved';
          tags.push('pacoima_118', 'hillside_estate', 'wide_freeway_view');
        }
        break;

      // 4. Stella Ponce Pacoima Hillside Encampment (NBC4)
      case 'pacoima_residents_plead_with_c':
        if (num <= 3 || num >= 19) {
          status = 'rejected';
          rejectionReason = 'NBC4 studio news anchor desk';
        } else if (num >= 11 && num <= 13) {
          status = 'rejected';
          rejectionReason = 'Talking head resident interview without b-roll';
        } else if (num >= 14 && num <= 18) {
          status = 'approved';
          tags.push('stella_ponce', 'bicycles_trash_pile', 'pacoima_fence', 'encampment_debris', 'grievance_side');
        } else {
          status = 'approved';
          tags.push('stella_ponce', 'pacoima_encampment', 'backyard_fence', 'hillside_debris', 'night_encampment');
        }
        break;

      // 5. Pacoima Street Homelessness & Businesses (KTLA 5)
      case 'pacoima_street_homelessness_tr':
        if (num <= 7 || (num >= 12 && num <= 14) || num >= 26) {
          status = 'rejected';
          rejectionReason = 'News anchor studio or talking head interview';
        } else if (num >= 8 && num <= 11) {
          status = 'approved';
          tags.push('pacoima_street', 'sidewalk_tents', 'business_trash', 'commercial_corridor');
        } else {
          status = 'approved';
          tags.push('pacoima_businesses', 'strip_mall_corridor', 'street_conditions', 'trash_affecting_business');
        }
        break;

      // 6. Caltrans Crews Clean Out Sacramento Homeless Camp (CBS13)
      case 'caltrans_crews_clean_out_sacra':
        if (num <= 4 || (num >= 12 && num <= 15) || num >= 27) {
          status = 'rejected';
          rejectionReason = 'Studio anchor desk, dark frames, or talking heads';
        } else if (num >= 22 && num <= 26) {
          status = 'approved';
          tags.push('caltrans_notice_to_vacate', 'eviction_notice', 'caltrans_crews', 'orange_cones', 'state_property');
        } else {
          status = 'approved';
          tags.push('freeway_margin_debris', 'caltrans_corridor', 'underpass_campsite', 'cleanup_pressure');
        }
        break;

      // 7. Jurisdictional Encampment Fight / Railroad Debris (KPIX 5)
      case 'homeless_encampment_fight_erup':
        if (num <= 2 || (num >= 10 && num <= 14)) {
          status = 'rejected';
          rejectionReason = 'Studio anchor desk or corporate spokesman talking head';
        } else if (num >= 3 && num <= 9) {
          status = 'approved';
          tags.push('railroad_tracks_debris', 'jurisdictional_gap', 'encampment_rubbish', 'no_mans_land');
        } else {
          status = 'approved';
          tags.push('railroad_easement', 'mass_debris_piles', 'unresolved_cleanup', 'jurisdiction_standoff');
        }
        break;

      // 8. Sepulveda Basin Encampment Sweep & Heavy Machinery
      case 'crews_clean_up_homeless_encamp':
        if (num <= 4 || num >= 25) {
          status = 'rejected';
          rejectionReason = 'News anchor intro / outro';
        } else {
          status = 'approved';
          tags.push('encampment_sweep', 'heavy_machinery', 'caltrans_city_cleaners', 'protective_suits', 'removal_operations');
        }
        break;

      // 9. Freeway Overpass Encampments (NBC4)
      case 'could_homeless_encampments_und':
        if (num <= 11 || num >= 21) {
          status = 'rejected';
          rejectionReason = 'Studio anchor desk, reporter standup, or talking head interview';
        } else {
          status = 'approved';
          tags.push('freeway_underpass_tents', 'concrete_highway_wall', 'freeway_traffic_passing', 'overpass_encampment');
        }
        break;

      // 10. North Hollywood Pallet Homes
      case 'north_hollywood_pallet_homes_x':
        if (num <= 4 || (num >= 10 && num <= 14)) {
          status = 'rejected';
          rejectionReason = 'Politician / masked talking head interview';
        } else if (num >= 5 && num <= 9) {
          status = 'approved';
          tags.push('north_hollywood_shelter', 'pallet_homes', 'modular_cabins', 'temporary_housing', 'tiny_home_village');
        } else {
          status = 'approved';
          tags.push('pallet_tiny_homes', 'victory_blvd_freeway', 'village_walkway', 'lockable_door', 'interim_shelter');
        }
        break;

      // 11. Los Angeles Temporary COVID Shelters
      case 'los_angeles_opens_temporary_ho':
        if (num <= 12 || num >= 27) {
          status = 'rejected';
          rejectionReason = 'Mayor Garcetti press conference talking heads';
        } else {
          status = 'approved';
          tags.push('emergency_shelter_cots', 'convention_center_partitions', 'city_shelter_capacity', 'institutional_shelter');
        }
        break;

      // 12. Encampments Near Beverly Hills
      case 'homeless_encampments_growing_n':
        if (num <= 4 || num >= 19) {
          status = 'rejected';
          rejectionReason = 'Studio anchor desk or talking head interviews';
        } else {
          status = 'approved';
          tags.push('corridor_tents', 'sidewalk_survival', 'older_unhoused', 'la_county_homelessness');
        }
        break;

      // 13. California Roadside Encampments
      case 'oakland_california_homeless_en':
        if (num <= 10 || num >= 41) {
          status = 'rejected';
          rejectionReason = 'Dashboard windshield glare or repetitive driving footage';
        } else {
          status = 'approved';
          tags.push('california_encampment_broll', 'wooden_retaining_walls', 'tarp_structures', 'makeshift_estate');
        }
        break;

      // 14. Westwood City Encampment Sweep
      case 'homeless_encampment_cleanup_in':
        if (num <= 4 || num >= 21) {
          status = 'rejected';
          rejectionReason = 'Anchor intro or talking head interviews';
        } else {
          status = 'approved';
          tags.push('city_sweeps', 'sanitation_workers', 'trash_dumpsters', 'street_clearance');
        }
        break;

      // 15. Little Tokyo Encampment Removal
      case 'los_angeles_city_crews_to_remo':
        if (num <= 2 || num >= 15) {
          status = 'rejected';
          rejectionReason = 'Night anchor intro or talking heads';
        } else {
          status = 'approved';
          tags.push('city_sanitation_crews', 'encampment_notices', 'clean_up_trucks', 'public_order_sweeps');
        }
        break;

      // 16. Bathroom on Wheels Mobile Sanitation
      case 'how_a_bathroom_on_wheels_is_ch':
        if (num <= 5 || (num >= 26 && num <= 45) || num >= 59) {
          status = 'rejected';
          rejectionReason = 'Intro/outro or talking head interviews';
        } else {
          status = 'approved';
          tags.push('mobile_bathroom', 'shower_trailer', 'hygiene_sanitation', 'dignity_services');
        }
        break;

      // 17. Tiny Home Out of Portable Toilets
      case 'he_made_a_tiny_home_out_of_por':
        if (num <= 6 || num === 26 || num >= 41) {
          status = 'rejected';
          rejectionReason = 'YouTuber host talking directly to camera / outro pitch';
        } else {
          status = 'approved';
          tags.push('portable_toilet_conversion', 'plastic_tiny_home', 'compact_shelter', 'sanitation_structure');
        }
        break;

      // 18. Port-A-Potties Tiny Home Conversion
      case 'man_wants_to_convert_port_a_po':
        if (num <= 3 || num >= 13) {
          status = 'rejected';
          rejectionReason = 'Anchor intro or outro';
        } else {
          status = 'approved';
          tags.push('port_a_potty_prototype', 'modular_shell', 'micro_shelter_concept');
        }
        break;

      // 19. Porta Potty House Micro Home
      case 'porta_potty_house_world_s_smal':
        if (num <= 4 || num >= 19) {
          status = 'rejected';
          rejectionReason = 'YouTuber intro or black screen outro';
        } else {
          status = 'approved';
          tags.push('porta_potty_house', 'interior_micro_bed', 'compact_living');
        }
        break;

      // 20. Hollywood Encampment Returns
      case 'homeless_encampment_in_hollywo':
        status = 'approved';
        tags.push('hollywood_encampment', 'sidewalk_return', 'persistent_homelessness');
        break;

      default:
        status = 'pending';
        break;
    }

    clip.status = status;
    clip.rejectionReason = rejectionReason;
    if (status === 'approved') {
      clip.tags = tags;
      approvedCount++;
    } else {
      rejectedCount++;
    }
  }

  saveProjectManifest(manifest);

  console.log(`✅ Visual Screening Complete:`);
  console.log(`   • Total Clips Processed: ${manifest.clips.length}`);
  console.log(`   • Approved Authentic B-Roll Clips: ${approvedCount}`);
  console.log(`   • Rejected Clips (Anchors, Loudlabs Fire, Talking Heads): ${rejectedCount}\n`);
}

screenAndTagClips();
