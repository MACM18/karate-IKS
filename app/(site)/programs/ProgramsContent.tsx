"use client";

import { motion } from "framer-motion";
import {
  User,
  Users,
  Zap,
  Target,
  Shield,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ScheduleItem {
  id: string;
  name: string;
  day: string;
  time: string;
}

interface Program {
  id: string;
  title: string;
  ageGroup: string;
  description: string;
  benefits: string[];
  color: string | null;
  icon: string | null;
  featured: boolean;
}

interface ProgramsContentProps {
  schedule: ScheduleItem[];
  programs: Program[];
}

// Icon mapper
const IconMap: Record<string, any> = {
  shield: Shield,
  target: Target,
  zap: Zap,
  flame: Flame,
  users: Users,
  award: Award,
};

const GradientMap: Record<string, string> = {
  blue: "from-blue-500/10",
  red: "from-red-500/10",
  amber: "from-amber-500/10",
  emerald: "from-emerald-500/10",
  purple: "from-purple-500/10",
  primary: "from-primary/10",
  orange: "from-orange-500/10",
  zinc: "from-zinc-500/10",
};

const TextColorMap: Record<string, string> = {
  blue: "text-blue-500",
  red: "text-red-500",
  amber: "text-amber-500",
  emerald: "text-emerald-500",
  purple: "text-purple-500",
  primary: "text-primary",
  orange: "text-orange-500",
  zinc: "text-zinc-500",
};

export default function ProgramsContent({
  schedule,
  programs,
}: ProgramsContentProps) {
  // Helper to sort days
  const dayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };
  const sortedSchedule = [...schedule].sort((a, b) => {
    // @ts-ignore
    return (dayOrder[a.day] || 10) - (dayOrder[b.day] || 10);
  });

  return (
    <div className='min-h-screen bg-background pb-24'>
      {/* Programs Hero */}
      <section className='relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-black/70 z-10' />
          <Image
            src='https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=2000&auto=format&fit=crop'
            alt='Karate Class'
            fill
            className='object-cover'
          />
        </div>

        <div className='container mx-auto px-4 relative z-20 text-center'>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-5xl md:text-7xl lg:text-8xl font-heading font-black uppercase text-white leading-none tracking-tighter'
          >
            Master the <br />
            <span className='text-primary italic'>Curriculum</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='text-muted-foreground text-lg max-w-2xl mx-auto mt-6 uppercase tracking-widest font-bold'
          >
            Classes designed for every age and skill level.
          </motion.p>
        </div>
      </section>

      <div className='container mx-auto px-4 lg:px-8 mt-24'>
        {/* Program Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-32'>
          {programs.map((program, i) => {
            const Icon =
              IconMap[program.icon?.toLowerCase() || "shield"] || Shield;
            const colorKey = program.color || "zinc";
            const colorClass = GradientMap[colorKey] || GradientMap["zinc"];
            const accentClass = TextColorMap[colorKey] || TextColorMap["zinc"];

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group relative bg-muted/20 border border-border rounded-lg overflow-hidden flex flex-col p-10 transition-all duration-500 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-b ${colorClass} to-transparent`}
              >
                <div className='mb-8'>
                  <Icon className={`w-12 h-12 ${accentClass} mb-6`} />
                  <h2 className='text-3xl font-heading font-black uppercase text-foreground mb-2 leading-tight'>
                    {program.title}
                  </h2>
                  <p className='text-xs font-black uppercase tracking-[0.2em] text-muted-foreground'>
                    {program.ageGroup}
                  </p>
                </div>

                <p className='text-muted-foreground leading-relaxed mb-8'>
                  {program.description}
                </p>

                <ul className='space-y-3 mb-12 flex-grow'>
                  {program.benefits.map((benefit, j) => (
                    <li
                      key={j}
                      className='flex items-center gap-3 text-sm font-bold text-foreground/80'
                    >
                      <CheckCircle2 size={16} className={accentClass} />{" "}
                      {benefit}
                    </li>
                  ))}
                </ul>

                <Link
                  href='/join'
                  className={`block w-full py-4 text-center font-black uppercase tracking-widest text-xs border border-border hover:bg-foreground hover:text-background transition-colors ${
                    program.featured
                      ? "bg-primary text-white border-primary hover:bg-red-700"
                      : ""
                  }`}
                >
                  Start Training
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Schedule Section */}
        {sortedSchedule.length > 0 && (
          <section className='bg-muted/5 border border-border p-12 rounded-2xl relative overflow-hidden'>
            <div className='absolute top-0 right-0 p-12 opacity-5 rotate-12'>
              <Calendar size={200} />
            </div>

            <div className='relative z-10'>
              <div className='flex items-center gap-4 mb-12'>
                <div className='p-4 bg-primary/10 text-primary rounded-lg'>
                  <Calendar size={32} />
                </div>
                <div>
                  <h2 className='text-4xl font-heading font-black uppercase tracking-tight text-foreground'>
                    Weekly <span className='text-primary italic'>Schedule</span>
                  </h2>
                  <p className='text-muted-foreground font-bold uppercase tracking-widest text-xs mt-1'>
                    Current Training Times
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {sortedSchedule.map((slot) => (
                  <div
                    key={slot.id}
                    className='bg-background border border-border p-6 flex items-start justify-between group hover:border-primary transition-colors'
                  >
                    <div>
                      <p className='text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2'>
                        {slot.day}
                      </p>
                      <h3 className='text-xl font-heading font-bold uppercase text-foreground'>
                        {slot.name}
                      </h3>
                    </div>
                    <div className='px-3 py-1 bg-muted rounded text-sm font-bold tabular-nums'>
                      {slot.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Training Philosophy Section */}
        <section className='mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div>
            <span className='text-primary font-heading font-bold uppercase tracking-[0.3em] text-sm mb-4 block'>
              Our Methodology
            </span>
            <h2 className='text-4xl md:text-6xl font-heading font-black uppercase tracking-tight text-foreground leading-[0.9] mb-8'>
              Beyond <span className='text-primary italic'>Technique</span>
            </h2>
            <div className='space-y-6 text-muted-foreground leading-relaxed text-lg'>
              <p>
                At Karate IKS, we believe that true martial arts training is a
                triangle: the physical, the mental, and the spiritual. One
                cannot exist without the others.
              </p>
              <p>
                Our curriculum is meticulously structured to ensure steady
                progress, from the fundamental kihon (basics) to the complex
                bunkai (applications) of advanced Shito-Ryu kata.
              </p>
            </div>

            <div className='grid grid-cols-2 gap-6 mt-12'>
              <div className='space-y-2'>
                <h4 className='text-foreground font-heading font-bold uppercase tracking-widest text-sm'>
                  Traditional Kata
                </h4>
                <p className='text-xs text-muted-foreground'>
                  Preserving the classical patterns of the Shinbukan lineage.
                </p>
              </div>
              <div className='space-y-2'>
                <h4 className='text-foreground font-heading font-bold uppercase tracking-widest text-sm'>
                  Elite Kumite
                </h4>
                <p className='text-xs text-muted-foreground'>
                  Dynamic sparring techniques for timing and distance mastery.
                </p>
              </div>
            </div>
          </div>

          <div className='relative aspect-video lg:aspect-square bg-muted/30 border border-border group overflow-hidden skew-x-[-2deg]'>
            <Image
              src='https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=800&auto=format&fit=crop'
              alt='Karate Philosophy'
              fill
              className='object-cover grayscale group-hover:grayscale-0 transition-all duration-700 skew-x-[2deg]'
            />
            <div className='absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500' />
          </div>
        </section>
      </div>
    </div>
  );
}
