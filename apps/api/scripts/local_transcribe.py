import os
import sys
import json
import argparse
from faster_whisper import WhisperModel

def transcribe(audio_path, model_size="base", device="cpu", compute_type="int8", language=None):
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    # Use CPU by default with int8 quantization for high speed and minimal memory
    model = WhisperModel(model_size, device=device, compute_type=compute_type)

    kwargs = {
        "word_timestamps": True,
        "beam_size": 5,
        "vad_filter": True,
    }
    if language:
        kwargs["language"] = language

    segments, info = model.transcribe(audio_path, **kwargs)

    result_segments = []
    all_words = []

    for segment in segments:
        seg_dict = {
            "id": segment.id,
            "seek": segment.seek,
            "start": round(segment.start, 3),
            "end": round(segment.end, 3),
            "text": segment.text.strip(),
            "words": []
        }
        if segment.words:
            for w in segment.words:
                w_dict = {
                    "word": w.word.strip(),
                    "start": round(w.start, 3),
                    "end": round(w.end, 3),
                    "probability": round(w.probability, 3)
                }
                seg_dict["words"].append(w_dict)
                all_words.append(w_dict)

        result_segments.append(seg_dict)

    return {
        "language": info.language,
        "language_probability": round(info.language_probability, 3),
        "duration": round(info.duration, 3),
        "segments": result_segments,
        "words": all_words,
        "text": " ".join(s["text"] for s in result_segments)
    }

def main():
    parser = argparse.ArgumentParser(description="Local Whisper Transcription with Word Timestamps")
    parser.add_argument("--audio", required=True, help="Path to input audio file")
    parser.add_argument("--model", default="base", help="Model size: tiny, base, small, medium, large-v3")
    parser.add_argument("--output", help="Optional output JSON file path")
    parser.add_argument("--device", default="cpu", help="Device: cpu or cuda")
    parser.add_argument("--compute_type", default="int8", help="Compute type: int8, float16, float32")
    parser.add_argument("--language", default=None, help="Language code (optional)")

    args = parser.parse_args()

    try:
        data = transcribe(
            audio_path=args.audio,
            model_size=args.model,
            device=args.device,
            compute_type=args.compute_type,
            language=args.language
        )
        json_output = json.dumps(data, ensure_ascii=False, indent=2)

        if args.output:
            os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(json_output)
            print(f"Transcription saved to {args.output}")
        else:
            print(json_output)

    except Exception as e:
        sys.stderr.write(f"Error: {e}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
