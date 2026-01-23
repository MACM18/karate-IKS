"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  Calendar,
  CheckCircle,
  Shield,
  Loader2,
  Check,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AttendanceManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [presentStudentIds, setPresentStudentIds] = useState<Set<string>>(
    new Set(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    // Fetch schedules
    fetch("/api/schedules")
      .then((res) => res.json())
      .then((data) => setSchedules(data))
      .catch(() => setSchedules([]));

    // Fetch active students
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data.filter((s: any) => s.isActive)))
      .catch(() => setStudents([]));
  }, []);

  // Fetch daily attendance whenever date changes
  useEffect(() => {
    fetchDailyAttendance();
  }, [attendanceDate]);

  const fetchDailyAttendance = async () => {
    try {
      const res = await fetch(`/api/attendance?date=${attendanceDate}`);
      if (res.ok) {
        const data = await res.json();
        const ids = new Set(data.map((d: any) => d.studentId));
        setPresentStudentIds(ids as Set<string>);
      }
    } catch (error) {
      console.error("Failed to fetch daily attendance", error);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.admissionNumber &&
        s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass = selectedClass ? s.classId === selectedClass : true;
    return matchesSearch && matchesClass;
  });

  const markAttendance = async (studentId: string) => {
    setLoadingIds((prev) => new Set(prev).add(studentId));
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          date: attendanceDate,
          classType:
            schedules.find((s) => s.id === selectedClass)?.name || "General",
        }),
      });

      if (res.ok) {
        setPresentStudentIds((prev) => new Set(prev).add(studentId));
        setMessage({
          type: "success",
          text: "Presence confirmed.",
        });
      } else {
        const error = await res.json();
        if (res.status === 409) {
          setPresentStudentIds((prev) => new Set(prev).add(studentId));
        } else {
          throw new Error(error.error || "Failed");
        }
      }
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to record attendance." });
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(studentId);
        return next;
      });
    }
  };

  const removeAttendance = async (studentId: string) => {
    if (!confirm("Revoke attendance for this date?")) return;
    setLoadingIds((prev) => new Set(prev).add(studentId));
    try {
      const res = await fetch(
        `/api/attendance?studentId=${studentId}&date=${attendanceDate}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        setPresentStudentIds((prev) => {
          const next = new Set(prev);
          next.delete(studentId);
          return next;
        });
        setMessage({
          type: "success",
          text: "Attendance record revoked.",
        });
      } else {
        throw new Error("Failed");
      }
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to revoke attendance." });
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(studentId);
        return next;
      });
    }
  };

  const markBatch = async () => {
    if (!selectedClass) return;
    setIsSubmitting(true);
    try {
      const promises = filteredStudents
        .filter((s) => !presentStudentIds.has(s.id))
        .map((s) =>
          fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentId: s.id,
              date: attendanceDate,
              classType:
                schedules.find((sc) => sc.id === selectedClass)?.name ||
                "General",
            }),
          }),
        );
      await Promise.all(promises);
      await fetchDailyAttendance();
      setMessage({
        type: "success",
        text: `Unit deployment confirmed.`,
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Batch operation failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='p-8 space-y-8 animate-in fade-in duration-500'>
      <header className='flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-900'>
        <div>
          <h1 className='text-4xl font-heading font-black uppercase tracking-tighter text-white'>
            Attendance <span className='text-primary italic'>Command</span>
          </h1>
          <p className='text-zinc-500 mt-2 font-medium'>
            Tactical check-ins and roster management.
          </p>
        </div>
      </header>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 right-8 z-50 p-4 border font-black uppercase tracking-widest text-xs shadow-2xl ${
              message.type === "success"
                ? "bg-emerald-950/90 border-emerald-500 text-emerald-400"
                : "bg-red-950/90 border-red-500 text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className='inline-block mr-2 h-4 w-4' />
            ) : null}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        {/* Controls Sidebar */}
        <aside className='lg:col-span-1 space-y-8'>
          <div className='bg-zinc-900 border border-zinc-800 p-6 space-y-6'>
            <div className='space-y-4'>
              <label className='text-[10px] uppercase font-black tracking-widest text-zinc-500'>
                Deployment Date
              </label>
              <div className='relative'>
                <Calendar
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600'
                  size={14}
                />
                <input
                  type='date'
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className='w-full bg-black border border-zinc-800 py-3 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:border-primary transition-all uppercase'
                />
              </div>
            </div>

            <div className='space-y-4'>
              <label className='text-[10px] uppercase font-black tracking-widest text-zinc-500'>
                Filter By Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className='w-full bg-black border border-zinc-800 py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-primary transition-all uppercase'
              >
                <option value=''>ALL ACTIVE PERSONNEL</option>
                {schedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {selectedClass && filteredStudents.length > 0 && (
              <button
                onClick={markBatch}
                disabled={isSubmitting}
                className='w-full bg-primary text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all disabled:opacity-50 skew-x-[-12deg] shadow-lg hover:shadow-primary/20'
              >
                <span className='skew-x-[12deg]'>Mark List Present</span>
              </button>
            )}
          </div>

          <div className='bg-zinc-900/50 border border-zinc-800 p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Users size={16} className='text-zinc-500' />
              <h3 className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>
                Roster Intel
              </h3>
            </div>
            <div className='text-3xl font-heading font-black text-white'>
              {filteredStudents.length}
            </div>
            <p className='text-[10px] text-zinc-600 font-bold uppercase tracking-widest'>
              Active personnel in view
            </p>
          </div>
        </aside>

        {/* Main Roster Area */}
        <div className='lg:col-span-3 space-y-6'>
          <div className='relative group'>
            <Search
              className='absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors'
              size={18}
            />
            <input
              type='text'
              placeholder='SEARCH PERSONNEL...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full bg-zinc-900 border border-zinc-800 py-5 pl-14 pr-6 text-sm font-bold text-white focus:outline-none focus:border-primary transition-all placeholder:text-zinc-700 uppercase tracking-wider'
            />
          </div>

          <div className='bg-zinc-900 border border-zinc-800'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='border-b border-zinc-800 bg-black/40'>
                  <th className='p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-6'>
                    Personnel
                  </th>
                  <th className='p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center'>
                    Current Rank
                  </th>
                  <th className='p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right pr-6'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-zinc-800/50'>
                {filteredStudents.map((student) => {
                  const isPresent = presentStudentIds.has(student.id);
                  const isLoading = loadingIds.has(student.id);

                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors group ${
                        isPresent
                          ? "bg-emerald-950/10 hover:bg-emerald-950/20"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <td className='p-4 pl-6'>
                        <div className='flex items-center gap-4'>
                          <div className='w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center text-zinc-700 group-hover:text-primary transition-colors'>
                            <Shield size={16} />
                          </div>
                          <div>
                            <div className='text-sm font-bold text-white group-hover:text-primary transition-colors uppercase'>
                              {student.user.name}
                            </div>
                            <div className='text-[10px] text-zinc-600 uppercase font-black tracking-widest'>
                              {student.admissionNumber || "NO ID"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='p-4 text-center'>
                        <div className='inline-flex flex-col items-center'>
                          <span
                            className='w-8 h-1 rounded-full mb-1'
                            style={{
                              backgroundColor:
                                student.currentRank?.colorCode || "#fff",
                            }}
                          />
                          <span className='text-[9px] text-zinc-500 font-black uppercase tracking-tighter'>
                            {student.currentRank?.name || "White"}
                          </span>
                        </div>
                      </td>
                      <td className='p-4 text-right pr-6'>
                        {isPresent ? (
                          <div className='flex items-center justify-end gap-3'>
                            <span className='text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-3 py-1.5 bg-emerald-950/30 border border-emerald-900/50 rounded'>
                              <Check size={12} strokeWidth={4} /> Present
                            </span>
                            <button
                              onClick={() => removeAttendance(student.id)}
                              disabled={isLoading}
                              className='p-2 text-zinc-600 hover:text-red-500 hover:bg-red-950/30 rounded transition-all'
                              title='Revoke Attendance'
                            >
                              {isLoading ? (
                                <Loader2 size={14} className='animate-spin' />
                              ) : (
                                <RotateCcw size={14} />
                              )}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => markAttendance(student.id)}
                            disabled={isLoading}
                            className='border border-zinc-700 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white text-zinc-400 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2 disabled:opacity-50'
                          >
                            {isLoading ? (
                              <Loader2 size={12} className='animate-spin' />
                            ) : (
                              "Report Present"
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className='p-12 text-center text-zinc-600 italic font-medium'
                    >
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
