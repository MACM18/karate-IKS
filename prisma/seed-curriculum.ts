import { PrismaClient, CurriculumCategory } from "@prisma/client";

const prisma = new PrismaClient();

const curriculumData = {
  // White Belt (8th & 7th Kyu)
  "8th Kyu (White Belt)": [
    // Kata
    {
      category: "KATA",
      itemName: "Taikyoku Shodan",
      description: "First basic kata",
      order: 1,
    },

    // Techniques
    {
      category: "TECHNIQUE",
      itemName: "Seiken Tsuki (Straight Punch)",
      description: "Basic straight punch from ready stance",
      order: 2,
    },
    {
      category: "TECHNIQUE",
      itemName: "Age Uke (Rising Block)",
      description: "Upper level rising block",
      order: 3,
    },
    {
      category: "TECHNIQUE",
      itemName: "Soto Uke (Outside Block)",
      description: "Outside forearm block",
      order: 4,
    },
    {
      category: "TECHNIQUE",
      itemName: "Gedan Barai (Downward Block)",
      description: "Lower level sweeping block",
      order: 5,
    },
    {
      category: "TECHNIQUE",
      itemName: "Mae Geri (Front Kick)",
      description: "Basic front snap kick",
      order: 6,
    },

    // Stances
    {
      category: "TECHNIQUE",
      itemName: "Zenkutsu Dachi (Front Stance)",
      description: "Forward leaning stance, 70% front weight",
      order: 7,
    },
    {
      category: "TECHNIQUE",
      itemName: "Heiko Dachi (Parallel Stance)",
      description: "Natural parallel ready stance",
      order: 8,
    },

    // Physical Requirements
    {
      category: "PHYSICAL",
      itemName: "20 Push-ups",
      description: "Continuous push-ups with proper form",
      order: 9,
    },
    {
      category: "PHYSICAL",
      itemName: "30 Sit-ups",
      description: "Continuous sit-ups",
      order: 10,
    },

    // Knowledge
    {
      category: "KNOWLEDGE",
      itemName: "Dojo Etiquette",
      description: "Bowing protocol, respect for sensei and dojo",
      order: 11,
    },
    {
      category: "KNOWLEDGE",
      itemName: "Count to 10 in Japanese",
      description: "Ichi, Ni, San, Shi, Go, Roku, Shichi, Hachi, Ku, Ju",
      order: 12,
    },
  ],

  "7th Kyu (White Belt L2)": [
    {
      category: "KATA",
      itemName: "Taikyoku Nidan",
      description: "Second basic kata",
      order: 1,
    },
    {
      category: "TECHNIQUE",
      itemName: "Uchi Uke (Inside Block)",
      description: "Inside forearm block",
      order: 2,
    },
    {
      category: "PHYSICAL",
      itemName: "25 Push-ups",
      description: "Continuous push-ups with proper form",
      order: 3,
    },
    {
      category: "PHYSICAL",
      itemName: "35 Sit-ups",
      description: "Continuous sit-ups",
      order: 4,
    },
  ],

  // Yellow Belt (6th Kyu)
  "6th Kyu (Yellow Belt)": [
    {
      category: "KATA",
      itemName: "Taikyoku Sandan",
      description: "Third basic kata",
      order: 1,
    },

    {
      category: "TECHNIQUE",
      itemName: "Shuto Uke (Knife Hand Block)",
      description: "Open hand blocking technique",
      order: 2,
    },
    {
      category: "TECHNIQUE",
      itemName: "Mawashi Geri (Roundhouse Kick)",
      description: "Circular kicking technique",
      order: 3,
    },
    {
      category: "TECHNIQUE",
      itemName: "Yoko Geri Keage (Side Snap Kick)",
      description: "Side snap kicking technique",
      order: 4,
    },

    {
      category: "TECHNIQUE",
      itemName: "Kokutsu Dachi (Back Stance)",
      description: "Back leaning stance, 70% rear weight",
      order: 5,
    },
    {
      category: "TECHNIQUE",
      itemName: "Kiba Dachi (Horse Stance)",
      description: "Strong side stance for blocking",
      order: 6,
    },

    {
      category: "KUMITE",
      itemName: "Sanbon Kumite (3-Step Sparring)",
      description: "Basic three-step sparring drill",
      order: 7,
    },

    {
      category: "PHYSICAL",
      itemName: "30 Push-ups",
      description: "Continuous push-ups with proper form",
      order: 8,
    },
    {
      category: "PHYSICAL",
      itemName: "40 Sit-ups",
      description: "Continuous sit-ups",
      order: 9,
    },

    {
      category: "KNOWLEDGE",
      itemName: "Basic Striking Surfaces",
      description: "Seiken, Shuto, Uraken, Empi",
      order: 10,
    },
  ],

  // Green Belt (5th & 4th Kyu)
  "5th Kyu (Green Belt)": [
    {
      category: "KATA",
      itemName: "Pinan Shodan",
      description: "First Pinan kata",
      order: 1,
    },

    {
      category: "TECHNIQUE",
      itemName: "Gyaku Tsuki (Reverse Punch)",
      description: "Counter punch with hip rotation",
      order: 2,
    },
    {
      category: "TECHNIQUE",
      itemName: "Uraken Uchi (Backfist Strike)",
      description: "Snapping backfist strike",
      order: 3,
    },
    {
      category: "TECHNIQUE",
      itemName: "Yoko Geri Kekomi (Side Thrust Kick)",
      description: "Thrusting side kick",
      order: 4,
    },

    {
      category: "TECHNIQUE",
      itemName: "Neko Ashi Dachi (Cat Stance)",
      description: "Front leg light, ready to kick",
      order: 5,
    },

    {
      category: "KUMITE",
      itemName: "Kihon Ippon Kumite (1-Step Sparring)",
      description: "Basic one-step sparring",
      order: 6,
    },

    {
      category: "PHYSICAL",
      itemName: "40 Push-ups",
      description: "Continuous push-ups with proper form",
      order: 7,
    },
    {
      category: "PHYSICAL",
      itemName: "50 Sit-ups",
      description: "Continuous sit-ups",
      order: 8,
    },

    {
      category: "KNOWLEDGE",
      itemName: "Dojo Kun Principles",
      description: "Understand and recite the five principles",
      order: 9,
    },
  ],

  "4th Kyu (Green Belt L2)": [
    {
      category: "KATA",
      itemName: "Pinan Nidan",
      description: "Second Pinan kata",
      order: 1,
    },
    {
      category: "TECHNIQUE",
      itemName: "Ushiro Geri (Back Kick)",
      description: "Rear thrust kick",
      order: 2,
    },
    {
      category: "PHYSICAL",
      itemName: "50 Push-ups",
      description: "Continuous push-ups",
      order: 3,
    },
    {
      category: "PHYSICAL",
      itemName: "60 Sit-ups",
      description: "Continuous sit-ups",
      order: 4,
    },
  ],

  // Brown Belt (3rd, 2nd, 1st Kyu)
  "3rd Kyu (Brown Belt)": [
    {
      category: "KATA",
      itemName: "Pinan Sandan",
      description: "Third Pinan kata",
      order: 1,
    },

    {
      category: "TECHNIQUE",
      itemName: "Empi Uchi (Elbow Strike)",
      description: "Close-range elbow strike",
      order: 2,
    },
    {
      category: "TECHNIQUE",
      itemName: "Mae Geri Jodan (High Front Kick)",
      description: "Front kick to head level",
      order: 3,
    },

    {
      category: "KUMITE",
      itemName: "Jiyu Ippon Kumite (Semi-Free 1-Step)",
      description: "One-step with freedom of movement",
      order: 4,
    },

    {
      category: "PHYSICAL",
      itemName: "60 Push-ups",
      description: "Continuous push-ups",
      order: 5,
    },
    {
      category: "PHYSICAL",
      itemName: "70 Sit-ups",
      description: "Continuous sit-ups",
      order: 6,
    },

    {
      category: "KNOWLEDGE",
      itemName: "Shinbukan History",
      description: "Origins of Shito-Ryu Shinbukan",
      order: 7,
    },
  ],

  "2nd Kyu (Brown Belt L2)": [
    {
      category: "KATA",
      itemName: "Pinan Yondan",
      description: "Fourth Pinan kata",
      order: 1,
    },
    {
      category: "TECHNIQUE",
      itemName: "Nukite (Spear Hand Strike)",
      description: "Finger tip thrust",
      order: 2,
    },
    {
      category: "KUMITE",
      itemName: "Jiyu Kumite (Controlled Free Sparring)",
      description: "Light contact sparring with control",
      order: 3,
    },
    {
      category: "PHYSICAL",
      itemName: "70 Push-ups",
      description: "Continuous push-ups",
      order: 4,
    },
  ],

  "1st Kyu (Brown Belt L3)": [
    {
      category: "KATA",
      itemName: "Pinan Godan",
      description: "Fifth Pinan kata",
      order: 1,
    },
    {
      category: "KATA",
      itemName: "Bassai Dai",
      description: "Storm the fortress - major version",
      order: 2,
    },

    {
      category: "TECHNIQUE",
      itemName: "Advanced Combination Techniques",
      description: "Multi-strike combinations",
      order: 3,
    },

    {
      category: "KUMITE",
      itemName: "Competition Kumite",
      description: "Tournament-level sparring",
      order: 4,
    },

    {
      category: "PHYSICAL",
      itemName: "80 Push-ups",
      description: "Continuous push-ups",
      order: 5,
    },
    {
      category: "PHYSICAL",
      itemName: "90 Sit-ups",
      description: "Continuous sit-ups",
      order: 6,
    },

    {
      category: "KNOWLEDGE",
      itemName: "Comprehensive Bunkai",
      description: "Understanding of all kata applications",
      order: 7,
    },
  ],

  // Black Belt (1st Dan)
  "1st Dan (Black Belt)": [
    {
      category: "KATA",
      itemName: "Kanku Dai",
      description: "View the sky - major version",
      order: 1,
    },
    {
      category: "KATA",
      itemName: "Jion",
      description: "Temple sound kata",
      order: 2,
    },

    {
      category: "TECHNIQUE",
      itemName: "Perfect Kihon",
      description: "Flawless execution of all basic techniques",
      order: 3,
    },
    {
      category: "TECHNIQUE",
      itemName: "Advanced Kumite Strategy",
      description: "Tournament and self-defense tactics",
      order: 4,
    },

    {
      category: "KUMITE",
      itemName: "Black Belt Sparring",
      description: "High-level controlled sparring",
      order: 5,
    },
    {
      category: "KUMITE",
      itemName: "Teaching Assistant Role",
      description: "Ability to teach and mentor junior students",
      order: 6,
    },

    {
      category: "PHYSICAL",
      itemName: "100 Push-ups",
      description: "Continuous push-ups",
      order: 7,
    },
    {
      category: "PHYSICAL",
      itemName: "100 Sit-ups",
      description: "Continuous sit-ups",
      order: 8,
    },

    {
      category: "KNOWLEDGE",
      itemName: "Complete Kata Bunkai",
      description: "Teach and demonstrate all applications",
      order: 9,
    },
    {
      category: "KNOWLEDGE",
      itemName: "Karate Philosophy",
      description: "Understanding of Bushido and karate principles",
      order: 10,
    },
  ],
};

