export interface Coupon {
  id: string
  title: string
  image: string
  description: string
  link: string
}

export function getCoverUrl(image: string | undefined | null): string {
  if (!image) return ''
  try {
    const parsed = JSON.parse(image)
    if (Array.isArray(parsed)) {
      const cover = parsed.find(img => img.isCover) || parsed[0]
      return typeof cover === 'string' ? cover : cover.url
    }
    return image
  } catch {
    return image
  }
}
