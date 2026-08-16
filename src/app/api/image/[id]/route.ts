import { getImage } from '@/lib/content'

export const runtime = 'nodejs'

/** Serve question images straight out of SQLite -- nothing to sync to disk. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const image = getImage(id)
  if (!image) return new Response('Not found', { status: 404 })

  return new Response(new Uint8Array(image.bytes), {
    headers: {
      'Content-Type': image.mime,
      // Image ids are content-addressed by creation, so they never change.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
