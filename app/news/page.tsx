import { prisma } from "@/app/lib/prisma";
import NewsContent from "./NewsContent";

export const revalidate = 60; // Revalidate every minute

export default async function NewsPage() {
    // 1. Fetch News Posts
    const posts = await (prisma as any).post.findMany({
        where: { published: true },
        include: {
            author: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // 2. Fetch Wall of Fame Achievements
    const achievements = await (prisma as any).achievement.findMany({
        include: {
            student: {
                include: {
                    user: {
                        select: { name: true }
                    }
                }
            }
        },
        orderBy: { date: 'desc' },
        take: 5
    });

    // 3. Map Prisma data to Component props
    const newsItems = posts.map((post: any) => ({
        title: post.title,
        excerpt: post.content.substring(0, 150) + (post.content.length > 150 ? "..." : ""),
        date: new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        category: post.category,
        imageUrl: post.imageUrl || undefined
    }));

    const wallOfFame = achievements.map((ach: any) => ({
        name: ach.student?.user?.name || "Anonymous Student",
        achievement: ach.title,
        sub: ach.description || "Outstanding Milestone",
        date: new Date(ach.date).toLocaleDateString()
    }));

    return <NewsContent initialNews={newsItems} initialAchievements={wallOfFame} />;
}
