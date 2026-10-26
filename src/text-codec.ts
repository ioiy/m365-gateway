/**
 * Shared TextEncoder / TextDecoder singletons.
 *
 * These objects are stateless and safe to reuse across the entire Worker.
 * Previously each module created its own instance; this module centralises
 * them to reduce per-isolate allocation and make the codec surface explicit.
 */

/** Stateless UTF-8 encoder — safe to share everywhere. */
export const encoder = new TextEncoder();

/** Stateless UTF-8 decoder — safe to share everywhere. */
export const decoder = new TextDecoder();

/** Fatal UTF-8 decoder — rejects malformed byte sequences instead of
 *  silently replacing them with U+FFFD.  Used where corrupt input must be
 *  surfaced as an error rather than silently corrupted text. */
export const fatalDecoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: false });
