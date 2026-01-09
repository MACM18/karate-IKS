import Link from "next/link";
import { Users, LayoutDashboard, Award, Settings, LogOut, Calendar, PenTool, FileText, Image as ImageIcon, Trophy } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-black text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-900 bg-zinc-950 hidden md:flex flex-col">
                <div className="p-6 border-b border-zinc-900">
                    <h1 className="text-xl font-heading uppercase tracking-widest text-action">
                        Sensei Admin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                    >
                        <LayoutDashboard size={20} />
                        <span className="uppercase text-sm tracking-wide">Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/students"
                        className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                    >
                        <Users size={20} />
                        <span className="uppercase text-sm tracking-wide">Students</span>
                    </Link>
                    <Link
                        href="/admin/attendance"
                        className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                    >
                        <div className="relative">
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-action rounded-full animate-pulse"></span>
                            <Calendar size={20} />
                        </div>
                        <span className="uppercase text-sm tracking-wide">Attendance</span>
                    </Link>
                    <Link
                        href="/admin/promotions"
                        className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                    >
                        <Award size={20} />
                        <span className="uppercase text-sm tracking-wide">Promotions</span>
                    </Link>
                    <Link
                        href="/admin/exams"
                        className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                    >
                        <FileText size={20} />
                        <span className="uppercase text-sm tracking-wide">Exam Forge</span>
                    </Link>
                    <Link
                        href="/admin/content/news"
                        className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                    >
                        <PenTool size={20} />
                        <span className="uppercase text-sm tracking-wide">News CMS</span>
                    </Link>
                    <Link
                        href="/admin/content/gallery"
                        className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                    >
                        <ImageIcon size={20} />
                        <span className="uppercase text-sm tracking-wide">Gallery</span>
                    </Link>
                    <Link
                        href="/admin/students/achievements"
                        className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                    >
                        <Trophy size={20} />
                        <span className="uppercase text-sm tracking-wide">Honors</span>
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                    >
                        <Settings size={20} />
                        <span className="uppercase text-sm tracking-wide">Settings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-zinc-900">
                    <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-500 w-full transition-colors">
                        <LogOut size={20} />
                        <span className="uppercase text-sm tracking-wide">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-black">
                {children}
            </main>
        </div>
    );
}
