"use client";

import React, { useState } from "react";
import { MoreHorizontal, Trophy, CheckCircle2, Loader2 } from "lucide-react";
import { createAchievement } from "@/app/lib/actions";

export interface Student {
    id: string; // This should be the StudentProfile ID
    name: string;
    email: string;
    rank: string;
    joinDate: string;
    status: "active" | "inactive" | "suspended";
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

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-xs tracking-widest">
                        <th className="py-4 px-6 font-medium">Name</th>
                        <th className="py-4 px-6 font-medium">Rank</th>
                        <th className="py-4 px-6 font-medium">Status</th>
                        <th className="py-4 px-6 font-medium">Last Seen</th>
                        <th className="py-4 px-6 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-zinc-300">
                    {students.map((student) => (
                        <tr key={student.id} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors group">
                            <td className="py-4 px-6">
                                <div className="font-bold text-white">{student.name}</div>
                                <div className="text-xs text-zinc-500">{student.email}</div>
                            </td>
                            <td className="py-4 px-6">
                                <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs uppercase tracking-wide border border-zinc-700">
                                    {student.rank}
                                </span>
                            </td>
                            <td className="py-4 px-6">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                                ${student.status === 'active' ? 'bg-green-950/30 text-green-400 border border-green-900' : ''}
                                ${student.status === 'suspended' ? 'bg-red-950/30 text-red-400 border border-red-900' : ''}
                                ${student.status === 'inactive' ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : ''}
                            `}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'active' ? 'bg-green-400' :
                                        student.status === 'suspended' ? 'bg-red-400' : 'bg-zinc-400'
                                        }`}></span>
                                    {student.status}
                                </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-zinc-500">
                                {student.lastAttendance}
                            </td>
                            <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {awardingTo === student.id ? (
                                        <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                                            <input
                                                type="text"
                                                value={achievementTitle}
                                                onChange={(e) => setAchievementTitle(e.target.value)}
                                                placeholder="Achievement Title"
                                                className="bg-zinc-800 border border-zinc-700 text-xs py-1.5 px-3 rounded text-white focus:outline-none focus:border-action"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleAward(student.id)}
                                                disabled={isSubmitting || !achievementTitle}
                                                className="p-1.5 bg-action text-white rounded hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                                            </button>
                                            <button
                                                onClick={() => setAwardingTo(null)}
                                                className="text-zinc-500 hover:text-white text-xs uppercase font-bold px-2"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setAwardingTo(student.id)}
                                                className="p-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-action transition-all group-hover:scale-110"
                                                title="Award Achievement"
                                            >
                                                <Trophy size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors">
                                                <MoreHorizontal size={18} />
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

