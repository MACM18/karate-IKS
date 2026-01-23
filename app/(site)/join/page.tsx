import { prisma } from "@/app/lib/prisma";
import JoinContent from "./JoinContent";

export const dynamic = "force-dynamic";

export default async function JoinPage() {
  let schedules: any[] = [];
  try {
    schedules = await prisma.classSchedule.findMany({
      orderBy: { day: "asc" }, // Simple ordering, refined in UI
    });
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn(
        "Prisma P2021 during schedules fetch; using empty schedules.",
      );
      schedules = [];
    } else {
      throw err;
    }
  }

  return <JoinContent schedules={schedules} />;
}
