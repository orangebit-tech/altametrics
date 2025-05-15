import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'demo@inbox.com' },
    update: {},
    create: {
      email: 'demo@inbox.com',
      name: 'Demo User',
      password,
    },
  })

  await prisma.invoice.createMany({
    data: [
      {
        vendor_name: 'AWS',
        amount: 123.45,
        due_date: new Date('2024-10-15'),
        description: 'EC2 hosting',
        paid: false,
        userId: user.id,
      },
      {
        vendor_name: 'Google',
        amount: 67.89,
        due_date: new Date('2024-10-20'),
        description: 'Google Workspace',
        paid: true,
        userId: user.id,
      },
    ],
  })

  console.log('✅ Seeded DB with demo user and invoices')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
