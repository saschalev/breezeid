/**
 * Generates a unique, human-friendly ID
 * @param length - Optional length of the ID (excluding hyphens). Default is 16.
 * @returns A unique ID string with hyphens inserted every 4 characters
 * @throws Error if length exceeds the maximum allowed length
 * 
 * @example
 * ```typescript
 * import { breezeid } from 'breezeid-browser';
 * 
 * const id = breezeid(); // => "9NU6-XQLZ-BDIH-6HKE"
 * const shortId = breezeid(8); // => "Q228-VQUR"
 * ```
 */
declare function breezeid(length?: number): string;

/**
 * Alias for breezeid function
 */
declare const BreezeID: typeof breezeid;

export { breezeid, BreezeID };

