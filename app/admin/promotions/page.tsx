import { prisma } from "@/app/lib/prisma";
import { PromotionsClient } from "./PromotionsClient";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
    // Candidates are students with APPROVED exam applications who haven't been promoted since that approval
    // Simplified: Show all students who have at least one APPROVED application.
    // In a real system, we might want to filter by students whose current rank is less than the rank they applied for.

    let candidatesData: any[] = [];
    try {
        candidatesData = (await prisma.studentProfile.findMany({
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
    } catch (err: any) {
        if (err?.code === 'P2021') {
            console.warn('Prisma P2021 during promotions candidates fetch; using empty candidates.');
            candidatesData = [];
        } else {
            throw err;
        }
    }

    let allRanks: any[] = [];
    try {
        allRanks = await prisma.rank.findMany({ orderBy: { order: 'asc' } });
    } catch (err: any) {
        if (err?.code === 'P2021') {
            console.warn('Prisma P2021 during rank fetch; using empty ranks.');
            allRanks = [];
        } else {
            throw err;
        }
    }

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
