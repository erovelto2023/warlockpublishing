/**
 * RESILIENT PARSER V4 - THE HARDENED REWRITE
 * Special focus on Qwen-style "Source Code" blocks and mixed quotes.
 */

function advancedRepair(input) {
    if (!input || typeof input !== 'string') return input;
    
    // 1. Pre-clean: Remove MD and Variable decls
    let clean = input.trim();
    clean = clean.replace(/```[a-z]*\n?/g, '').replace(/```/g, '');
    clean = clean.replace(/^(const|let|var|data|result)\s*[\w\d]*\s*=\s*/, '');
    clean = clean.replace(/;?\s*$/, '');
    clean = clean.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

    // 2. Escape Literal Normalization
    // Qwen often prints literal \n in the error trace, which means the string 
    // actually contains a backslash and an n.
    clean = clean.replace(/\\n/g, '\n').replace(/\\t/g, ' ');

    // 3. String Concatenation Merger
    // Cross-quote merge: 'a' + "b", "a" + 'b', etc.
    // Handles multi-line with \s+ (including real newlines now)
    clean = clean.replace(/(['"])\s*\+\s*([\s\n\r]*)(['"])/g, '');

    // 4. Structural Transform
    // We want to convert { key: 'value' } to { "key": "value" }
    // A. Quote unquoted keys (handling nested objects)
    const quoteKeys = (s) => s.replace(/([\{,\[]\s*)([a-z_][a-z0-9_]*)(\s*):/gi, '$1"$2"$3:');
    clean = quoteKeys(clean);
    // B. Transform single-quoted keys: { 'key': -> { "key":
    clean = clean.replace(/([\{,\[]\s*)'([a-z_][a-z0-9_]*)'(\s*):/gi, '$1"$2"$3:');

    // 5. Value Normalization (Apostrophe-Safe)
    // We use a regex that matches :'... ', preserving interior stuff
    // We MUST escape nested double quotes before wrapping in double quotes.
    clean = clean.replace(/:\s*'([^]*?)'(\s*[,\}\]])/g, (match, content, terminator) => {
        const escaped = content.replace(/"/g, '\\"');
        return ': "' + escaped + '"' + terminator;
    });

    // 6. Array Element Normalization: [ 'a', 'b' ] -> [ "a", "b" ]
    clean = clean.replace(/([\[,]\s*)'([^]*?)'(\s*[,\]])/g, (match, prefix, content, suffix) => {
        const escaped = content.replace(/"/g, '\\"');
        return prefix + '"' + escaped + '"' + suffix;
    });

    // 7. Cleanup remaining single quotes that might be delimiters
    // (e.g., if there were escaped single quotes, they survived)
    // clean = clean.replace(/'/g, '"'); // Still too dangerous?

    // 8. Trailing Comma Cleanup
    clean = clean.replace(/,(\s*[\]\}])/g, '$1');

    return clean;
}

function deepIngest(val) {
    if (typeof val === 'string') {
        const t = val.trim();
        if (t.startsWith('[') || t.startsWith('{') || (t.startsWith('"') && t.includes('['))) {
            try {
                // Try standard first
                const parsed = JSON.parse(t);
                return deepIngest(parsed);
            } catch (e) {
                try {
                    const repaired = advancedRepair(t);
                    return deepIngest(JSON.parse(repaired));
                } catch (e2) {
                    // Try unwrapping if it's a double-quoted stringified array
                    if (t.startsWith('"') && t.endsWith('"')) {
                        try {
                            return deepIngest(JSON.parse(t));
                        } catch (e3) { return val; }
                    }
                    return val;
                }
            }
        }
    }
    if (Array.isArray(val)) {
        if (val.length === 1 && typeof val[0] === 'string' && (val[0].trim().startsWith('[') || val[0].trim().startsWith('{'))) {
            return deepIngest(val[0]);
        }
        return val.map(v => deepIngest(v));
    }
    if (val !== null && typeof val === 'object') {
        const n = {};
        for (const k in val) {
            n[k] = deepIngest(val[k]);
        }
        return n;
    }
    return val;
}

// TEST: The "off-leash dog park" failure case
// We simulate the literal \n and + from the error log
const failingInput = `"[\n' +
  '  {\n' +
  "    keyword: 'off-leash dog' + ' park',\\n" +
  '    searchVolume: \\'74,000\\',\\n' +
  "    relevance: 'High'\\n" +
  '  }\\n' +
  ']"`;

const result = deepIngest(failingInput);
console.log('--- V4 REWRITE RESULT ---');
console.log(JSON.stringify(result, null, 2));
