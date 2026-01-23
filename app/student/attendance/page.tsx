import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AttendanceClient } from "./AttendanceClient";

export default async function AttendancePage() {
    const session = await auth();
    if (!session || !session.user) redirect("/login");

    const profile = await prisma.studentProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            attendance: {
                orderBy: { date: 'desc' }
            }
        }
    });

    if (!profile) return <div>Profile not found</div>;

    // Calculate Stats
    const totalClasses = profile.attendance.length;
    const totalHours = totalClasses * 1.5; // Assuming 1.5 hours per class

    // Simple streak calculation: count consecutive days backwards from today
    let streak = 0;
    const attendanceDates = new Set(profile.attendance.map(a => new Date(a.date).toDateString()));
    const today = new Date();

    // For a real dojo, streak might mean "no more than 7 days gap" 
    // but let's do "consecutive training days" for impact
    let checkDate = new Date();
    while (attendanceDates.has(checkDate.toDateString())) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }

    // If not trained today, check from yesterday
    if (streak === 0) {
        checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - 1);
        while (attendanceDates.has(checkDate.toDateString())) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
    }

    const lastClass = profile.attendance[0];

    return (
        <AttendanceClient
            attendance={profile.attendance.map(a => ({
                id: a.id,
                date: a.date.toISOString(),
                type: a.classType
            }))}
            stats={{
                totalClasses,
                totalHours,
                streak,
                lastClass: lastClass ? {
                    date: lastClass.date.toISOString(),
                    type: lastClass.classType
                } : null
            }}
        />
    );
}
