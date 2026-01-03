"use client";

import { CheckInCard } from "@/components/admin/CheckInCard";
import { Calendar, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function AttendancePage() {
    const [selectedClass, setSelectedClass] = useState("adults-6pm");

    const students = [
        { id: 1, name: "Daniel LaRusso", rank: "Yellow Belt", streak: 12 },
        { id: 2, name: "Johnny Lawrence", rank: "Black Belt", streak: 45 },
        { id: 3, name: "Samantha LaRusso", rank: "Orange Belt", streak: 8 },
        { id: 4, name: "Eli Moskowitz", rank: "Green Belt", streak: 15 },
        { id: 5, name: "Robby Keene", rank: "Green Belt", streak: 2 },
        { id: 6, name: "Demetri Alexopoulos", rank: "White Belt", streak: 5 },
    ];

    return (
        <div className="p-8 h-screen flex flex-col">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading uppercase text-white tracking-widest">
                        Attendance Logger
                    </h1>
                    <p className="text-zinc-500 mt-1">Tap a student to mark them present.</p>
                </div>

                <div className="flex items-center gap-4 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                    <Calendar className="text-zinc-500 ml-2" size={20} />
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-transparent text-white border-none focus:ring-0 py-2 cursor-pointer font-bold uppercase tracking-wide"
                    >
                        <option value="kids-4pm">Kids Class (4:00 PM)</option>
                        <option value="adults-6pm">Adults All Ranks (6:00 PM)</option>
                        <option value="advanced-730pm">Black Belt Club (7:30 PM)</option>
                    </select>
                    <ChevronRight className="text-zinc-500 mr-2" size={16} />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto">
                <h2 className="text-zinc-500 uppercase text-xs tracking-widest mb-4">
                    Roster ({students.length} Students)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                    {students.map((student) => (
                        <CheckInCard
                            key={student.id}
                            name={student.name}
                            rank={student.rank}
                            streak={student.streak}
                        />
                    ))}
                </div>
            </div>

            <div className="fixed bottom-8 right-8">
                <button className="bg-action text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-red-700 transition-colors animate-in slide-in-from-bottom-8">
                    Submit Attendance
                </button>
            </div>
        </div>
    );
}
