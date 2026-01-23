import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CurriculumBoardStyled from "@/components/student/CurriculumBoardStyled";

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
      applications: true,
    },
  });

  if (!student || !student.currentRank) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center p-8'>
        <div className='text-center'>
          <p className='text-zinc-500'>
            No curriculum data available. Please contact your instructor.
          </p>
        </div>
      </div>
    );
  }

  // Get next rank for preview
  const nextRank = await prisma.rank.findFirst({
    where: { order: student.currentRank.order + 1 },
    select: { name: true },
  });

  // Get active exams
  const activeExams = await prisma.examTemplate.findMany({
    where: {
      isActive: true,
      deadline: { gte: new Date() },
    },
  });

  // Create progress map
  const progressMap = new Map(
    student.curriculumProgress.map((p) => [p.curriculumId, p])
  );

  // Prepare curriculum items with progress
  const curriculumItems = student.currentRank.curriculumItems.map((item) => ({
    ...item,
    progress: progressMap.get(item.id),
  }));

  // Exam availability mapping - check if item category includes exam items
  const examAvailability = curriculumItems.reduce((acc, item) => {
    // Only set availability for items that might be exam-related
    acc[item.id] = activeExams.length > 0;
    return acc;
  }, {} as Record<string, boolean>);

  return (
    <div className='min-h-screen bg-black text-white'>
      <div className='container mx-auto px-4 lg:px-8 py-12'>
        {/* Header */}
        <div className='mb-12'>
          <Link
            href='/student/dashboard'
            className='inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors mb-8'
          >
            <ArrowLeft className='h-4 w-4' />
            Return to Command
          </Link>

          <div className='bg-zinc-900 border border-zinc-800 p-8'>
            <div className='flex items-center gap-4 mb-4'>
              <div
                className='w-6 h-6 border-2'
                style={{
                  backgroundColor: student.currentRank.colorCode,
                  borderColor: student.currentRank.colorCode,
                }}
              />
              <h1 className='text-4xl font-heading font-black uppercase tracking-tighter'>
                Curriculum Intel
              </h1>
            </div>
            <p className='text-zinc-500 text-sm font-medium'>
              Master all requirements to unlock advancement to{" "}
              {nextRank?.name || "next rank"}
            </p>
          </div>
        </div>

        {/* Curriculum Board */}
        <CurriculumBoardStyled
          rankName={student.currentRank.name}
          rankColor={student.currentRank.colorCode}
          items={curriculumItems}
          nextRankName={nextRank?.name}
          examAvailability={examAvailability}
        />
      </div>
    </div>
  );
}
