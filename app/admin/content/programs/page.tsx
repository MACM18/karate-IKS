import { prisma } from "@/app/lib/prisma";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { FolderKanban } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProgramsAdminPage() {
  let programs: any[] = [];
  try {
    programs = await prisma.program.findMany({
      orderBy: { order: "asc" },
    });
  } catch (err: any) {
    if (err?.code === 'P2021') {
      console.warn('Prisma P2021 during admin programs fetch; using empty programs.');
      programs = [];
    } else {
      throw err;
    }
  }

  return (
    <div className='p-8 space-y-8'>
      <header className='flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-900'>
        <div>
          <h1 className='text-4xl font-heading font-black uppercase text-white tracking-tighter'>
            Training <span className='text-primary italic'>Programs</span>
          </h1>
          <p className='text-zinc-500 mt-2 font-medium'>
            Manage program details, age groups, and benefits.
          </p>
        </div>
      </header>

      <ProgramForm initialPrograms={programs} />
    </div>
  );
}
