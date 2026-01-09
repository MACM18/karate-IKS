import Link from "next/link";
import {
    LayoutDashboard,
    Calendar,
    BookOpen,
    Award,
    FileText,
    Shield,
    LogOut,
    User,
    Settings
} from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session || session.user.role !== 'STUDENT') {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-black text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-900 bg-zinc-950 hidden md:flex flex-col fixed h-full z-30">
                <div className="p-8 border-b border-zinc-900">
                    <h1 className="text-xl font-heading font-black uppercase tracking-[0.2em] text-white">
                        Tactical <span className="text-primary italic">OS</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link
                        href="/student/dashboard"
                        className="flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900/50 rounded-lg transition-all group"
                    >
                        <LayoutDashboard size={20} className="group-hover:text-primary transition-colors" />
                        <span className="uppercase text-[10px] font-black tracking-widest">HQ Dashboard</span>
                    </Link>
                    <Link
                        href="/student/attendance"
                        className="flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900/50 rounded-lg transition-all group"
                    >
                        <Calendar size={20} className="group-hover:text-primary transition-colors" />
                        <span className="uppercase text-[10px] font-black tracking-widest">Training Log</span>
                    </Link>
                    <Link
                        href="/student/resources"
                        className="flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900/50 rounded-lg transition-all group"
                    >
                        <BookOpen size={20} className="group-hover:text-primary transition-colors" />
                        <span className="uppercase text-[10px] font-black tracking-widest">Curriculum</span>
                    </Link>
                    <Link
                        href="/student/certificates"
                        className="flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900/50 rounded-lg transition-all group"
                    >
                        <Award size={20} className="group-hover:text-primary transition-colors" />
                        <span className="uppercase text-[10px] font-black tracking-widest">Honors</span>
                    </Link>
                    <Link
                        href="/student/exams"
                        className="flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900/50 rounded-lg transition-all group"
                    >
                        <FileText size={20} className="group-hover:text-primary transition-colors" />
                        <span className="uppercase text-[10px] font-black tracking-widest">Grading Forms</span>
                    </Link>
                </nav>

                <div className="p-6 border-t border-zinc-900 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 overflow-hidden">
                            {session.user.image ? (
                                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} />
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-[10px] font-black text-white uppercase truncate">{session.user.name}</div>
                            <div className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">Student Clearance</div>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="flex items-center gap-4 px-4 py-3 text-zinc-600 hover:text-primary transition-colors group">
                        <LogOut size={18} />
                        <span className="uppercase text-[10px] font-black tracking-widest">Logoff</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:pl-64 bg-black">
                <div className="min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
