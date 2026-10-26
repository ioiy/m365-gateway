/**
 * Shared constants and tiny utility functions that were previously duplicated
 * across multiple modules.
 */

// ---------------------------------------------------------------------------
// SSE (Server-Sent Events)
// ---------------------------------------------------------------------------

/** The SSE termination frame sent to clients when a stream is complete. */
export const SSE_TERMINATOR = "data: [DONE]\n\n";

// ---------------------------------------------------------------------------
// CJK / Chinese text detection
// ---------------------------------------------------------------------------

/** Unicode range covering CJK Unified Ideographs Extension A and the main
 *  CJK block.  Used to detect Chinese-language prompts for routing decisions. */
const CJK_RANGE = /[\u3400-\u9fff]/u;

/** True when *text* contains at least one CJK character. */
export function containsCJK(text: string): boolean {
  return CJK_RANGE.test(text);
}

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

/** Current Unix epoch in whole seconds (equivalent to `Math.floor(Date.now() / 1000)`). */
export function unixNow(): number {
  return Math.floor(Date.now() / 1000);
}
