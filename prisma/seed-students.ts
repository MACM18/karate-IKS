import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Utility function to generate random dates
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// First names pool
const firstNames = [
  "Daniel",
  "Johnny",
  "Miguel",
  "Robby",
  "Tory",
  "Sam",
  "Hawk",
  "Demetri",
  "Aisha",
  "Moon",
  "Yasmine",
  "Chris",
  "Mitch",
  "Bert",
  "Nate",
  "Kyler",
  "Anthony",
  "Kenny",
  "Devon",
  "Piper",
  "Armand",
  "Chozen",
  "Terry",
  "Mike",
  "Carmen",
  "Amanda",
  "Shannon",
  "Ali",
  "Kumiko",
  "Jessica",
  "Anoush",
  "Louie",
];

const lastNames = [
  "LaRusso",
  "Lawrence",
  "Diaz",
  "Keene",
  "Nichols",
  "Robinson",
  "Moskowitz",
  "Alexopoulos",
  "Turner",
  "Johnson",
  "Mills",
  "Stone",
  "Harper",
  "Reed",
  "Chen",
  "Kim",
  "Patel",
  "Rodriguez",
  "Martinez",
  "Garcia",
  "Thompson",
  "Anderson",
  "Wilson",
  "Moore",
  "Taylor",
  "Jackson",
  "White",
  "Harris",
];

async function main() {
  console.log("🥋 Starting student seed...");

  // Get all ranks ordered
  const ranks = await prisma.rank.findMany({ orderBy: { order: "asc" } });
  if (ranks.length === 0) {
    console.log("⚠️  No ranks found. Please run rank seeding first.");
    return;
  }

  // Get class schedules
  const schedules = await prisma.classSchedule.findMany();

  console.log(`Found ${ranks.length} ranks and ${schedules.length} schedules`);

  // Generate 50 random students
  const studentCount = 50;
  const students = [];

  for (let i = 0; i < studentCount; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@karateiks.com`;

    // Random rank (weighted towards lower ranks)
    const rankIndex = Math.floor(Math.random() * Math.random() * ranks.length);
    const rank = ranks[rankIndex];

    // Random class assignment
    const classSchedule =
      schedules.length > 0
        ? schedules[Math.floor(Math.random() * schedules.length)]
        : null;

    // Random dates
    const enrollmentDate = randomDate(new Date(2020, 0, 1), new Date());

    const birthDate = randomDate(new Date(1990, 0, 1), new Date(2015, 11, 31));

    students.push({
      name,
      email,
      rank,
      classSchedule,
      enrollmentDate,
      birthDate,
    });
  }

  console.log(`🎯 Creating ${studentCount} students...`);

  // Create users and profiles
  let createdCount = 0;
  for (const student of students) {
    try {
      // Check if user exists
      const existing = await prisma.user.findUnique({
        where: { email: student.email },
      });

      if (existing) {
        console.log(`⏭️  Skipping ${student.email} - already exists`);
        continue;
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          name: student.name,
          email: student.email,
          passwordHash: await bcrypt.hash("password123", 10), // Default password
          role: "STUDENT",
          createdAt: student.enrollmentDate,
        },
      });

      // Create student profile
      const admissionNumber = `IKS${String(createdCount + 1).padStart(4, "0")}`;

      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          currentRankId: student.rank.id,
          classId: student.classSchedule?.id,
          dateOfBirth: student.birthDate,
          admissionNumber,
          bio: `Dedicated karate practitioner focused on mastering ${student.rank.name} techniques.`,
          isActive: Math.random() > 0.1, // 90% active
          createdAt: student.enrollmentDate,
        },
      });

      // Generate random attendance records
      const attendanceCount = Math.floor(Math.random() * 50) + 10; // 10-60 classes
      const attendanceRecords = [];

      for (let j = 0; j < attendanceCount; j++) {
        const attendanceDate = randomDate(student.enrollmentDate, new Date());
        attendanceRecords.push({
          studentId: user.id, // Will be updated after profile creation
          date: attendanceDate,
          classType: student.classSchedule?.name || "General Training",
        });
      }

      // Get the created profile
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
      });

      if (profile) {
        // Create attendance records
        for (const record of attendanceRecords) {
          await prisma.attendance.create({
            data: {
              studentId: profile.id,
              date: record.date,
              classType: record.classType,
            },
          });
        }

        // Generate random achievements (20% chance per student)
        if (Math.random() > 0.8) {
          const achievementCount = Math.floor(Math.random() * 3) + 1;
          const achievementTypes = [
            {
              title: "Tournament Champion",
              desc: "Secured 1st place in regional kumite competition",
            },
            {
              title: "Kata Excellence",
              desc: "Performed flawless kata demonstration at seminar",
            },
            {
              title: "Perfect Attendance",
              desc: "Attended every class for 3 consecutive months",
            },
            {
              title: "Breakthrough Performance",
              desc: "Demonstrated exceptional technical improvement",
            },
            {
              title: "Leadership Award",
              desc: "Helped junior students master basic techniques",
            },
          ];

          for (let k = 0; k < achievementCount; k++) {
            const achievement =
              achievementTypes[
                Math.floor(Math.random() * achievementTypes.length)
              ];
            await prisma.achievement.create({
              data: {
                studentId: profile.id,
                title: achievement.title,
                description: achievement.desc,
                date: randomDate(student.enrollmentDate, new Date()),
              },
            });
          }
        }

        // Generate promotion history (if not white belt)
        if (student.rank.order > 0) {
          const promotionCount = Math.min(student.rank.order, 5); // Max 5 historical promotions
          const promotionRanks = ranks.slice(0, promotionCount);

          let promotionDate = new Date(student.enrollmentDate);
          for (const pRank of promotionRanks) {
            promotionDate = new Date(
              promotionDate.getTime() + 90 * 24 * 60 * 60 * 1000
            ); // ~3 months later
            if (promotionDate > new Date()) break;

            await prisma.studentPromotion.create({
              data: {
                studentId: profile.id,
                rankId: pRank.id,
                promotedAt: promotionDate,
                notes: `Demonstrated mastery of ${pRank.name} curriculum requirements.`,
              },
            });
          }
        }
      }

      createdCount++;
      console.log(`✅ Created: ${student.name} (${student.rank.name})`);
    } catch (error) {
      console.error(`❌ Error creating ${student.name}:`, error);
    }
  }

  console.log(`\n🎉 Successfully created ${createdCount} students!`);
  console.log("\n📊 Summary:");

  const totalStudents = await prisma.studentProfile.count();
  const totalAttendance = await prisma.attendance.count();
  const totalAchievements = await prisma.achievement.count();

  console.log(`   Total Students: ${totalStudents}`);
  console.log(`   Total Attendance Records: ${totalAttendance}`);
  console.log(`   Total Achievements: ${totalAchievements}`);
  console.log("\n🔐 Default password for all seeded students: password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
