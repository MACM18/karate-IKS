import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // 1. Seed Ranks
    const ranks = [
        { name: 'White', colorCode: '#ffffff', order: 0 },
        { name: 'Yellow', colorCode: '#ca8a04', order: 1 }, // yellow-600
        { name: 'Orange', colorCode: '#f97316', order: 2 }, // orange-500
        { name: 'Green', colorCode: '#16a34a', order: 3 }, // green-600
        { name: 'Blue', colorCode: '#2563eb', order: 4 }, // blue-600
        { name: 'Purple', colorCode: '#9333ea', order: 5 }, // purple-600
        { name: 'Brown', colorCode: '#78350f', order: 6 }, // brown-900
        { name: 'Red', colorCode: '#dc2626', order: 7 }, // red-600
        { name: 'Black', colorCode: '#000000', order: 8 },
    ]

    for (const rank of ranks) {
        await prisma.rank.upsert({
            where: { order: rank.order },
            update: {},
            create: rank,
        })
    }
    console.log('Ranks seeded.')

    // 2. Seed Sensei (Admin)
    const senseiPassword = await bcrypt.hash('kata123', 10)
    const sensei = await prisma.user.upsert({
        where: { email: 'sensei@karate-iks.com' },
        update: {
            passwordHash: senseiPassword,
        },
        create: {
            email: 'sensei@karate-iks.com',
            name: 'Sensei Miyagi',
            role: 'SENSEI',
            passwordHash: senseiPassword,
        },
    })

    // 3. Seed Student
    const studentPassword = await bcrypt.hash('student123', 10)
    const student = await prisma.user.upsert({
        where: { email: 'student@example.com' },
        update: {
            passwordHash: studentPassword,
        },
        create: {
            email: 'student@example.com',
            name: 'Daniel San',
            role: 'STUDENT',
            passwordHash: studentPassword,
        },
    })

    // Link student to White Belt
    const whiteBelt = await prisma.rank.findFirst({ where: { name: 'White' } })
    if (whiteBelt) {
        await prisma.studentProfile.upsert({
            where: { userId: student.id },
            update: {},
            create: {
                userId: student.id,
                currentRankId: whiteBelt.id,
                emergencyContact: 'Mr. Miyagi',
            }
        })
    }


    console.log({ sensei, student })
    console.log('Seeding finished.')
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
