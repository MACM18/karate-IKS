import { Users, TrendingUp, Award } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-heading uppercase text-white tracking-widest">
                    Dojo Overview
                </h1>
                <p className="text-zinc-500 mt-1">Welcome back, Sensei.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase tracking-widest text-zinc-500">Active Students</span>
                        <Users className="text-zinc-600" size={20} />
                    </div>
                    <div className="text-4xl font-heading text-white">124</div>
                    <div className="text-sm text-green-500 mt-2 flex items-center gap-1">
                        <TrendingUp size={14} /> +3 this week
                    </div>
                </div>

                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase tracking-widest text-zinc-500">Avg. Attendance</span>
                        <TrendingUp className="text-zinc-600" size={20} />
                    </div>
                    <div className="text-4xl font-heading text-white">85%</div>
                    <div className="text-sm text-zinc-500 mt-2">
                        Stable since last month
                    </div>
                </div>

                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase tracking-widest text-zinc-500">Pending Promotions</span>
                        <Award className="text-zinc-600" size={20} />
                    </div>
                    <div className="text-4xl font-heading text-white">12</div>
                    <div className="text-sm text-action mt-2 font-bold uppercase text-xs tracking-wide cursor-pointer hover:underline">
                        View Candidates &rarr;
                    </div>
                </div>
            </div>
        </div>
    );
}
