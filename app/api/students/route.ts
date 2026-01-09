import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { StudentSchema } from "@/app/lib/schemas";
import { encrypt, decrypt } from "@/app/lib/encryption";
import { NextResponse } from "next/server";

// GET: List all students (Admin Only)
export async function GET(req: Request) {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN' && session.user.role !== 'SENSEI') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const students = await prisma.studentProfile.findMany({
            include: {
                user: {
                    select: { name: true, email: true, role: true }
                },
                currentRank: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        // Decrypt PII for Admin view
        const decryptedStudents = students.map(student => ({
            ...student,
            phone: student.phone ? decrypt(student.phone) : null,
            emergencyContact: student.emergencyContact ? decrypt(student.emergencyContact) : null,
        }));

        return NextResponse.json(decryptedStudents);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
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
            // Note: Password handling should be robust (hashing). Here we set a default.
            const user = await tx.user.create({
                data: {
                    name: validatedData.name,
                    email: validatedData.email,
                    role: 'STUDENT',
                    // passwordHash: await bcrypt.hash('welcome123', 10), // In real app
                }
            });

            // 2. Get Rank ID (assuming ranks exist, otherwise find/create)
            // For simplicity, we search for the rank by name
            let rank = await tx.rank.findFirst({ where: { name: validatedData.rank } });
            if (!rank) {
                // Fallback or error. For this implementation plan, allow null or handle grace.
                // We can optionally seed ranks if they don't exist.
            }

            // 3. Create Profile
            const profile = await tx.studentProfile.create({
                data: {
                    userId: user.id,
                    phone: validatedData.phone ? encrypt(validatedData.phone) : null,
                    emergencyContact: validatedData.emergencyContact ? encrypt(validatedData.emergencyContact) : null,
                    dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
                    currentRankId: rank?.id,
                }
            });

            return { user, profile };
        });

        return NextResponse.json(result, { status: 201 });

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
