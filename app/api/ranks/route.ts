import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const ranks = await prisma.rank.findMany({
            orderBy: { order: "asc" },
        });
        return NextResponse.json(ranks);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch ranks" }, { status: 500 });
    }
}
