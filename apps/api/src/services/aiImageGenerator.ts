import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
// Default to the cheapest and highest-quality image generation model on OpenRouter (~$0.03/image)
const DEFAULT_IMAGE_MODEL = 'google/gemini-2.5-flash-image';

export interface GenerateImageParams {
  visualSubject?: string;
  text: string;
  projectContext?: string;
  chapterContext?: string;
  negativeKeywords?: string[];
  outputPath: string;
}

export interface GeneratedImageResult {
  success: boolean;
  outputPath: string | null;
  prompt: string;
  source: 'ai_generated';
  cost?: number;
  error?: string;
}

/**
 * Builds a context-aware cinematic prompt anchored in the documentary premise and chapter directive.
 */
export function buildDocumentaryImagePrompt(params: {
  visualSubject?: string;
  text: string;
  projectContext?: string;
  chapterContext?: string;
  negativeKeywords?: string[];
}): string {
  const { visualSubject, text, projectContext, chapterContext, negativeKeywords } = params;

  const promptSections = [
    `Generate an authentic, ultra-realistic 35mm documentary photograph in 16:9 widescreen landscape.`,
    projectContext ? `DOCUMENTARY STORY PREMISE: ${projectContext}` : '',
    chapterContext ? `CHAPTER VISUAL CONTEXT: ${chapterContext}` : '',
    visualSubject ? `PRIMARY VISUAL SUBJECT: ${visualSubject}` : '',
    text ? `SPOKEN NARRATION IN THIS SCENE: "${text}"` : '',
    `CINEMATOGRAPHY & STYLE DIRECTIVES:
- Realistic 35mm documentary photography (Vice, BBC, HBO investigative documentary style).
- Naturalistic lighting, authentic real-world textures, subtle film grain, real optical depth of field.
- If characters or people are present, strictly match their demographic profile, age, worn clothing, and mood described in the story premise.
- Shot from an authentic photojournalistic camera angle (handheld eye-level, vehicle interior, dashcam perspective, or observational wide).
- 16:9 landscape aspect ratio suitable for cinematic video overlay.
- STRICTLY FORBIDDEN: No cartoons, no 3D renders, no anime, no shiny CGI, no airbrushing, no text overlays, no watermarks, no subtitles.`,
    negativeKeywords && negativeKeywords.length > 0
      ? `EXCLUDED OBJECTS & CONFLICTS: ${negativeKeywords.join(', ')}`
      : '',
  ].filter(Boolean);

  return promptSections.join('\n\n');
}

/**
 * Generates a custom documentary image using OpenRouter's multimodal image models.
 * Automatically saves the decoded image buffer to disk at `outputPath`.
 */
export async function generateDocumentaryImage(
  params: GenerateImageParams
): Promise<GeneratedImageResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      outputPath: null,
      prompt: '',
      source: 'ai_generated',
      error: 'OPENROUTER_API_KEY is not configured',
    };
  }

  const model = process.env.IMAGE_GEN_MODEL || DEFAULT_IMAGE_MODEL;
  const prompt = buildDocumentaryImagePrompt(params);

  console.log(`🎨 [AI Image Generator] Generating custom documentary visual with model: ${model}...`);
  console.log(`   Subject: "${params.visualSubject || params.text.slice(0, 50)}"`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000); // 45s timeout

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bloketuber.app',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        modalities: ['image', 'text'],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter image generation failed (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as any;
    const message = data.choices?.[0]?.message;

    // Check for images array in response (standard for multimodal image generation)
    let base64Data: string | null = null;
    let imageUrl: string | null = null;

    if (Array.isArray(message?.images) && message.images.length > 0) {
      const firstImage = message.images[0];
      const url = typeof firstImage === 'string' ? firstImage : firstImage?.image_url?.url || firstImage?.url;
      if (url) {
        if (url.startsWith('data:image/')) {
          base64Data = url.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        } else {
          imageUrl = url;
        }
      }
    }

    // Fallback: check if base64 data or markdown image link was returned in content
    if (!base64Data && !imageUrl && message?.content) {
      const content = String(message.content);
      const dataUriMatch = content.match(/data:image\/[a-zA-Z]+;base64,([A-Za-z0-9+/=]+)/);
      if (dataUriMatch && dataUriMatch[1]) {
        base64Data = dataUriMatch[1];
      } else {
        const markdownMatch = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
        if (markdownMatch && markdownMatch[1]) {
          imageUrl = markdownMatch[1];
        }
      }
    }

    if (!base64Data && !imageUrl) {
      throw new Error('No image payload returned in OpenRouter assistant response');
    }

    // Ensure parent directory exists
    const dir = path.dirname(params.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (base64Data) {
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(params.outputPath, buffer);
    } else if (imageUrl) {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`Failed to fetch generated image URL: ${imageUrl}`);
      const arrayBuffer = await imgRes.arrayBuffer();
      fs.writeFileSync(params.outputPath, Buffer.from(arrayBuffer));
    }

    const cost = data.usage?.cost || 0.03;
    console.log(`  ✨ [AI Image Generated] Saved to: ${params.outputPath} (Cost: ~$${cost.toFixed(4)})`);

    return {
      success: true,
      outputPath: params.outputPath,
      prompt,
      source: 'ai_generated',
      cost,
    };
  } catch (err: any) {
    console.error(`  ❌ [AI Image Generator] Failed: ${err.message}`);
    return {
      success: false,
      outputPath: null,
      prompt,
      source: 'ai_generated',
      error: err.message,
    };
  }
}
