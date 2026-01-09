import React from 'react';
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
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { DataExport } from '@/components/admin/DataExport';
import { auth } from '@/auth';

export default async function AdminDashboard() {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';

    // Fetch stats
    const [
        studentCount,
        activeExamsCount,
        pendingAppsCount,
        totalPromotions,
        newsCount,
        galleryCount
    ] = await Promise.all([
        prisma.studentProfile.count(),
        prisma.examTemplate.count({ where: { isActive: true } }),
        prisma.examApplication.count({ where: { status: "PENDING" } }),
        prisma.studentPromotion.count(),
        prisma.post.count(),
        prisma.galleryItem.count()
    ]);

    // Fetch recent items for previews
    const [ongoingApplications, latestNews, latestGallery, classSchedules] = await Promise.all([
        prisma.examApplication.findMany({
            where: { status: "PENDING" },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                student: { include: { user: true } },
                template: true
            }
        }),
        prisma.post.findFirst({ orderBy: { createdAt: 'desc' } }),
        prisma.galleryItem.findFirst({ orderBy: { createdAt: 'desc' } }),
        prisma.classSchedule.findMany({
            include: { _count: { select: { students: true } } }
        })
    ]);

    const exportData = ongoingApplications.map((app: any) => ({
        ID: app.id,
        Student: app.student.user.name,
        Exam: app.template.title,
        Status: app.status,
        Payment: app.paymentStatus,
        Date: app.createdAt.toLocaleDateString()
    }));

    const stats = [
        { label: "Total Students", value: studentCount, icon: Users, trend: "+4% from last month", color: "text-blue-500" },
        { label: "Pending Apps", value: pendingAppsCount, icon: FileText, trend: "Requires review", color: "text-rose-500" },
        { label: "News Intel", value: newsCount, icon: PenTool, trend: "Published updates", color: "text-amber-500" },
        { label: "Visual Intel", value: galleryCount, icon: ImageIcon, trend: "Gallery items", color: "text-emerald-500" },
    ];

    return (
        <div className="p-4 md:p-8 space-y-12 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-heading font-black uppercase tracking-tighter text-white">HQ <span className="text-primary italic">Dashboard</span></h1>
                    <p className="text-zinc-500 mt-2 font-medium">Strategic overview and school management.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/attendance" className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:border-primary transition-all flex items-center gap-2">
                        Attendance Command <Clock size={16} />
                    </Link>
                    <Link href="/admin/exams" className="bg-primary text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2">
                        Forge New Exam <ArrowUpRight size={16} />
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 space-y-4 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center justify-between">
                            <stat.icon className={`${stat.color}`} size={24} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{stat.trend}</span>
                        </div>
                        <div>
                            <div className="text-3xl font-heading font-black text-white">{stat.value}</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-1">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                            <span className="h-px w-8 bg-zinc-800"></span>
                            Ongoing Applications
                        </h2>
                        <DataExport
                            data={exportData}
                            filename="karate_iks_pending_applications"
                            columns={['Student', 'Exam', 'Status', 'Payment', 'Date']}
                            title="Pending Exam Applications Report"
                        />
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-black/20">
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Student</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Exam</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {ongoingApplications.map((app: any) => (
                                    <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="text-xs font-bold text-white">{app.student.user.name}</div>
                                            <div className="text-[10px] text-zinc-600 uppercase font-black">{app.student.user.email}</div>
                                        </td>
                                        <td className="p-4 text-xs font-medium text-zinc-400">{app.template.title}</td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter bg-amber-500/10 text-amber-500`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/exams/review?id=${app.id}`} className="text-primary hover:underline text-[10px] font-black uppercase tracking-widest bg-zinc-800 px-3 py-1 border border-zinc-700 rounded-sm">
                                                Review
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {ongoingApplications.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-xs text-zinc-600 italic">No pending applications at HQ.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Class Density Widget */}
                    <div className="space-y-6">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                            <span className="h-px w-8 bg-zinc-800"></span>
                            Class Density Intel
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {classSchedules.map((schedule: any) => {
                                const percentage = Math.round((schedule._count.students / schedule.capacity) * 100);
                                return (
                                    <div key={schedule.id} className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-xs font-black uppercase text-white tracking-widest">{schedule.name}</h4>
                                                <p className="text-[10px] text-zinc-600 font-bold uppercase">{schedule.day} @ {schedule.time}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-heading font-black text-white">{schedule._count.students}</div>
                                                <div className="text-[10px] text-zinc-600 uppercase font-black">/ {schedule.capacity}</div>
                                            </div>
                                        </div>
                                        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-amber-500' : 'bg-primary'}`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dojo Intel Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                <PenTool size={14} /> Latest News Post
                            </h3>
                            {latestNews ? (
                                <div className="space-y-2">
                                    <div className="text-lg font-heading font-black text-white line-clamp-1">{latestNews.title}</div>
                                    <p className="text-xs text-zinc-500 line-clamp-2">{latestNews.content}</p>
                                    <Link href="/admin/content/news" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline block pt-2">Manage News</Link>
                                </div>
                            ) : (
                                <p className="text-xs italic text-zinc-600">No news posted yet.</p>
                            )}
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                <ImageIcon size={14} /> Latest Gallery Intel
                            </h3>
                            {latestGallery ? (
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-black border border-zinc-800 overflow-hidden flex-shrink-0">
                                        <img src={latestGallery.url} alt="Latest" className="w-full h-full object-cover opacity-80" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-white line-clamp-1">{latestGallery.caption || "Untagged Visual"}</p>
                                        <p className="text-[10px] text-zinc-600 uppercase font-black">{latestGallery.category}</p>
                                        <Link href="/admin/content/gallery" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline block">View Gallery</Link>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs italic text-zinc-600">No images archived yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar area */}
                <div className="space-y-8">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                        Quick Ops
                        <span className="h-px flex-1 bg-zinc-800"></span>
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        <Link href="/admin/students" className="p-4 bg-zinc-900 border border-zinc-800 flex items-center gap-4 hover:border-primary transition-all group">
                            <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                                <Users size={20} />
                            </div>
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest text-white">Student Roster</div>
                                <div className="text-[10px] text-zinc-600 font-medium">Manage belt ranks & profiles</div>
                            </div>
                        </Link>

                        <Link href="/admin/students/achievements" className="p-4 bg-zinc-900 border border-zinc-800 flex items-center gap-4 hover:border-primary transition-all group">
                            <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest text-white">Attribute Honors</div>
                                <div className="text-[10px] text-zinc-600 font-medium">Awards & Tournament victories</div>
                            </div>
                        </Link>

                        <Link href="/admin/content/news" className="p-4 bg-zinc-900 border border-zinc-800 flex items-center gap-4 hover:border-primary transition-all group">
                            <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                                <PenTool size={20} />
                            </div>
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest text-white">Dojo News</div>
                                <div className="text-[10px] text-zinc-600 font-medium">Publish updates & notices</div>
                            </div>
                        </Link>

                        <Link href="/admin/content/gallery" className="p-4 bg-zinc-900 border border-zinc-800 flex items-center gap-4 hover:border-primary transition-all group">
                            <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                                <ImageIcon size={20} />
                            </div>
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest text-white">Visual Archives</div>
                                <div className="text-[10px] text-zinc-600 font-medium">Manage library & featured shots</div>
                            </div>
                        </Link>

                        {/* Staff Management - ADMIN ONLY */}
                        {isAdmin && (
                            <Link href="/admin/staff" className="p-4 bg-zinc-900 border border-zinc-800 flex items-center gap-4 hover:border-primary transition-all group">
                                <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <div className="text-xs font-black uppercase tracking-widest text-white">Staff Management</div>
                                    <div className="text-[10px] text-zinc-600 font-medium">Recruit & manage Sensei personnel</div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
