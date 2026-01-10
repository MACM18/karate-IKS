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
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { ProgressionStats } from "@/components/student/ProgressionStats";
import { decrypt, maskData } from "@/app/lib/encryption";
import { markSelfAttendance } from "@/app/lib/actions";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch Profile with related data
  const profileData = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      currentRank: true,
      attendance: {
        orderBy: { date: "desc" },
        take: 50,
      },
      achievements: true,
      applications: {
        include: { template: true },
      },
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

  // Cast to any to bypass Prisma type lag in editor
  const profile = profileData as any;

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

  const activeExams = activeExamsFetch as any[];
  const appliedTemplateIds = new Set(
    profile.applications.map((a: any) => a.templateId)
  );
  const availableExams = activeExams.filter(
    (e: any) => !appliedTemplateIds.has(e.id)
  );

  // Attendance stats
  const totalClasses = profile.attendance.length;
  const attendanceThisMonth = profile.attendance.filter((a: any) => {
    const d = new Date(a.date);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const today = new Date();
  const hasAttendedToday = profile.attendance.some((a: any) => {
    const d = new Date(a.date);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  const beltColor = profile.currentRank?.colorCode || "#ffffff";
  const isBlackBelt = profile.currentRank?.name
    ?.toLowerCase()
    .includes("black");
  const themeColor = isBlackBelt ? "#dc2626" : beltColor;

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
              <div
                className='w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-black shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-1'
                style={{ borderColor: themeColor }}
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || ""}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700'>
                    <User size={80} />
                  </div>
                )}
              </div>
              <div
                className='absolute -bottom-3 -right-3 px-4 py-1.5 bg-black border-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl'
                style={{ borderColor: themeColor, color: themeColor }}
              >
                {profile.currentRank?.name || "Student"}
              </div>
            </div>

            <div className='flex-1 mb-2'>
              <h1 className='text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter leading-none mb-6'>
                {session.user.name?.split(" ")[0]}{" "}
                <span style={{ color: themeColor }}>
                  {session.user.name?.split(" ").slice(1).join(" ")}
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
                <form
                  action={async () => {
                    "use server";
                    await markSelfAttendance("General Training");
                  }}
                >
                  <button className='px-8 py-4 bg-[var(--belt-theme)] text-white text-[10px] font-black uppercase tracking-[0.3em] skew-x-[-12deg] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all group overflow-hidden relative'>
                    <div className='absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
                    <span className='skew-x-[12deg] inline-block relative z-10 flex items-center gap-2'>
                      <Zap size={14} /> Report for Duty
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className='container mx-auto px-4 lg:px-8 py-16'>
        {/* Active Alerts / Exams */}
        {availableExams.length > 0 && (
          <section className='mb-16'>
            <div className='relative p-8 rounded-2xl border-2 border-[var(--belt-theme)] bg-[var(--belt-theme-soft)] backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700'>
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
            streak={totalClasses > 0 ? 5 : 0}
            achievements={profile.achievements.length}
            beltColor={themeColor}
          />
        </section>

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
              <div className='bg-zinc-900/20 border border-zinc-800/50 p-10 rounded-3xl'>
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
              <div className='p-10 bg-zinc-900/20 border border-zinc-800 rounded-3xl hover:bg-zinc-900/40 transition-all group border-b-4 border-b-zinc-800 hover:border-b-[var(--belt-theme)] translate-y-0 hover:-translate-y-1'>
                <div className='p-4 bg-zinc-800/50 w-fit rounded-2xl mb-8 group-hover:bg-[var(--belt-theme-soft)] group-hover:text-[var(--belt-theme)] transition-colors'>
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
                  href='/student/resources'
                  className='text-[10px] font-black uppercase tracking-[0.2em] text-[var(--belt-theme)] hover:brightness-125 flex items-center gap-2'
                >
                  Open Archives{" "}
                  <div className='w-10 h-px bg-[var(--belt-theme)] opacity-40' />
                </Link>
              </div>

              <div className='p-10 bg-zinc-900/20 border border-zinc-800 rounded-3xl hover:bg-zinc-900/40 transition-all group border-b-4 border-b-zinc-800 hover:border-b-amber-500 translate-y-0 hover:-translate-y-1'>
                <div className='p-4 bg-zinc-800/50 w-fit rounded-2xl mb-8 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors'>
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
                        className='text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-white/5 p-3 rounded-xl flex items-center justify-between border border-zinc-800/50'
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
            <div className='bg-zinc-900/30 p-10 border border-zinc-800 rounded-3xl backdrop-blur-sm'>
              <h3 className='text-zinc-500 uppercase text-[10px] font-black tracking-[0.3em] mb-10 flex items-center justify-between'>
                Security Archive{" "}
                <ShieldAlert size={14} className='opacity-20' />
              </h3>
              <div className='space-y-8'>
                <div className='group cursor-default'>
                  <div className='text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1 group-hover:text-[var(--belt-theme)] transition-colors'>
                    Combat Identity
                  </div>
                  <div className='text-base font-black text-white uppercase tracking-tighter'>
                    {session.user.name}
                  </div>
                </div>
                <div className='group cursor-default'>
                  <div className='text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1 group-hover:text-[var(--belt-theme)] transition-colors'>
                    Encrypted Signal
                  </div>
                  <div className='text-sm font-bold text-zinc-400 font-mono tracking-tighter bg-black/40 p-2 rounded border border-zinc-800/50'>
                    {maskedPhone}
                  </div>
                </div>
                <div className='group cursor-default'>
                  <div className='text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1 group-hover:text-[var(--belt-theme)] transition-colors'>
                    Emergency Bridge
                  </div>
                  <div className='text-sm font-bold text-zinc-400 font-mono tracking-tighter bg-black/40 p-2 rounded border border-zinc-800/50'>
                    {maskedEmergency}
                  </div>
                </div>
                <div className='pt-8 border-t border-zinc-800/50'>
                  <button className='text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all flex items-center gap-2 group'>
                    <User
                      size={12}
                      className='group-hover:text-[var(--belt-theme)]'
                    />{" "}
                    Modify Intelligence Profile
                  </button>
                </div>
              </div>
            </div>

            <div className='p-10 bg-black border border-zinc-800 rounded-3xl relative overflow-hidden group hover:border-[var(--belt-theme)] transition-all'>
              <div className='absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity grayscale group-hover:grayscale-0 group-hover:text-[var(--belt-theme)]'>
                <Phone size={180} />
              </div>
              <h3 className='text-xl font-heading font-black uppercase mb-3 relative z-10 italic'>
                Secure Line
              </h3>
              <p className='text-xs text-zinc-500 leading-relaxed mb-8 relative z-10 font-medium'>
                Encountering structural discrepancies in your progression data?
                Initiate contact with HQ immediately.
              </p>
              <button className='text-[10px] font-black uppercase tracking-[0.2em] text-white bg-zinc-800 px-6 py-3 rounded-xl hover:bg-[var(--belt-theme)] transition-all relative z-10 w-full text-center'>
                Open Comm Channel
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
