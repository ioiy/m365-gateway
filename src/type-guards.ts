/**
 * Shared type-guard helpers.
 *
 * The codebase previously inlined `typeof x === "object" && x !== null &&
 * !Array.isArray(x)` and `as Record<string, unknown>` casts dozens of times
 * across openai.ts, chathub.ts and other modules.  These helpers centralise
 * the patterns so call-sites are shorter and the intent is explicit.
 */

/** True when *value* is a plain object (not null, not an array). */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Return *value* as a Record when it is a plain object, otherwise undefined. */
export function asRecord<T extends Record<string, unknown> = Record<string, unknown>>(
  value: unknown,
): T | undefined {
  return isRecord(value) ? (value as T) : undefined;
}

/** True when *value* is a non-empty string. */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

/** True when *value* is a finite number (not NaN, not Infinity). */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** Narrow *value* to an array of records, or return undefined. */
export function asRecordArray(value: unknown): Record<string, unknown>[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.every(isRecord) ? value : undefined;
}
