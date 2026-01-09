import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ResourcesClient } from "./ResourcesClient";

export default async function ResourcesPage() {
    const session = await auth();
    if (!session || !session.user) redirect("/login");

    const [profile, resourcesData] = await Promise.all([
        prisma.studentProfile.findUnique({
            where: { userId: session.user.id },
            include: { currentRank: true }
        }),
        prisma.resource.findMany({
            include: { minRank: true }
        })
    ]);

    if (!profile) return <div>Profile not found</div>;

    const currentOrder = profile.currentRank?.order ?? -1;

    const resources = resourcesData.map(res => ({
        id: res.id,
        title: res.title,
        description: res.description || "",
        type: res.type.toLowerCase() as "video" | "pdf",
        url: res.url,
        isLocked: res.minRank ? res.minRank.order > currentOrder : false,
        requiredRank: res.minRank?.name
    }));

    return <ResourcesClient initialResources={resources} />;
}
