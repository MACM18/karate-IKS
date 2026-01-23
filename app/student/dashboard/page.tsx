import { BeltProgress } from "@/components/BeltProgress";
import {
  User,
  Calendar,
  BookOpen,
  Trophy,
  FileText,
  Bell,
  MapPin,
  Phone,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Target,
  Shield,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { ProgressionStats } from "@/components/student/ProgressionStats";
import { decrypt, maskData } from "@/app/lib/encryption";
import { markSelfAttendance } from "@/app/lib/actions";
import CurriculumBoardStyled from "@/components/student/CurriculumBoardStyled";
import SenseiContact from "@/components/student/SenseiContact";
import { Prisma } from "@prisma/client";

type StudentProfileWithData = Prisma.StudentProfileGetPayload<{
  include: {
    user: true;
    currentRank: {
      include: {
        curriculumItems: true;
      };
    };
    attendance: true;
    achievements: true;
    applications: {
      include: { template: true };
    };
    curriculumProgress: true;
  };
}>;

export default async function StudentDashboard() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch Profile with related data
  const profileData = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      currentRank: {
        include: {
          curriculumItems: {
            orderBy: { order: "asc" },
          },
        },
      },
      attendance: {
        orderBy: { date: "desc" },
        take: 50,
      },
      achievements: true,
      applications: {
        include: { template: true },
      },
      curriculumProgress: true,
    },
  });

  if (!profileData) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center p-8'>
        <div className='text-center'>
          <ShieldAlert size={48} className='text-primary mx-auto mb-4' />
          <h1 className='text-2xl font-heading mb-2'>RESTRICTED ACCESS</h1>
          <p className='text-zinc-500'>
            Student credentials required for this area.
          </p>
        </div>
      </div>
    );
  }

  const profile = profileData as StudentProfileWithData;

  // Fetch All Ranks to find progression
  const allRanks = await prisma.rank.findMany({ orderBy: { order: "asc" } });
  const currentRankOrder = profile.currentRank?.order || 0;
  const nextRank = allRanks.find((r) => r.order > currentRankOrder);

  // Fetch Active Exam Templates (Highlight those student hasn't applied for)
  const activeExamsFetch = await prisma.examTemplate.findMany({
    where: {
      isActive: true,
      deadline: { gte: new Date() },
    },
  });

  const appliedTemplateIds = new Set(
    profile.applications.map((a) => a.templateId)
  );
  const availableExams = activeExamsFetch.filter(
    (e) => !appliedTemplateIds.has(e.id)
  );

  // Fetch Dojo Settings for Sensei Contact
  let dojoSettings = await prisma.dojoSettings.findFirst();
  if (!dojoSettings) {
    dojoSettings = {
      id: "default",
      phoneNumbers: [],
      whatsappNumbers: [],
      senseiName: "Sensei",
      senseiEmail: null,
      dojoAddress: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Attendance stats
  const totalClasses = profile.attendance.length;
  const attendanceThisMonth = profile.attendance.filter((a) => {
    const d = new Date(a.date);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const today = new Date();
  const hasAttendedToday = profile.attendance.some((a) => {
    const d = new Date(a.date);
    return d.toDateString() === today.toDateString();
  });

  // Calculate Streak
  const sortedUniqueDates = Array.from(
    new Set(profile.attendance.map((a) => new Date(a.date).toDateString()))
  )
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  if (sortedUniqueDates.length > 0) {
    const latest = sortedUniqueDates[0];
    const todayStart = new Date(today.toDateString());
    // Difference in days (0 if today, 1 if yesterday)
    const diffDays = Math.floor(
      (todayStart.getTime() - latest.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Streak is alive if latest attendance was Today (0) or Yesterday (1)
    if (diffDays <= 1) {
      streak = 1;
      for (let i = 0; i < sortedUniqueDates.length - 1; i++) {
        const current = sortedUniqueDates[i];
        const previous = sortedUniqueDates[i + 1];
        const gap = Math.round(
          (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (gap === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  const beltColor = profile.currentRank?.colorCode || "#ffffff";
  const isBlackBelt = profile.currentRank?.name
    ?.toLowerCase()
    .includes("black");
  const themeColor = isBlackBelt ? "#dc2626" : beltColor;

  // Calculate curriculum proficiency
  const totalCurriculumItems =
    profile.currentRank?.curriculumItems?.length || 0;
  const masteredCurriculumItems =
    profile.curriculumProgress?.filter((p) => p.status === "MASTERED").length ||
    0;
  const proficiencyPercentage =
    totalCurriculumItems > 0
      ? Math.round((masteredCurriculumItems / totalCurriculumItems) * 100)
      : 0;

  // Prepare curriculum data for CurriculumBoardStyled
  const curriculumItems =
    profile.currentRank?.curriculumItems?.map((item) => ({
      ...item,
      progress: profile.curriculumProgress?.find(
        (p) => p.curriculumId === item.id
      ),
    })) || [];

  // Exam availability mapping for locked/unlocked items
  // For now, we'll check if there are active exams. In a real scenario,
  // this would be based on individual student exam announcements
  const examAvailability = curriculumItems
    .filter((item) => item.category === "EXAM")
    .reduce((acc, item) => {
      // Check if there's an active exam for this student's rank
      acc[item.id] = availableExams.length > 0;
      return acc;
    }, {} as Record<string, boolean>);

  // Data Masking for PII
  const maskedPhone = profile.phone
    ? maskData(decrypt(profile.phone))
    : "Not provided";
  const maskedEmergency = profile.emergencyContact
    ? maskData(decrypt(profile.emergencyContact))
    : "Not provided";

  return (
    <div
      className='min-h-screen bg-black text-white'
      style={{
        //@ts-ignore
        "--belt-theme": themeColor,
        "--belt-theme-soft": themeColor + "30",
      }}
    >
      {/* High-Impact Hero Section */}
      <div className='relative h-[45vh] overflow-hidden border-b border-zinc-900'>
        <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10' />
        <div
          className='absolute inset-0 opacity-10 blur-[120px] animate-pulse'
          style={{ backgroundColor: themeColor }}
        />

        <div className='container mx-auto px-4 lg:px-8 h-full flex flex-col justify-end pb-12 relative z-20'>
          <div className='flex flex-col md:flex-row items-end gap-8'>
            <div className='relative group'>
              {/* Profile Image with Belt Border */}
              <Link
                href='/student/settings'
                className='block relative cursor-pointer'
                title='Update Profile Intelligence'
              >
                <div
                  className={`w-36 h-36 md:w-48 md:h-48 overflow-hidden border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-1 ${
                    isBlackBelt
                      ? "animate-pulse shadow-[0_0_60px_rgba(220,38,38,0.4)]"
                      : ""
                  }`}
                  style={{
                    borderColor: themeColor,
                    boxShadow: isBlackBelt
                      ? `0 0 60px rgba(220,38,38,0.4), inset 0 0 30px rgba(220,38,38,0.1)`
                      : `0 0 50px rgba(0,0,0,0.5)`,
                  }}
                >
                  {profile.user.image ? (
                    <img
                      src={profile.user.image}
                      alt={profile.user.name || ""}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700'>
                      <User size={80} />
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white'>
                    <User size={24} className='mb-2' />
                    <span className='text-[10px] font-black uppercase tracking-widest'>
                      Update
                    </span>
                  </div>
                </div>
              </Link>
              {/* Rank Badge */}
              <div
                className='absolute -bottom-3 -right-3 px-4 py-1.5 bg-black border-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl'
                style={{ borderColor: themeColor, color: themeColor }}
              >
                {profile.currentRank?.name || "Student"}
              </div>
              {/* Black Belt Special Badge */}
              {isBlackBelt && (
                <div className='absolute -top-3 -left-3 bg-gradient-to-br from-red-600 via-red-700 to-black border-2 border-red-500 px-3 py-1.5 shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse'>
                  <div className='flex items-center gap-2'>
                    <Shield size={14} className='text-yellow-400' />
                    <span className='text-[9px] font-black uppercase tracking-widest text-yellow-400'>
                      Dan
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className='flex-1 mb-2'>
              <h1 className='text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter leading-none mb-6'>
                {profile.user.name?.split(" ")[0]}{" "}
                <span style={{ color: themeColor }}>
                  {profile.user.name?.split(" ").slice(1).join(" ")}
                </span>
              </h1>
              <div className='flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500'>
                <div className='flex items-center gap-2'>
                  <MapPin size={16} className='text-zinc-600' /> Shito-Ryu
                  Shinbukan HQ
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar size={16} className='text-zinc-600' /> Enrolled{" "}
                  {new Date(profile.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className='flex gap-4 mb-2'>
              {hasAttendedToday ? (
                <div className='px-8 py-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] skew-x-[-12deg] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]'>
                  <span className='skew-x-[12deg] flex items-center gap-2'>
                    <CheckCircle2 size={16} /> Duty Reported
                  </span>
                </div>
              ) : (
                <div className='px-8 py-4 border-2 border-[var(--belt-theme)] text-[var(--belt-theme)] text-[10px] font-black uppercase tracking-[0.3em] skew-x-[-12deg] flex items-center justify-center opacity-80'>
                  <span className='skew-x-[12deg] flex items-center gap-2'>
                    <Zap size={14} /> Check-in Required
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className='container mx-auto px-4 lg:px-8 py-16'>
        {/* Active Alerts / Exams */}
        {availableExams.length > 0 && (
          <section className='mb-16'>
            <div className='relative p-8 border-2 border-[var(--belt-theme)] bg-[var(--belt-theme-soft)] backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700'>
              <div className='absolute -top-4 -right-4 p-4 opacity-5 rotate-12'>
                <Bell size={120} />
              </div>
              <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
                <div className='max-w-2xl text-center md:text-left'>
                  <div className='flex items-center gap-2 text-[var(--belt-theme)] text-[10px] font-black uppercase tracking-[0.3em] mb-4'>
                    <ShieldAlert size={16} /> Strategic Alert
                  </div>
                  <h3 className='text-3xl font-heading font-black uppercase tracking-tight mb-3'>
                    Grading Opportunity Detected
                  </h3>
                  <p className='text-zinc-400 text-sm leading-relaxed font-medium'>
                    The Sensei Council has opened applications for the upcoming
                    grading cycle. This is your chance to advance along the Path
                    of Power. Review your requirements and submit your
                    application before the deadline.
                  </p>
                </div>
                <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
                  {availableExams.map((exam: any) => (
                    <Link
                      key={exam.id}
                      href={`/student/exams`}
                      className='px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all text-center skew-x-[-12deg]'
                    >
                      <span className='skew-x-[12deg] inline-block'>
                        Apply: {exam.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Core Metrics */}
        <section className='mb-16'>
          <h2 className='text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 mb-8 flex items-center gap-4'>
            <span className='whitespace-nowrap italic'>Tactical Overview</span>
            <div className='w-full h-px bg-zinc-800' />
          </h2>
          <ProgressionStats
            attendance={{
              current: attendanceThisMonth,
              required: 12,
              total: totalClasses,
            }}
            streak={streak}
            achievements={profile.achievements.length}
            beltColor={themeColor}
          />
        </section>

        {/* Curriculum Mastery Board */}
        {curriculumItems.length > 0 && (
          <section className='mb-16'>
            <div className='flex items-end justify-between mb-8'>
              <h2 className='text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 flex items-center gap-4'>
                <span className='whitespace-nowrap italic'>
                  Curriculum Mastery
                </span>
                <div className='w-32 h-px bg-zinc-800' />
              </h2>
              <Link
                href='/student/curriculum'
                className='text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-2'
              >
                View All <Target size={14} />
              </Link>
            </div>
            <CurriculumBoardStyled
              rankName={profile.currentRank?.name || "Unknown"}
              rankColor={profile.currentRank?.colorCode || "#ffffff"}
              items={curriculumItems}
              nextRankName={nextRank?.name}
              examAvailability={examAvailability}
            />
          </section>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-16'>
          {/* Progression Path */}
          <div className='lg:col-span-2 space-y-16'>
            <section>
              <div className='flex items-end justify-between mb-10'>
                <h2 className='text-2xl font-heading font-black uppercase tracking-widest border-l-8 border-[var(--belt-theme)] pl-8'>
                  Path of Power
                </h2>
                <div className='text-[10px] font-black text-zinc-500 uppercase tracking-widest'>
                  Rank: {profile.currentRank?.name || "Initiate"}
                </div>
              </div>
              <div className='bg-zinc-900/20 border border-zinc-800/50 p-10'>
                <BeltProgress
                  currentBelt={profile.currentRank?.name || "White"}
                  nextBelt={nextRank?.name || "Dan Candidate"}
                  progress={Math.min(
                    Math.round((totalClasses / 24) * 100),
                    100
                  )}
                  color={themeColor}
                />
              </div>
            </section>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='p-10 bg-zinc-900/20 border border-zinc-800 hover:bg-zinc-900/40 transition-all group border-b-4 border-b-zinc-800 hover:border-b-[var(--belt-theme)] translate-y-0 hover:-translate-y-1'>
                <div className='p-4 bg-zinc-800/50 w-fit mb-8 group-hover:bg-[var(--belt-theme-soft)] group-hover:text-[var(--belt-theme)] transition-colors'>
                  <BookOpen size={32} />
                </div>
                <h3 className='font-heading uppercase text-3xl font-black mb-3'>
                  Curriculum
                </h3>
                <p className='text-sm text-zinc-500 mb-8 leading-relaxed font-medium italic'>
                  Master the Heian Katas and Kihon Kumite required for your
                  current rank phase.
                </p>
                <Link
                  href='/student/curriculum'
                  className='text-[10px] font-black uppercase tracking-[0.2em] text-[var(--belt-theme)] hover:brightness-125 flex items-center gap-2'
                >
                  View Curriculum{" "}
                  <div className='w-10 h-px bg-[var(--belt-theme)] opacity-40' />
                </Link>
              </div>

              <div className='p-10 bg-zinc-900/20 border border-zinc-800 hover:bg-zinc-900/40 transition-all group border-b-4 border-b-zinc-800 hover:border-b-amber-500 translate-y-0 hover:-translate-y-1'>
                <div className='p-4 bg-zinc-800/50 w-fit mb-8 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors'>
                  <Trophy size={32} />
                </div>
                <h3 className='font-heading uppercase text-3xl font-black mb-3'>
                  Honors
                </h3>
                <p className='text-sm text-zinc-500 mb-8 leading-relaxed font-medium italic'>
                  {profile.achievements.length > 0
                    ? `HQ has recorded ${profile.achievements.length} strategic recognitions for your service.`
                    : "Your legacy is yet to be written. Achieve excellence to earn your place here."}
                </p>
                {profile.achievements.length > 0 && (
                  <div className='space-y-3'>
                    {profile.achievements.slice(0, 3).map((a: any) => (
                      <div
                        key={a.id}
                        className='text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-white/5 p-3 flex items-center justify-between border border-zinc-800/50'
                      >
                        <span>★ {a.title}</span>
                        <span className='text-[8px] opacity-40'>
                          {new Date(a.date).getFullYear()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Intelligence (Sidebar) */}
          <aside className='space-y-12'>
            {/* Proficiency Card with Black Belt Special Styling */}
            <div
              className={`p-10 border backdrop-blur-sm ${
                isBlackBelt
                  ? "bg-gradient-to-br from-red-950/40 via-zinc-900/60 to-black border-red-900/50 shadow-[0_0_40px_rgba(220,38,38,0.2)]"
                  : "bg-zinc-900/30 border-zinc-800"
              }`}
            >
              <div className='flex items-center justify-between mb-6'>
                <h3 className='uppercase text-[10px] font-black tracking-[0.3em] text-zinc-500'>
                  Curriculum Mastery
                </h3>
                {isBlackBelt && (
                  <div className='flex items-center gap-2 bg-gradient-to-r from-red-900/50 to-yellow-900/30 border border-red-700/50 px-3 py-1'>
                    <Shield size={12} className='text-yellow-400' />
                    <span className='text-[9px] font-black uppercase tracking-widest text-yellow-400'>
                      Elite
                    </span>
                  </div>
                )}
              </div>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span
                    className='text-sm font-black uppercase tracking-widest'
                    style={{ color: themeColor }}
                  >
                    Proficiency
                  </span>
                  <span
                    className='text-4xl font-heading font-black'
                    style={{ color: themeColor }}
                  >
                    {proficiencyPercentage}%
                  </span>
                </div>
                <div className='h-3 bg-black border border-zinc-800 overflow-hidden'>
                  <div
                    className='h-full transition-all duration-500'
                    style={{
                      width: `${proficiencyPercentage}%`,
                      backgroundColor: themeColor,
                      boxShadow: isBlackBelt
                        ? `0 0 20px ${themeColor}`
                        : "none",
                    }}
                  />
                </div>
                <div className='grid grid-cols-2 gap-3 pt-4'>
                  <div className='bg-black border border-zinc-800 p-3 text-center'>
                    <p
                      className='text-xl font-heading font-black'
                      style={{ color: themeColor }}
                    >
                      {masteredCurriculumItems}
                    </p>
                    <p className='text-[8px] font-black uppercase tracking-widest text-zinc-600 mt-1'>
                      Mastered
                    </p>
                  </div>
                  <div className='bg-black border border-zinc-800 p-3 text-center'>
                    <p className='text-xl font-heading font-black text-zinc-600'>
                      {totalCurriculumItems - masteredCurriculumItems}
                    </p>
                    <p className='text-[8px] font-black uppercase tracking-widest text-zinc-600 mt-1'>
                      Remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-zinc-900/30 p-10 border border-zinc-800 backdrop-blur-sm'>
              <h3 className='text-zinc-500 uppercase text-[10px] font-black tracking-[0.3em] mb-10 flex items-center justify-between'>
                Profile Details <User size={14} className='opacity-20' />
              </h3>
              <div className='space-y-8'>
                <div className='group cursor-default'>
                  <div className='text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1 group-hover:text-[var(--belt-theme)] transition-colors'>
                    Student Name
                  </div>
                  <div className='text-base font-black text-white uppercase tracking-tighter'>
                    {profile.user.name}
                  </div>
                </div>
                <div className='group cursor-default'>
                  <div className='text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1 group-hover:text-[var(--belt-theme)] transition-colors'>
                    Phone Number
                  </div>
                  <div className='text-sm font-bold text-zinc-400 font-mono tracking-tighter bg-black/40 p-2 border border-zinc-800/50'>
                    {maskedPhone}
                  </div>
                </div>
                <div className='group cursor-default'>
                  <div className='text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1 group-hover:text-[var(--belt-theme)] transition-colors'>
                    Emergency Contact
                  </div>
                  <div className='text-sm font-bold text-zinc-400 font-mono tracking-tighter bg-black/40 p-2 border border-zinc-800/50'>
                    {maskedEmergency}
                  </div>
                </div>
                <div className='pt-8 border-t border-zinc-800/50'>
                  <Link
                    href='/student/settings'
                    className='text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all flex items-center gap-2 group'
                  >
                    <Settings
                      size={12}
                      className='group-hover:text-[var(--belt-theme)]'
                    />{" "}
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            <SenseiContact
              senseiName={dojoSettings.senseiName}
              phoneNumbers={dojoSettings.phoneNumbers}
              whatsappNumbers={dojoSettings.whatsappNumbers}
              senseiEmail={dojoSettings.senseiEmail}
              dojoAddress={dojoSettings.dojoAddress}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
