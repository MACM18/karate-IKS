import { prisma } from "@/app/lib/prisma";
import ProgramsContent from "./ProgramsContent";

export const revalidate = 3600; // Hourly revalidation for schedule

export default async function ProgramsPage() {
  const schedule = await prisma.classSchedule.findMany({
    orderBy: { day: "asc" },
  });

  const programs = await prisma.program.findMany({
    orderBy: { order: "asc" },
  });

  return <ProgramsContent schedule={schedule} programs={programs} />;
}
