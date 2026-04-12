/**
 * TEST PIPELINE: Surgical Repair & Deep Normalization
 * This script verifies that the new repair logic can handle 
 * Javascript-style objects, unquoted keys, and apostrophes.
 */

function surgicalRepair(str) {
    if (!str || typeof str !== 'string') return str;
    
    let fixed = str.trim();

    // 0. Pre-clean: Remove JS code artifacts if pasted as a code block
    // Remove 'const data =', 'let x =', etc.
    fixed = fixed.replace(/^(const|let|var)\s+[a-zA-Z0-9_]+\s*=\s*/, '');
    // Remove trailing semicolon
    fixed = fixed.replace(/;$/, '');
    // Resolve JS concatenation: 'line' + \n 'line' -> 'line line'
    // This handles the user's specific error: 'keyword' + \n 'value'
    fixed = fixed.replace(/'\s*\+\s*['\n\r]*/g, '');
    fixed = fixed.replace(/"\s*\+\s*["\n\r]*/g, '');

    // 1. Resolve unquoted keys: { key: ... } -> { "key": ... }
    fixed = fixed.replace(/([\{,\[]\s*)([a-zA-Z0-9_]+)(\s*):/g, '$1"$2"$3:');

    // 2. Resolve single-quoted keys: { 'key': ... } -> { "key": ... }
    fixed = fixed.replace(/([\{,\[]\s*)'([a-zA-Z0-9_]+)'(\s*):/g, '$1"$2"$3:');

    // 3. Resolve single-quoted values safely (preserves internal apostrophes)
    fixed = fixed.replace(/:\s*'([^']*)'(\s*[,\}\]])/g, ': "$1"$2');

    // 4. Handle trailing commas
    fixed = fixed.replace(/,(\s*[\]\}])/g, '$1');

    return fixed;
}

// ... existing deepNormalize ...

// TEST CASE 3: The Concatenated Code Snippet (The user's specific failing case)
const concatenatedCase = `[
  {
    keyword: 'off-leash dog' +
    ' park',
    searchVolume: '74,000',
    relevance: 'High'
  }
]`;

console.log('\n--- TEST 3: Concatenated Code Snippet ---');
const repaired3 = surgicalRepair(concatenatedCase);
console.log('Repaired String:', repaired3);
try {
    const result = JSON.parse(repaired3);
    console.log('SUCCESS: Parsed concatenated string');
    console.log('Data:', JSON.stringify(result, null, 2));
} catch (e) {
    console.error('FAILED: could not parse concatenated string');
    console.error('Error:', e.message);
}

function deepNormalize(val) {
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            try {
                // Try standard first
                const parsed = JSON.parse(trimmed);
                return deepNormalize(parsed);
            } catch (e) {
                try {
                    // Try surgical repair
                    const repaired = surgicalRepair(trimmed);
                    const parsed = JSON.parse(repaired);
                    return deepNormalize(parsed);
                } catch (e2) {
                    console.warn('Deep normalization failed for string:', trimmed.substring(0, 50));
                    return val;
                }
            }
        }
    }

    if (Array.isArray(val)) {
        // Recursively normalize elements
        // If it's a length-1 array containing a stringified array, unpack it
        if (val.length === 1 && typeof val[0] === 'string' && (val[0].trim().startsWith('[') || val[0].trim().startsWith('{'))) {
            return deepNormalize(val[0]);
        }
        return val.map(item => deepNormalize(item));
    }

    if (val !== null && typeof val === 'object') {
        const obj = {};
        for (const key in val) {
            obj[key] = deepNormalize(val[key]);
        }
        return obj;
    }

    return val;
}

// TEST CASE 1: The Failing Puppy Training String (Javascript style)
const failingString = `[
  {
    keyword: 'puppy training',
    searchVolume: 'High',
    relevance: 'High'
  },
  {
    keyword: "positive reinforcement's value",
    searchVolume: 'Medium',
    relevance: 'High'
  }
]`;

console.log('--- TEST 1: Surgical Repair ---');
const repaired = surgicalRepair(failingString);
console.log('Repaired String:', repaired);
try {
    const result = JSON.parse(repaired);
    console.log('SUCCESS: Parsed successfully');
    console.log('Data:', JSON.stringify(result, null, 2));
} catch (e) {
    console.error('FAILED: could not parse repaired string');
    console.error('Error:', e.message);
}

// TEST CASE 2: Nested wrapped strings
const nestedWrapped = {
    relatedKeywords: ["[ { keyword: 'nested' } ]"],
    targetAudience: "{ primaryDemographic: 'Ages 18+' }"
};

console.log('\n--- TEST 2: Deep Normalization ---');
const normResult = deepNormalize(nestedWrapped);
console.log('Deep Normalized:', JSON.stringify(normResult, null, 2));
