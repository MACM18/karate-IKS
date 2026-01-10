import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressTracker from "@/components/admin/ProgressTracker";

const categoryIcons = {
  KATA: "🥋",
  TECHNIQUE: "👊",
  KUMITE: "🤼",
  PHYSICAL: "💪",
  KNOWLEDGE: "📚",
};

export default async function StudentCurriculumProgressPage({
  params,
}: {
  params: { studentId: string };
}) {
  const student = await prisma.studentProfile.findUnique({
    where: { id: params.studentId },
    include: {
      user: true,
      currentRank: {
        include: {
          curriculumItems: {
            orderBy: { order: "asc" },
          },
        },
      },
      curriculumProgress: {
        include: {
          curriculum: true,
        },
      },
    },
  });

  if (!student) {
    notFound();
  }

  // Create progress map for quick lookup
  const progressMap = new Map(
    student.curriculumProgress.map((p) => [p.curriculumId, p])
  );

  // Group curriculum items by category
  const itemsByCategory =
    student.currentRank?.curriculumItems?.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push({
        ...item,
        progress: progressMap.get(item.id),
      });
      return acc;
    }, {} as Record<string, Array<(typeof student.currentRank.curriculumItems)[0] & { progress?: any }>>) ||
    {};

  const categories = ["KATA", "TECHNIQUE", "KUMITE", "PHYSICAL", "KNOWLEDGE"];

  // Calculate overall progress
  const totalItems = student.currentRank?.curriculumItems?.length ?? 0;
  const masteredItems = student.curriculumProgress.filter(
    (p) => p.status === "MASTERED"
  ).length;
  const inProgressItems = student.curriculumProgress.filter(
    (p) => p.status === "IN_PROGRESS"
  ).length;
  const progressPercentage =
    totalItems > 0 ? Math.round((masteredItems / totalItems) * 100) : 0;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/students'>
            <Button variant='ghost' size='icon'>
              <ArrowLeft className='h-4 w-4' />
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              {student.user.name}
            </h1>
            <div className='flex items-center gap-2 mt-1'>
              <div
                className='w-4 h-4 rounded-full border'
                style={{
                  backgroundColor: student.currentRank?.colorCode ?? "#ccc",
                }}
              />
              <p className='text-muted-foreground'>
                {student.currentRank?.name ?? "No Rank"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Overall Progress</h2>
        <div className='space-y-4'>
          {/* Progress Bar */}
          <div>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium'>Rank Completion</span>
              <span className='text-sm font-bold text-primary'>
                {progressPercentage}%
              </span>
            </div>
            <div className='h-3 bg-secondary rounded-full overflow-hidden'>
              <div
                className='h-full bg-primary transition-all duration-500'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-3 gap-4 pt-2'>
            <div className='text-center'>
              <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
                {masteredItems}
              </p>
              <p className='text-sm text-muted-foreground'>Mastered</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-yellow-600 dark:text-yellow-400'>
                {inProgressItems}
              </p>
              <p className='text-sm text-muted-foreground'>In Progress</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-gray-600 dark:text-gray-400'>
                {totalItems - masteredItems - inProgressItems}
              </p>
              <p className='text-sm text-muted-foreground'>Not Started</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Curriculum Items by Category */}
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
                  {categoryMastered} / {items.length} mastered
                </span>
              </div>

              <div className='space-y-3'>
                {items.map((item) => (
                  <ProgressTracker
                    key={item.id}
                    item={item}
                    progress={item.progress}
                    studentId={student.id}
                  />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
