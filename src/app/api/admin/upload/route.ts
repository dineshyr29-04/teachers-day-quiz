import type { NextRequest } from 'next/server'
import { fail, ok } from '@/lib/api-helpers'
import { requireAdminApi } from '@/lib/auth'
import { saveImage } from '@/lib/content'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MAX_BYTES = 4 * 1024 * 1024
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'])

/** Store a question image as a blob and hand back its id. */
export async function POST(req: NextRequest) {
  const denied = await requireAdminApi()
  if (denied) return denied

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return fail('Could not read the upload.')
  }

  const file = form.get('file')
  if (!(file instanceof File)) return fail('Choose an image file.')
  if (file.size === 0) return fail('That file is empty.')
  if (file.size > MAX_BYTES) return fail('Images must be 4 MB or smaller.')
  if (!ALLOWED.has(file.type)) {
    return fail('Use a PNG, JPEG, WebP, GIF or AVIF image.')
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const id = saveImage(file.type, bytes)
  return ok({ imageId: id, url: `/api/image/${id}` })
}
