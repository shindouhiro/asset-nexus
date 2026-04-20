import process from 'node:process'
import { coupons, db, users } from './src/index.js'

async function seed() {
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding database...')

  // Seed users
  await db.insert(users).values([
    { name: 'Admin', email: 'admin@example.com' },
  ]).onConflictDoNothing()

  // Seed coupons
  await db.insert(coupons).values([
    {
      title: '新人特惠券',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400',
      description: '首单立减 50 元，仅限新用户使用。',
      link: 'https://example.com/welcome',
    },
  ]).onConflictDoNothing()

  // eslint-disable-next-line no-console
  console.log('✅ Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed!')

  console.error(err)
  process.exit(1)
})
