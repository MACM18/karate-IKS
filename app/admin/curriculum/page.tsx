import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminCurriculumPage() {
  // Fetch all ranks with their curriculum counts
  const ranks = await prisma.rank.findMany({
    orderBy: { order: "asc" },
    include: {
      curriculumItems: {
        select: {
          id: true,
          category: true,
        },
      },
    },
  });

  // Calculate category counts for each rank
  const ranksWithStats = ranks.map((rank) => {
    const categoryCounts = rank.curriculumItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      ...rank,
      totalItems: rank.curriculumItems.length,
      categoryCounts,
    };
  });

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Curriculum Management
          </h1>
          <p className='text-muted-foreground mt-2'>
            Manage curriculum requirements for each rank
          </p>
        </div>
      </div>

      {/* Ranks Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {ranksWithStats.map((rank) => (
          <Link
            key={rank.id}
            href={`/admin/curriculum/${rank.id}`}
            className='group'
          >
            <Card className='p-6 transition-all hover:shadow-lg hover:border-primary'>
              {/* Rank Header */}
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <div
                    className='w-4 h-4 rounded-full border-2'
                    style={{ backgroundColor: rank.colorCode }}
                  />
                  <div>
                    <h3 className='font-semibold text-lg group-hover:text-primary transition-colors'>
                      {rank.name}
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      {rank.totalItems} requirements
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              {rank.totalItems > 0 ? (
                <div className='space-y-2'>
                  <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Categories
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {rank.categoryCounts.KATA && (
                      <Badge variant='default' className='gap-1'>
                        <span className='text-xs'>🥋</span>
                        {rank.categoryCounts.KATA} Kata
                      </Badge>
                    )}
                    {rank.categoryCounts.TECHNIQUE && (
                      <Badge variant='default' className='gap-1'>
                        <span className='text-xs'>👊</span>
                        {rank.categoryCounts.TECHNIQUE} Techniques
                      </Badge>
                    )}
                    {rank.categoryCounts.KUMITE && (
                      <Badge variant='default' className='gap-1'>
                        <span className='text-xs'>🤼</span>
                        {rank.categoryCounts.KUMITE} Kumite
                      </Badge>
                    )}
                    {rank.categoryCounts.PHYSICAL && (
                      <Badge variant='default' className='gap-1'>
                        <span className='text-xs'>💪</span>
                        {rank.categoryCounts.PHYSICAL} Physical
                      </Badge>
                    )}
                    {rank.categoryCounts.KNOWLEDGE && (
                      <Badge variant='default' className='gap-1'>
                        <span className='text-xs'>📚</span>
                        {rank.categoryCounts.KNOWLEDGE} Knowledge
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <p className='text-sm text-muted-foreground italic'>
                  No curriculum items yet
                </p>
              )}

              {/* Hover Indicator */}
              <div className='mt-4 flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors'>
                <span>View & Edit</span>
                <svg
                  className='w-4 h-4 ml-1 transition-transform group-hover:translate-x-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Overview</h2>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
          <div className='text-center'>
            <p className='text-3xl font-bold text-primary'>
              {ranksWithStats.reduce((sum, r) => sum + r.totalItems, 0)}
            </p>
            <p className='text-sm text-muted-foreground mt-1'>Total Items</p>
          </div>
          <div className='text-center'>
            <p className='text-3xl font-bold text-orange-500'>
              {ranksWithStats.reduce(
                (sum, r) => sum + (r.categoryCounts.KATA || 0),
                0
              )}
            </p>
            <p className='text-sm text-muted-foreground mt-1'>Kata</p>
          </div>
          <div className='text-center'>
            <p className='text-3xl font-bold text-blue-500'>
              {ranksWithStats.reduce(
                (sum, r) => sum + (r.categoryCounts.TECHNIQUE || 0),
                0
              )}
            </p>
            <p className='text-sm text-muted-foreground mt-1'>Techniques</p>
          </div>
          <div className='text-center'>
            <p className='text-3xl font-bold text-green-500'>
              {ranksWithStats.reduce(
                (sum, r) => sum + (r.categoryCounts.KUMITE || 0),
                0
              )}
            </p>
            <p className='text-sm text-muted-foreground mt-1'>Kumite</p>
          </div>
          <div className='text-center'>
            <p className='text-3xl font-bold text-purple-500'>
              {ranksWithStats.reduce(
                (sum, r) =>
                  sum +
                  (r.categoryCounts.PHYSICAL || 0) +
                  (r.categoryCounts.KNOWLEDGE || 0),
                0
              )}
            </p>
            <p className='text-sm text-muted-foreground mt-1'>Other</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
