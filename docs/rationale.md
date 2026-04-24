---
layout: default
title: Why PMF
---

# Why PMF

## The gap

Procedural and AI-assisted music generators exist in every engine, every game framework, and every creative coding environment. They all produce audio. Most of them produce nothing else — no structured description of what they generated, no way for another tool to inspect or replay the composition, no format an LLM can reason about.

PMF fills that gap.

## What existing formats miss

### MIDI

MIDI stores *performance data* — note-on, note-off, velocity, control changes, timestamps. It does not store compositional intent. A MIDI file contains no information about which seed generated it, what key it was composed in, what mood it expresses, or how the arrangement unfolds. You can reconstruct the notes from MIDI but not the recipe.

MIDI is also binary. LLMs cannot read binary formats directly.

### MusicXML

MusicXML stores *score notation* — staves, measures, noteheads, articulations, layout. It is designed for printing and interchange between notation software. Its XML verbosity is a fundamental problem for LLM consumption: research consistently shows that MusicXML produces poor results in LLM music tasks because the signal-to-noise ratio in the token stream is too low (see ABC-Eval 2024, Teaching LLMs Music Theory 2025).

### ABC Notation

ABC is the strongest existing text-based format for LLM note tasks — it's compact, uses musical vocabulary, and has been used to train music LLMs (ChatMusician, 2024). PMF uses ABC for melody motifs exactly because of this.

But ABC is a transcription format. It stores a sequence of notes. It does not store a seed, a mood, an arrangement structure, a BPM palette, or synthesis parameters. It cannot describe *how a piece was generated* — only what notes were produced.

### ChordPro / YNote / HNote

ChordPro is for lead sheets and lyrics. YNote and HNote are optimized for LLM note generation — compact fixed-width encodings that reduce sequence length. Like ABC, they are note-sequence formats. None captures the generative layer.

## The research case for text + musical vocabulary

The research on LLM-readable music formats points to consistent findings:

1. **Text beats binary every time.** MIDI requires tokenization with tens of thousands of tokens. Text formats at the same musical resolution use a fraction.
2. **Musical vocabulary beats raw numbers.** `"Am"` is better than `69`. `"i-VI-III-VII"` is better than `[0, 5, 3, 7]`. LLMs have been trained on enormous music theory corpora — use that.
3. **Shorter sequences perform better.** ABC outperforms MusicXML in LLM music tasks primarily because it's 10-50x more compact for the same musical content.
4. **Summary fields anchor comprehension.** When an LLM is given a natural language description alongside structured data, it reasons more accurately about the structured data (retrieval-augmented reasoning).

PMF is designed around all four of these findings.

## Why JSON and not a custom DSL

A custom DSL would allow more expressive syntax — inline chord notation, rhythm shorthand, etc. But:

- Every LLM in existence has been trained on billions of JSON documents
- JSON has universal tooling: parsers, validators, diffing, querying
- JSON is unambiguous — there is exactly one way to represent a given structure
- A custom DSL requires documentation just to parse; JSON requires none

The expressive power of a custom DSL buys very little for PMF's use case. The musical vocabulary comes from the field names and values, not the syntax. ABC notation handles the one case where compact note encoding matters (melody motifs).

## PMF vs MIDI: complementary, not competing

PMF is not a replacement for MIDI. The two serve different purposes:

| | PMF | MIDI |
|---|---|---|
| Stores | Compositional recipe | Performance events |
| Readable by | LLMs, humans, any JSON tool | DAWs, samplers, hardware |
| Round-trips to | Re-generation | Playback |
| Contains | Seed, mood, arrangement structure | Note-on/off, velocity, CC |

An engine can export both from the same render. PMF tells you *what* was composed and *why*. MIDI tells you *how it sounded* note by note.
