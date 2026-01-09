import { prisma } from "@/app/lib/prisma";
import { PromotionsClient } from "./PromotionsClient";

export default async function PromotionsPage() {
    // Candidates are students with APPROVED exam applications who haven't been promoted since that approval
    // Simplified: Show all students who have at least one APPROVED application.
    // In a real system, we might want to filter by students whose current rank is less than the rank they applied for.

    const candidatesData = (await prisma.studentProfile.findMany({
        where: {
            applications: {
                some: {
                    status: 'APPROVED'
                }
            }
        },
        include: {
            user: true,
            currentRank: true,
            applications: {
                where: { status: 'APPROVED' },
                orderBy: { createdAt: 'desc' },
                take: 1,
                include: { template: true }
            }
        }
    })) as any[];

    const allRanks = await prisma.rank.findMany({ orderBy: { order: 'asc' } });

    const candidates = candidatesData.map(student => {
        const currentOrder = student.currentRank?.order ?? -1;
        const nextRank = allRanks.find(r => r.order === currentOrder + 1);

        return {
            id: student.id,
            name: student.user.name || "Unknown",
            currentRank: student.currentRank?.name || "White Belt",
            nextRank: nextRank?.name || "Dan Candidate",
            currentRankColor: student.currentRank?.colorCode || "#ffffff",
            nextRankColor: nextRank?.colorCode || "#dc2626"
        };
    });

    return <PromotionsClient initialCandidates={candidates} />;
}
