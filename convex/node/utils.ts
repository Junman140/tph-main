"use node";

/**
 * Generate a unique ID using Node.js crypto module
 * This is a replacement for crypto.randomUUID() that's compatible with Convex
 */
export function generateUniqueId(): string {
  return crypto.randomUUID();
}

/**
 * Format a date to ISO string
 * This is a utility function that uses Node.js Date functionality
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString();
}

/**
 * Calculate reading time for content
 * This is a utility function that uses Node.js string operations
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
} 