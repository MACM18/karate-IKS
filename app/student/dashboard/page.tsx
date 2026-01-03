import { BeltProgress } from "@/components/BeltProgress";
import { User, Calendar, BookOpen, Trophy } from "lucide-react";

export default function StudentDashboard() {
    // Mock Data
    const student = {
        name: "Daniel LaRusso",
        currentBelt: "Yellow Belt",
        nextBelt: "Orange Belt",
        beltColor: "#FACC15", // Yellow-400
        progress: 65,
        streak: 12,
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-4xl font-heading uppercase tracking-widest">
                        Welcome back, {student.name.split(" ")[0]}
                    </h1>
                    <p className="text-zinc-500 mt-2">Dojo Kun: Seek Perfection of Character</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded border border-zinc-800">
                        <span className="text-zinc-400 uppercase text-xs tracking-wider">Streak</span>
                        <span className="text-xl font-bold text-action">🔥 {student.streak}</span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700">
                        <User size={20} />
                    </button>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Progress & Status */}
                <div className="col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-heading uppercase tracking-widest mb-6 border-l-4 border-action pl-4">
                            My Progress
                        </h2>
                        <BeltProgress
                            currentBelt={student.currentBelt}
                            nextBelt={student.nextBelt}
                            progress={student.progress}
                            color={student.beltColor}
                        />
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors cursor-pointer group">
                            <BookOpen className="text-zinc-500 group-hover:text-white mb-4" />
                            <h3 className="font-heading uppercase text-lg">Curriculum</h3>
                            <p className="text-sm text-zinc-500 mt-2">View Kata and Techniques for {student.currentBelt}</p>
                        </div>
                        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors cursor-pointer group">
                            <Calendar className="text-zinc-500 group-hover:text-white mb-4" />
                            <h3 className="font-heading uppercase text-lg">Schedule</h3>
                            <p className="text-sm text-zinc-500 mt-2">Upcoming classes and events</p>
                        </div>
                    </section>
                </div>

                {/* Right Column: News & Requirements */}
                <aside className="space-y-8">
                    <div className="bg-zinc-900 p-6 border border-zinc-800 rounded-lg">
                        <h3 className="text-zinc-400 uppercase text-xs tracking-widest mb-4">Requirements Checklist</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-900 text-green-400 flex items-center justify-center text-xs">✓</div>
                                <span className="text-sm text-zinc-300">Heian Shodan Kata</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-900 text-green-400 flex items-center justify-center text-xs">✓</div>
                                <span className="text-sm text-zinc-300">Kihon (Basics)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700"></div>
                                <span className="text-sm text-zinc-500">Kumite (Sparring)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700"></div>
                                <span className="text-sm text-zinc-500">Attendance (18/24)</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-zinc-900 to-black p-6 border border-zinc-800 rounded-lg">
                        <Trophy className="text-amber-500 mb-2" />
                        <h3 className="font-heading uppercase text-lg">Upcoming Tournament</h3>
                        <p className="text-sm text-zinc-400 mt-2">Regional Championship<br />Oct 24th, 2026</p>
                        <button className="mt-4 text-xs uppercase font-bold text-action hover:text-red-400">Register Now &rarr;</button>
                    </div>
                </aside>

            </main>
        </div>
    );
}
