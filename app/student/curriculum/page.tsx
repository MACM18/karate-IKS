import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categoryIcons = {
  KATA: "🥋",
  TECHNIQUE: "👊",
  KUMITE: "🤼",
  PHYSICAL: "💪",
  KNOWLEDGE: "📚",
};

export default async function StudentCurriculumPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      currentRank: {
        include: {
          curriculumItems: {
            orderBy: { order: "asc" },
          },
        },
      },
      curriculumProgress: true,
    },
  });

  if (!student || !student.currentRank) {
    return (
      <div className='p-8 text-center'>
        <p className='text-muted-foreground'>
          No curriculum data available. Please contact your instructor.
        </p>
      </div>
    );
  }

  // Get next rank for preview
  const nextRank = await prisma.rank.findFirst({
    where: { order: student.currentRank.order + 1 },
    select: { name: true },
  });

  // Create progress map
  const progressMap = new Map(
    student.curriculumProgress.map((p) => [p.curriculumId, p])
  );

  // Group items by category
  const itemsByCategory = student.currentRank.curriculumItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push({
        ...item,
        progress: progressMap.get(item.id),
      });
      return acc;
    },
    {} as Record<string, any[]>
  );

  const categories = ["KATA", "TECHNIQUE", "KUMITE", "PHYSICAL", "KNOWLEDGE"];

  // Calculate stats
  const totalItems = student.currentRank.curriculumItems.length;
  const masteredItems = student.curriculumProgress.filter(
    (p) => p.status === "MASTERED"
  ).length;
  const inProgressItems = student.curriculumProgress.filter(
    (p) => p.status === "IN_PROGRESS"
  ).length;
  const progressPercentage =
    totalItems > 0 ? Math.round((masteredItems / totalItems) * 100) : 0;

  const getStatusBadge = (progress?: any) => {
    if (!progress || progress.status === "NOT_STARTED") {
      return (
        <Badge variant='outline' className='text-gray-600 dark:text-gray-400'>
          Not Started
        </Badge>
      );
    }
    if (progress.status === "IN_PROGRESS") {
      return (
        <Badge
          variant='outline'
          className='bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-500/50'
        >
          In Progress
        </Badge>
      );
    }
    return (
      <Badge
        variant='outline'
        className='bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-500/50'
      >
        ✓ Mastered
      </Badge>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/student/dashboard'>
            <Button variant='ghost' size='icon'>
              <ArrowLeft className='h-4 w-4' />
            </Button>
          </Link>
          <div className='flex items-center gap-3'>
            <div
              className='w-6 h-6 rounded-full border-2'
              style={{ backgroundColor: student.currentRank.colorCode }}
            />
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>
                My Curriculum
              </h1>
              <p className='text-muted-foreground'>
                {student.currentRank.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <Card className='p-6 bg-linear-to-br from-primary/5 to-primary/10 border-primary/20'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-lg font-semibold'>Your Progress</span>
            <span className='text-3xl font-bold text-primary'>
              {progressPercentage}%
            </span>
          </div>

          <div className='h-4 bg-secondary rounded-full overflow-hidden'>
            <div
              className='h-full bg-linear-to-r from-primary to-primary/80 transition-all duration-500'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='text-center p-3 bg-background/50 rounded-lg'>
              <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
                {masteredItems}
              </p>
              <p className='text-xs text-muted-foreground'>Mastered</p>
            </div>
            <div className='text-center p-3 bg-background/50 rounded-lg'>
              <p className='text-2xl font-bold text-yellow-600 dark:text-yellow-400'>
                {inProgressItems}
              </p>
              <p className='text-xs text-muted-foreground'>In Progress</p>
            </div>
            <div className='text-center p-3 bg-background/50 rounded-lg'>
              <p className='text-2xl font-bold text-gray-600 dark:text-gray-400'>
                {totalItems - masteredItems - inProgressItems}
              </p>
              <p className='text-xs text-muted-foreground'>To Learn</p>
            </div>
          </div>

          {nextRank && progressPercentage >= 75 && (
            <div className='mt-2 p-3 bg-background/70 rounded-lg border border-primary/30'>
              <div className='flex items-center gap-2'>
                <Target className='h-4 w-4 text-primary' />
                <span className='text-sm font-medium'>
                  {progressPercentage === 100
                    ? "🎉 Ready to test for"
                    : "Next goal"}
                  :
                </span>
                <span className='text-sm font-bold text-primary'>
                  {nextRank.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Curriculum by Category */}
      <div className='space-y-6'>
        {categories.map((category) => {
          const items = itemsByCategory[category] || [];
          if (items.length === 0) return null;

          const categoryMastered = items.filter(
            (item) => item.progress?.status === "MASTERED"
          ).length;

          return (
            <Card key={category} className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <span className='text-2xl'>
                    {categoryIcons[category as keyof typeof categoryIcons]}
                  </span>
                  <h2 className='text-xl font-semibold'>{category}</h2>
                  <Badge variant='default'>{items.length}</Badge>
                </div>
                <span className='text-sm text-muted-foreground'>
                  {categoryMastered} / {items.length} completed
                </span>
              </div>

              <div className='space-y-3'>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border transition-all ${
                      item.progress?.status === "MASTERED"
                        ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30"
                        : item.progress?.status === "IN_PROGRESS"
                        ? "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30"
                        : "bg-card border-border"
                    }`}
                  >
                    <div className='flex items-start gap-4'>
                      <div className='shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium'>
                        {item.order}
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-4 mb-2'>
                          <div>
                            <h3
                              className={`font-semibold ${
                                item.progress?.status === "MASTERED"
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {item.itemName}
                            </h3>
                            {item.description && (
                              <p className='text-sm text-muted-foreground mt-1'>
                                {item.description}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(item.progress)}
                        </div>

                        <div className='flex items-center gap-3'>
                          {item.isRequired && (
                            <Badge
                              variant='outline'
                              className='text-xs border-red-500/50 text-red-600 dark:text-red-400'
                            >
                              Required
                            </Badge>
                          )}
                          {item.videoUrl && (
                            <a
                              href={item.videoUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1'
                            >
                              <svg
                                className='w-3 h-3'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                              >
                                <path d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z' />
                              </svg>
                              Watch Tutorial
                            </a>
                          )}
                          {item.progress?.completedAt && (
                            <span className='text-xs text-muted-foreground'>
                              Completed on{" "}
                              {new Date(
                                item.progress.completedAt
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
