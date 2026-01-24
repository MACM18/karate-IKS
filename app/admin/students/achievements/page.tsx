import { prisma } from "@/app/lib/prisma";
import { Trophy, Medal, Trash2, User } from "lucide-react";
import { deleteAchievement } from "@/app/lib/actions";
import { AchievementForm } from "@/components/admin/AchievementForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FormOverlay } from "@/components/admin/FormOverlay";

export const dynamic = "force-dynamic";

export default async function AchievementManagementPage() {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "SENSEI")
  ) {
    redirect("/login");
  }

  let achievements: any[] = [];
  try {
    achievements = await prisma.achievement.findMany({
      orderBy: { date: "desc" },
      include: {
        student: {
          include: { user: true },
        },
      },
    });
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn("Prisma P2021 during achievements fetch; using empty list.");
      achievements = [];
    } else {
      throw err;
    }
  }

  let students: any[] = [];
  try {
    students = await prisma.studentProfile.findMany({
      include: { user: true },
      orderBy: { user: { name: "asc" } },
    });
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn(
        "Prisma P2021 during students fetch for achievements; using empty list.",
      );
      students = [];
    } else {
      throw err;
    }
  }

  return (
    <div className='p-8 space-y-12 max-w-7xl mx-auto min-h-screen relative'>
      <header className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <h1 className='text-5xl font-heading font-black uppercase tracking-tighter text-white'>
            Honor <span className='text-primary italic'>Roll</span>
          </h1>
          <p className='text-zinc-500 mt-2 font-medium'>
            Attribute awards, tournament victories, and special achievements to
            your students.
          </p>
        </div>
      </header>

      <div className='space-y-6'>
        <h2 className='text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3'>
          <span className='h-px w-8 bg-zinc-800'></span>
          Hall of Fame
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className='bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between group hover:border-primary/50 transition-colors'
            >
              <div className='space-y-4'>
                <div className='flex justify-between items-start'>
                  <div className='w-12 h-12 bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all'>
                    <Trophy size={24} />
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await deleteAchievement(achievement.id);
                    }}
                  >
                    <button className='p-2 text-zinc-700 hover:text-primary transition-colors opacity-0 group-hover:opacity-100'>
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
                <div className='space-y-2'>
                  <div className='flex flex-col'>
                    <h3 className='text-lg font-heading font-black text-white uppercase tracking-tight'>
                      {achievement.title}
                    </h3>
                    <span className='text-[10px] text-zinc-600 font-black uppercase tracking-widest'>
                      {new Date(achievement.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-xs text-zinc-400'>
                    <User size={12} className='text-primary' />
                    <span className='font-bold text-white uppercase italic'>
                      {achievement.student.user.name}
                    </span>
                  </div>
                  <p className='text-xs text-zinc-500 italic line-clamp-3 leading-relaxed'>
                    {achievement.description || "Official Dojo Recognition"}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {achievements.length === 0 && (
            <div className='col-span-full py-24 text-center border border-dashed border-zinc-800 text-zinc-600'>
              <Trophy size={48} className='mx-auto mb-4 opacity-20' />
              <p className='italic font-medium'>
                No honors bestowed yet. Ready to recognize excellence.
              </p>
            </div>
          )}
        </div>
      </div>

      <FormOverlay title='Bestow Honor' triggerLabel='Award Achievement'>
        <AchievementForm
          students={students.map((s) => ({
            id: s.id,
            name: s.user.name || "Unknown",
          }))}
        />
      </FormOverlay>
    </div>
  );
}
