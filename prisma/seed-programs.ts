import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const programs = [
    {
      title: "Little Ninjas",
      ageGroup: "Ages 4 - 7",
      description:
        "A fun, high-energy introduction to martial arts. We focus on listening skills, balance, coordination, and stranger danger awareness.",
      benefits: [
        "Listening Skills",
        "Motor Coordination",
        "Positive Socialization",
      ],
      color: "blue",
      icon: "shield",
      order: 1,
    },
    {
      title: "Juniors Program",
      ageGroup: "Ages 8 - 15",
      description:
        "Building confidence and discipline. Students learn the full Shito-Ryu curriculum, including Kata, Kumite, and self-defense applications.",
      benefits: [
        "Self-Confidence",
        "Focus & Discipline",
        "Athletic Development",
      ],
      color: "red",
      icon: "target",
      featured: true,
      order: 2,
    },
    {
      title: "Adults & Teens",
      ageGroup: "Ages 16+",
      description:
        "Whether your goal is fitness, self-defense, or black belt excellence, our adult program offers a challenging and supportive environment.",
      benefits: [
        "Stress Relief",
        "Practical Self-Defense",
        "Functional Fitness",
      ],
      color: "amber",
      icon: "zap",
      order: 3,
    },
  ];

  for (const p of programs) {
    await prisma.program.create({
      data: p,
    });
  }

  console.log("Programs seeded");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
