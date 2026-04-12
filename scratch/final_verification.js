/**
 * FINAL VERIFICATION: Nuclear V5 Parser
 * This script uses the exact same logic now deployed in production.
 */

const resilientRepair = (input) => {
    if (!input || typeof input !== 'string') return input;
    let clean = input.trim();
    clean = clean.replace(/```[a-z]*\n?|```/g, '');
    clean = clean.replace(/^(const|let|var|data|result)\s*[\w\d]*\s*=\s*/, '');
    clean = clean.replace(/;?\s*$/, '');
    clean = clean.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    clean = clean.replace(/\\n/g, '\n').replace(/\\t/g, ' ');
    clean = clean.replace(/(['"])\s*(?:\n|\r|\s)*\+\s*(?:\n|\r|\s)*(['"])/g, '');
    clean = clean.replace(/([\{,\[]\s*)([a-z_][a-z0-9_]*)(\s*):/gi, '$1"$2"$3:');
    clean = clean.replace(/([\{,\[]\s*)'([a-z_][a-z0-9_]*)'(\s*):/gi, '$1"$2"$3:');
    clean = clean.replace(/[:\[,]\s*'([^]*?)'(\s*[\]\},\n\r])/g, (match, content, terminator) => {
        const escaped = content.replace(/"/g, '\\"');
        const prefix = match.startsWith(':') ? ': ' : match.substring(0, 1);
        return prefix + '"' + escaped + '"' + terminator;
    });
    return clean.replace(/,(\s*[\]\}])/g, '$1');
};

const deepNormalize = (val) => {
    if (typeof val === 'string') {
        const t = val.trim();
        if (t.startsWith('[') || t.startsWith('{') || (t.startsWith('"') && t.includes('['))) {
            try { return deepNormalize(JSON.parse(t)); } 
            catch (e) {
                try {
                    const r = resilientRepair(t);
                    return deepNormalize(JSON.parse(r));
                } catch (e2) {
                    if (t.startsWith('"') && t.endsWith('"')) {
                        try { return deepNormalize(JSON.parse(t)); } catch (e3) { return val; }
                    }
                    return val;
                }
            }
        }
    }
    if (Array.isArray(val)) {
        if (val.length === 1 && typeof val[0] === 'string' && (val[0].trim().startsWith('[') || val[0].trim().startsWith('{'))) {
            const r = deepNormalize(val[0]);
            return Array.isArray(r) || typeof r === 'object' ? r : [];
        }
        return val.map(v => deepNormalize(v));
    }
    if (val !== null && typeof val === 'object') {
        const n = {};
        for (const k in val) { n[k] = deepNormalize(val[k]); }
        return n;
    }
    return val;
};

// THE FAILING STRING FROM QWEN (Simulating literal context)
const failingInput = `[
  {
    keyword: 'off-leash dog' +
    ' park',
    searchVolume: '74,000',
    relatedKeywords: "[\n' +
      '  { keyword: \\'dog park safety\\', volume: \\'8,100\\' }\\n' +
      ']"
  }
]`;

const result = deepNormalize(failingInput);
console.log('--- NUCLEAR V5 VERIFICATION ---');
console.log(JSON.stringify(result, null, 2));
