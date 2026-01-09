"use client";

import React, { useState } from "react";
import { MoreHorizontal, Trophy, CheckCircle2, Loader2, UserX, UserCheck, Inbox } from "lucide-react";
import { createAchievement, toggleStudentActiveStatus } from "@/app/lib/actions";

export interface Student {
    id: string;
    name: string;
    email: string;
    admissionNumber: string;
    classSchedule: string;
    rank: string;
    joinDate: string;
    status: "active" | "inactive";
    isActive: boolean;
    lastAttendance: string;
}

interface StudentTableProps {
    students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
    const [awardingTo, setAwardingTo] = useState<string | null>(null);
    const [achievementTitle, setAchievementTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAward = async (studentId: string) => {
        if (!achievementTitle) return;
        setIsSubmitting(true);
        try {
            await createAchievement({
                title: achievementTitle,
                studentId: studentId,
            });
            alert("Achievement awarded successfully!");
            setAwardingTo(null);
            setAchievementTitle("");
        } catch (error) {
            alert("Failed to award achievement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (studentId: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to mark this student as ${currentStatus ? 'INACTIVE' : 'ACTIVE'}?`)) return;
        try {
            await toggleStudentActiveStatus(studentId, !currentStatus);
        } catch (error) {
            alert("Failed to update status.");
        }
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-zinc-900 text-zinc-500 uppercase text-[10px] tracking-[0.2em] bg-black/40">
                        <th className="py-4 px-6 font-black">Personnel / ID</th>
                        <th className="py-4 px-6 font-black">Rank</th>
                        <th className="py-4 px-6 font-black">Deployment (Class)</th>
                        <th className="py-4 px-6 font-black">Status</th>
                        <th className="py-4 px-6 font-black text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-zinc-300">
                    {students.map((student) => (
                        <tr key={student.id} className={`border-b border-zinc-900 hover:bg-white/5 transition-colors group ${!student.isActive ? 'opacity-50' : ''}`}>
                            <td className="py-4 px-6">
                                <div className="font-bold text-white group-hover:text-primary transition-colors">{student.name}</div>
                                <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{student.admissionNumber || "NO ADMISSION ID"}</div>
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full border border-white/10"
                                        style={{ backgroundColor: student.rank.toLowerCase() === 'black' ? '#000' : '#fff' }} // Simplified for display
                                    />
                                    <span className="text-xs font-bold uppercase tracking-tighter">
                                        {student.rank}
                                    </span>
                                </div>
                            </td>
                            <td className="py-4 px-6">
                                <div className="text-xs font-medium text-zinc-400">{student.classSchedule}</div>
                            </td>
                            <td className="py-4 px-6">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest
                                ${student.isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}
                            `}>
                                    {student.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {awardingTo === student.id ? (
                                        <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                                            <input
                                                type="text"
                                                value={achievementTitle}
                                                onChange={(e) => setAchievementTitle(e.target.value)}
                                                placeholder="INTEL TITLE"
                                                className="bg-black border border-zinc-800 text-[10px] py-1.5 px-3 font-black text-white focus:outline-none focus:border-primary uppercase tracking-widest"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleAward(student.id)}
                                                disabled={isSubmitting || !achievementTitle}
                                                className="p-1.5 bg-primary text-white rounded-sm hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                                            </button>
                                            <button
                                                onClick={() => setAwardingTo(null)}
                                                className="text-zinc-500 hover:text-white text-[10px] uppercase font-black px-2 tracking-widest"
                                            >
                                                Abort
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setAwardingTo(student.id)}
                                                className="p-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-primary transition-all"
                                                title="Award Achievement"
                                            >
                                                <Trophy size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(student.id, student.isActive)}
                                                className={`p-2 hover:bg-zinc-800 rounded transition-all ${student.isActive ? 'text-zinc-500 hover:text-rose-500' : 'text-emerald-500 hover:text-emerald-400'}`}
                                                title={student.isActive ? "Deactivate personnel" : "Reactivate personnel"}
                                            >
                                                {student.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                                            </button>
                                            <button className="p-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

