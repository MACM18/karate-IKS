"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function approveMemberApplication(applicationId: string) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")) {
        throw new Error("Unauthorized");
    }

    const application = await prisma.memberApplication.findUnique({
        where: { id: applicationId }
    });

    if (!application) throw new Error("Application not found");

    // 1. Create User
    const user = await prisma.user.create({
        data: {
            name: application.name,
            email: application.email,
            passwordHash: application.passwordHash,
            role: "STUDENT",
        }
    });

    // 2. Generate Admission Number: KS-[Year]-[Count+1]
    const year = new Date().getFullYear();
    const count = await prisma.studentProfile.count({
        where: {
            admissionNumber: {
                startsWith: `KS-${year}`
            }
        }
    });
    const admissionNumber = `KS-${year}-${(count + 1).toString().padStart(3, '0')}`;

    // 3. Get Default Rank (8th Kyu - White Belt) 
    // Assuming 8th Kyu is the lowest order, or searching by Name.
    // Robust way: Find rank with lowest order.
    let rank = await prisma.rank.findFirst({ orderBy: { order: "asc" } });

    // 4. Create StudentProfile
    await prisma.studentProfile.create({
        data: {
            userId: user.id,
            admissionNumber,
            phone: application.phone, // Already encrypted
            emergencyContact: application.emergencyContact, // Already encrypted
            dateOfBirth: application.dateOfBirth,
            currentRankId: rank?.id,
        }
    });

    // 5. Update Application Status (or delete it, but keeping it as APPROVED is better for history, or user requested deletion?)
    // User prompted: "delete/archive member application". 
    // Let's update status to APPROVED for record keeping. Or the prompt said "delete/archive". Let's update status.
    await prisma.memberApplication.update({
        where: { id: applicationId },
        data: { status: "APPROVED" }
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/students");
}

export async function rejectMemberApplication(applicationId: string) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")) {
        throw new Error("Unauthorized");
    }

    await prisma.memberApplication.update({
        where: { id: applicationId },
        data: { status: "REJECTED" }
    });

    revalidatePath("/admin/dashboard");
}
