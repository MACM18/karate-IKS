"use client";

import React, { useState, useEffect } from "react";
import { MoreHorizontal, Trophy, CheckCircle2, Loader2, UserX, UserCheck, Inbox, AlertCircle, Trash2, Eye, Edit, Calendar, UserMinus, Lock, BookOpen } from "lucide-react";
import { createAchievement, toggleStudentActiveStatus, adminUpdateStudentProfile, updateStudentPassword, assignStudentClass } from "@/app/lib/actions";
import { TacticalModal } from "./TacticalModal";

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

    // Modal states
    const [statusModal, setStatusModal] = useState<{ isOpen: boolean, studentId: string, studentName: string, currentStatus: boolean } | null>(null);
    const [editModal, setEditModal] = useState<{ isOpen: boolean, student: Student | null } | null>(null);
    const [passwordModal, setPasswordModal] = useState<{ isOpen: boolean, studentId: string, studentName: string } | null>(null);
    const [classModal, setClassModal] = useState<{ isOpen: boolean, studentId: string, studentName: string, currentClass: string } | null>(null);
    const [notification, setNotification] = useState<{ isOpen: boolean, title: string, message: string, severity: 'info' | 'warning' | 'danger' } | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const handleAward = async (studentId: string) => {
        if (!achievementTitle) return;
        setIsSubmitting(true);
        try {
            await createAchievement({
                title: achievementTitle,
                studentId: studentId,
            });
            setNotification({
                isOpen: true,
                title: "HONOR BESTOWED",
                message: `Achievement "${achievementTitle}" has been officially recorded.`,
                severity: 'info'
            });
            setAwardingTo(null);
            setAchievementTitle("");
        } catch (error) {
            setNotification({
                isOpen: true,
                title: "MISSION FAILED",
                message: "Failed to award achievement. System error.",
                severity: 'danger'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeactivateConfirm = async () => {
        if (!statusModal) return;
        setIsSubmitting(true);
        try {
            await toggleStudentActiveStatus(statusModal.studentId, !statusModal.currentStatus);
            setNotification({
                isOpen: true,
                title: "STATUS UPDATED",
                message: `Personnel ${statusModal.currentStatus ? 'deactivated' : 'reactivated'} successfully.`,
                severity: statusModal.currentStatus ? 'warning' : 'info'
            });
            setStatusModal(null);
        } catch (error) {
            setNotification({
                isOpen: true,
                title: "COMMAND ERROR",
                message: "Failed to update personnel status.",
                severity: 'danger'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full overflow-visible">
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
                        <tr key={student.id} className="border-b border-zinc-900 hover:bg-white/5 transition-colors group">
                            <td className={`py-4 px-6 ${!student.isActive ? 'opacity-50' : ''}`}>
                                <button 
                                    onClick={() => setEditModal({ isOpen: true, student })}
                                    className="text-left font-bold text-white group-hover:text-primary transition-colors"
                                >
                                    {student.name}
                                </button>
                                <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{student.admissionNumber || "NO ADMISSION ID"}</div>
                            </td>
                            <td className={`py-4 px-6 ${!student.isActive ? 'opacity-50' : ''}`}>
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
                            <td className={`py-4 px-6 ${!student.isActive ? 'opacity-50' : ''}`}>
                                <div className="text-xs font-medium text-zinc-400">{student.classSchedule}</div>
                            </td>
                            <td className={`py-4 px-6 ${!student.isActive ? 'opacity-50' : ''}`}>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest
                                ${student.isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}
                            `}>
                                    {student.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="py-4 px-6 text-right relative">
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
                                                onClick={() => setStatusModal({
                                                    isOpen: true,
                                                    studentId: student.id,
                                                    studentName: student.name,
                                                    currentStatus: student.isActive
                                                })}
                                                className={`p-2 hover:bg-zinc-800 rounded transition-all ${student.isActive ? 'text-zinc-500 hover:text-rose-500' : 'text-emerald-500 hover:text-emerald-400'}`}
                                                title={student.isActive ? "Deactivate personnel" : "Reactivate personnel"}
                                            >
                                                {student.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                                            </button>
                                            <div className="relative inline-block text-left">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(openMenuId === student.id ? null : student.id);
                                                    }}
                                                    className="p-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors"
                                                >
                                                    <MoreHorizontal size={16} />
                                                </button>
                                                {openMenuId === student.id && (
                                                    <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-950 border border-zinc-800 shadow-2xl z-[9999] rounded-sm ring-1 ring-white/10">
                                                        <div className="py-2">
                                                            <button 
                                                                onClick={() => {
                                                                    setEditModal({ isOpen: true, student });
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3">
                                                                <Edit size={14} /> Edit Details
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    setPasswordModal({ isOpen: true, studentId: student.id, studentName: student.name });
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3">
                                                                <Lock size={14} /> Change Password
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    setClassModal({ isOpen: true, studentId: student.id, studentName: student.name, currentClass: student.classSchedule });
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3">
                                                                <BookOpen size={14} /> Assign Class
                                                            </button>
                                                            <button className="w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3">
                                                                <Calendar size={14} /> Attendance History
                                                            </button>
                                                            <div className="h-px bg-zinc-800 my-2" />
                                                            <button className="w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-3">
                                                                <UserMinus size={14} /> Remove Student
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Student Modal */}
            {editModal && editModal.student && (
                <TacticalModal
                    isOpen={editModal.isOpen}
                    onClose={() => setEditModal(null)}
                    title="EDIT PERSONNEL FILE"
                    severity="info"
                >
                    <form action={async (formData) => {
                        setIsSubmitting(true);
                        try {
                            const name = formData.get('name') as string;
                            const admissionNumber = formData.get('admissionNumber') as string;
                            const email = formData.get('email') as string;
                            await adminUpdateStudentProfile(editModal.student!.id, { name, admissionNumber, email });
                            setNotification({ isOpen: true, title: "SUCCESS", message: "Personnel file updated.", severity: "info" });
                            setEditModal(null);
                        } catch (e) {
                            setNotification({ isOpen: true, title: "ERROR", message: "Failed to update profile.", severity: "danger" });
                        } finally {
                            setIsSubmitting(false);
                        }
                    }} className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-1">Full Name</label>
                            <input name="name" defaultValue={editModal.student.name} className="w-full bg-black border border-zinc-800 p-2 text-white font-bold" required />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-1">Admission ID</label>
                            <input name="admissionNumber" defaultValue={editModal.student.admissionNumber} className="w-full bg-black border border-zinc-800 p-2 text-white font-bold" />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-1">Email</label>
                            <input name="email" defaultValue={editModal.student.email} className="w-full bg-black border border-zinc-800 p-2 text-white font-bold" required type="email" />
                        </div>
                        <button disabled={isSubmitting} className="w-full bg-primary text-white py-3 font-black uppercase tracking-widest hover:bg-red-700 transition-colors">
                            {isSubmitting ? "Updating..." : "Save Changes"}
                        </button>
                    </form>
                </TacticalModal>
            )}

            {/* Password Modal */}
            {passwordModal && (
                <TacticalModal
                    isOpen={passwordModal.isOpen}
                    onClose={() => setPasswordModal(null)}
                    title="RESET ACCESS CODES"
                    severity="warning"
                >
                    <form action={async (formData) => {
                        setIsSubmitting(true);
                        try {
                            const password = formData.get('password') as string;
                            await updateStudentPassword(passwordModal.studentId, password);
                            setNotification({ isOpen: true, title: "SUCCESS", message: "Password updated successfully.", severity: "info" });
                            setPasswordModal(null);
                        } catch (e) {
                            setNotification({ isOpen: true, title: "ERROR", message: "Failed to update password.", severity: "danger" });
                        } finally {
                            setIsSubmitting(false);
                        }
                    }} className="space-y-4">
                        <p className="text-zinc-500 text-xs">Resetting password for <span className="text-white font-bold">{passwordModal.studentName}</span>.</p>
                        <div>
                            <label className="block text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-1">New Password</label>
                            <input name="password" type="text" className="w-full bg-black border border-zinc-800 p-2 text-white font-bold" required minLength={6} placeholder="Enter new password" />
                        </div>
                        <button disabled={isSubmitting} className="w-full bg-primary text-white py-3 font-black uppercase tracking-widest hover:bg-red-700 transition-colors">
                            {isSubmitting ? "Processing..." : "Update Password"}
                        </button>
                    </form>
                </TacticalModal>
            )}

            {/* Class Assignment Modal */}
            {classModal && (
                <TacticalModal
                    isOpen={classModal.isOpen}
                    onClose={() => setClassModal(null)}
                    title="REASSIGN DEPLOYMENT"
                    severity="info"
                >
                     <ClassAssignmentForm 
                        studentId={classModal.studentId} 
                        currentClass={classModal.currentClass} 
                        onClose={() => setClassModal(null)}
                        onSuccess={() => setNotification({ isOpen: true, title: "SUCCESS", message: "Class assigned.", severity: "info" })}
                    />
                </TacticalModal>
            )}

            {/* Status Change Confirmation Modal */}
            {statusModal && (
                <TacticalModal
                    isOpen={statusModal.isOpen}
                    onClose={() => setStatusModal(null)}
                    title={statusModal.currentStatus ? "DEACTIVATE PERSONNEL" : "REACTIVATE PERSONNEL"}
                    severity={statusModal.currentStatus ? "danger" : "info"}
                >
                    <div className="space-y-6">
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            You are about to {statusModal.currentStatus ? 'deactivate' : 'reactivate'} <span className="text-white font-bold">{statusModal.studentName}</span>.
                        </p>
                        <p className="text-zinc-500 text-xs italic">
                            {statusModal.currentStatus
                                ? "This will remove them from active rosters and attendance tracking."
                                : "This will restore their access to all dojo systems."}
                        </p>
                        <div className="flex gap-3 justify-end pt-4 border-t border-zinc-800">
                            <button
                                onClick={() => setStatusModal(null)}
                                className="px-6 py-2.5 bg-zinc-800 text-zinc-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
                            >
                                Abort
                            </button>
                            <button
                                onClick={handleDeactivateConfirm}
                                disabled={isSubmitting}
                                className={`px-6 py-2.5 text-white text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 ${statusModal.currentStatus ? 'bg-primary hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                                    }`}
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </TacticalModal>
            )}

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

function ClassAssignmentForm({ studentId, currentClass, onClose, onSuccess }: { studentId: string, currentClass: string, onClose: () => void, onSuccess: () => void }) {
    const [classes, setClasses] = useState<{ id: string, name: string, day: string, time: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetch('/api/schedules')
            .then(res => res.json())
            .then(data => {
                setClasses(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            await assignStudentClass(studentId, formData.get('classId') as string);
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>;

    return (
        <form action={handleSubmit} className="space-y-4">
             <p className="text-zinc-500 text-xs">Assigning class for personnel.</p>
             <div className="space-y-2 max-h-60 overflow-y-auto">
                {classes.map(c => (
                    <label key={c.id} className="flex items-center justify-between p-3 border border-zinc-800 bg-black hover:border-primary/50 cursor-pointer transition-colors group">
                        <div className="flex items-center gap-3">
                            <input type="radio" name="classId" value={c.id} defaultChecked={c.name === currentClass} className="accent-primary" />
                            <div>
                                <div className="text-xs font-black uppercase text-white group-hover:text-primary transition-colors">{c.name}</div>
                                <div className="text-[10px] text-zinc-500 font-bold">{c.day} @ {c.time}</div>
                            </div>
                        </div>
                    </label>
                ))}
                <label className="flex items-center justify-between p-3 border border-zinc-800 bg-black hover:border-zinc-700 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <input type="radio" name="classId" value="none" defaultChecked={!currentClass} className="accent-zinc-500" />
                        <span className="text-xs font-bold text-zinc-500 uppercase">Unassigned / No Class</span>
                    </div>
                </label>
             </div>
             <button disabled={isSubmitting} className="w-full bg-primary text-white py-3 font-black uppercase tracking-widest hover:bg-red-700 transition-colors">
                {isSubmitting ? "Assigning..." : "Confirm Assignment"}
            </button>
        </form>
    );
}

