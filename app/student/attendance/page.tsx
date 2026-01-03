import { AttendanceCalendar } from "@/components/student/AttendanceCalendar";
import { Clock, TrendingUp, Calendar } from "lucide-react";

export default function AttendancePage() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="mb-12">
                <h1 className="text-4xl font-heading uppercase tracking-widest text-white mb-4">
                    Training Log
                </h1>
                <p className="text-zinc-500 max-w-2xl">
                    Consistency is the key to mastery. Track your progress here.
                </p>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

                {/* Stats Column */}
                <div className="space-y-6">
                    <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-2 text-zinc-500">
                            <TrendingUp size={20} />
                            <span className="text-xs uppercase tracking-widest font-bold">Current Streak</span>
                        </div>
                        <div className="text-4xl font-heading text-white">
                            12 <span className="text-lg text-zinc-600 ml-1">Classes</span>
                        </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-2 text-zinc-500">
                            <Clock size={20} />
                            <span className="text-xs uppercase tracking-widest font-bold">Total Training Hours</span>
                        </div>
                        <div className="text-4xl font-heading text-white">
                            145 <span className="text-lg text-zinc-600 ml-1">Hrs</span>
                        </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-2 text-zinc-500">
                            <Calendar size={20} />
                            <span className="text-xs uppercase tracking-widest font-bold">Last Class</span>
                        </div>
                        <div className="text-xl font-heading text-white">
                            Yesterday
                        </div>
                        <p className="text-sm text-zinc-600 mt-1">Foundations (6:00 PM)</p>
                    </div>
                </div>

                {/* Calendar Column */}
                <div className="lg:col-span-2">
                    <AttendanceCalendar />

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        {/* Previous Months Placeholders - blurred/dimmed */}
                        <div className="bg-zinc-950/50 border border-zinc-900/50 rounded-lg p-6 opacity-50 grayscale">
                            <h4 className="text-zinc-600 text-sm font-bold uppercase tracking-widest mb-4">September</h4>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <div key={i} className={`aspect-square rounded ${[1, 4, 7].includes(i) ? 'bg-zinc-800' : 'bg-zinc-950'}`}></div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-zinc-950/50 border border-zinc-900/50 rounded-lg p-6 opacity-50 grayscale">
                            <h4 className="text-zinc-600 text-sm font-bold uppercase tracking-widest mb-4">August</h4>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: 31 }).map((_, i) => (
                                    <div key={i} className={`aspect-square rounded ${[2, 5, 10].includes(i) ? 'bg-zinc-800' : 'bg-zinc-950'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
