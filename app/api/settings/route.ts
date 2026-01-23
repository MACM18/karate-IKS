import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch settings
    let settings = await prisma.dojoSettings.findFirst();

    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.dojoSettings.create({
        data: {
          phoneNumbers: [],
          whatsappNumbers: [],
          senseiName: "Sensei",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      phoneNumbers,
      whatsappNumbers,
      senseiName,
      senseiEmail,
      dojoAddress,
    } = body;

    // Validate required fields
    if (!senseiName || typeof senseiName !== "string") {
      return NextResponse.json(
        { error: "Sensei name is required" },
        { status: 400 }
      );
    }

    // Upsert settings (create if doesn't exist, update if exists)
    const existingSettings = await prisma.dojoSettings.findFirst();

    let settings;
    if (existingSettings) {
      settings = await prisma.dojoSettings.update({
        where: { id: existingSettings.id },
        data: {
          phoneNumbers: phoneNumbers || [],
          whatsappNumbers: whatsappNumbers || [],
          senseiName,
          senseiEmail: senseiEmail || null,
          dojoAddress: dojoAddress || null,
        },
      });
    } else {
      settings = await prisma.dojoSettings.create({
        data: {
          phoneNumbers: phoneNumbers || [],
          whatsappNumbers: whatsappNumbers || [],
          senseiName,
          senseiEmail: senseiEmail || null,
          dojoAddress: dojoAddress || null,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to save settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
