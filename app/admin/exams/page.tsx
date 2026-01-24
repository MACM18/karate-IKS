import { prisma } from "@/app/lib/prisma";
import { ExamTemplateForm } from "@/components/admin/ExamTemplateForm";
import { Trash2, FileText, Users, Clock, Eye } from "lucide-react";
import { deleteExamTemplate } from "@/app/lib/actions";
import { PendingApplicationsList } from "@/components/admin/PendingApplicationsList";
import Link from "next/link";
import { FormOverlay } from "@/components/admin/FormOverlay";

export const dynamic = "force-dynamic";

export default async function AdminExamsPage() {
  let templates: any[] = [];
  try {
    templates = await prisma.examTemplate.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    });
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn(
        "Prisma P2021 during admin exam templates fetch; using empty list.",
      );
      templates = [];
    } else {
      throw err;
    }
  }

  return (
    <div className='p-4 md:p-8 space-y-12 max-w-7xl mx-auto min-h-screen relative'>
      <header className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <h1 className='text-5xl font-heading font-black uppercase tracking-tighter text-white'>
            Exam <span className='text-primary italic'>Forge</span>
          </h1>
          <p className='text-zinc-500 mt-2 font-medium'>
            Design and manage grading forms and event registrations.
          </p>
        </div>
      </header>

      <div className='space-y-16'>
        <section>
          <h2 className='text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-8 flex items-center gap-3'>
            <span className='h-px w-8 bg-zinc-800'></span>
            Active Templates
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {templates.map((template) => (
              <div
                key={template.id}
                className='bg-zinc-900 border border-zinc-800 p-6 flex items-center justify-between group hover:border-zinc-700 transition-all'
              >
                <div className='space-y-1'>
                  <div className='flex items-center gap-3'>
                    <h3 className='text-lg font-bold text-white uppercase tracking-tight'>
                      {template.title}
                    </h3>
                    <span className='px-2 py-0.5 bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 rounded-sm'>
                      {template.type}
                    </span>
                  </div>
                  <div className='flex items-center gap-6 text-xs text-zinc-500'>
                    <span className='flex items-center gap-1.5'>
                      <Users size={12} /> {template._count.applications}{" "}
                      Applicants
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <Clock size={12} />{" "}
                      {new Date(template.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <Link
                    href={`/admin/exams/review?id=${template.id}`}
                    className='text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-2'
                  >
                    <Eye size={14} /> Review
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteExamTemplate(template.id);
                    }}
                  >
                    <button className='p-3 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-sm'>
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              </div>
            ))}

            {templates.length === 0 && (
              <div className='col-span-full py-24 text-center border border-dashed border-zinc-800 text-zinc-600'>
                <FileText size={48} className='mx-auto mb-4 opacity-20' />
                <p className='italic font-medium'>
                  No exam templates created yet.
                </p>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className='text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-8 flex items-center gap-3'>
            <span className='h-px w-8 bg-zinc-800'></span>
            Pending Submissions
          </h2>

          <div className='bg-zinc-900 border border-zinc-800 overflow-hidden'>
            <PendingApplicationsList />
          </div>
        </section>
      </div>

      <FormOverlay title='New Exam Template' triggerLabel='Forge Template'>
        <ExamTemplateForm />
      </FormOverlay>
    </div>
  );
}
