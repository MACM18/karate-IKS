import Link from "next/link";
import { Users, LayoutDashboard, Award, Settings, LogOut } from "lucide-react";

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
                        href="/admin/promotions"
                        className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                    >
                        <Award size={20} />
                        <span className="uppercase text-sm tracking-wide">Promotions</span>
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
