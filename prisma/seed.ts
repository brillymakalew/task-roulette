import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  const dian = await prisma.user.upsert({
    where: { username: 'Dian' },
    update: {},
    create: {
      username: 'Dian',
      password_hash: passwordHash,
    },
  })

  const brilly = await prisma.user.upsert({
    where: { username: 'Brilly' },
    update: {},
    create: {
      username: 'Brilly',
      password_hash: passwordHash,
    },
  })

  console.log({ dian, brilly })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
