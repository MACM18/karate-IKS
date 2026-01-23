"use client";

import { useState } from "react";
import {
  Check,
  Clock,
  Circle,
  ChevronRight,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

interface ExamAvailability {
  [itemId: string]: boolean;
}

interface CurriculumBoardStyledProps {
  rankName: string;
  rankColor: string;
  items: (CurriculumItem & { progress?: Progress })[];
  nextRankName?: string;
  examAvailability?: ExamAvailability;
}

const categoryConfig = {
  KATA: { icon: "🥋", label: "Kata", color: "text-orange-500" },
  TECHNIQUE: { icon: "👊", label: "Techniques", color: "text-blue-500" },
  KUMITE: { icon: "🤼", label: "Kumite", color: "text-green-500" },
  PHYSICAL: { icon: "💪", label: "Physical", color: "text-purple-500" },
  KNOWLEDGE: { icon: "📚", label: "Knowledge", color: "text-pink-500" },
  EXAM: { icon: "📋", label: "Examinations", color: "text-red-500" },
};

export default function CurriculumBoardStyled({
  rankName,
  rankColor,
  items,
  nextRankName,
  examAvailability = {},
}: CurriculumBoardStyledProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const totalItems = items.length;
  const masteredItems = items.filter(
    (item) => item.progress?.status === "MASTERED"
  ).length;
  const inProgressItems = items.filter(
    (item) => item.progress?.status === "IN_PROGRESS"
  ).length;
  const progressPercentage =
    totalItems > 0 ? Math.round((masteredItems / totalItems) * 100) : 0;

  const getStatusIcon = (item: (typeof items)[0]) => {
    if (item.category === "EXAM") {
      const isExamAvailable = examAvailability[item.id];
      if (!isExamAvailable) {
        return <Lock className='h-4 w-4 text-zinc-600' />;
      }
      if (item.progress?.status === "MASTERED") {
        return <Check className='h-4 w-4 text-primary' />;
      }
      return <Unlock className='h-4 w-4 text-primary' />;
    }

    switch (item.progress?.status) {
      case "MASTERED":
        return <Check className='h-4 w-4 text-primary' />;
      case "IN_PROGRESS":
        return <Clock className='h-4 w-4 text-yellow-600' />;
      default:
        return <Circle className='h-4 w-4 text-zinc-600' />;
    }
  };

  return (
    <div className='space-y-12'>
      {/* Header Stats */}
      <div className='bg-zinc-900 border border-zinc-800 p-8'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <div
              className='w-4 h-4 border-2'
              style={{ backgroundColor: rankColor, borderColor: rankColor }}
            />
            <h2 className='text-2xl font-heading font-black uppercase tracking-tighter text-white'>
              {rankName}
            </h2>
          </div>
          <div className='text-[10px] font-black uppercase tracking-widest text-zinc-600'>
            Curriculum Mastery
          </div>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-black uppercase tracking-widest text-zinc-500'>
              Overall Progress
            </span>
            <span className='text-3xl font-heading font-black text-primary'>
              {progressPercentage}%
            </span>
          </div>
          <div className='h-2 bg-black border border-zinc-800'>
            <div
              className='h-full bg-primary transition-all duration-500'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className='grid grid-cols-3 gap-4 pt-4'>
            <div className='text-center bg-black border border-zinc-800 p-4'>
              <p className='text-2xl font-heading font-black text-primary'>
                {masteredItems}
              </p>
              <p className='text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-1'>
                Mastered
              </p>
            </div>
            <div className='text-center bg-black border border-zinc-800 p-4'>
              <p className='text-2xl font-heading font-black text-yellow-600'>
                {inProgressItems}
              </p>
              <p className='text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-1'>
                In Progress
              </p>
            </div>
            <div className='text-center bg-black border border-zinc-800 p-4'>
              <p className='text-2xl font-heading font-black text-zinc-600'>
                {totalItems - masteredItems - inProgressItems}
              </p>
              <p className='text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-1'>
                Pending
              </p>
            </div>
          </div>
        </div>

        {nextRankName && progressPercentage >= 75 && (
          <div className='mt-6 bg-black border border-primary/50 p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <span className='text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                  {progressPercentage === 100 ? "Ready For" : "Next Target"}:
                </span>
                <span className='text-sm font-heading font-black text-primary uppercase tracking-tighter'>
                  {nextRankName}
                </span>
              </div>
              <ChevronRight className='h-4 w-4 text-primary' />
            </div>
          </div>
        )}
      </div>

      {/* Curriculum Categories */}
      <div className='space-y-6'>
        {Object.entries(categoryConfig).map(([category, config]) => {
          const categoryItems = itemsByCategory[category] || [];
          if (categoryItems.length === 0) return null;

          const isExpanded = expandedCategories.has(category);
          const categoryMastered = categoryItems.filter(
            (item) => item.progress?.status === "MASTERED"
          ).length;

          return (
            <div key={category} className='bg-zinc-900 border border-zinc-800'>
              <button
                onClick={() => toggleCategory(category)}
                className='w-full p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors'
              >
                <div className='flex items-center gap-4'>
                  <span className='text-2xl'>{config.icon}</span>
                  <div className='text-left'>
                    <h3 className='text-lg font-heading font-black uppercase tracking-tighter text-white'>
                      {config.label}
                    </h3>
                    <p className='text-[9px] font-black uppercase tracking-widest text-zinc-600'>
                      {categoryMastered} / {categoryItems.length} Complete
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-xl font-heading font-black text-primary'>
                    {categoryItems.length > 0
                      ? Math.round(
                          (categoryMastered / categoryItems.length) * 100
                        )
                      : 0}
                    %
                  </div>
                  {isExpanded ? (
                    <ChevronUp className='h-5 w-5 text-zinc-500' />
                  ) : (
                    <ChevronDown className='h-5 w-5 text-zinc-500' />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className='border-t border-zinc-800 divide-y divide-zinc-800'>
                  {categoryItems.map((item) => {
                    const isLocked =
                      item.category === "EXAM" && !examAvailability[item.id];

                    return (
                      <div
                        key={item.id}
                        className={`p-6 flex items-center justify-between ${
                          isLocked ? "opacity-60" : "hover:bg-white/[0.02]"
                        } transition-colors`}
                      >
                        <div className='flex items-center gap-6 flex-1'>
                          <div className='w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center text-primary font-heading font-black'>
                            {item.order}
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-1'>
                              <h4
                                className={`font-heading font-black uppercase tracking-tighter ${
                                  item.progress?.status === "MASTERED"
                                    ? "line-through text-zinc-700"
                                    : "text-white"
                                }`}
                              >
                                {item.itemName}
                              </h4>
                              {isLocked && (
                                <span className='text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-800 px-2 py-1'>
                                  Locked - Exam Not Announced
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className='text-xs text-zinc-500 font-medium'>
                                {item.description}
                              </p>
                            )}
                            {item.videoUrl && !isLocked && (
                              <a
                                href={item.videoUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors mt-2 inline-block'
                              >
                                [Video Tutorial →]
                              </a>
                            )}
                          </div>
                        </div>
                        <div className='flex items-center gap-4'>
                          {getStatusIcon(item)}
                          {item.progress?.completedAt && (
                            <span className='text-[9px] font-black uppercase tracking-widest text-zinc-600'>
                              {new Date(
                                item.progress.completedAt
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
