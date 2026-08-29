import path from 'path';
import { renderTimelineVideo } from '../src/services/remotionRenderer';

async function renderExisting() {
  const timelineJsonPath = path.resolve(process.cwd(), 'output', 'pipeline_audit_test', 'audit_timeline.json');
  const finalVideoPath = path.resolve(process.cwd(), 'output', 'pipeline_audit_test', 'full_pipeline_audit_video.mp4');

  console.log('🎬 [RenderDirect] Rendering already-downloaded assets from timeline:', timelineJsonPath);
  await renderTimelineVideo(timelineJsonPath, finalVideoPath);
  console.log('🎉 RENDER COMPLETE! Video saved to:', finalVideoPath);
}

renderExisting().catch((err) => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
