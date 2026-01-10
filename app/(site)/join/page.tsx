import { prisma } from "@/app/lib/prisma";
import JoinContent from "./JoinContent";

export default async function JoinPage() {
    const schedules = await prisma.classSchedule.findMany({
        orderBy: { day: 'asc' } // Simple ordering, refined in UI
    });

    return <JoinContent schedules={schedules} />;
}

