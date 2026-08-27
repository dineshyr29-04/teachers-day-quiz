import type { NextRequest } from 'next/server'
import QRCode from 'qrcode'
import { appOrigin, ok } from '@/lib/api-helpers'
import { requireAdminApi } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const denied = await requireAdminApi()
  if (denied) return denied

  // Point QR code directly to the Landing Page homepage
  const landingUrl = appOrigin(req)

  const dataUrl = await QRCode.toDataURL(landingUrl, {
    margin: 1,
    width: 450,
    errorCorrectionLevel: 'M',
    color: { dark: '#2A2440', light: '#FFFFFF' },
  })

  const svg = await QRCode.toString(landingUrl, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#2A2440', light: '#FFFFFF' },
  })

  return ok({ joinUrl: landingUrl, dataUrl, svg })
}
