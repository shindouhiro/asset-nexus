import type { Coupon } from '@platform/utils'

// In-memory store for demo. In real app, use a DB.
let coupons: Coupon[] = [
  {
    id: '1',
    title: '新人特惠券',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400',
    description: '首单立减 50 元，仅限新用户使用。',
    link: 'https://example.com/welcome',
  },
]

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    return coupons
  }

  if (method === 'POST') {
    const body = await readBody<Coupon>(event)
    if (body.id) {
      // Update
      coupons = coupons.map(c => c.id === body.id ? body : c)
    }
    else {
      // Create
      const newCoupon = { ...body, id: Date.now().toString() }
      coupons.push(newCoupon)
    }
    return { success: true }
  }
})
