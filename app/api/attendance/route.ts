import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { AttendanceSchema } from "@/app/lib/schemas";
import { NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";

export async function POST(req: Request) {
    const session = await auth();

    if (
        !session ||
        (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validatedData = AttendanceSchema.parse(body);
        const date = body.date ? new Date(body.date) : new Date();

        // Check for existing attendance today
        const existing = await prisma.attendance.findFirst({
            where: {
                studentId: validatedData.studentId,
                date: {
                    gte: startOfDay(date),
                    lte: endOfDay(date),
                },
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Attendance already marked for this date" },
                { status: 409 }
            );
        }

        const attendance = await prisma.attendance.create({
            data: {
                studentId: validatedData.studentId,
                classType: validatedData.classType,
                date: date,
                checkedInBy: session.user.id,
            },
        });

        return NextResponse.json(attendance, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(
            { error: "Failed to record attendance" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (
        !session ||
        (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get("studentId");
        const dateStr = searchParams.get("date");

        if (!studentId || !dateStr) {
            return NextResponse.json(
                { error: "Missing studentId or date" },
                { status: 400 }
            );
        }

        const date = new Date(dateStr);

        await prisma.attendance.deleteMany({
            where: {
                studentId,
                date: {
                    gte: startOfDay(date),
                    lte: endOfDay(date),
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete attendance" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const session = await auth();
    if (
        !session ||
        (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    // If date is provided, return all attendance for that day (for visual checkmarks)
    if (dateStr) {
        const date = new Date(dateStr);
        const logs = await prisma.attendance.findMany({
            where: {
                date: {
                    gte: startOfDay(date),
                    lte: endOfDay(date),
                },
            },
            select: { studentId: true },
        });
        return NextResponse.json(logs);
    }

    // Otherwise default to recent activity log
    const logs = await prisma.attendance.findMany({
        take: 50,
        orderBy: { date: "desc" },
        include: {
            student: {
                include: { user: { select: { name: true } } },
            },
        },
    });

    return NextResponse.json(logs);
}
