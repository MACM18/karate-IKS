"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Circle, ChevronRight } from "lucide-react";

interface CurriculumItem {
  id: string;
  itemName: string;
  description: string | null;
  category: string;
  order: number;
  videoUrl: string | null;
}

interface Progress {
  status: "NOT_STARTED" | "IN_PROGRESS" | "MASTERED";
  completedAt: Date | null;
}

interface CurriculumBoardProps {
  rankName: string;
  rankColor: string;
  items: (CurriculumItem & { progress?: Progress })[];
  nextRankName?: string;
  showNextRankPreview?: boolean;
}

const categoryConfig = {
  KATA: { icon: "🥋", label: "Kata", color: "orange" },
  TECHNIQUE: { icon: "👊", label: "Techniques", color: "blue" },
  KUMITE: { icon: "🤼", label: "Kumite", color: "green" },
  PHYSICAL: { icon: "💪", label: "Physical", color: "purple" },
  KNOWLEDGE: { icon: "📚", label: "Knowledge", color: "pink" },
};

export default function CurriculumBoard({
  rankName,
  rankColor,
  items,
  nextRankName,
  showNextRankPreview = false,
}: CurriculumBoardProps) {
  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  // Calculate overall progress
  const totalItems = items.length;
  const masteredItems = items.filter(
    (item) => item.progress?.status === "MASTERED"
  ).length;
  const inProgressItems = items.filter(
    (item) => item.progress?.status === "IN_PROGRESS"
  ).length;
  const progressPercentage =
    totalItems > 0 ? Math.round((masteredItems / totalItems) * 100) : 0;

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "MASTERED":
        return <Check className='h-4 w-4 text-green-600 dark:text-green-400' />;
      case "IN_PROGRESS":
        return (
          <Clock className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
        );
      default:
        return <Circle className='h-4 w-4 text-gray-400' />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "MASTERED":
        return "text-green-600 dark:text-green-400";
      case "IN_PROGRESS":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header with Progress */}
      <Card className='p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div
              className='w-6 h-6 rounded-full border-2'
              style={{ backgroundColor: rankColor }}
            />
            <div>
              <h2 className='text-2xl font-bold'>{rankName}</h2>
              <p className='text-sm text-muted-foreground'>
                Your Current Rank Requirements
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Overall Mastery</span>
            <span className='text-2xl font-bold text-primary'>
              {progressPercentage}%
            </span>
          </div>
          <div className='h-4 bg-secondary rounded-full overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Stats */}
          <div className='grid grid-cols-3 gap-4 pt-2'>
            <div className='text-center'>
              <p className='text-xl font-bold text-green-600 dark:text-green-400'>
                {masteredItems}
              </p>
              <p className='text-xs text-muted-foreground'>Mastered</p>
            </div>
            <div className='text-center'>
              <p className='text-xl font-bold text-yellow-600 dark:text-yellow-400'>
                {inProgressItems}
              </p>
              <p className='text-xs text-muted-foreground'>In Progress</p>
            </div>
            <div className='text-center'>
              <p className='text-xl font-bold text-gray-600 dark:text-gray-400'>
                {totalItems - masteredItems - inProgressItems}
              </p>
              <p className='text-xs text-muted-foreground'>To Learn</p>
            </div>
          </div>
        </div>

        {/* Next Rank Preview */}
        {nextRankName && progressPercentage >= 75 && (
          <div className='mt-4 p-3 bg-background/50 rounded-lg border border-primary/30'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>
                  {progressPercentage === 100 ? "Ready for" : "Next Goal"}:
                </span>
                <span className='text-sm font-bold text-primary'>
                  {nextRankName}
                </span>
              </div>
              <ChevronRight className='h-4 w-4 text-primary' />
            </div>
          </div>
        )}
      </Card>

      {/* Curriculum by Category */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Object.entries(categoryConfig).map(([category, config]) => {
          const categoryItems = itemsByCategory[category] || [];
          if (categoryItems.length === 0) return null;

          const categoryMastered = categoryItems.filter(
            (item) => item.progress?.status === "MASTERED"
          ).length;
          const categoryProgress =
            categoryItems.length > 0
              ? Math.round((categoryMastered / categoryItems.length) * 100)
              : 0;

          return (
            <Card
              key={category}
              className='p-4 hover:shadow-lg transition-shadow'
            >
              {/* Category Header */}
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2'>
                  <span className='text-2xl'>{config.icon}</span>
                  <div>
                    <h3 className='font-semibold text-sm'>{config.label}</h3>
                    <p className='text-xs text-muted-foreground'>
                      {categoryMastered} / {categoryItems.length}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p
                    className={`text-lg font-bold ${
                      categoryProgress === 100
                        ? "text-green-600 dark:text-green-400"
                        : "text-primary"
                    }`}
                  >
                    {categoryProgress}%
                  </p>
                </div>
              </div>

              {/* Mini Progress Bar */}
              <div className='h-2 bg-secondary rounded-full overflow-hidden mb-3'>
                <div
                  className={`h-full transition-all duration-500 ${
                    categoryProgress === 100 ? "bg-green-500" : "bg-primary"
                  }`}
                  style={{ width: `${categoryProgress}%` }}
                />
              </div>

              {/* Item List */}
              <div className='space-y-2'>
                {categoryItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-2 text-sm p-2 rounded ${
                      item.progress?.status === "MASTERED"
                        ? "bg-green-50 dark:bg-green-900/10"
                        : item.progress?.status === "IN_PROGRESS"
                        ? "bg-yellow-50 dark:bg-yellow-900/10"
                        : "bg-muted/30"
                    }`}
                  >
                    {getStatusIcon(item.progress?.status)}
                    <div className='flex-1 min-w-0'>
                      <p
                        className={`text-xs font-medium truncate ${
                          item.progress?.status === "MASTERED"
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {item.itemName}
                      </p>
                      {item.videoUrl && (
                        <a
                          href={item.videoUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-[10px] text-blue-600 dark:text-blue-400 hover:underline'
                        >
                          📹 Video
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {categoryItems.length > 3 && (
                  <p className='text-xs text-muted-foreground text-center pt-1'>
                    +{categoryItems.length - 3} more items
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
