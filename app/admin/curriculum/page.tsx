import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import {
  BookOpen,
  Dumbbell,
  Swords,
  Brain,
  HandMetal,
  ChevronRight,
  LayoutDashboard,
  Layers
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCurriculumPage() {
  // Fetch all ranks with their curriculum counts
  let ranks: any[] = [];
  try {
    ranks = await prisma.rank.findMany({
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
  } catch (err: any) {
    if (err?.code === 'P2021') {
      console.warn('Prisma P2021 during rank fetch; using empty ranks.');
      ranks = [];
    } else {
      throw err;
    }
  }

  // Calculate category counts for each rank
  const ranksWithStats = ranks.map((rank) => {
    const categoryCounts = rank.curriculumItems.reduce((acc: Record<string, number>, item: any) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      ...rank,
      totalItems: rank.curriculumItems.length,
      categoryCounts,
    };
  });

  const totalItems = ranksWithStats.reduce((sum, r) => sum + r.totalItems, 0);
  const totalKata = ranksWithStats.reduce((sum, r) => sum + (r.categoryCounts.KATA || 0), 0);
  const totalTech = ranksWithStats.reduce((sum, r) => sum + (r.categoryCounts.TECHNIQUE || 0), 0);
  const totalKumite = ranksWithStats.reduce((sum, r) => sum + (r.categoryCounts.KUMITE || 0), 0);

  return (
    <div className='p-8 space-y-12 animate-in fade-in duration-500'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-900'>
        <div>
          <h1 className='text-4xl font-heading font-black uppercase tracking-tighter text-white'>
            Curriculum <span className='text-primary italic'>Command</span>
          </h1>
          <p className='text-zinc-500 mt-2 font-medium'>
            Manage training protocols and rank requirements.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-zinc-900 border border-zinc-800 px-6 py-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Protocols</div>
            <div className="text-2xl font-bold text-white">{totalItems}</div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {[
          { label: "KATA PROTOCOLS", value: totalKata, color: "text-orange-500", icon: BookOpen },
          { label: "TECHNIQUE SETS", value: totalTech, color: "text-blue-500", icon: HandMetal },
          { label: "KUMITE DRILLS", value: totalKumite, color: "text-green-500", icon: Swords },
          { label: "ALL RANKS", value: ranks.length, color: "text-purple-500", icon: Layers },
        ].map((stat, i) => (
          <div key={i} className='bg-zinc-900/50 border border-zinc-800 p-6 flex flex-col justify-between group hover:border-zinc-700 transition-all'>
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color} opacity-70`} />
              <span className={`text-xs font-black bg-zinc-950 px-2 py-1 rounded text-zinc-500`}>SYS.0{i + 1}</span>
            </div>
            <div>
              <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className='text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1'>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ranks Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {ranksWithStats.map((rank) => (
          <Link
            key={rank.id}
            href={`/admin/curriculum/${rank.id}`}
            className='group relative block'
          >
            <div className='absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300' />
            <div className='bg-zinc-950 border border-zinc-800 p-8 h-full transition-all group-hover:border-primary/50 group-hover:translate-x-1 group-hover:-translate-y-1 overflow-hidden relative'>

              {/* Rank Color Strip */}
              <div
                className="absolute top-0 left-0 w-1 h-full transition-all group-hover:w-2"
                style={{ backgroundColor: rank.colorCode }}
              />

              <div className='flex items-start justify-between mb-6 pl-4'>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">Start Protocol</span>
                  <h3 className='font-heading font-black text-2xl uppercase text-white group-hover:text-primary transition-colors'>
                    {rank.name}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900 text-zinc-500 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                  <ChevronRight size={14} />
                </div>
              </div>

              {/* Progress/Stats */}
              <div className="pl-4 space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white">{rank.totalItems}</span>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 mb-2">Requirements</span>
                </div>

                {rank.totalItems > 0 ? (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900">
                    {rank.categoryCounts.KATA && (
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold">
                        <BookOpen size={10} className="text-orange-500" /> {rank.categoryCounts.KATA} Kata
                      </div>
                    )}
                    {rank.categoryCounts.TECHNIQUE && (
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold">
                        <HandMetal size={10} className="text-blue-500" /> {rank.categoryCounts.TECHNIQUE} Tech
                      </div>
                    )}
                    {rank.categoryCounts.KUMITE && (
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold">
                        <Swords size={10} className="text-green-500" /> {rank.categoryCounts.KUMITE} Kumite
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-2 border-t border-zinc-900 text-[10px] text-zinc-600 uppercase font-bold italic">
                    No data populated
                  </div>
                )}
              </div>

              <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <LayoutDashboard size={64} />
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
