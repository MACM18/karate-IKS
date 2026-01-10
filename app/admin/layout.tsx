import Link from "next/link";
import {
  Users,
  LayoutDashboard,
  Award,
  Settings,
  LogOut,
  Calendar,
  PenTool,
  FileText,
  Image as ImageIcon,
  Trophy,
  Clock,
  Shield,
  BookOpen,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen bg-black text-white font-sans'>
      {/* Sidebar */}
      <aside className='w-64 border-r border-zinc-900 bg-zinc-950 hidden md:flex flex-col fixed h-full z-30'>
        <div className='p-8 border-b border-zinc-900'>
          <h1 className='text-xl font-heading font-black uppercase tracking-[0.2em] text-white'>
            Sensei <span className='text-primary italic'>Admin</span>
          </h1>
        </div>

        <nav className='flex-1 p-4 space-y-1 overflow-y-auto pt-6'>
          <Link
            href='/admin/dashboard'
            className='flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all group'
          >
            <LayoutDashboard
              size={20}
              className='group-hover:text-primary transition-colors'
            />
            <span className='uppercase text-[10px] font-black tracking-widest'>
              HQ Dashboard
            </span>
          </Link>
          <Link
            href='/admin/students'
            className='flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all group'
          >
            <Users
              size={20}
              className='group-hover:text-primary transition-colors'
            />
            <span className='uppercase text-[10px] font-black tracking-widest'>
              Student Roster
            </span>
          </Link>
          <Link
            href='/admin/attendance'
            className='flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all group'
          >
            <div className='relative'>
              <Calendar
                size={20}
                className='group-hover:text-primary transition-colors'
              />
              <span className='absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse'></span>
            </div>
            <span className='uppercase text-[10px] font-black tracking-widest'>
              Attendance
            </span>
          </Link>
          <Link
            href='/admin/promotions'
            className='flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all group'
          >
            <Award
              size={20}
              className='group-hover:text-primary transition-colors'
            />
            <span className='uppercase text-[10px] font-black tracking-widest'>
              Promotions
            </span>
          </Link>
          <Link
            href='/admin/curriculum'
            className='flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all group'
          >
            <BookOpen
              size={20}
              className='group-hover:text-primary transition-colors'
            />
            <span className='uppercase text-[10px] font-black tracking-widest'>
              Curriculum
            </span>
          </Link>
          <Link
            href='/admin/exams'
            className='flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all group'
          >
            <FileText
              size={20}
              className='group-hover:text-primary transition-colors'
            />
            <span className='uppercase text-[10px] font-black tracking-widest'>
              Exam Forge
            </span>
          </Link>
          <Link
            href='/admin/students/achievements'
            className='flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all group'
          >
            <Trophy
              size={20}
              className='group-hover:text-primary transition-colors'
            />
            <span className='uppercase text-[10px] font-black tracking-widest'>
              Honors Roll
            </span>
          </Link>
          <Link
            href='/admin/schedules'
            className='flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all group'
          >
            <Clock
              size={20}
              className='group-hover:text-primary transition-colors'
            />
            <span className='uppercase text-[10px] font-black tracking-widest'>
              Class Schedules
            </span>
          </Link>{" "}
          <Link
            href='/admin/content/programs'
            className='flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all group'
          >
            <Shield
              size={20}
              className='group-hover:text-primary transition-colors'
            />
            <span className='uppercase text-[10px] font-black tracking-widest'>
              Programs
            </span>
          </Link>
          <div className='pt-8 pb-4'>
            <div className='px-4 text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 italic'>
              Content Ops
            </div>
            <Link
              href='/admin/content/news'
              className='flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all group'
            >
              <PenTool
                size={20}
                className='group-hover:text-primary transition-colors'
              />
              <span className='uppercase text-[10px] font-black tracking-widest'>
                News CMS
              </span>
            </Link>
            <Link
              href='/admin/content/gallery'
              className='flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all group'
            >
              <ImageIcon
                size={20}
                className='group-hover:text-primary transition-colors'
              />
              <span className='uppercase text-[10px] font-black tracking-widest'>
                Gallery
              </span>
            </Link>
          </div>
        </nav>

        <div className='p-6 border-t border-zinc-900 space-y-2'>
          <Link
            href='/'
            className='flex items-center gap-4 px-4 py-3 text-zinc-600 hover:text-white transition-colors group'
          >
            <LayoutDashboard size={18} />
            <span className='uppercase text-[10px] font-black tracking-widest'>
              Return Home
            </span>
          </Link>
          <Link
            href='/api/auth/signout'
            className='flex items-center gap-4 px-4 py-3 text-zinc-600 hover:text-red-500 transition-colors group'
          >
            <LogOut size={18} />
            <span className='uppercase text-[10px] font-black tracking-widest'>
              Sign Out
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className='flex-1 md:pl-64 bg-black'>
        <div className='min-h-screen'>{children}</div>
      </main>
    </div>
  );
}
