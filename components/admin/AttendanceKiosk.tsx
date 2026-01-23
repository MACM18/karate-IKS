"use client";

import { CheckInCard } from "@/components/admin/CheckInCard";
import { Calendar, ChevronRight } from "lucide-react";
import { useState } from "react";
// import { toast } from "sonner"; // Assuming toast exists or use alert

interface Student {
  id: string;
  name: string;
  rank: string;
  streak: number;
}

interface AttendanceKioskProps {
  initialStudents: Student[];
}

export function AttendanceKiosk({ initialStudents }: AttendanceKioskProps) {
  const [selectedClass, setSelectedClass] = useState("Adults");
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckIn = (id: string) => {
    if (!checkedInIds.includes(id)) {
      setCheckedInIds([...checkedInIds, id]);
    }
  };

  const handleSubmit = async () => {
    if (checkedInIds.length === 0) return;
    setIsSubmitting(true);

    // Process sequentially or Promise.all. For robust logging, sequential or batch endpoint is better.
    // We implemented POST /api/attendance for single student.
    // We will call it for each checked in student.

    try {
      const promises = checkedInIds.map((id) =>
        fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: id,
            classType: selectedClass,
          }),
        })
      );

      await Promise.all(promises);
      alert(`Successfully checked in ${checkedInIds.length} students!`);
      setCheckedInIds([]);
      // Optionally refresh or reset states locally (CheckInCard state is local though)
      // Real app would trigger a re-render or context update.
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to submit attendance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='p-8 h-full flex flex-col'>
      <header className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-heading uppercase text-white tracking-widest'>
            Attendance Logger
          </h1>
          <p className='text-zinc-500 mt-1'>
            Tap a student to mark them present.
          </p>
        </div>

        <div className='flex items-center gap-4 bg-zinc-900 p-2 rounded-lg border border-zinc-800'>
          <Calendar className='text-zinc-500 ml-2' size={20} />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className='bg-transparent text-white border-none focus:ring-0 py-2 cursor-pointer font-bold uppercase tracking-wide'
          >
            <option value='Kids'>Kids Class (4:00 PM)</option>
            <option value='Adults'>Adults All Ranks (6:00 PM)</option>
            <option value='Advanced'>Black Belt Club (7:30 PM)</option>
          </select>
          <ChevronRight className='text-zinc-500 mr-2' size={16} />
        </div>
      </header>

      <div className='flex-1 overflow-y-auto'>
        <h2 className='text-zinc-500 uppercase text-xs tracking-widest mb-4'>
          Roster ({initialStudents.length} Students)
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20'>
          {initialStudents.map((student) => (
            <CheckInCard
              key={student.id}
              id={student.id}
              name={student.name}
              rank={student.rank}
              streak={student.streak}
              onCheckIn={handleCheckIn}
            />
          ))}
        </div>
      </div>

      <div className='fixed bottom-8 right-8'>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || checkedInIds.length === 0}
          className='bg-action text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-red-700 transition-colors animate-in slide-in-from-bottom-8 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting ? "Saving..." : `Submit (${checkedInIds.length})`}
        </button>
      </div>
    </div>
  );
}
