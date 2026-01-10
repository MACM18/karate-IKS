import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/app/lib/storage";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (
        !session ||
        (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const caption = formData.get("caption") as string;
        const category = formData.get("category") as string;
        const featured = formData.get("featured") === "true";
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        const uploadPromises = files.map(async (file) => {
            const url = await uploadFile(file, "gallery");
            if (!url) throw new Error(`Failed to upload ${file.name}`);

            return prisma.galleryItem.create({
                data: {
                    title: title || file.name, // Use file name as fallback title
                    caption,
                    category,
                    featured,
                    url,
                },
            });
        });

        const results = await Promise.all(uploadPromises);

        return NextResponse.json({
            success: true,
            count: results.length,
            items: results,
        });
    } catch (error) {
        console.error("Bulk Upload Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
