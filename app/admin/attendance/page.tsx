import { AttendanceKiosk } from "@/components/admin/AttendanceKiosk";
import { prisma } from "@/app/lib/prisma";

export default async function AttendancePage() {
    // Fetch all active students
    const profiles = await prisma.studentProfile.findMany({
        include: {
            user: true,
            currentRank: true,
            // Calculate streak in real app later
        },
        orderBy: { user: { name: 'asc' } }
    });

    const students = profiles.map(p => ({
        id: p.userId, // Note: We use User ID for attendance log usually, or StudentProfile ID. Model says studentId refers to Profile.
        // Let's check schema: Attendance.studentId -> StudentProfile.id
        // So we should pass p.id, NOT p.userId for the API if API expects profile ID.
        // Let's check route: AttendanceSchema -> studentId. 
        // We should pass p.id (Profile ID).

        // Wait, CheckInCard usually displays User Name.
        name: p.user.name || "Unknown",
        rank: p.currentRank?.name || "No Rank",
        streak: 0 // Placeholder
    }));

    // Correction: In mapped object above, pass p.id as the ID.
    const mappedStudents = profiles.map(p => ({
        id: p.id,
        name: p.user.name || "Unknown",
        rank: p.currentRank?.name || "No Rank",
        streak: 0
    }));

    return (
        <div className="h-screen">
            <AttendanceKiosk initialStudents={mappedStudents} />
        </div>
    );
}
