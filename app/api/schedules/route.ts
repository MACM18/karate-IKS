import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const schedules = await prisma.classSchedule.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(schedules);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
    }
}
