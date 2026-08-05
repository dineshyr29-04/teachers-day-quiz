'use client'

/** Tiny fetch wrappers so components don't repeat error handling. */

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text()
  let body: unknown = null
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = null
  }
  if (!res.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : 'Something went wrong. Please try again.'
    throw new Error(message)
  }
  return body as T
}

export async function apiGet<T>(url: string): Promise<T> {
  return parse<T>(await fetch(url, { cache: 'no-store' }))
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  return parse<T>(
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  )
}

export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  return parse<T>(
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  )
}

export async function apiDelete<T>(url: string): Promise<T> {
  return parse<T>(await fetch(url, { method: 'DELETE' }))
}
