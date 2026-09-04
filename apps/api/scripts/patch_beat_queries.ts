import fs from 'fs';
import path from 'path';
import { DIRECTED_KLOEHN_BEATS } from './direct_kloehn_chapters';

const subjectQueryMap: Record<string, { primary: string; backup: string }> = {
  // Chapter 1
  'tiny_home_fence_reveal': { primary: 'colorful small wooden cabin tiny house exterior', backup: 'handmade wooden shelter street' },
  'structure_on_wheels_bedframe': { primary: 'small mobile house on wheels street', backup: 'tiny timber shelter rolling cart' },
  'pitched_roof_tiny_home': { primary: 'wooden pitched roof handmade cabin framing', backup: 'salvaged wood roof shingles exterior' },
  'inside_lived_in_home': { primary: 'inside cozy small room neat mattress shelf', backup: 'tiny living space interior organized' },
  'interior_shelf_belongings': { primary: 'organized shelf small wooden room interior', backup: 'modest bedroom storage shelf daylight' },
  'arranged_belongings_personal_care': { primary: 'hands arranging personal items shelf interior', backup: 'neatly arranged clothes room daylight' },
  'mismatched_exterior_paint': { primary: 'colorful painted wooden wall weathered planks', backup: 'colorful patchwork wooden fence exterior' },

  // Chapter 2
  'kloehn_portrait_sculptor': { primary: 'mature artist sculptor portrait workshop sawdust', backup: 'craftsman looking at camera workshop' },
  'sculptor_hands_chiseling': { primary: 'sculptor hands carving wood chisel close up', backup: 'artisan carving timber hands workshop' },
  'welding_steel_scrap_sparks': { primary: 'welding sparks flying metal workshop industrial', backup: 'craftsman welding metal frame sparks' },
  'found_object_art_assembly': { primary: 'assemblage art found objects metal scrap', backup: 'sorting through scrap metal parts workshop' },
  'kloehn_in_studio_thinking': { primary: 'artist sitting thoughtful studio workbench', backup: 'carpenter thinking looking at timber designs' },
  'dumpster_dive_hunting': { primary: 'rummaging through industrial scrap metal pile', backup: 'salvaging discarded wooden pallets street' },
  'sculpture_gallery_exhibition': { primary: 'contemporary art sculpture gallery white walls', backup: 'art gallery wooden sculpture exhibition' },

  // Chapter 3
  'kloehn_interview_camera': { primary: 'documentary interview craftsman workshop tools', backup: 'older builder talking in workshop daylight' },
  'filmmaker_pointing_camera': { primary: 'video camera on tripod filming documentary', backup: 'cameraman filming interview documentary studio' },
  'close_up_kloehn_speaking': { primary: 'close up mature craftsman speaking passionate', backup: 'portrait carpenter talking genuine expression' },
  'workshop_clutter_surroundings': { primary: 'messy carpentry workshop tools hanging wall', backup: 'cluttered artist studio sawdust timber planks' },

  // Chapter 4
  'kloehn_sorting_discarded_pallets': { primary: 'man lifting wooden pallets loading truck', backup: 'stacking wooden pallets industrial alley' },
  'salvaged_doors_leaning_wall': { primary: 'vintage wooden doors stacked against wall', backup: 'old reclaimed doors salvage yard' },
  'measuring_scrap_timber': { primary: 'carpenter measuring reclaimed wood tape measure', backup: 'measuring timber plank with pencil square' },
  'hands_pulling_rusty_nails': { primary: 'hands using pry bar pulling rusty nail from wood', backup: 'removing nails from reclaimed pallet wood' },
  'kloehn_inspecting_caster_wheels': { primary: 'inspecting heavy duty steel caster wheels cart', backup: 'metal wheels rolling workbench' },

  // Chapter 5
  'volunteers_arriving_studio': { primary: 'group of volunteers arriving workshop smiling', backup: 'people gathering community build project' },
  'sawing_timber_planks': { primary: 'carpenter cutting wood circular saw sawdust flying', backup: 'hands sawing timber plank workbench' },
  'screwing_framing_studs': { primary: 'cordless drill driving screw into timber stud', backup: 'fastening wooden frame with power drill' },
  'painting_walls_bright_colors': { primary: 'hands painting wooden wall bright colors brush', backup: 'community volunteers painting wood fence' },
  'installing_caster_wheels_frame': { primary: 'bolting heavy caster wheel to wooden base', backup: 'attaching rolling wheels to timber frame' },
  'recipient_closing_locking_door': { primary: 'person closing front door lock keys', backup: 'wooden door opening closing home' },

  // Chapter 6
  'fleet_of_diverse_tiny_houses': { primary: 'tiny house community colorful small homes', backup: 'micro shelter wooden cabin street' },
  'standing_tall_inside_cabin': { primary: 'inside small wooden cabin camper interior', backup: 'cozy small room interior wood' },
  'caster_wheels_close_up': { primary: 'swivel caster wheels heavy duty rolling industrial', backup: 'cart wheels rolling asphalt' },
  'rolling_house_along_sidewalk': { primary: 'pushing cart wooden structure street sidewalk', backup: 'mobile house rolling urban road' },
  'the_chuck_wagon_exterior': { primary: 'wooden camper cabin on wheels handmade', backup: 'small timber home on trailer wheels' },
  'inside_chuck_wagon_kitchenette': { primary: 'tiny camper interior kitchen shelf stove', backup: 'small cabin lived in interior storage' },
  'studio_crew_laughing_workshop': { primary: 'volunteers working wood shop carpentry smiling', backup: 'community workshop people building wood' },
  'headboards_assembled_into_frame': { primary: 'wooden bed frame salvaged timber carpentry', backup: 'carpenter assembling wood frame screws' },
  'triangular_gable_roof_detail': { primary: 'pitched roof wooden shingles handmade cabin', backup: 'timber roof rafters construction detail' },
  'outside_painted_walls_bed_house': { primary: 'colorful wooden exterior wall weathered paint', backup: 'painting wooden structure bright colors' },
  'kloehn_peaceful_inside_home': { primary: 'carpenter sitting relaxing inside workshop cabin', backup: 'man smiling inside small wooden room' },
  'inspecting_unusual_scrap_curves': { primary: 'artisan examining reclaimed wood curves workshop', backup: 'builder sorting scrap lumber warehouse' },
  'kloehn_showing_home_details': { primary: 'craftsman demonstrating handmade wooden structure', backup: 'showing tiny house construction details' },

  // Chapter 7
  'cars_driving_past_tiny_home_sidewalk': { primary: 'cars driving past urban street sidewalk city', backup: 'street traffic passing city sidewalk daylight' },
  'new_volunteers_arriving_workshop': { primary: 'people arriving at community workshop tools', backup: 'volunteers meeting urban warehouse carpentry' },
  'volunteers_smiling_working_tools': { primary: 'people using cordless drill building wood project', backup: 'group working together carpentry workshop' },
  'kloehn_portrait_quiet_determination': { primary: 'portrait older craftsman carpenter focused eyes', backup: 'portrait mature builder looking thoughtful workshop' },
  'tiny_home_standing_as_advertisement': { primary: 'tiny house parked sidewalk urban roadside', backup: 'small wooden shelter street corner daylight' },
  'passersby_stopping_to_admire': { primary: 'pedestrians walking past unique street structure', backup: 'people looking at street art installation sidewalk' },
  'volunteers_scrambling_to_build': { primary: 'busy carpentry workshop sawing drilling framing', backup: 'construction crew assembling timber frame' },
  'tiny_home_on_sidewalk_crowd': { primary: 'small wooden shelter sidewalk city street crowd', backup: 'tiny house street community people passing' },

  // Chapter 8
  'kloehn_blunt_interview_portrait': { primary: 'interview portrait thoughtful artisan workshop', backup: 'portrait craftsman talking in studio' },
  'kloehn_direct_eye_contact': { primary: 'close up portrait serious craftsman looking at camera', backup: 'older man portrait thoughtful determined workshop' },
  'kloehn_speaking_in_shop': { primary: 'man talking in carpentry workshop with tools', backup: 'builder speaking inside wood shop tools' },
  'solitary_tiny_home_sidewalk': { primary: 'solitary small wooden house sidewalk city curb', backup: 'tiny shelter parked on urban street corner' },
  'peaceful_sleeping_bed_inside': { primary: 'warm bed mattress cozy small room morning light', backup: 'neatly made bed small shelter interior' },
  'kloehn_reflective_interview_shop': { primary: 'man sitting in workshop talking reflecting', backup: 'sculptor artist in messy studio thinking' },
  'people_connected_community_smiles': { primary: 'diverse people talking smiling community urban', backup: 'warm handshake neighbors smiling outdoor street' },
  'kloehn_adjusting_wheel_candid': { primary: 'mechanic builder tightening bolts on wheel cart', backup: 'installing wheels on heavy timber frame' },
  'resident_pushing_rolling_home': { primary: 'person pushing mobile cart on sidewalk sunny day', backup: 'pushing wheeled cart down urban sidewalk' },
  'kloehn_and_resident_talking_warmly': { primary: 'two people talking warmly outside urban street', backup: 'friendly conversation on city sidewalk daylight' },
  'kloehn_working_on_sidewalk_driveway': { primary: 'builder working outside driveway measuring timber', backup: 'man cutting wood outside workshop driveway' },
  'kloehn_smiling_candid_portrait': { primary: 'smiling older man craftsman genuine expression', backup: 'friendly portrait builder in flannel shirt' },
  'volunteers_celebrating_finished_build': { primary: 'group of builders high five smiling finished project', backup: 'celebrating successful community build teamwork' },
  'resident_smiling_warm_eyes': { primary: 'warm portrait smiling person relieved happy', backup: 'candid smiling face gratitude outdoor daylight' },
  'people_not_a_statistic': { primary: 'close up eyes face emotion human dignity portrait', backup: 'candid urban portrait authentic human expression' },

  // Chapter 9
  'municipal_code_regulations_paper': { primary: 'stack of building blueprints legal documents desk', backup: 'reading architectural plans paperwork desk' },
  'missing_amenities_checklist': { primary: 'vintage plumbing water pipes faucet dripping', backup: 'old water pipe shutoff valve concrete wall' },
  'kloehn_thoughtful_sidestep': { primary: 'man shrugging smiling thoughtful interview', backup: 'portrait artisan gesturing thoughtfully' },
  'mobile_home_rolling_on_street': { primary: 'small house on wheels moving along city street', backup: 'tiny mobile structure rolling down asphalt' },
  'tiny_home_exterior_humble': { primary: 'humble small wooden structure sidewalk daylight', backup: 'tiny cabin on wheels street curb morning' },
  'recipient_smiling_in_dry_shelter': { primary: 'person smiling warmly inside dry cozy shelter', backup: 'relief smiling face warm indoor shelter' },
  'kloehn_working_tools_serene': { primary: 'craftsman quietly working with hand plane wood', backup: 'carpenter hands measuring wood calm workshop' },
  'kloehn_sitting_inside_contemplative': { primary: 'man sitting quietly looking out window small room', backup: 'contemplative moment artisan sitting wooden cabin' },

  // Chapter 10
  'lineup_of_completed_tiny_homes': { primary: 'row of colorful handmade wooden structures', backup: 'tiny houses parked outside workshop yard' },
  'teaching_volunteers_tools': { primary: 'instructor teaching student how to use drill wood', backup: 'hands demonstrating power drill carpentry lesson' },
  'kloehn_framing_wood_demonstrating': { primary: 'carpenter framing wall studs with speed square', backup: 'builder holding lumber framing structure' },
  'zero_cost_fasteners_tools': { primary: 'box of used screws bolts nails sorting hands', backup: 'hands picking through assorted nuts and bolts' },
  'bustling_cramped_studio_workshop': { primary: 'busy packed workshop artists builders working', backup: 'crowded industrial studio sawdust tools' },
  'kloehn_framing_with_hands': { primary: 'carpenter aligning two 2x4 studs with bare hands', backup: 'hands assembling wooden timber joint workshop' },
  'kloehn_portrait_authentic_roots': { primary: 'authentic portrait older builder grey beard flannel', backup: 'weathered hands holding carpenter pencil workshop' },
  'recipient_opening_front_door_smiling': { primary: 'person opening small wooden door welcoming smile', backup: 'hand turning key unlocking front door daylight' },

  // Chapter 11
  'compact_bed_frame_structure_exterior': { primary: 'colorful small wooden micro home street curb', backup: 'compact mobile wooden shelter exterior' },
  'inside_shelter_modest_furnishings': { primary: 'interior tiny room tidy shelf book mattress', backup: 'organized small camper living space interior' },
  'hand_holding_brass_key': { primary: 'hand holding brass key giving to another hand', backup: 'handing over keys close up handshake' },
  'kloehn_peaceful_in_shop': { primary: 'builder standing in sawdust workshop golden hour', backup: 'quiet wood shop sunset light through windows' },
  'completed_tiny_house_sunset_oakland': { primary: 'tiny house on sidewalk sunset golden light street', backup: 'small wooden cabin urban street dusk warm light' },
};

