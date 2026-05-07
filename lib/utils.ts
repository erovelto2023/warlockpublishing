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
 * Robustly attempts to repair common AI-generated JSON formatting errors.
 * Handles trailing commas, unquoted keys, smart quotes, and surrounding text.
 */
export function repairJson(content: string): string {
    let repaired = content.trim();

    // 1. Strip markdown code blocks if present
    const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
    const matches = [...repaired.matchAll(codeBlockRegex)];
    if (matches.length > 0) {
        repaired = matches[0][1].trim();
    }

    // 2. Replace smart/curly quotes
    repaired = repaired
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2018\u2019]/g, "'");

    // 3. Remove trailing commas in objects and arrays
    repaired = repaired.replace(/,(\s*[\]\}])/g, '$1');

    // 4. Fix missing/double commas between objects in an array: } { -> }, {
    repaired = repaired.replace(/\}\s*,?\s*\{/g, '}, {');

    // 5. Fix missing/double commas between properties
    // Case A: After a closing quote
    repaired = repaired.replace(/"\s*,?\s+"([a-zA-Z0-9_]+)"\s*:/g, '", "$1":');
    // Case B: After a number, boolean, or null
    repaired = repaired.replace(/(\d+|true|false|null)\s*,?\s+"([a-zA-Z0-9_]+)"\s*:/g, '$1, "$2":');
    // Case C: After a closing brace or bracket (nested objects/arrays)
    repaired = repaired.replace(/([\]\}])\s*,?\s+"([a-zA-Z0-9_]+)"\s*:/g, '$1, "$2":');

    // 6. Fix missing colons: "key" "value" -> "key": "value"
    repaired = repaired.replace(/"\s*([a-zA-Z0-9_]+)"\s+("|\d+|true|false|null|\[|\{)/g, '"$1": $2');

    // 7. Ensure property names are quoted
    // This handles { key: "value" } -> { "key": "value" }
    repaired = repaired.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

    // 7. Fix multi-line strings that aren't escaped (common in AI output)
    repaired = repaired.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, p1) => {
        return '"' + p1.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';
    });

    // 6. Try to find the start of an array or object if there is trailing garbage
    const startChar = repaired.indexOf('[');
    const lastChar = repaired.lastIndexOf(']');
    if (startChar !== -1 && lastChar !== -1 && lastChar > startChar) {
        repaired = repaired.substring(startChar, lastChar + 1);
    }

    // 8. Handle truncation (close unclosed quotes, braces, and brackets)
    // First, fix unclosed quotes
    const quoteMatches = repaired.match(/"/g);
    if (quoteMatches && quoteMatches.length % 2 !== 0) {
        repaired += '"';
    }

    // Then, close unclosed braces and brackets
    let openBraces = (repaired.match(/\{/g) || []).length - (repaired.match(/\}/g) || []).length;
    let openBrackets = (repaired.match(/\[/g) || []).length - (repaired.match(/\]/g) || []).length;
    
    while (openBraces > 0) {
        repaired += '}';
        openBraces--;
    }
    while (openBrackets > 0) {
        repaired += ']';
        openBrackets--;
    }

    // 9. Final attempt to parse and prettify if possible
    try {
        const obj = JSON.parse(repaired);
        return JSON.stringify(obj, null, 2);
    } catch (e) {
        return repaired;
    }
}
