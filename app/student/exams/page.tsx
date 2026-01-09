import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ExamApplicationForm } from "@/components/student/ExamApplicationForm";
import { Clock, Shield, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function StudentExamsPage({ searchParams }: { searchParams: { id?: string } }) {
    const session = await auth();
    if (!session || !session.user) redirect("/login");

    const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!studentProfile) redirect("/join");

    // If an ID is provided, show the application form
    if (searchParams.id) {
        const templateData = await prisma.examTemplate.findUnique({
            where: { id: searchParams.id }
        });

        const template = templateData as any;

        if (!template) redirect("/student/exams");

        return (
            <div className="p-4 md:p-12 max-w-4xl mx-auto">
                <Link href="/student/exams" className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-primary mb-8 inline-block">&larr; Back to Listings</Link>
                <ExamApplicationForm template={template} />
            </div>
        );
    }

    // List available exams and my applications
    const templatesFetch = await prisma.examTemplate.findMany({
        where: {
            isActive: true,
            openDate: { lte: new Date() }
        },
        orderBy: { createdAt: "desc" }
    });

    const templates = templatesFetch as any[];

    const myApplicationsFetch = await prisma.examApplication.findMany({
        where: { studentId: studentProfile.id },
        include: { template: true },
        orderBy: { createdAt: "desc" }
    });

    const myApplications = myApplicationsFetch as any[];

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-7xl mx-auto">
            <header>
                <h1 className="text-5xl font-heading font-black uppercase tracking-tighter text-white">Grading <span className="text-primary italic">Portal</span></h1>
                <p className="text-zinc-500 mt-2 font-medium">Apply for rank progression and school events.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                        <span className="h-px w-8 bg-zinc-800"></span>
                        Open Registrations
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {templates.map((template) => {
                            const isPastDeadline = template.deadline && new Date(template.deadline) < new Date();

                            return (
                                <div
                                    key={template.id}
                                    className={`bg-zinc-900 border border-zinc-800 p-6 flex flex-col md:flex-row md:items-center justify-between group transition-all gap-4 ${isPastDeadline ? 'opacity-50 grayscale' : 'hover:border-primary/50'}`}
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`text-xl font-bold text-white uppercase tracking-tight transition-colors ${!isPastDeadline && 'group-hover:text-primary'}`}>{template.title}</h3>
                                            <span className="px-2 py-0.5 bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 rounded-sm">
                                                {template.type}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-500 line-clamp-1">{template.description || "No description provided."}</p>
                                        {template.deadline && (
                                            <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${isPastDeadline ? 'text-red-500' : 'text-zinc-400'}`}>
                                                Deadline: {new Date(template.deadline).toLocaleDateString()} {isPastDeadline && "(CLOSED)"}
                                            </p>
                                        )}
                                    </div>

                                    {!isPastDeadline ? (
                                        <Link
                                            href={`/student/exams?id=${template.id}`}
                                            className="flex items-center gap-4 text-primary font-black uppercase tracking-widest text-xs"
                                        >
                                            Apply Now <ChevronRight size={14} />
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-4 text-zinc-600 font-black uppercase tracking-widest text-xs">
                                            Closed
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {templates.length === 0 && (
                            <div className="py-20 text-center bg-zinc-900/50 border border-zinc-800 rounded-sm">
                                <Shield className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                                <p className="text-zinc-600 font-medium italic">No active exams at this time.</p>
                            </div>
                        )}
                    </div>
                </div>

                <aside className="space-y-8">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                        <span className="h-px w-8 bg-zinc-800"></span>
                        My Applications
                    </h2>

                    <div className="space-y-4">
                        {myApplications.map((app) => (
                            <div key={app.id} className="bg-zinc-900/50 border border-zinc-800 p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-bold text-white uppercase">{app.template.title}</h4>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${app.status === 'APPROVED' ? 'bg-green-900/30 text-green-400' :
                                        app.status === 'REJECTED' ? 'bg-red-900/30 text-red-400' :
                                            'bg-zinc-800 text-zinc-400'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                                    <span className="flex items-center gap-1"><Clock size={10} /> {new Date(app.createdAt).toLocaleDateString()}</span>
                                    <span className={app.paymentStatus === 'PAID' ? 'text-green-500' : 'text-amber-500'}>
                                        {app.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {myApplications.length === 0 && (
                            <p className="text-xs text-zinc-600 italic text-center py-8">No applications submitted.</p>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
