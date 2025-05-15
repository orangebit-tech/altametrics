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

  const invoices = [
    {
      vendor_name: 'AWS',
      amount: 123.45,
      due_date: new Date('2024-10-15'),
      description: 'EC2 hosting',
      paid: false,
    },
    {
      vendor_name: 'Google',
      amount: 67.89,
      due_date: new Date('2024-10-20'),
      description: 'Workspace',
      paid: true,
    },
    {
      vendor_name: 'Apple',
      amount: 299.99,
      due_date: new Date('2024-10-25'),
      description: 'Cloud Storage',
      paid: false,
    },
    {
      vendor_name: 'Microsoft',
      amount: 180.75,
      due_date: new Date('2024-10-18'),
      description: 'Azure VM',
      paid: true,
    },
    {
      vendor_name: 'Stripe',
      amount: 89.12,
      due_date: new Date('2024-10-22'),
      description: 'Payment Gateway',
      paid: false,
    },
    {
      vendor_name: 'DigitalOcean',
      amount: 45.0,
      due_date: new Date('2024-10-17'),
      description: 'Droplet hosting',
      paid: true,
    },
    {
      vendor_name: 'Netlify',
      amount: 19.99,
      due_date: new Date('2024-10-30'),
      description: 'Static Hosting',
      paid: false,
    },
    {
      vendor_name: 'Vercel',
      amount: 15.25,
      due_date: new Date('2024-10-12'),
      description: 'Edge Functions',
      paid: true,
    },
    {
      vendor_name: 'Cloudflare',
      amount: 65.0,
      due_date: new Date('2024-11-01'),
      description: 'CDN Services',
      paid: true,
    },
    {
      vendor_name: 'Zoom',
      amount: 49.99,
      due_date: new Date('2024-11-05'),
      description: 'Team Subscription',
      paid: false,
    },
    {
      vendor_name: 'Slack',
      amount: 99.0,
      due_date: new Date('2024-11-10'),
      description: 'Business Plan',
      paid: true,
    },
    {
      vendor_name: 'GitHub',
      amount: 25.0,
      due_date: new Date('2024-11-08'),
      description: 'Pro Team',
      paid: false,
    },
    {
      vendor_name: 'Figma',
      amount: 72.0,
      due_date: new Date('2024-11-12'),
      description: 'Design Tools',
      paid: true,
    },
    {
      vendor_name: 'Trello',
      amount: 13.5,
      due_date: new Date('2024-11-03'),
      description: 'Collaboration',
      paid: true,
    },
    {
      vendor_name: 'Heroku',
      amount: 34.99,
      due_date: new Date('2024-11-14'),
      description: 'App Hosting',
      paid: false,
    },
  ];

  for (const invoice of invoices) {
    await prisma.invoice.create({
      data: {
        ...invoice,
        userId: user.id,
      },
    });
  }


  console.log('Invoices created')
  console.log('Seed complete')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
