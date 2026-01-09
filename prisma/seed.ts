import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seed started...');

    // 1. Create Default Admin
    const adminEmail = 'hello@macm.dev';
    const adminPassword = 'KarateMACM';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            passwordHash: hashedPassword,
            role: Role.ADMIN,
        },
        create: {
            email: adminEmail,
            name: 'Headquarters Admin',
            passwordHash: hashedPassword,
            role: Role.ADMIN,
        },
    });

    console.log(`Admin user created/updated: ${admin.email}`);

    // 2. Create Ranks
    const ranks = [
        { name: '8th Kyu (White Belt)', colorCode: '#FFFFFF', order: 0 },
        { name: '7th Kyu (White Belt L2)', colorCode: '#F8F8F8', order: 1 },
        { name: '6th Kyu (Yellow Belt)', colorCode: '#EAB308', order: 2 },
        { name: '5th Kyu (Green Belt)', colorCode: '#22C55E', order: 3 },
        { name: '4th Kyu (Green Belt L2)', colorCode: '#16A34A', order: 4 },
        { name: '3rd Kyu (Brown Belt)', colorCode: '#92400E', order: 5 },
        { name: '2nd Kyu (Brown Belt L2)', colorCode: '#78350F', order: 6 },
        { name: '1st Kyu (Brown Belt L3)', colorCode: '#451A03', order: 7 },
        { name: '1st Dan (Black Belt)', colorCode: '#000000', order: 8 },
        { name: '2nd Dan (Black Belt)', colorCode: '#000000', order: 9 },
        { name: '3rd Dan (Black Belt)', colorCode: '#000000', order: 10 },
        { name: '4th Dan (Black Belt)', colorCode: '#000000', order: 11 },
        { name: '5th Dan (Black Belt)', colorCode: '#000000', order: 12 },
        { name: '6th Dan (Black Belt)', colorCode: '#000000', order: 13 },
        { name: '7th Dan (Black Belt)', colorCode: '#000000', order: 14 },
        { name: '8th Dan (Black Belt)', colorCode: '#000000', order: 15 },
    ];

    for (const rank of ranks) {
        await prisma.rank.upsert({
            where: { order: rank.order },
            update: {
                name: rank.name,
                colorCode: rank.colorCode,
            },
            create: {
                name: rank.name,
                colorCode: rank.colorCode,
                order: rank.order,
            },
        });
    }

    console.log('All ranks seeded successfully.');
    console.log('Seed finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
