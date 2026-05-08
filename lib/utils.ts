import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Efficiently serializes Mongoose documents for Next.js Server Components.
 * Faster than custom recursion for general cases and prevents "not a plain object" errors.
 */
export function parseData<T>(data: T): T {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
}

/**
 * Defensive data access helpers
 */
export const safeArray = <T>(arr: any): T[] => Array.isArray(arr) ? arr : [];
export const safeString = (str: any, fallback = ""): string => 
    typeof str === 'string' ? str : (str ? String(str) : fallback);

/**
 * Escapes special characters for use in regular expressions.
 * Prevents ReDoS and unintended regex matching.
 */
export function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Global Store ID
export const AMAZON_AFFILIATE_ID = "weightlo0f57d-20";

/**
 * Universal Amazon Affiliate Link Formatter
 */
export function formatAmazonLink(url: string, affiliateId: string = AMAZON_AFFILIATE_ID): string {
    if (!url || typeof url !== 'string' || !url.includes('amazon.com')) return url;
    
    // Sanitize broken links (handle the javascript:void(0) issue and missing slashes)
    let sanitized = url.trim().replace(/javascript:void\(0\)/g, '');
    
    // Ensure there is a slash after the TLD if missing
    if (sanitized.includes('amazon.com') && !sanitized.includes('amazon.com/')) {
        sanitized = sanitized.replace('amazon.com', 'amazon.com/');
    }

    // Clean up potential double slashes (excluding the protocol)
    sanitized = sanitized.replace(/([^:])\/\//g, '$1/');

    try {
        const u = new URL(sanitized);
        u.searchParams.set('tag', affiliateId);
        return u.toString();
    } catch (e) {
        // Fallback for malformed URLs
        const trimUrl = sanitized;
        const sep = trimUrl.includes('?') ? '&' : '?';
        if (!trimUrl.includes(`tag=${affiliateId}`)) {
            return `${trimUrl}${sep}tag=${affiliateId}`;
        }
        return trimUrl;
    }
}

/**
 * Forces a URL to use HTTPS protocol.
 */
export function forceHttps(url: string | undefined | null): string {
    if (!url) return "";
    if (typeof url !== 'string') return String(url);
    if (url.startsWith('http://')) {
        return url.replace('http://', 'https://');
    }
    return url;
}

/**
 * Complete ground-up rewrite of JSON repair utility.
 */
export function repairJson(content: string): string {
    let s = content.trim();

    // 1. CLEANING: Remove markdown blocks and invisible control characters
    const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
    const matches = [...s.matchAll(codeBlockRegex)];
    if (matches.length > 0) s = matches.map(m => m[1].trim()).join(', ');
    
    // Strip non-printable control characters except whitespace
    s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

    // 2. NORMALIZATION: Smart quotes and single quotes
    s = s.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
    
    // 2.5. ESCAPING: Fix unescaped backslashes (avoiding valid escapes)
    s = s.replace(/\\(?!(["\\\/bfnrt]|u[0-9a-fA-F]{4}))/g, '\\\\');

    // 3. PROPERTY DELIMITERS: Fix missing colons ("key" "value" -> "key": "value")
    s = s.replace(/"\s*([^"]+)"\s+("|\d+|true|false|null|\[|\{)/g, '"$1": $2');

    // 4. COMMA INJECTION: Ultra-aggressive pass for "Expected ',' or '}'"
    const p1 = '(?:\\"|\\d+|true|false|null|\\}|\\])';
    const p2 = '(?:\\"|\\d+|true|false|null|\\{|\\[)';
    
    // Heuristic: If we see a value/closing-bracket followed by another value/opening-bracket with space, add a comma
    // BUT avoid matching keys (quotes followed by colons)
    s = s.replace(new RegExp(`(${p1})\\s+(?![^"]*":)(${p2})`, 'g'), '$1, $2');

    // Fix double commas
    s = s.replace(/,\s*,/g, ',');
    
    // Remove trailing commas before closing braces/brackets
    s = s.replace(/,(\s*[\]\}])/g, '$1');

    // 5. KEY QUOTING: Ensure all keys are double-quoted
    s = s.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

    // 6. MULTI-LINE STRINGS: Escape literal newlines inside double quotes
    s = s.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, p1) => {
        return '"' + p1.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';
    });

    // 7. EXTRACTION: Find the widest balanced structure and handle multiple top-level blocks
    const firstBracket = s.indexOf('[');
    const lastBracket = s.lastIndexOf(']');
    const firstBrace = s.indexOf('{');
    const lastBrace = s.lastIndexOf('}');
    
    let startPos = Math.min(
        firstBracket === -1 ? Infinity : firstBracket,
        firstBrace === -1 ? Infinity : firstBrace
    );
    let endPos = Math.max(lastBracket, lastBrace);
    
    if (startPos !== Infinity && endPos !== -1 && endPos > startPos) {
        s = s.substring(startPos, endPos + 1);
    }

    // 8. TRUNCATION RECOVERY: Close any open quotes, braces, or brackets
    const quoteMatches = s.match(/"/g);
    if (quoteMatches && quoteMatches.length % 2 !== 0) s += '"';

    let openBraces = (s.match(/\{/g) || []).length - (s.match(/\}/g) || []).length;
    let openBrackets = (s.match(/\[/g) || []).length - (s.match(/\]/g) || []).length;
    
    while (openBraces > 0) { s += '}'; openBraces--; }
    while (openBrackets > 0) { s += ']'; openBrackets--; }

    // 9. MULTI-BLOCK WRAPPING: If it's multiple objects/arrays like {...} {...} or [...] [...], wrap and join them
    // This solves the "Unexpected non-whitespace character after JSON" error
    try {
        JSON.parse(s);
    } catch (e: any) {
        if (e.message.includes("Unexpected non-whitespace character") || 
            e.message.includes("after JSON")) {
            
            // 1. Force join any disconnected objects/arrays
            s = s.replace(/\]\s*\[/g, ' , ')
                 .replace(/\}\s*\{/g, ' } , { ')
                 .replace(/\}\s*\[/g, ' } , [ ')
                 .replace(/\]\s*\{/g, ' ] , { ');
            
            // 2. Ensure the whole thing is wrapped in an array if it's multiple blocks
            if (!s.startsWith('[')) s = '[' + s;
            if (!s.endsWith(']')) s = s + ']';
            
            // 3. Clean up any double-wrapping that might have been introduced
            s = s.replace(/^\[\s*\[/, '[').replace(/\]\s*\]$/, ']');
        }
    }

    // Ensure all blocks are joined by commas
    s = s.replace(/\]\s*\[/g, ', ');
    s = s.replace(/\}\s*\{/g, '}, {');
    s = s.replace(/,\s*,/g, ',');
    s = s.replace(/\[\s*,/g, '[').replace(/,\s*\]/g, ']');

    // 10. SURGICAL REPAIR: Iterative repair based on parser feedback
    let currentAttempt = s;
    for (let attempt = 0; attempt < 30; attempt++) { // Even more attempts
        try {
            const obj = JSON.parse(currentAttempt);
            return JSON.stringify(obj, null, 2);
        } catch (e: any) {
            const errorPos = e.message.match(/at position (\d+)/);
            if (errorPos) {
                const pos = parseInt(errorPos[1]);
                
                let leftPos = pos - 1;
                while (leftPos >= 0 && /\s/.test(currentAttempt[leftPos])) leftPos--;
                const charBefore = currentAttempt[leftPos];
                
                let rightPos = pos;
                while (rightPos < currentAttempt.length && /\s/.test(currentAttempt[rightPos])) rightPos++;
                const charAt = currentAttempt[rightPos];

                if (!charBefore || !charAt) break;

                // Case: Unescaped internal quote
                if (charAt === '"' && ![':', ',', '}', ']', '{', '['].includes(charBefore)) {
                    currentAttempt = currentAttempt.substring(0, rightPos) + '\\"' + currentAttempt.substring(rightPos + 1);
                    continue;
                }

                // Case: Missing comma between array elements or properties
                const needsCommaBefore = ['"', '}', ']', 'e', 's', 'l', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(charBefore);
                const needsCommaAfter = ['"', '{', '['].includes(charAt);
                
                if (needsCommaBefore && needsCommaAfter) {
                    currentAttempt = currentAttempt.substring(0, leftPos + 1) + ',' + currentAttempt.substring(leftPos + 1);
                    continue;
                }
                
                // Case: Missing colon
                if (charBefore === '"' && charAt === '"') {
                    currentAttempt = currentAttempt.substring(0, leftPos + 1) + ':' + currentAttempt.substring(leftPos + 1);
                    continue;
                }

                // Generic fallback for "Expected" errors
                if (e.message.includes("Expected ','") || e.message.includes("Expected ':'")) {
                     currentAttempt = currentAttempt.substring(0, pos) + ',' + currentAttempt.substring(pos);
                     continue;
                }
            }
            break; 
        }
    }

    return currentAttempt;
}