let patchedCount = 0;
for (let ch = 1; ch <= 11; ch++) {
  const beats = DIRECTED_KLOEHN_BEATS[ch] || [];
  for (const b of beats) {
    if (!b.stockVideoQuery) {
      const subject = b.visualSubject || '';
      const mapped = subjectQueryMap[subject];
      if (mapped) {
        b.stockVideoQuery = mapped.primary;
        b.backupVideoQuery = mapped.backup;
        patchedCount++;
      } else {
        const cleanSub = subject.replace(/_/g, ' ');
        b.stockVideoQuery = `${cleanSub} urban documentary`;
        b.backupVideoQuery = 'carpentry wood workshop tools';
        patchedCount++;
      }
    }
  }
}

console.log(`Patched ${patchedCount} beats with authentic documentary stock queries.`);

// Re-write direct_kloehn_chapters.ts cleanly
const filePath = path.resolve(__dirname, 'direct_kloehn_chapters.ts');
const fileHeader = `import { PlannedBeat } from '../src/services/aiScriptPlanner';

/**
 * Hand-crafted AI Director documentary scene beats for Gregory Kloehn Chapters 1–11.
 * Directed by Antigravity with Vice/Vox documentary pacing:
 * - 1.5s – 3.5s baseline snappy cuts (hard cap < 5.0s)
 * - 14 Authentic local RAW videos & photos from Oakland
 * - Dynamic selection across 18 screen layouts & 20 animated callouts
 * - Zero OpenRouter dependency: 100% pure Antigravity architecture
 */
export const DIRECTED_KLOEHN_BEATS: Record<number, PlannedBeat[]> = `;

const content = fileHeader + JSON.stringify(DIRECTED_KLOEHN_BEATS, null, 2) + ';\n';
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated direct_kloehn_chapters.ts!');
