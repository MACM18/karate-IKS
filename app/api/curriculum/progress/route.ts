import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId, curriculumId, status, instructorNotes } =
      await request.json();

    if (!studentId || !curriculumId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upsert progress record
    const progress = await prisma.studentCurriculumProgress.upsert({
      where: {
        studentId_curriculumId: {
          studentId,
          curriculumId,
        },
      },
      update: {
        status,
        instructorNotes,
        completedAt: status === "MASTERED" ? new Date() : null,
      },
      create: {
        studentId,
        curriculumId,
        status,
        instructorNotes,
        completedAt: status === "MASTERED" ? new Date() : null,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error updating curriculum progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID required" },
        { status: 400 }
      );
    }

    const progress = await prisma.studentCurriculumProgress.findMany({
      where: { studentId },
      include: {
        curriculum: true,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching curriculum progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
