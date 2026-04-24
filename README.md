---
layout: default
title: PMF — Procedural Music Format
---

# PMF — Procedural Music Format

[![Website](https://img.shields.io/badge/website-simplyliz.github.io%2Fpmf--spec-blue.svg)](https://simplyliz.github.io/pmf-spec/)
[![Version: 1.0](https://img.shields.io/badge/version-1.0-blue.svg)](https://simplyliz.github.io/pmf-spec/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://simplyliz.github.io/pmf-spec/)

PMF is an open JSON-based format for procedural and AI-assisted music composition data.

It stores **the recipe that generates music** — not the audio, not the score, not a DAW session. Any LLM that knows music theory can read a `.pmf` file and reason about it without documentation.

---

## What it looks like

```json
{
  "pmf_version": "1.0",
  "engine": "my-engine",
  "summary": "Mid-tempo track in A minor at 128 BPM. Sparse intro builds to full mix by bar 4.",
  "identity": {
    "seed": 42,
    "bpm": 128.0,
    "bpm_label": "mid-tempo",
    "key": "A minor",
    "bars": 8
  },
  "render_key": {
    "sample_rate": 44100,
    "bars": 8,
    "stem_format": "stereo",
    "loop_mode": "looped",
    "engine_version_major": 1
  },
  "harmony": {
    "progression": ["Am", "F", "C", "G"],
    "progression_degrees": ["i", "VI", "III", "VII"],
    "progression_label": "classic minor turnaround"
  }
}
```

See [examples/minimal.pmf](examples/minimal.pmf) and [examples/synthwave-example.pmf](examples/synthwave-example.pmf) for complete files.

---

## Why not MIDI / MusicXML / ABC?

| Format | Designed for | What's missing |
|---|---|---|
| MIDI | Performance capture | No compositional intent — just note events |
| MusicXML | Score printing | XML verbosity destroys LLM readability |
| ABC Notation | Score transcription | Note-level only; no seed, mood, or generative params |
| ChordPro | Chord sheets | No melody, arrangement, or synthesis detail |

PMF is the missing layer: it describes **how to generate** music, not music that already exists.

---

## Structure

A `.pmf` file has a generic core (readable by any tool) and optional engine-specific sections:

| Section | Generic? | What it contains |
|---|---|---|
| `summary` | yes | Engine-generated natural language description |
| `identity` | yes | Seed, key, BPM, mood, bar count |
| `render_key` | yes | Sample rate, loop mode, engine version — reconstruction key |
| `harmony` | yes | Chord progression, bass pattern, arp |
| `melody` | yes | Motifs in ABC notation with interval and rhythm labels |
| `arrangement` | yes | Section names, bar-gain masks, melody-on bars |
| `voices` | engine-defined | Per-voice synthesis parameters |
| `fx` | engine-defined | Reverb, delay, sidechain, limiter |
| `mix` | engine-defined | Stem volumes, reactive tiers |

---

## Status

**v1.0.** The format is stable and in active use by [synthwave_engine](https://github.com/SimplyLiz/synthwave-engine).

---

## Validate

A validator CLI is planned. In the meantime, use the JSON Schema directly:

```bash
npx ajv-cli validate -s schema/pmf-1.0.schema.json -d your-file.pmf
```

---

## License

MIT for everything — spec, schema, examples, tools. Use PMF in any project, open or commercial, without attribution requirements.

---

## Contributing

Open an issue or PR. PMF is an open format — implementations from other engines are welcome and encouraged. If you build something that reads or writes PMF, open an issue so we can link it.
