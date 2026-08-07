'use client'

import { avatarSpec, type AvatarSpec } from '@/lib/avatar'

interface ParticipantAvatarProps {
  seed: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZE_MAP = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

export function ParticipantAvatar({ seed, size = 'md', className = '' }: ParticipantAvatarProps) {
  const spec: AvatarSpec = avatarSpec(seed || 'default')
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full shrink-0 border border-black/10 shadow-sm ${sizeClass} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${spec.backdrop[0]} 0%, ${spec.backdrop[1]} 100%)`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transform scale-105 translate-y-1 select-none"
        aria-hidden="true"
      >
        {/* Torso / Garment */}
        <path d="M 20,100 Q 50,65 80,100 Z" fill={spec.garment} />
        <path d="M 40,78 Q 50,88 60,78 L 50,100 Z" fill="#ffffff" opacity={0.35} />

        {/* Neck */}
        <rect x="42" y="52" width="16" height="18" rx="4" fill={spec.skin} />
        <rect x="42" y="52" width="16" height="6" fill="#000000" opacity={0.08} />

        {/* Head */}
        <ellipse cx="50" cy="42" rx="20" ry="22" fill={spec.skin} />

        {/* Hair Styles */}
        {spec.hairStyle === 0 && (
          <path d="M 28,40 Q 50,15 72,40 Q 75,25 50,18 Q 25,25 28,40 Z" fill={spec.hair} />
        )}
        {spec.hairStyle === 1 && (
          <circle cx="50" cy="22" r="14" fill={spec.hair} />
        )}
        {spec.hairStyle === 2 && (
          <path d="M 26,45 C 22,25 35,16 50,16 C 65,16 78,25 74,45 C 68,28 32,28 26,45 Z" fill={spec.hair} />
        )}
        {spec.hairStyle === 3 && (
          <path d="M 30,35 Q 50,20 70,35 L 72,50 Q 50,32 28,50 Z" fill={spec.hair} />
        )}
        {spec.hairStyle === 4 && (
          <path d="M 25,48 Q 22,20 50,18 Q 78,20 75,48 Q 65,30 50,30 Q 35,30 25,48 Z" fill={spec.hair} />
        )}
        {spec.hairStyle === 5 && (
          <path d="M 32,32 Q 50,14 68,32 Q 72,22 50,18 Q 28,22 32,32 Z" fill={spec.hair} />
        )}

        {/* Eyes */}
        <circle cx="43" cy="40" r="2.5" fill="#2E2723" />
        <circle cx="57" cy="40" r="2.5" fill="#2E2723" />
        <circle cx="44" cy="39" r="0.8" fill="#ffffff" />
        <circle cx="58" cy="39" r="0.8" fill="#ffffff" />

        {/* Nose */}
        <path d="M 50,42 Q 48,46 51,46" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity={0.25} />

        {/* Mouth */}
        {spec.mouth === 0 && (
          <path d="M 45,51 Q 50,53 55,51" stroke="#2E2723" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        )}
        {spec.mouth === 1 && (
          <path d="M 44,50 Q 50,56 56,50" stroke="#2E2723" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        )}
        {spec.mouth === 2 && (
          <path d="M 43,49 Q 50,58 57,49 Z" fill="#2E2723" />
        )}

        {/* Glasses */}
        {spec.glasses && (
          <g stroke="#2E2723" strokeWidth="1.8" fill="none">
            <circle cx="43" cy="40" r="6" />
            <circle cx="57" cy="40" r="6" />
            <line x1="49" y1="40" x2="51" y2="40" strokeWidth="2" />
          </g>
        )}

        {/* Graduation Cap */}
        {spec.cap && (
          <g>
            <path d="M 24,24 L 50,14 L 76,24 L 50,34 Z" fill={spec.capColor} />
            <rect x="38" y="24" width="24" height="6" rx="2" fill={spec.capColor} opacity={0.8} />
            <path d="M 76,24 L 76,34 L 74,34 L 74,24 Z" fill="#D9A62E" />
            <circle cx="75" cy="35" r="2" fill="#D9A62E" />
          </g>
        )}
      </svg>
    </div>
  )
}
