import React from "react";
import { prisma } from "@/app/lib/prisma";
import {
  Users,
  FileText,
  CheckCircle,
  TrendingUp,
  Clock,
  Calendar,
  ArrowUpRight,
  Search,
  Trophy,
  Image as ImageIcon,
  PenTool,
  Shield,
  X,
} from "lucide-react";
import {
  approveMemberApplication,
  rejectMemberApplication,
} from "@/app/lib/registration-actions";
import Link from "next/link";
import { DataExport } from "@/components/admin/DataExport";
import { auth } from "@/auth";
import { decrypt } from "@/app/lib/encryption";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  // Fetch stats
  let studentCount = 0;
  let activeExamsCount = 0;
  let pendingAppsCount = 0;
  let totalPromotions = 0;
  let newsCount = 0;
  let galleryCount = 0;
  let pendingMembersCount = 0;

  try {
    const counts = await Promise.all([
      prisma.studentProfile.count(),
      prisma.examTemplate.count({ where: { isActive: true } }),
      prisma.examApplication.count({ where: { status: "PENDING" } }),
      prisma.studentPromotion.count(),
      prisma.post.count(),
      prisma.galleryItem.count(),
      prisma.memberApplication.count({ where: { status: "PENDING" } }),
    ]);
    [
      studentCount,
      activeExamsCount,
      pendingAppsCount,
      totalPromotions,
      newsCount,
      galleryCount,
      pendingMembersCount,
    ] = counts as number[];
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn(
        "Prisma P2021 during admin stats fetch; using placeholder zeros.",
      );
      studentCount = 0;
      activeExamsCount = 0;
      pendingAppsCount = 0;
      totalPromotions = 0;
      newsCount = 0;
      galleryCount = 0;
      pendingMembersCount = 0;
    } else {
      throw err;
    }
  }

  // Fetch recent items for previews
  let ongoingApplications: any[] = [];
  let latestNews: any = null;
  let latestGallery: any = null;
  let classSchedules: any[] = [];
  let pendingMembers: any[] = [];
  try {
    [
      ongoingApplications,
      latestNews,
      latestGallery,
      classSchedules,
      pendingMembers,
    ] = await Promise.all([
      prisma.examApplication.findMany({
        where: { status: "PENDING" },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          student: { include: { user: true } },
          template: true,
        },
      }),
      prisma.post.findFirst({ orderBy: { createdAt: "desc" } }),
      prisma.galleryItem.findFirst({ orderBy: { createdAt: "desc" } }),
      prisma.classSchedule.findMany({
        include: { _count: { select: { students: true } } },
      }),
      prisma.memberApplication.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
      }),
    ]);
  } catch (err: any) {
    if (err?.code === "P2021") {
      console.warn(
        "Prisma P2021 during admin previews fetch; using empty placeholders.",
      );
      ongoingApplications = [];
      latestNews = null;
      latestGallery = null;
      classSchedules = [];
      pendingMembers = [];
    } else {
      throw err;
    }
  }

  const exportData = ongoingApplications.map((app: any) => ({
    ID: app.id,
    Student: app.student.user.name,
    Exam: app.template.title,
    Status: app.status,
    Payment: app.paymentStatus,
    Date: app.createdAt.toLocaleDateString(),
  }));

  const stats = [
    {
      label: "Total Students",
      value: studentCount,
      icon: Users,
      trend: "+4% from last month",
      color: "text-blue-500",
    },
    {
      label: "Pending Exams",
      value: pendingAppsCount,
      icon: FileText,
      trend: "Requires review",
      color: "text-rose-500",
    },
    {
      label: "New Joiners",
      value: pendingMembersCount,
      icon: Shield,
      trend: "Waiting approval",
      color: "text-purple-500",
    },
    {
      label: "Visual Intel",
      value: galleryCount,
      icon: ImageIcon,
      trend: "Gallery items",
      color: "text-emerald-500",
    },
  ];

  return (
    <div className='p-4 md:p-10 space-y-12 w-full'>
      <header className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div>
          <h1 className='text-5xl font-heading font-black uppercase tracking-tighter text-white'>
            HQ <span className='text-primary italic'>Dashboard</span>
          </h1>
          <p className='text-zinc-500 mt-2 font-medium'>
            Strategic overview and school management.
          </p>
        </div>
        <div className='flex gap-4'>
          <Link
            href='/admin/attendance'
            className='bg-zinc-900 border border-zinc-800 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:border-primary transition-all flex items-center gap-2'
          >
            Attendance Command <Clock size={16} />
          </Link>
          <Link
            href='/admin/exams'
            className='bg-primary text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2'
          >
            Forge New Exam <ArrowUpRight size={16} />
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, i) => (
          <div
            key={i}
            className='bg-zinc-900 border border-zinc-800 p-6 space-y-4 hover:border-zinc-700 transition-colors'
          >
            <div className='flex items-center justify-between'>
              <stat.icon className={`${stat.color}`} size={24} />
              <span className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600'>
                {stat.trend}
              </span>
            </div>
            <div>
              <div className='text-3xl font-heading font-black text-white'>
                {stat.value}
              </div>
              <div className='text-xs font-bold uppercase tracking-widest text-zinc-500 mt-1'>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
        {/* Main Content Area */}
        <div className='lg:col-span-2 space-y-8'>
          <div className='bg-zinc-900 border border-zinc-800 p-6 space-y-4'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3'>
                <span className='h-px w-8 bg-zinc-800'></span>
                New Member Request
              </h2>
              <span className='text-[10px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-800 px-2 py-1 rounded-sm'>
                {pendingMembers.length} PENDING
              </span>
            </div>

            <div className='space-y-2'>
              {pendingMembers.map((app: any) => (
                <div
                  key={app.id}
                  className='flex items-center justify-between p-4 bg-black/20 border border-zinc-800 hover:border-zinc-700 transition-colors'
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold uppercase'>
                      {app.name.substring(0, 2)}
                    </div>
                    <div>
                      <div className='text-xs font-bold text-white uppercase'>
                        {app.name}
                      </div>
                      <div className='text-[10px] text-zinc-500 font-mono mb-1'>
                        {app.email}
                      </div>
                      <div className='flex gap-3 text-[10px] text-zinc-600'>
                        {app.phone && (
                          <span title='Phone'>📞 {decrypt(app.phone)}</span>
                        )}
                        {app.dateOfBirth && (
                          <span title='DOB'>
                            🎂 {new Date(app.dateOfBirth).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {app.emergencyContact && (
                        <div className='text-[10px] text-zinc-600 mt-0.5'>
                          🆘 {decrypt(app.emergencyContact)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <form
                      action={async () => {
                        "use server";
                        await approveMemberApplication(app.id);
                      }}
                    >
                      <button className='text-emerald-500 hover:bg-emerald-500/10 p-2 rounded-full transition-colors'>
                        <CheckCircle size={18} />
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await rejectMemberApplication(app.id);
                      }}
                    >
                      <button className='text-rose-500 hover:bg-rose-500/10 p-2 rounded-full transition-colors'>
                        <X size={18} />
                      </button>
                    </form>
                  </div>
                </div>
              ))}

              {pendingMembers.length === 0 && (
                <div className='text-center py-8 text-zinc-600 italic text-xs'>
                  No pending applications. The dojo is quiet.
                </div>
              )}
            </div>
          </div>

          <div className='bg-zinc-900 border border-zinc-800 p-6 space-y-4'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3'>
                <span className='h-px w-8 bg-zinc-800'></span>
                Exam Applications
              </h2>
              <Link
                href='/admin/exams'
                className='text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors'
              >
                View All
              </Link>
            </div>
            <DataExport
              data={exportData}
              filename='exam_applications'
              columns={["ID", "Student", "Exam", "Status", "Payment", "Date"]}
            />
            <div className='overflow-x-auto'>
              <table className='w-full text-left'>
                <thead className='bg-zinc-950/50 text-[10px] uppercase font-black tracking-widest text-zinc-500'>
                  <tr>
                    <th className='p-4'>Student</th>
                    <th className='p-4'>Exam</th>
                    <th className='p-4'>Status</th>
                    <th className='p-4'>Payment</th>
                    <th className='p-4 text-right'>Action</th>
                  </tr>
                </thead>
                <tbody className='divider-y divider-zinc-800'>
                  {ongoingApplications.map((app: any) => (
                    <tr
                      key={app.id}
                      className='border-b border-zinc-800/50 hover:bg-white/5 transition-colors group'
                    >
                      <td className='p-4'>
                        <div className='font-bold text-white text-xs uppercase'>
                          {app.student.user.name}
                        </div>
                        <div className='text-[10px] text-zinc-600'>
                          ID: {app.student.admissionNumber}
                        </div>
                      </td>
                      <td className='p-4'>
                        <div className='text-xs font-medium text-zinc-300'>
                          {app.template.title}
                        </div>
                        <div className='text-[10px] text-zinc-600'>
                          {new Date(app.template.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className='p-4'>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-1 rounded-sm ${
                            app.status === "APPROVED"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : app.status === "REJECTED"
                                ? "bg-rose-500/10 text-rose-500"
                                : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className='p-4'>
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            app.paymentStatus === "PAID"
                              ? "text-emerald-500"
                              : "text-zinc-500"
                          }`}
                        >
                          {app.paymentStatus}
                        </span>
                      </td>
                      <td className='p-4 text-right'>
                        <Link
                          href={`/admin/exams/review/${app.id}`}
                          className='text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all'
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ongoingApplications.length === 0 && (
                <div className='text-center py-8 text-zinc-600 italic text-xs'>
                  No exam applications to review.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className='space-y-8'>
          {/* Class Schedule Quick View */}
          <div className='bg-zinc-900 border border-zinc-800 p-6 space-y-4'>
            <h2 className='text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3'>
              <span className='h-px w-8 bg-zinc-800'></span>
              Training Log
            </h2>
            <div className='space-y-2'>
              {classSchedules.map((schedule: any) => (
                <div
                  key={schedule.id}
                  className='flex items-center justify-between p-3 bg-black/20 border border-zinc-800'
                >
                  <div>
                    <div className='text-xs font-bold text-white uppercase'>
                      {schedule.name}
                    </div>
                    <div className='text-[10px] text-zinc-500'>
                      {schedule.day} @ {schedule.startTime}
                    </div>
                  </div>
                  <div className='text-xs font-bold text-zinc-600'>
                    {schedule._count.students}{" "}
                    <span className='text-[10px] font-normal'>Students</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className='bg-zinc-900 border border-zinc-800 p-6 space-y-4'>
            <h2 className='text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3'>
              <span className='h-px w-8 bg-zinc-800'></span>
              Command Center
            </h2>
            <div className='grid grid-cols-2 gap-4'>
              <Link
                href='/admin/students'
                className='p-4 bg-black/20 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group text-center'
              >
                <Users
                  className='mx-auto mb-2 text-zinc-500 group-hover:text-primary transition-colors'
                  size={20}
                />
                <div className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>
                  Students
                </div>
              </Link>
              <Link
                href='/admin/curriculum'
                className='p-4 bg-black/20 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group text-center'
              >
                <TrendingUp
                  className='mx-auto mb-2 text-zinc-500 group-hover:text-primary transition-colors'
                  size={20}
                />
                <div className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>
                  Curriculum
                </div>
              </Link>
              <Link
                href='/admin/content'
                className='p-4 bg-black/20 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group text-center'
              >
                <PenTool
                  className='mx-auto mb-2 text-zinc-500 group-hover:text-primary transition-colors'
                  size={20}
                />
                <div className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>
                  Content
                </div>
              </Link>
              <Link
                href='/admin/settings'
                className='p-4 bg-black/20 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group text-center'
              >
                <Trophy
                  className='mx-auto mb-2 text-zinc-500 group-hover:text-primary transition-colors'
                  size={20}
                />
                <div className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>
                  Ranks
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
