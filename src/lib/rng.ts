/**
 * Small deterministic RNG helpers.
 *
 * Per-participant question order is *derived* from (runSeed, participantId)
 * rather than stored. That single decision buys a lot:
 *   - a participant who refreshes or reconnects gets the same order back,
 *   - the server can restart mid-quiz and rebuild every order exactly,
 *   - no per-participant array has to be persisted for 1,000+ players.
 */

/** xmur3 string hash -> 32-bit seed generator. */
function xmur3(str: string) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return h >>> 0
  }
}

/** mulberry32 PRNG: fast, tiny, good enough for shuffling and avatars. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Build a deterministic `() => [0,1)` generator from any string. */
export function seededRandom(seed: string): () => number {
  return mulberry32(xmur3(seed)())
}

/** Deterministic 32-bit hash of a string. */
export function hashString(seed: string): number {
  return xmur3(seed)()
}

/**
 * Fisher-Yates shuffle driven by a seeded PRNG. Pure: returns a new array.
 * Same seed + same input always yields the same permutation.
 */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const out = items.slice()
  const rand = seededRandom(seed)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Deterministically pick one element of a non-empty list. */
export function seededPick<T>(items: readonly T[], seed: string): T {
  return items[hashString(seed) % items.length]
}
