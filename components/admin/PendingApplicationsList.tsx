import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { ChevronRight, Clock, User } from "lucide-react";

export async function PendingApplicationsList() {
    const pending = await prisma.examApplication.findMany({
        where: { status: "PENDING" },
        include: {
            student: { include: { user: true } },
            template: true
        },
        orderBy: { createdAt: "desc" },
        take: 10
    });

    if (pending.length === 0) {
        return <div className="p-12 text-center text-zinc-600 italic text-sm">No pending applications.</div>;
    }

    return (
        <div className="divide-y divide-zinc-800">
            {pending.map((app) => (
                <Link
                    key={app.id}
                    href={`/admin/exams/review?id=${app.id}`}
                    className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                            <User size={16} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white uppercase">{app.student.user.name}</div>
                            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{app.template.title}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <div className={`text-[10px] font-black uppercase tracking-widest ${app.paymentStatus === 'PAID' ? 'text-green-500' : 'text-amber-500'}`}>
                                {app.paymentStatus}
                            </div>
                            <div className="text-[10px] text-zinc-600 flex items-center gap-1"><Clock size={10} /> {new Date(app.createdAt).toLocaleDateString()}</div>
                        </div>
                        <ChevronRight size={16} className="text-zinc-700 group-hover:text-primary transition-colors" />
                    </div>
                </Link>
            ))}
        </div>
    );
}
