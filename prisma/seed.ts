import { PrismaClient, Role, CurriculumCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// --- Data Constants ---

const ranksData = [
  { name: "8th Kyu (White Belt)", colorCode: "#FFFFFF", order: 0 },
  { name: "7th Kyu (White Belt L2)", colorCode: "#F8F8F8", order: 1 },
  { name: "6th Kyu (Yellow Belt)", colorCode: "#EAB308", order: 2 },
  { name: "5th Kyu (Green Belt)", colorCode: "#22C55E", order: 3 },
  { name: "4th Kyu (Green Belt L2)", colorCode: "#16A34A", order: 4 },
  { name: "3rd Kyu (Brown Belt)", colorCode: "#92400E", order: 5 },
  { name: "2nd Kyu (Brown Belt L2)", colorCode: "#78350F", order: 6 },
  { name: "1st Kyu (Brown Belt L3)", colorCode: "#451A03", order: 7 },
  { name: "1st Dan (Black Belt)", colorCode: "#000000", order: 8 },
  { name: "2nd Dan (Black Belt)", colorCode: "#000000", order: 9 },
  { name: "3rd Dan (Black Belt)", colorCode: "#000000", order: 10 },
];

const programsData = [
  {
    title: "Little Ninjas",
    ageGroup: "Ages 4 - 7",
    description: "A fun, high-energy introduction to martial arts. We focus on listening skills, balance, coordination, and stranger danger awareness.",
    benefits: ["Listening Skills", "Motor Coordination", "Positive Socialization"],
    color: "blue",
    icon: "shield",
    order: 1,
  },
  {
    title: "Juniors Program",
    ageGroup: "Ages 8 - 15",
    description: "Building confidence and discipline. Students learn the full Shito-Ryu curriculum, including Kata, Kumite, and self-defense applications.",
    benefits: ["Self-Confidence", "Focus & Discipline", "Athletic Development"],
    color: "red",
    icon: "target",
    featured: true,
    order: 2,
  },
  {
    title: "Adults & Teens",
    ageGroup: "Ages 16+",
    description: "Whether your goal is fitness, self-defense, or black belt excellence, our adult program offers a challenging and supportive environment.",
    benefits: ["Stress Relief", "Practical Self-Defense", "Functional Fitness"],
    color: "amber",
    icon: "zap",
    order: 3,
  },
];

const classSchedulesData = [
  { name: "Little Ninjas (Mon/Wed 4PM)", day: "Monday, Wednesday", time: "16:00", capacity: 15 },
  { name: "Juniors (Tue/Thu 5PM)", day: "Tuesday, Thursday", time: "17:00", capacity: 20 },
  { name: "Adults Basic (Mon/Wed 6PM)", day: "Monday, Wednesday", time: "18:00", capacity: 25 },
  { name: "Advanced Kumite (Fri 6PM)", day: "Friday", time: "18:00", capacity: 20 },
];

const curriculumData: Record<string, any[]> = {
  "8th Kyu (White Belt)": [
    { category: "KATA", itemName: "Taikyoku Shodan", description: "First basic kata", order: 1 },
    { category: "TECHNIQUE", itemName: "Seiken Tsuki (Straight Punch)", description: "Basic straight punch", order: 2 },
    { category: "TECHNIQUE", itemName: "Age Uke (Rising Block)", description: "Upper level rising block", order: 3 },
    { category: "PHYSICAL", itemName: "20 Push-ups", description: "Proper form", order: 9 },
    { category: "KNOWLEDGE", itemName: "Dojo Etiquette", description: "Bowing protocol", order: 11 },
  ],
  "7th Kyu (White Belt L2)": [
    { category: "KATA", itemName: "Taikyoku Nidan", description: "Second basic kata", order: 1 },
    { category: "TECHNIQUE", itemName: "Uchi Uke (Inside Block)", description: "Inside forearm block", order: 2 },
  ],
  "6th Kyu (Yellow Belt)": [
    { category: "KATA", itemName: "Taikyoku Sandan", description: "Third basic kata", order: 1 },
    { category: "TECHNIQUE", itemName: "Shuto Uke", description: "Knife hand block", order: 2 },
    { category: "KUMITE", itemName: "Sanbon Kumite", description: "3-Step Sparring", order: 7 },
  ],
  "5th Kyu (Green Belt)": [
    { category: "KATA", itemName: "Pinan Shodan", description: "First Pinan kata", order: 1 },
    { category: "TECHNIQUE", itemName: "Gyaku Tsuki", description: "Reverse punch", order: 2 },
  ],
  "1st Dan (Black Belt)": [
    { category: "KATA", itemName: "Kanku Dai", description: "View the sky - major", order: 1 },
    { category: "KUMITE", itemName: "Black Belt Sparring", description: "High level control", order: 5 },
  ],
};

// --- Helper Functions ---
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const firstNames = ["Daniel", "Johnny", "Miguel", "Robby", "Tory", "Sam", "Hawk", "Demetri", "Aisha", "Mike", "Terry"];
const lastNames = ["LaRusso", "Lawrence", "Diaz", "Keene", "Nichols", "Robinson", "Moskowitz", "Barnes", "Silver"];

// --- Main Seed Function ---
async function main() {
  console.log("🌱 Starting Database Seed...");

  // 1. Create Admin
  const adminEmail = "hello@macm.dev";
  const hashedPassword = await bcrypt.hash("KarateMACM", 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hashedPassword, role: Role.ADMIN },
    create: {
      email: adminEmail,
      name: "Headquarters Admin",
      passwordHash: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin Created: ${admin.email}`);

  // 2. Create Ranks
  console.log("🥋 Seeding Ranks...");
  const dbRanks = [];
  for (const rank of ranksData) {
    const r = await prisma.rank.upsert({
      where: { order: rank.order },
      update: rank,
      create: rank,
    });
    dbRanks.push(r);
  }

  // 3. Create Programs
  console.log("📜 Seeding Programs...");
  for (const p of programsData) {
    // Programs don't have unique constraint on title easily, so we just perform a create/find logic check or deleteFirst?
    // For simplicity in a reset scenario, we use create. If consolidating, we can clear first.
    // We will rely on DB reset, so Create is fine.
    await prisma.program.create({ data: p });
  }

  // 4. Create Class Schedules
  console.log("⏰ Seeding Class Schedules...");
  const dbSchedules = [];
  for (const s of classSchedulesData) {
    const schedule = await prisma.classSchedule.upsert({
      where: { id: s.name.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: {
        id: s.name.toLowerCase().replace(/ /g, '-'),
        ...s
      }
    });
    dbSchedules.push(schedule);
  }

  // 5. Create Curriculum
  console.log("📚 Seeding Curriculum...");
  for (const rank of dbRanks) {
    const items = curriculumData[rank.name];
    if (items) {
      for (const item of items) {
        await prisma.curriculumItem.create({
          data: {
            rankId: rank.id,
            category: item.category as CurriculumCategory,
            itemName: item.itemName,
            description: item.description,
            order: item.order,
          }
        });
      }
    }
  }

  // 6. Create Random Students
  console.log("👥 Seeding Random Students...");
  const passwordHash = await bcrypt.hash("password123", 10);

  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@karateiks.com`;

    // Ensure email uniqueness collision handling
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) continue;

    const rank = dbRanks[Math.floor(Math.random() * Math.min(dbRanks.length, 6))];
    const schedule = dbSchedules[Math.floor(Math.random() * dbSchedules.length)];
    const enrollmentDate = randomDate(new Date(2022, 0, 1), new Date());

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: Role.STUDENT,
        createdAt: enrollmentDate,
      }
    });

    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        currentRankId: rank.id,
        classId: schedule.id,
        dateOfBirth: randomDate(new Date(1995, 0, 1), new Date(2015, 0, 1)),
        admissionNumber: `IKS-${1000 + i}`,
        bio: `Student of ${rank.name}`,
        isActive: true,
        createdAt: enrollmentDate,
      }
    });
  }
  console.log("✅ Seed Completed Successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
