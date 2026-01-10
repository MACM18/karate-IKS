"use client";

import React, { useState, useEffect } from "react";
import { Search, Users, Calendar, CheckCircle, UserPlus, Shield, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AttendanceManager() {
    const [searchTerm, setSearchTerm] = useState("");
    const [students, setStudents] = useState<any[]>([]);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        // Fetch schedules
        fetch('/api/schedules')
            .then(res => res.json())
            .then(data => setSchedules(data));

        // Fetch all active students initially
        fetch('/api/students')
            .then(res => res.json())
            .then(data => setStudents(data.filter((s: any) => s.isActive)));
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // The /api/students already returns all, we can filter client side or enhance API
        // For now, client side filtering for better UX on small-medium datasets
    };

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.admissionNumber && s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesClass = selectedClass ? s.classId === selectedClass : true;
        return matchesSearch && matchesClass;
    });

    const markAttendance = async (studentId: string) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    date: attendanceDate,
                    classType: schedules.find(s => s.id === selectedClass)?.name || "Adults"
                })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: "Attendance recorded successfully!" });
                setTimeout(() => setMessage(null), 3000);
            } else {
                throw new Error("Failed to record attendance");
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Error recording attendance." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const markBatch = async () => {
        if (!selectedClass) return;
        setIsSubmitting(true);
        try {
            const promises = filteredStudents.map(s =>
                fetch('/api/attendance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: s.id,
                        date: attendanceDate,
                        classType: schedules.find(sc => sc.id === selectedClass)?.name || "General"
                    })
                })
            );
            await Promise.all(promises);
            setMessage({ type: 'success', text: `Attendance recorded for ${filteredStudents.length} students!` });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: "Error in batch recording." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-heading font-black uppercase tracking-tighter text-white">Attendance <span className="text-primary italic">Command</span></h1>
                    <p className="text-zinc-500 mt-2 font-medium">Tactical check-ins and class roster management.</p>
                </div>
            </header>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-4 border font-black uppercase tracking-widest text-xs ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-rose-500/10 border-rose-500 text-rose-500'}`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Controls Sidebar */}
                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Deployment Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                <input
                                    type="date"
                                    value={attendanceDate}
                                    onChange={(e) => setAttendanceDate(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 py-3 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Strategy Slot (Class)</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full bg-black border border-zinc-800 py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-primary transition-all"
                            >
                                <option value="">ALL ACTIVE PERSONNEL</option>
                                {schedules.map(s => (
                                    <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        {selectedClass && filteredStudents.length > 0 && (
                            <button
                                onClick={markBatch}
                                disabled={isSubmitting}
                                className="w-full bg-primary text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                                Mark Entire Roster Present
                            </button>
                        )}
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users size={16} className="text-zinc-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Roster Intel</h3>
                        </div>
                        <div className="text-3xl font-heading font-black text-white">{filteredStudents.length}</div>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Active students in current view</p>
                    </div>
                </aside>

                {/* Main Roster Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH BY NAME OR ADMISSION NO (E.G. KS-2026-001)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 py-5 pl-14 pr-6 text-sm font-bold text-white focus:outline-none focus:border-primary transition-all placeholder:text-zinc-700"
                        />
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-black/40">
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">ID / Personnel</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Current Rank</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Deployment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center text-zinc-700 group-hover:text-primary transition-colors">
                                                    <Shield size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{student.user.name}</div>
                                                    <div className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">{student.admissionNumber || "NO ID"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span
                                                className="inline-block w-3 h-3 rounded-full border border-white/20"
                                                style={{ backgroundColor: student.currentRank?.colorCode || "#fff" }}
                                            />
                                            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter mt-1">
                                                {student.currentRank?.name || "White Belt"}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => markAttendance(student.id)}
                                                disabled={isSubmitting}
                                                className="bg-zinc-800 border border-zinc-700 hover:border-emerald-500 hover:text-emerald-500 text-zinc-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <CheckCircle size={14} /> Report Present
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-12 text-center text-zinc-600 italic font-medium">
                                            No personnel matching current search/filter criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
