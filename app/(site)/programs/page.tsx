import { prisma } from "@/app/lib/prisma";
import ProgramsContent from "./ProgramsContent";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Hourly revalidation for schedule

export default async function ProgramsPage() {
  let schedule: any[] = [];
  try {
    schedule = await prisma.classSchedule.findMany({
      orderBy: { day: "asc" },
    });
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn("Prisma P2021 during schedule fetch; using empty schedule.");
      schedule = [];
    } else {
      throw err;
    }
  }

  let programs: any[] = [];
  try {
    programs = await prisma.program.findMany({
      orderBy: { order: "asc" },
    });
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn("Prisma P2021 during programs fetch; using empty programs.");
      programs = [];
    } else {
      throw err;
    }
  }

  return <ProgramsContent schedule={schedule} programs={programs} />;
}
