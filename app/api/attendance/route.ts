import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { AttendanceSchema } from "@/app/lib/schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    // Ensure only authorized personnel can log attendance (e.g., Sensei or Admin)
    // Or if it's a kiosk mode, maybe strictly limit who can call this? 
    // For now, allow SENSEI/ADMIN.
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validatedData = AttendanceSchema.parse(body);

        const attendance = await prisma.attendance.create({
            data: {
                studentId: validatedData.studentId,
                classType: validatedData.classType,
                checkedInBy: session.user.id,
            }
        });

        return NextResponse.json(attendance, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 });
    }
}

// GET: Fetch recent attendance (Optional utility)
export async function GET(req: Request) {
    const session = await auth();
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get last 50 check-ins
    const logs = await prisma.attendance.findMany({
        take: 50,
        orderBy: { date: 'desc' },
        include: {
            student: {
                include: { user: { select: { name: true } } }
            }
        }
    });

    return NextResponse.json(logs);
}
