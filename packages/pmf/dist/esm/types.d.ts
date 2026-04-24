export interface PMFIdentity {
    seed: number;
    bpm: number;
    key: string;
    bars: number;
    mood?: string;
    bpm_label?: string;
    key_type?: string;
    key_shift_semitones?: number;
    time_signature?: string;
}
export interface PMFRenderKey {
    sample_rate: number;
    bars: number;
    stem_format: string;
    loop_mode: "looped" | "finite";
    engine_version_major: number;
    palette_pack_version?: number;
}
export interface PMFHarmony {
    progression?: string[];
    progression_degrees?: string[];
    progression_label?: string;
    key_root_midi?: number;
    bass_pattern?: number[];
    bass_pattern_label?: string;
    arp_pattern?: string;
    arp_pattern_label?: string;
    arp_bar_order?: number[];
}
export interface PMFMotif {
    abc: string;
    intervals_semitones?: number[];
    rhythm?: string;
    label?: string;
    active_bars?: number[];
}
export interface PMFSection {
    name: string;
    bars: [number, number];
    stems_active?: string[];
}
export interface PMFArrangement {
    template?: string;
    sections?: PMFSection[];
    melody_on_bars?: number[];
    bar_gains?: Record<string, number[]>;
}
export interface PMFFile {
    pmf_version: "1.0";
    engine: string;
    engine_version?: string;
    summary: string;
    identity: PMFIdentity;
    render_key: PMFRenderKey;
    harmony?: PMFHarmony;
    melody?: Record<string, PMFMotif>;
    arrangement?: PMFArrangement;
    voices?: Record<string, unknown>;
    fx?: Record<string, unknown>;
    mix?: Record<string, unknown>;
    extensions?: Record<string, Record<string, unknown>>;
}
export interface ValidationError {
    path: string;
    message: string;
}
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}
//# sourceMappingURL=types.d.ts.map