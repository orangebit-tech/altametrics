import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.log('Skipping seed: NODE_ENV is production')
    return
  }

  console.log('🌱 Seeding dev database...')

  await prisma.invoice.deleteMany()
  await prisma.user.deleteMany()

  const password = await bcrypt.hash(process.env.SEED_USER_PASSWORD || '', 10)

  const user = await prisma.user.create({
    data: {
      email: process.env.SEED_USER || '',
      name: 'Demo User',
      password,
    },
  })

  console.log('Created user:', user)

  await prisma.invoice.create({
    data: {
      vendor_name: 'AWS',
      amount: 123.45,
      due_date: new Date('2024-10-15'),
      description: 'EC2 hosting',
      paid: false,
      userId: user.id,
    },
  })

  await prisma.invoice.create({
    data: {
      vendor_name: 'Google',
      amount: 67.89,
      due_date: new Date('2024-10-20'),
      description: 'Workspace',
      paid: true,
      userId: user.id,
    },
  })

  console.log('Invoices created')
  console.log('Seed complete')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
