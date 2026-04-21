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
      const url = typeof cover === 'string' ? cover : cover.url
      return url.includes('hn-bkt.clouddn.com') ? `/api/proxy?url=${encodeURIComponent(url)}` : url
    }
    return image.includes('hn-bkt.clouddn.com') ? `/api/proxy?url=${encodeURIComponent(image)}` : image
  } catch {
    return image.includes('hn-bkt.clouddn.com') ? `/api/proxy?url=${encodeURIComponent(image)}` : image
  }
}
