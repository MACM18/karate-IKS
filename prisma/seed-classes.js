const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const schedules = [
        { name: "Little Ninjas (Mon/Wed 4PM)", day: "Monday, Wednesday", time: "16:00", capacity: 15 },
        { name: "Juniors (Tue/Thu 5PM)", day: "Tuesday, Thursday", time: "17:00", capacity: 20 },
        { name: "Adults Basic (Mon/Wed 6PM)", day: "Monday, Wednesday", time: "18:00", capacity: 25 },
        { name: "Advanced Kumite (Fri 6PM)", day: "Friday", time: "18:00", capacity: 20 },
    ];

    console.log("Seeding Class Schedules...");
    for (const s of schedules) {
        await prisma.classSchedule.upsert({
            where: { id: s.name.toLowerCase().replace(/ /g, '-') },
            update: {},
            create: {
                id: s.name.toLowerCase().replace(/ /g, '-'),
                ...s
            }
        });
    }
    console.log("Done!");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
