---
layout: default
title: Extension Policy
---

# Extension Policy

PMF's `voices`, `fx`, and `mix` sections are intentionally engine-defined — their schemas are not specified by the core format. This covers most engine-specific needs.

For data that does not fit into those sections, PMF provides the `extensions` field.

---

## The `extensions` field

`extensions` is an optional top-level object. Each key is a namespace owned by a specific engine or tool. The value is a free-form object.

```json
{
  "pmf_version": "1.0",
  "engine": "synthwave_engine",
  "summary": "...",
  "identity": { ... },
  "render_key": { ... },

  "extensions": {
    "synthwave_engine": {
      "lcg_state_after_init": 2847362918,
      "combo_tier_at_render": 2,
      "debug_palette_indices": {
        "bpm_index": 3,
        "key_index": 0,
        "progression_index": 2
      }
    }
  }
}
```

---

## Naming convention

The key inside `extensions` **must match the `engine` field** at the root, or use a globally unique reverse-domain identifier for tools that are not engines.

| Author | Recommended key |
|---|---|
| Engine named `synthwave_engine` | `"synthwave_engine"` |
| Third-party tool `pmf-inspector` | `"pmf_inspector"` or `"io.github.username.pmf-inspector"` |
| Company tool | `"com.yourcompany.toolname"` |

This prevents collisions when multiple tools each add extension data to the same file.

---

## What belongs in `extensions`

Use `extensions` for data that:
- Is engine-specific and has no equivalent in the core spec
- Is useful for debugging or analysis but not required for reproduction
- Is experimental and not yet stable enough to propose for the core spec

Do **not** use `extensions` for data that:
- Duplicates core fields (don't re-encode `bpm` in your extension namespace)
- Should be in `voices`, `fx`, or `mix` (those are already engine-defined)
- Is required for basic PMF interpretation (if something is required, propose it for the core spec)

---

## Proposing fields for the core spec

If you implement something in `extensions` and find it useful across multiple engines, open an issue at [github.com/SimplyLiz/pmf-spec](https://github.com/SimplyLiz/pmf-spec) to propose it as a core field.

The bar for adding a field to the core spec:
- At least two independent engines have a use for it
- It is expressible with standard musical vocabulary or unambiguous machine values
- Its semantics can be defined precisely enough to validate

Core additions before 1.0 are minor bumps. After 1.0, all new core fields are additive (optional) and increment the minor version.