async function main() {
  console.log("🥋 Starting curriculum seed...");

  // Get all ranks
  const ranks = await prisma.rank.findMany({ orderBy: { order: "asc" } });

  if (ranks.length === 0) {
    console.log("⚠️  No ranks found. Please run rank seeding first.");
    return;
  }

  console.log(`Found ${ranks.length} ranks`);

  let totalCreated = 0;

  for (const rank of ranks) {
    const rankCurriculum =
      curriculumData[rank.name as keyof typeof curriculumData];

    if (!rankCurriculum) {
      console.log(`⏭️  No curriculum defined for ${rank.name}, skipping...`);
      continue;
    }

    console.log(`\n📚 Processing ${rank.name}...`);

    for (const item of rankCurriculum) {
      try {
        await prisma.curriculumItem.create({
          data: {
            rankId: rank.id,
            category: item.category as CurriculumCategory,
            itemName: item.itemName,
            description: item.description,
            order: item.order,
            isRequired: true,
          },
        });

        totalCreated++;
        console.log(`  ✅ Added: ${item.itemName}`);
      } catch (error) {
        console.error(`  ❌ Failed to add ${item.itemName}:`, error);
      }
    }
  }

  console.log(`\n🎉 Successfully created ${totalCreated} curriculum items!`);

  // Summary
  const summary = await prisma.curriculumItem.groupBy({
    by: ["category"],
    _count: true,
  });

  console.log("\n📊 Curriculum Summary:");
  for (const item of summary) {
    console.log(`   ${item.category}: ${item._count} items`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
