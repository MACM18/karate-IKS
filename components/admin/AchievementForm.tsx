"use client";

import React, { useState } from 'react';
import { createAchievement } from '@/app/lib/actions';
import { Save, Medal, User, Search, Calendar } from 'lucide-react';

interface Student {
    id: string;
    name: string;
}

export function AchievementForm({ students, onSuccess }: { students: Student[], onSuccess?: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [studentId, setStudentId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId) {
            alert('Please select a student.');
            return;
        }
        setIsSubmitting(true);

        try {
            await createAchievement({ title, studentId, description, date });
            setTitle('');
            setDescription('');
            setStudentId('');
            setSearchTerm('');
            alert('Achievement bestowed successfully!');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            alert('Failed to bestow achievement.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
            <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Honor Title</label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors"
                    placeholder="e.g., Regional Kata Gold Medalist"
                />
            </div>

            <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Target Practitioner</label>
                <div className="space-y-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-3.5 text-zinc-600" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black border border-zinc-800 p-3 pl-10 text-xs text-white focus:border-primary outline-none"
                            placeholder="Search students..."
                        />
                    </div>
                    <select
                        required
                        size={5}
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-2 text-xs text-zinc-300 focus:border-primary outline-none scrollbar-thin scrollbar-thumb-primary"
                    >
                        {filteredStudents.map(student => (
                            <option key={student.id} value={student.id} className="p-2 hover:bg-zinc-900">
                                {student.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Date of Honor</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-3 text-xs text-white focus:border-primary outline-none"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500">Intel (Description)</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors min-h-[100px] text-sm"
                    placeholder="Provide details about the victory or recognition..."
                />
            </div>

            <div className="pt-4 border-t border-zinc-800">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                >
                    {isSubmitting ? 'Recording...' : (
                        <>
                            <Medal size={16} /> Record Achievement
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
