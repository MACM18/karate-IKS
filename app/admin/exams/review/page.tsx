import { prisma } from "@/app/lib/prisma";
import { updateApplicationStatus } from "@/app/lib/actions";
import { Check, X, Eye, FileText, User } from "lucide-react";
import Link from "next/link";

export default async function AdminExamReviewPage({ searchParams }: { searchParams: { id?: string } }) {
    if (!searchParams.id) {
        return (
            <div className="p-8 text-center text-zinc-500 italic">
                Select an application to review.
            </div>
        );
    }

    const application = await prisma.examApplication.findUnique({
        where: { id: searchParams.id },
        include: {
            student: { include: { user: true, currentRank: true } },
            template: true
        }
    });

    if (!application) return <div className="p-8 text-zinc-500">Application not found.</div>;

    const submissionData = application.submissionData as Record<string, any>;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-600">
                        <User size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-black uppercase text-white leading-none">
                            {application.student.user.name}
                        </h1>
                        <p className="text-primary font-black uppercase tracking-widest text-[10px] mt-2">
                            Applied for: {application.template.title}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <form action={async () => {
                        "use server";
                        await updateApplicationStatus(application.id, 'APPROVED');
                    }}>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-black uppercase tracking-widest text-xs hover:bg-green-700 transition-all rounded-sm">
                            <Check size={16} /> Approve
                        </button>
                    </form>
                    <form action={async () => {
                        "use server";
                        await updateApplicationStatus(application.id, 'REJECTED');
                    }}>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all rounded-sm">
                            <X size={16} /> Reject
                        </button>
                    </form>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                        <span className="h-px w-4 bg-zinc-800"></span>
                        Submission Data
                    </h3>

                    <div className="space-y-6">
                        {Object.entries(submissionData).map(([key, value]) => (
                            <div key={key} className="space-y-1.5">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">{key.replace(/_/g, ' ')}</label>
                                {typeof value === 'string' && value.startsWith('http') ? (
                                    <a
                                        href={value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-sm hover:border-primary transition-all group"
                                    >
                                        <FileText className="text-zinc-600 group-hover:text-primary" />
                                        <span className="text-sm text-zinc-300 font-medium">View Uploaded Document</span>
                                    </a>
                                ) : (
                                    <div className="p-3 bg-zinc-900 border border-zinc-800 text-white rounded-sm">
                                        {value?.toString() || "N/A"}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                        <span className="h-px w-4 bg-zinc-800"></span>
                        Student Context
                    </h3>

                    <div className="bg-zinc-900 p-6 border border-zinc-800 space-y-4">
                        <div className="flex justify-between border-b border-zinc-800 pb-4">
                            <span className="text-xs text-zinc-500 uppercase font-black tracking-widest">Current Rank</span>
                            <span className="text-sm font-bold text-white uppercase">{application.student.currentRank?.name || "N/A"}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800 pb-4">
                            <span className="text-xs text-zinc-500 uppercase font-black tracking-widest">Application Date</span>
                            <span className="text-sm font-bold text-white uppercase">{new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-zinc-500 uppercase font-black tracking-widest">Payment Status</span>
                            <span className={`text-xs font-black uppercase tracking-widest ${application.paymentStatus === 'PAID' ? 'text-green-500' : 'text-amber-500'}`}>
                                {application.paymentStatus}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 bg-primary/5 border border-primary/20 rounded-sm italic text-zinc-400 text-sm leading-relaxed">
                        Notice: Approving this application will automatically advance the student to the next available rank in the Shito-Ryu hierarchy.
                    </div>
                </div>
            </div>
        </div>
    );
}
