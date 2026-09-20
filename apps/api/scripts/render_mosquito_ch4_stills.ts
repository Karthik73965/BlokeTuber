import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

async function main() {
  console.log('Rendering Chapter 4 test stills...');
  const rootDir = path.resolve(__dirname, '../../..');
  const entryPoint = path.resolve(rootDir, 'packages/remotion-video/src/index.ts');
  const outDir = path.resolve(rootDir, 'output/mosquito/stills_ch4');
  fs.mkdirSync(outDir, { recursive: true });

  const serveUrl = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  const compositionId = 'Mosquito-Chapter4-TwinStudy';
  const composition = await selectComposition({
    serveUrl,
    id: compositionId,
  });

  console.log(`Loaded ${composition.id} (${composition.durationInFrames} frames)`);

  const beatFrames = [
    { beat: 1, frame: 60, name: 'beat1_landmark_paper' },
    { beat: 2, frame: 200, name: 'beat2_ytube_apparatus' },
    { beat: 3, frame: 450, name: 'beat3_identical_twins_50_50' },
    { beat: 4, frame: 650, name: 'beat4_fraternal_twins_variation' },
    { beat: 5, frame: 850, name: 'beat5_genetics_pie_chart' },
    { beat: 6, frame: 1100, name: 'beat6_dna_traits' },
    { beat: 7, frame: 1350, name: 'beat7_citronella_willpower' },
    { beat: 8, frame: 1550, name: 'beat8_gene_clusters' },
    { beat: 9, frame: 1800, name: 'beat9_volume_mute_peace' },
    { beat: 9, frame: 1880, name: 'beat9_fully_muted_flying_away' },
  ];

  for (const { beat, frame, name } of beatFrames) {
    const outPath = path.resolve(outDir, `${beat}_${name}.png`);
    console.log(`Rendering Beat ${beat} @ frame ${frame}...`);
    await renderStill({
      composition,
      serveUrl,
      output: outPath,
      frame,
    });
    console.log(`✓ Saved ${outPath}`);
  }

  console.log('All 9 stills rendered successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
