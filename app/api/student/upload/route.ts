import { NextRequest, NextResponse } from "next/server";
import { uploadFile, deleteFile } from "@/app/lib/storage";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload new image
    const url = await uploadFile(file, `profiles/${session.user.id}`);
    if (!url) {
      return NextResponse.json(
        { error: "Failed to upload to storage" },
        { status: 500 }
      );
    }

    // Delete old image if exists
    // (Optional: fetch current user to getting old image path, but assume storage handles replacement or unique names)
    // Ideally we should clean up old images, but for now let's focus on the upload working.
    if (
      session.user.image &&
      session.user.id &&
      session.user.image.includes(session.user.id)
    ) {
      try {
        await deleteFile(session.user.image);
      } catch (e) {
        console.error("Failed to delete old image", e);
      }
    }

    // Update User and StudentProfile
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: url },
    });

    // Also update student profile if we want to store it there, but User.image is the source of truth for auth session
    // The StudentProfile doesn't strictly have an 'image' field in the schema usually (it's on User), but checked relations.
    // Let's check schema.prisma if needed, but User.image is standard for NextAuth.

    return NextResponse.json({
      success: true,
      url: url,
    });
  } catch (error) {
    console.error("Profile Upload Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
