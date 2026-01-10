"use client";

import React, { useState, useEffect } from "react";
import { Clock, Plus, Trash2, Calendar, Edit } from "lucide-react";
import { TacticalModal } from "@/components/admin/TacticalModal";

interface ClassSchedule {
    id: string;
    name: string;
    day: string;
    time: string;
}

export default function ClassSchedulesPage() {
    const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ isOpen: boolean, title: string, message: string, severity: 'info' | 'warning' | 'danger' } | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        dayOfWeek: "Monday",
        startTime: "",
        endTime: ""
    });

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const res = await fetch('/api/schedules');
            const data = await res.json();
            setSchedules(data);
        } catch (error) {
            console.error("Failed to fetch schedules", error);
        }
    };

    const handleEdit = (schedule: ClassSchedule) => {
        const [startTime, endTime] = schedule.time.split(' - ');
        setFormData({
            name: schedule.name,
            dayOfWeek: schedule.day,
            startTime: startTime || "",
            endTime: endTime || ""
        });
        setEditingId(schedule.id);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { ...formData, id: editingId } : formData;

            const res = await fetch('/api/schedules', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setNotification({
                    isOpen: true,
                    title: editingId ? "SCHEDULE UPDATED" : "SCHEDULE CREATED",
                    message: `Class schedule "${formData.name}" has been successfully ${editingId ? 'updated' : 'added'}.`,
                    severity: 'info'
                });
                setFormData({ name: "", dayOfWeek: "Monday", startTime: "", endTime: "" });
                setEditingId(null);
                setIsFormOpen(false);
                fetchSchedules();
            } else {
                throw new Error("Failed to save schedule");
            }
        } catch (error) {
            setNotification({
                isOpen: true,
                title: "OPERATION FAILED",
                message: "Failed to save class schedule.",
                severity: 'danger'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        try {
            const res = await fetch(`/api/schedules?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setNotification({
                    isOpen: true,
                    title: "SCHEDULE REMOVED",
                    message: `Class schedule "${name}" has been deleted.`,
                    severity: 'warning'
                });
                fetchSchedules();
            }
        } catch (error) {
            setNotification({
                isOpen: true,
                title: "DELETION FAILED",
                message: "Failed to delete class schedule.",
                severity: 'danger'
            });
        }
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-heading font-black uppercase tracking-tighter text-white">Class <span className="text-primary italic">Schedules</span></h1>
                    <p className="text-zinc-500 mt-2 font-medium">Manage training time slots and class schedules.</p>
                </div>
                <button
                    onClick={() => {
                        setFormData({ name: "", dayOfWeek: "Monday", startTime: "", endTime: "" });
                        setEditingId(null);
                        setIsFormOpen(true);
                    }}
                    className="bg-primary text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> New Schedule
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schedules.map((schedule) => (
                    <div key={schedule.id} className="bg-zinc-900 border border-zinc-800 p-6 space-y-4 group hover:border-primary/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-heading font-black text-white uppercase tracking-tight">{schedule.name}</h3>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{schedule.day}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(schedule)}
                                    className="p-2 text-zinc-600 hover:text-white transition-colors"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(schedule.id, schedule.name)}
                                    className="p-2 text-zinc-600 hover:text-primary transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Clock size={14} />
                            <span className="font-bold">{schedule.time}</span>
                        </div>
                    </div>
                ))}

                {schedules.length === 0 && (
                    <div className="col-span-full py-24 text-center border border-dashed border-zinc-800 text-zinc-600">
                        <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="italic font-medium">No class schedules configured yet.</p>
                    </div>
                )}
            </div>

            {/* Create Schedule Modal */}
            <TacticalModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title="NEW CLASS SCHEDULE"
                severity="info"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Class Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black border border-zinc-800 py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-primary transition-all"
                            placeholder="e.g., Kids Karate, Advanced Training"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Day of Week</label>
                        <select
                            value={formData.dayOfWeek}
                            onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                            className="w-full bg-black border border-zinc-800 py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-primary transition-all"
                        >
                            {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Start Time</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full bg-black border border-zinc-800 py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-primary transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-500">End Time</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full bg-black border border-zinc-800 py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-primary transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className="px-6 py-2.5 bg-zinc-800 text-zinc-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Schedule'}
                        </button>
                    </div>
                </form>
            </TacticalModal>

            {/* Notification Modal */}
            {notification && (
                <TacticalModal
                    isOpen={notification.isOpen}
                    onClose={() => setNotification(null)}
                    title={notification.title}
                    severity={notification.severity}
                >
                    <div className="space-y-6">
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {notification.message}
                        </p>
                        <div className="flex justify-end pt-4 border-t border-zinc-800">
                            <button
                                onClick={() => setNotification(null)}
                                className="px-6 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                            >
                                Acknowledged
                            </button>
                        </div>
                    </div>
                </TacticalModal>
            )}
        </div>
    );
}
