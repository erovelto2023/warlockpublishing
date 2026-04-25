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
