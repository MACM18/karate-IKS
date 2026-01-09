"use client";

import { Clock, TrendingUp, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { format, isSameDay } from "date-fns";

interface Attendance {
    id: string;
    date: string;
    type: string;
}

interface Stats {
    totalClasses: number;
    totalHours: number;
    streak: number;
    lastClass: {
        date: string;
        type: string;
    } | null;
}

export function AttendanceClient({ attendance, stats }: { attendance: Attendance[], stats: Stats }) {
    const attendanceDates = attendance.map(a => new Date(a.date));

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-10 max-w-7xl mx-auto w-full">
            <header className="mb-16">
                <div className="flex items-center gap-4 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                    <div className="w-12 h-px bg-primary" />
                    Tactical Logs
                </div>
                <h1 className="text-6xl font-heading font-black uppercase tracking-tighter text-white">
                    Training <span className="text-primary italic">Record</span>
                </h1>
                <p className="text-zinc-500 mt-4 font-medium max-w-2xl">
                    Every session is a battle won against mediocrity. Review your historical training data and maintain your combat readiness.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Stats Column */}
                <div className="space-y-8">
                    <div className="bg-zinc-900 border border-zinc-800 p-8 hover:border-primary transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <TrendingUp className="text-primary group-hover:scale-110 transition-transform" size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Current Edge</span>
                        </div>
                        <div className="text-5xl font-heading font-black text-white">
                            {stats.streak} <span className="text-sm font-black text-zinc-700 uppercase tracking-tighter">Day Streak</span>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-8 hover:border-primary transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <Clock className="text-primary group-hover:scale-110 transition-transform" size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Total Immersion</span>
                        </div>
                        <div className="text-5xl font-heading font-black text-white">
                            {Math.round(stats.totalHours)} <span className="text-sm font-black text-zinc-700 uppercase tracking-tighter">Hours</span>
                        </div>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-4">Across {stats.totalClasses} Sessions</p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-8 hover:border-primary transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <CalendarIcon className="text-primary group-hover:scale-110 transition-transform" size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Last Deployment</span>
                        </div>
                        {stats.lastClass ? (
                            <>
                                <div className="text-2xl font-heading font-black text-white">
                                    {format(new Date(stats.lastClass.date), "MMMM do")}
                                </div>
                                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">
                                    {stats.lastClass.type}
                                </div>
                            </>
                        ) : (
                            <div className="text-xl font-heading font-black text-zinc-700 italic">No Data Recorded</div>
                        )}
                    </div>
                </div>

                {/* Log Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                            <span className="h-px w-8 bg-zinc-800"></span>
                            Chronological Log
                        </h2>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 divide-y divide-zinc-800">
                        {attendance.length === 0 ? (
                            <div className="p-12 text-center text-zinc-600 italic font-medium">
                                No logs detected. Report for training to initiate tracking.
                            </div>
                        ) : (
                            attendance.map((log) => (
                                <div key={log.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-sm bg-black border border-zinc-800 flex items-center justify-center text-primary">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <div className="text-lg font-heading font-black text-white uppercase tracking-tighter">
                                                {format(new Date(log.date), "EEEE, MMM d")}
                                            </div>
                                            <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                                                {log.type} session complete
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                                        Verified
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
