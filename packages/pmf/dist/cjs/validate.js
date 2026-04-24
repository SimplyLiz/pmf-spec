"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.parse = parse;
const _2020_js_1 = require("ajv/dist/2020.js");
const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://SimplyLiz.github.io/pmf-spec/schema/pmf-1.0.schema.json",
    title: "Procedural Music Format (PMF) 1.0",
    type: "object",
    required: ["pmf_version", "engine", "summary", "identity", "render_key"],
    properties: {
        pmf_version: { type: "string", const: "1.0" },
        engine: { type: "string" },
        engine_version: { type: "string" },
        summary: { type: "string", maxLength: 500 },
        identity: {
            type: "object",
            required: ["seed", "bpm", "key", "bars"],
            properties: {
                seed: { type: "integer", minimum: 0 },
                mood: { type: "string" },
                bpm: { type: "number", minimum: 20, maximum: 400 },
                bpm_label: { type: "string" },
                key: { type: "string" },
                key_type: { type: "string" },
                key_shift_semitones: { type: "integer", minimum: -24, maximum: 24 },
                bars: { type: "integer", minimum: 1 },
                time_signature: { type: "string" },
            },
            additionalProperties: false,
        },
        render_key: {
            type: "object",
            required: ["sample_rate", "bars", "stem_format", "loop_mode", "engine_version_major"],
            properties: {
                sample_rate: { type: "integer", minimum: 8000, maximum: 192000 },
                bars: { type: "integer", minimum: 1 },
                stem_format: { type: "string" },
                loop_mode: { type: "string", enum: ["looped", "finite"] },
                engine_version_major: { type: "integer", minimum: 0 },
                palette_pack_version: { type: "integer", minimum: 0 },
            },
            additionalProperties: false,
        },
        harmony: {
            type: "object",
            properties: {
                progression: { type: "array", items: { type: "string" } },
                progression_degrees: { type: "array", items: { type: "string" } },
                progression_label: { type: "string" },
                key_root_midi: { type: "integer", minimum: 0, maximum: 127 },
                bass_pattern: { type: "array", items: { type: "integer", minimum: -24, maximum: 24 } },
                bass_pattern_label: { type: "string" },
                arp_pattern: { type: "string" },
                arp_pattern_label: { type: "string" },
                arp_bar_order: { type: "array", items: { type: "integer", minimum: 0 } },
            },
        },
        melody: {
            type: "object",
            additionalProperties: {
                type: "object",
                required: ["abc"],
                properties: {
                    abc: { type: "string" },
                    intervals_semitones: { type: "array", items: { type: "integer" } },
                    rhythm: { type: "string" },
                    label: { type: "string" },
                    active_bars: { type: "array", items: { type: "integer", minimum: 0 } },
                },
            },
        },
        arrangement: {
            type: "object",
            properties: {
                template: { type: "string" },
                sections: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["name", "bars"],
                        properties: {
                            name: { type: "string" },
                            bars: { type: "array", items: { type: "integer", minimum: 0 }, minItems: 2, maxItems: 2 },
                            stems_active: { type: "array", items: { type: "string" } },
                        },
                        additionalProperties: false,
                    },
                },
                melody_on_bars: { type: "array", items: { type: "integer", minimum: 0 } },
                bar_gains: {
                    type: "object",
                    additionalProperties: { type: "array", items: { type: "number", minimum: 0, maximum: 2 } },
                },
            },
        },
        voices: { type: "object" },
        fx: { type: "object" },
        mix: { type: "object" },
        extensions: { type: "object", additionalProperties: { type: "object" } },
    },
};
const ajv = new _2020_js_1.Ajv2020({ allErrors: true });
const validateSchema = ajv.compile(schema);
function validate(data) {
    const valid = validateSchema(data);
    if (valid)
        return { valid: true, errors: [] };
    const errors = (validateSchema.errors ?? []).map((e) => ({
        path: e.instancePath || "/",
        message: e.message ?? "unknown error",
    }));
    return { valid: false, errors };
}
function parse(json) {
    let data;
    try {
        data = JSON.parse(json);
    }
    catch (e) {
        throw new Error(`Invalid JSON: ${String(e)}`);
    }
    const result = validate(data);
    if (!result.valid) {
        const messages = result.errors.map((e) => `  ${e.path}: ${e.message}`).join("\n");
        throw new Error(`PMF validation failed:\n${messages}`);
    }
    return data;
}
//# sourceMappingURL=validate.js.map