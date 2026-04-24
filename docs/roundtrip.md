---
layout: default
title: Round-Trip Contract
---

# Round-Trip Contract

A PMF file **round-trips** if passing it back to the originating engine produces the same audio output.

PMF defines two modes of round-trip, with different requirements and guarantees.

---

## Exact Round-Trip

**Definition:** The engine produces byte-identical audio from the PMF file as it did on the original render.

**Required fields (unchanged):**

| Field | Why it matters |
|---|---|
| `identity.seed` | The seed is the source of all composition decisions |
| `render_key.sample_rate` | Different sample rates produce different PCM |
| `render_key.bars` | Different bar counts produce different length output |
| `render_key.stem_format` | Channel layout affects every sample value |
| `render_key.loop_mode` | Loop-aware processing changes the tail |
| `render_key.engine_version_major` | Determinism is only guaranteed within a major version |
| `engine` | Different engines produce different output from the same seed |

**What the engine does:** Re-derives all composition parameters from the seed. All other PMF fields (harmony, melody, arrangement, voices, fx, mix) are informational — the engine ignores them in exact mode and regenerates from scratch.

**Guarantee scope:** Byte-identical output is guaranteed only on the same platform and binary, or within the Tier 1 determinism guarantee of the specific engine. See the engine's own determinism documentation for cross-platform guarantees.

---

## Approximate Round-Trip

**Definition:** The engine accepts an edited PMF file and renders a new composition that is musically consistent with the edited parameters — not byte-identical to the original, but coherent with the changes.

**Example use cases:**
- Change `identity.mood` from `"NightDrive"` to `"NeonClub"` and re-render
- Edit `harmony.progression` to a different chord set and re-render
- Swap `melody.motif_a.abc` and re-render with a new melodic idea

**Requirements:**
- The engine must explicitly declare support for approximate round-trip
- Engines that do not support it may ignore all fields except the reconstruction key and re-derive everything from the seed (falling back to exact mode)

**What the engine does:** Uses the edited PMF fields to override corresponding palette selections. The seed is still used for any fields not explicitly overridden.

**Result:** The output will differ from the original PCM but will reflect the user's edits. It is not guaranteed to be byte-identical across multiple renders of the same edited PMF (depends on how the engine applies overrides).

---

## Validation Before Round-Trip

Before submitting a PMF to an engine for round-trip, validate it against the schema:

```bash
npx ajv-cli validate -s schema/pmf-0.1.schema.json -d your-file.pmf
```

A file that fails schema validation may be accepted by some engines and rejected by others. Engines are not required to validate incoming PMF files, but they are encouraged to warn on schema violations.

---

## Version Mismatch Behavior

| Situation | Recommended engine behavior |
|---|---|
| `pmf_version` matches | Proceed normally |
| `pmf_version` minor differs | Accept, ignore unknown fields, warn if fields are missing |
| `pmf_version` major differs | Reject or warn loudly; behavior is undefined |
| `engine` differs | Attempt if engine can interpret the file; otherwise reject |
| `engine_version_major` differs | Exact round-trip may produce different output; approximate round-trip is unaffected |
