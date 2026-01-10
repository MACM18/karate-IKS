import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categoryIcons = {
  KATA: "🥋",
  TECHNIQUE: "👊",
  KUMITE: "🤼",
  PHYSICAL: "💪",
  KNOWLEDGE: "📚",
};

const categoryColors = {
  KATA: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  TECHNIQUE: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  KUMITE:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  PHYSICAL:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  KNOWLEDGE: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
};

export default async function RankCurriculumPage({
  params,
}: {
  params: { rankId: string };
}) {
  const rank = await prisma.rank.findUnique({
    where: { id: params.rankId },
    include: {
      curriculumItems: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!rank) {
    notFound();
  }

  // Group items by category
  const itemsByCategory = rank.curriculumItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof rank.curriculumItems>);

  const categories = ["KATA", "TECHNIQUE", "KUMITE", "PHYSICAL", "KNOWLEDGE"];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/curriculum'>
            <Button variant='ghost' size='icon'>
              <ArrowLeft className='h-4 w-4' />
            </Button>
          </Link>
          <div className='flex items-center gap-3'>
            <div
              className='w-6 h-6 rounded-full border-2'
              style={{ backgroundColor: rank.colorCode }}
            />
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>{rank.name}</h1>
              <p className='text-muted-foreground'>
                {rank.curriculumItems.length} curriculum requirements
              </p>
            </div>
          </div>
        </div>
        <Button>
          <Plus className='h-4 w-4 mr-2' />
          Add Item
        </Button>
      </div>

      {/* Curriculum Items by Category */}
      <div className='space-y-6'>
        {categories.map((category) => {
          const items = itemsByCategory[category] || [];
          if (items.length === 0) return null;

          return (
            <Card key={category} className='p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='text-2xl'>
                  {categoryIcons[category as keyof typeof categoryIcons]}
                </span>
                <h2 className='text-xl font-semibold'>{category}</h2>
                <Badge variant='default'>{items.length}</Badge>
              </div>

              <div className='space-y-3'>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group'
                  >
                    {/* Order Number */}
                    <div className='shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium'>
                      {item.order}
                    </div>

                    {/* Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between gap-4'>
                        <div className='flex-1'>
                          <h3 className='font-semibold text-base'>
                            {item.itemName}
                          </h3>
                          {item.description && (
                            <p className='text-sm text-muted-foreground mt-1'>
                              {item.description}
                            </p>
                          )}
                          <div className='flex items-center gap-3 mt-2'>
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
                                Video Tutorial
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className='shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <Button variant='ghost' size='sm'>
                            Edit
                          </Button>
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

      {/* Empty State */}
      {rank.curriculumItems.length === 0 && (
        <Card className='p-12 text-center'>
          <div className='text-4xl mb-4'>📝</div>
          <h3 className='text-xl font-semibold mb-2'>
            No Curriculum Items Yet
          </h3>
          <p className='text-muted-foreground mb-6'>
            Add requirements for {rank.name} to get started
          </p>
          <Button>
            <Plus className='h-4 w-4 mr-2' />
            Add First Item
          </Button>
        </Card>
      )}
    </div>
  );
}
