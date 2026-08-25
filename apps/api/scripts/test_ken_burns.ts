import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';

const FFMPEG = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';
const photo = path.resolve('output/cold_2026-08-23_03-09-35_fb9a2a/stock/photo_0.jpg');
const outIn = path.resolve('output/test_continuous_in.mp4');
const outOut = path.resolve('output/test_continuous_out.mp4');
const outArc = path.resolve('output/test_continuous_arc.mp4');

const fps = 30;
const duration = 2.8;
const totalFrames = Math.ceil(duration * fps);

// 1. Continuous Linear Push-In (Constant steady motion, 0 delay, 0 hesitation)
const zIn = `1.0+0.15*(on/${totalFrames})`;
// 2. Continuous Linear Reveal Pull-Out (Constant steady pull-back, 0 delay, 0 hesitation)
const zOut = `1.15-0.15*(on/${totalFrames})`;
// 3. Smooth Arc: Fluid 1.4s Zoom In -> 1.4s Zoom Out without plateau/pause
const zArc = `1.0+0.13*sin(3.14159265*on/${totalFrames})`;

const flashGrade = `eq=contrast=1.08:brightness='if(lt(t,0.10),0.20*(1-t/0.10),-0.01)':saturation=1.08`;
const grain = `noise=c0s=6:allf=t+u`;
const vignette = `vignette=PI/5`;

const runTest = (name: string, zExpr: string, outFile: string) => {
  const zoompan = `zoompan=z='${zExpr}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=1920x1080:fps=${fps}`;
  const filter = `[0:v]scale=3500:1968:force_original_aspect_ratio=increase,crop=3500:1968,${zoompan},${flashGrade},${grain},${vignette}[out]`;
  const cmd = `${FFMPEG} -y -loop 1 -i "${photo}" -t ${duration} -filter_complex "${filter}" -map "[out]" -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p "${outFile}"`;
  console.log(`Rendering ${name}...`);
  execSync(cmd, { stdio: 'inherit' });
};

runTest('Continuous Push-In', zIn, outIn);
runTest('Continuous Reveal Pull-Out', zOut, outOut);
runTest('Continuous Smooth Arc (In + Out)', zArc, outArc);
console.log('✅ All 3 motion tests rendered successfully!');
