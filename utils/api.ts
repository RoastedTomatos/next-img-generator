export async function deleteImage(id: string): Promise<void> {
  const res = await fetch(`/api/images/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    let message = 'Failed to delete image'
    try {
      const data = await res.json()
      if (data?.error) message = data.error
    } catch {}
    throw new Error(message)
  }
}


