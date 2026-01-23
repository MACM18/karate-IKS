import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { encrypt } from "@/app/lib/encryption";
import { z } from "zod";

const RegistrationSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    emergencyContact: z.string().optional(),
    dateOfBirth: z.string().optional(), // ISO String
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = RegistrationSchema.parse(body);

        // Check if email already exists in User or MemberApplication
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }

        const existingApp = await prisma.memberApplication.findUnique({
            where: { email: validatedData.email }
        });

        if (existingApp) {
            return NextResponse.json({ error: "Application already pending for this email" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        const encryptedPhone = validatedData.phone ? encrypt(validatedData.phone) : null;
        const encryptedEmergency = validatedData.emergencyContact ? encrypt(validatedData.emergencyContact) : null;

        const application = await prisma.memberApplication.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                passwordHash: hashedPassword,
                phone: encryptedPhone,
                emergencyContact: encryptedEmergency,
                dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
                status: "PENDING"
            }
        });

        return NextResponse.json({ message: "Application submitted successfully", applicationId: application.id }, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation Error", details: (error as z.ZodError).issues }, { status: 400 });
        }
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
