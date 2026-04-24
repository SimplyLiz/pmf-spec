#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const validate_js_1 = require("./validate.js");
const [, , command, ...args] = process.argv;
function usage() {
    console.error("Usage: pmf validate <file.pmf>");
    process.exit(1);
    throw new Error(); // satisfy TS never
}
if (command !== "validate")
    usage();
const filePath = args[0];
if (!filePath)
    usage();
let raw;
try {
    raw = (0, node_fs_1.readFileSync)(filePath, "utf8");
}
catch (e) {
    console.error(`Cannot read file: ${filePath}: ${String(e)}`);
    process.exit(1);
    throw new Error(); // satisfy TS never
}
let data;
try {
    data = JSON.parse(raw);
}
catch (e) {
    console.error(`Invalid JSON: ${String(e)}`);
    process.exit(1);
    throw new Error(); // satisfy TS never
}
const result = (0, validate_js_1.validate)(data);
if (result.valid) {
    console.log(`✓ ${filePath} is valid PMF 1.0`);
    process.exit(0);
}
else {
    console.error(`✗ ${filePath} failed validation:\n`);
    for (const err of result.errors) {
        console.error(`  ${err.path || "/"}: ${err.message}`);
    }
    process.exit(1);
}
//# sourceMappingURL=cli.js.map