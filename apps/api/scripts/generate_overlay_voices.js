const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '../output/showcase_12_overlays/audio');
fs.mkdirSync(outDir, { recursive: true });

const overlayNames = [
  'Overlay 1: Film Dust and Scratches',
  'Overlay 2: Star Sparkles and Light Bokeh',
  'Overlay 3: Film Burn and Light Leaks',
  'Overlay 4: Vintage C R T Scanlines',
  'Overlay 5: Camera Viewfinder H U D',
  'Overlay 6: 35 millimeter Silver Halide Film Grain',
  'Overlay 7: Archival Halftone and Newsprint Texture',
  'Overlay 8: Cinematic Edge Vignette',
  'Overlay 9: Chromatic Aberration and Lens Prism',
  'Overlay 10: 16 millimeter Sprocket Film Frame',
  'Overlay 11: Rain Streaks and Wet Lens Droplets',
  'Overlay 12: V H S Glitch and Tape Tear',
];

console.log('Generating voice narration for 12 overlays using Windows Speech Synthesis...');

// Write powershell script to generate all 12 WAV files
const psLines = [
  'Add-Type -AssemblyName System.Speech',
  '$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer',
  '$synth.Rate = 0',
];

overlayNames.forEach((name, i) => {
  const wavPath = path.join(outDir, `voice_${i}.wav`).replace(/\\/g, '/');
  psLines.push(`$synth.SetOutputToWaveFile("${wavPath}")`);
  psLines.push(`$synth.Speak("${name}")`);
});

psLines.push('$synth.Dispose()');
psLines.push('Write-Output "ALL_VOICES_DONE"');

const psFile = path.join(outDir, 'gen_voices.ps1');
fs.writeFileSync(psFile, psLines.join('\r\n'), 'utf-8');

try {
  const result = execSync(`powershell -ExecutionPolicy Bypass -File "${psFile}"`, { encoding: 'utf-8' });
  console.log('Result:', result.trim());
  const files = fs.readdirSync(outDir).filter(f => f.endsWith('.wav'));
  console.log(`Successfully generated ${files.length} voice WAV files!`);
} catch (err) {
  console.error('Error generating voices:', err);
}
