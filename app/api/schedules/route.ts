import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

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

export async function POST(req: Request) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, dayOfWeek, startTime, endTime } = body;

        const schedule = await prisma.classSchedule.create({
            data: { 
                name, 
                day: dayOfWeek, 
                time: `${startTime} - ${endTime}`
            }
        });

        return NextResponse.json(schedule, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, name, dayOfWeek, startTime, endTime } = body;

        const schedule = await prisma.classSchedule.update({
            where: { id },
            data: { 
                name, 
                day: dayOfWeek, 
                time: `${startTime} - ${endTime}`
            }
        });

        return NextResponse.json(schedule);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Schedule ID required" }, { status: 400 });
        }

        await prisma.classSchedule.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 });
    }
}
