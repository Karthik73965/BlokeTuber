import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

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
const MODEL = process.env.CLIP_MATCH_MODEL || 'openai/gpt-4o-mini';

export interface ClipMatch {
  clipPath: string | null; // null means use stock footage
  confidence: number; // 0-1
  reason: string;
  useStock: boolean;
  stockQuery?: string;
}

export interface BeatInput {
  text: string;
  startTime: number; // seconds
  endTime: number;
  chapterIndex: number;
  beatIndex: number;
}

/**
 * Uses OpenRouter (cheap model) to match each beat to the best clip from the library.
 * Falls back to stock footage if confidence is below threshold.
 */
export async function matchClipForBeat(
  beat: BeatInput,
  availableClips: string[], // list of filenames (no paths)
  usedClips: Set<string>, // already used clips to reduce repetition
  confidenceThreshold = 0.6
): Promise<ClipMatch> {
  const systemPrompt = `You are an expert documentary video editor for "American Hideaways".
Your task is to match fast-paced narration beats (~2 seconds each) to visual video clips.

Analyze the script beat for VISUAL SUBJECTS with an American/USA documentary context (e.g. "American suburban home", "US veteran portrait", "rural USA landscape", "cinema crowd", "American dollar money").

Compare against the available clip filenames. Match by topic and keywords.

Respond ONLY with a valid JSON object:
{
  "clipFilename": "<exact filename from available list OR null if none fit>",
  "confidence": <number between 0.0 and 1.0>,
  "reason": "<one sentence visual matching rationale>",
  "useStock": <true if confidence < 0.7 or no clip matches, false if clip selected>,
  "stockQuery": "<if useStock is true: 2-4 word visual query ALWAYS including American/USA context, e.g. 'American suburban house', 'USA rural road sunset', 'American veteran portrait'>"
}

Rules:
1. ONLY match a clip filename if its topic directly relates to the beat text (confidence >= 0.7).
2. If no available clip matches well, set clipFilename to null, useStock to true, and generate a clean 2-4 word American/USA stockQuery.
3. Keep stockQuery visual, specific, and grounded in high-quality American documentary real estate style.`;

  const userMessage = `Script beat: "${beat.text}"

Available clips:
${availableClips.map((c, i) => `${i + 1}. ${c}${usedClips.has(c) ? ' [already used]' : ''}`).join('\n')}

Pick the best matching clip.`;

  let response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://bloketuber.app',
    },
    body: JSON.stringify({
      model: process.env.CLIP_MATCH_MODEL || 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: 256,
    }),
  });

  // If specified model returns 404 (e.g. retired model name), fallback to openai/gpt-4o-mini
  if (response.status === 404) {
    console.warn(`[ClipMatcher] Model "${process.env.CLIP_MATCH_MODEL}" returned 404. Retrying with "openai/gpt-4o-mini"...`);
    response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bloketuber.app',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.2,
        max_tokens: 256,
      }),
    });
  }

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as any;
  const rawContent = data.choices?.[0]?.message?.content || '{}';

  let parsed: any;
  try {
    // Strip any accidental markdown fences
    const clean = rawContent.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    parsed = JSON.parse(clean);
  } catch {
    return {
      clipPath: null,
      confidence: 0,
      reason: 'Failed to parse AI response',
      useStock: true,
      stockQuery: beat.text.slice(0, 60),
    };
  }

  const confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0));
  const useStock = parsed.useStock === true || confidence < confidenceThreshold;

  return {
    clipPath: useStock ? null : parsed.clipFilename || null,
    confidence,
    reason: parsed.reason || '',
    useStock,
    stockQuery: useStock ? parsed.stockQuery || beat.text.slice(0, 80) : undefined,
  };
}

/**
 * Detect dollar/number callouts in a beat's text.
 */
export function detectNumberCallouts(text: string): string[] {
  const patterns = [
    /\$[\d,]+(?:\.\d+)?(?:\s*(?:million|billion|thousand|k|m|b))?/gi,
    /\d+(?:,\d{3})*(?:\.\d+)?\s*(?:dollars?|cents?)/gi,
    /\b\d{1,4}(?:,\d{3})+\b/g, // large numbers like 2,000
    /\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:thousand|million|billion)/gi,
  ];

  const found = new Set<string>();
  for (const pattern of patterns) {
    const matches = text.match(pattern) || [];
    matches.forEach((m) => found.add(m.trim()));
  }
  return Array.from(found);
}
