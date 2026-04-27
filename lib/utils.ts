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
    try {
        const u = new URL(url.trim());
        u.searchParams.set('tag', affiliateId);
        return u.toString();
    } catch (e) {
        // Fallback for malformed URLs
        const trimUrl = url.trim();
        const sep = trimUrl.includes('?') ? '&' : '?';
        if (!trimUrl.includes(`tag=${affiliateId}`)) {
            return `${trimUrl}${sep}tag=${affiliateId}`;
        }
        return trimUrl;
    }
}
