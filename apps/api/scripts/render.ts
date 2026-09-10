#!/usr/bin/env tsx
import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';

const timelineJsonPath = process.argv[2];
if (!timelineJsonPath) {
  console.error('Usage: tsx scripts/render.ts <timeline.json> [output.mp4]');
  process.exit(1);
}

const absoluteTimelinePath = path.resolve(timelineJsonPath);
if (!fs.existsSync(absoluteTimelinePath)) {
  console.error(`❌ Timeline file not found at: ${absoluteTimelinePath}`);
  process.exit(1);
}

const timeline = JSON.parse(fs.readFileSync(absoluteTimelinePath, 'utf-8'));
let outputPath = process.argv[3];
if (!outputPath) {
  if (timeline.outputPath && /\.mp4$/i.test(timeline.outputPath)) {
    outputPath = timeline.outputPath;
  } else {
    outputPath = path.join(path.dirname(absoluteTimelinePath), 'final_video.mp4');
  }
}

renderTimelineVideo(absoluteTimelinePath, outputPath)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Render error:', err);
    process.exit(1);
  });
