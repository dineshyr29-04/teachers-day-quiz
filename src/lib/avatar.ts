import { seededRandom } from './rng'

/**
 * Deterministic avatar generation.
 *
 * Everything is derived from the participant id, so the same person always gets
 * the same face -- across refreshes, reconnects, and every screen in the app.
 * Avatars render as inline SVG (see `components/participant-avatar.tsx`), which
 * means zero network requests for 1,000 participants and no upload flow.
 */

const BACKDROPS: [string, string][] = [
  ['#DCE9FB', '#BBD5F6'],
  ['#E4DEFA', '#CFC4F4'],
  ['#FFE4D6', '#FFCBB2'],
  ['#D8F0E6', '#BCE4D4'],
  ['#FFF2CF', '#FFE49E'],
  ['#FBDCE7', '#F6C3D6'],
  ['#DDEEF0', '#BFE0E4'],
  ['#EAE6DC', '#D8D1C1'],
]

const SKINS = ['#F5D5BC', '#EFC4A2', '#DBA478', '#BE8259', '#8E5A3B', '#6B4229']

const HAIRS = [
  '#2E2723',
  '#4A342A',
  '#6E4B33',
  '#9A6B41',
  '#1F2937',
  '#5B4B8A',
  '#A63D57',
]

const GARMENTS = [
  '#5B8FD6',
  '#7C6BD6',
  '#E8825C',
  '#3FA98A',
  '#D9A62E',
  '#D9558A',
  '#4C7A94',
  '#8A6BAE',
]

const CAPS = ['#2A2440', '#3B3159', '#204060', '#4A2C46']

export interface AvatarSpec {
  backdrop: [string, string]
  skin: string
  hair: string
  /** 0-5, see ParticipantAvatar for the shapes. */
  hairStyle: number
  garment: string
  glasses: boolean
  cap: boolean
  capColor: string
  /** 0-2: neutral, smile, wide smile. */
  mouth: number
}

/**
 * Pure and stable: the draw order must never change, or existing participants
 * would get new faces mid-event.
 */
export function avatarSpec(seed: string): AvatarSpec {
  const rand = seededRandom(`avatar:${seed}`)
  const pick = <T,>(items: readonly T[]): T => items[Math.floor(rand() * items.length)]

  return {
    backdrop: pick(BACKDROPS),
    skin: pick(SKINS),
    hair: pick(HAIRS),
    hairStyle: Math.floor(rand() * 6),
    garment: pick(GARMENTS),
    glasses: rand() < 0.34,
    cap: rand() < 0.28,
    capColor: pick(CAPS),
    mouth: Math.floor(rand() * 3),
  }
}
