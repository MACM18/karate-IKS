import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { StudentSchema } from "@/app/lib/schemas";
import { encrypt, decrypt } from "@/app/lib/encryption";
import { NextResponse } from "next/server";

// GET: List all students (Admin Only)
export async function GET(req: Request) {
  const session = await auth();

  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const students = (await prisma.studentProfile.findMany({
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
        currentRank: true,
      },
      orderBy: { createdAt: "desc" },
    })) as any[];

    // Decrypt PII for Admin view
    const decryptedStudents = students.map((student) => ({
      ...student,
      phone: student.phone ? decrypt(student.phone) : null,
      emergencyContact: student.emergencyContact
        ? decrypt(student.emergencyContact)
        : null,
    }));

    return NextResponse.json(decryptedStudents);
  } catch (error: any) {
    console.error("Error fetching students:", error);
    // If migrations haven't been applied the table won't exist (Prisma P2021) — return empty list during build
    if (error?.code === "P2021") {
      console.warn("Student table missing; returning empty list.");
      return NextResponse.json([]);
    }
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}

// POST: Create a new student (Admin Only)
export async function POST(req: Request) {
  // Public Registration (Allow anyone to join)
  // const session = await auth();
  // if (!session || session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI') {
  //    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const body = await req.json();
    const validatedData = StudentSchema.parse(body);

    // Transaction to create User and Profile
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          role: "STUDENT",
        },
      });

      // 2. Generate Admission Number: KS-[Year]-[Count+1]
      const year = new Date().getFullYear();
      const count = await tx.studentProfile.count({
        where: {
          admissionNumber: {
            startsWith: `KS-${year}`,
          },
        },
      });
      const admissionNumber = `KS-${year}-${(count + 1).toString().padStart(3, "0")}`;

      // 3. Get Rank ID
      let rank = await tx.rank.findFirst({
        where: { name: validatedData.rank },
      });

      // 4. Create Profile
      const profile = await tx.studentProfile.create({
        data: {
          userId: user.id,
          admissionNumber,
          phone: validatedData.phone ? encrypt(validatedData.phone) : null,
          emergencyContact: validatedData.emergencyContact
            ? encrypt(validatedData.emergencyContact)
            : null,
          dateOfBirth: validatedData.dateOfBirth
            ? new Date(validatedData.dateOfBirth)
            : null,
          currentRankId: rank?.id,
          classId: (validatedData as any).classId || null,
        },
      });

      return { user, profile };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
