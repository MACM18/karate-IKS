import { prisma } from "@/app/lib/prisma";
import NewsContent from "./NewsContent";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute

export default async function NewsPage() {
  // 1. Fetch News Posts
  let posts: any[] = [];
  try {
    posts = await (prisma as any).post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn("Prisma P2021 during posts fetch; using empty posts list.");
      posts = [];
    } else {
      throw err;
    }
  }

  // 2. Fetch Wall of Fame Achievements
  let achievements: any[] = [];
  try {
    achievements = await (prisma as any).achievement.findMany({
      include: {
        student: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { date: "desc" },
      take: 5,
    });
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn(
        "Prisma P2021 during achievements fetch; using empty achievements.",
      );
      achievements = [];
    } else {
      throw err;
    }
  }

  // 3. Map Prisma data to Component props
  const newsItems = posts.map((post: any) => ({
    title: post.title,
    excerpt:
      post.content.substring(0, 150) + (post.content.length > 150 ? "..." : ""),
    date: new Date(post.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    category: post.category,
    imageUrl: post.imageUrl || undefined,
  }));

  const wallOfFame = achievements.map((ach: any) => ({
    name: ach.student?.user?.name || "Anonymous Student",
    achievement: ach.title,
    sub: ach.description || "Outstanding Milestone",
    date: new Date(ach.date).toLocaleDateString(),
  }));

  return (
    <NewsContent initialNews={newsItems} initialAchievements={wallOfFame} />
  );
}
