import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

async function main() {
  console.log('===========================================================');
  console.log('📸 TESTING MOSQUITO MASTER STILL RENDERS ACROSS ALL CHAPTERS');
  console.log('===========================================================');

  const rootDir = path.resolve(__dirname, '../../..');
  const entryPoint = path.resolve(rootDir, 'packages/remotion-video/src/index.ts');
  const outDir = path.resolve(rootDir, 'output/mosquito/stills_test');
  const brainDir = 'C:/Users/karth/.gemini/antigravity-cli/brain/d23a4d68-4217-4718-8a89-92e76fa11e4f';

  fs.mkdirSync(outDir, { recursive: true });

  console.log('\n[Bundle] Bundling Remotion project...');
  const t0Bundle = Date.now();
  const serveUrl = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });
  console.log(`[Bundle] Success in ${((Date.now() - t0Bundle) / 1000).toFixed(1)}s! Serving at: ${serveUrl}`);

  const composition = await selectComposition({
    serveUrl,
    id: 'Mosquito-Master',
  });
  console.log(`[Composition] Loaded ${composition.id} (${composition.durationInFrames} frames @ ${composition.fps}fps)`);

  const testFrames = [
    { frame: 100, label: 'ch0_patio_bbq' },
    { frame: 400, label: 'ch0_vampire_dots' },
    { frame: 1250, label: 'ch0_lemon_ghost' },
    { frame: 2900, label: 'ch1_flower_bar' },
    { frame: 4000, label: 'ch1_wifi_hotel' },
    { frame: 6000, label: 'ch2_microbe_tenants' },
    { frame: 7300, label: 'ch2_carboxylic_do_not_lick' },
    { frame: 9300, label: 'ch3_hospital_receptionist' },
    { frame: 10600, label: 'ch3_heritability_gauge' },
    { frame: 12500, label: 'ch4_disease_vectors' },
    { frame: 13550, label: 'ch4_restaurant_closed' },
    { frame: 14200, label: 'ch5_repellents_shelf' },
    { frame: 14900, label: 'ch5_patio_fan' },
    { frame: 16300, label: 'ch6_four_layer_hud' },
    { frame: 17300, label: 'ch6_213am_bedroom' },
  ];

  console.log(`\n📸 Rendering ${testFrames.length} still snapshots...`);
  for (const tf of testFrames) {
    const outPath = path.resolve(outDir, `${tf.label}_f${tf.frame}.jpeg`);
    const t0 = Date.now();
    await renderStill({
      composition,
      serveUrl,
      output: outPath,
      frame: tf.frame,
      imageFormat: 'jpeg',
    });
    console.log(`  ✓ Rendered ${tf.label} (frame ${tf.frame}) in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    if (fs.existsSync(brainDir)) {
      fs.copyFileSync(outPath, path.resolve(brainDir, `${tf.label}.jpeg`));
    }
  }

  console.log('\n✨ All test stills rendered and copied to brain directory successfully!');
}

main().catch((err) => {
  console.error('Fatal error rendering stills:', err);
  process.exit(1);
});
