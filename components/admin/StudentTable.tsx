"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";

export interface Student {
    id: string;
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
                                <button className="p-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
