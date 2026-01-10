"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Target, Users, Award, Flame } from "lucide-react";
import { useState } from "react";
import { ProgramModal } from "./ProgramModal";

import Link from "next/link";

interface DBProgram {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  benefits: string[];
  color: string | null;
  icon: string | null;
}

interface ProgramBentoProps {
  programs?: DBProgram[];
}

const IconMap: any = {
  Shield,
  Zap,
  Target,
  Users,
  Award,
  Flame,
};

const ColorClassMap: Record<string, string> = {
  blue: "bg-blue-500/10",
  red: "bg-red-500/10",
  amber: "bg-amber-500/10",
  emerald: "bg-emerald-500/10",
  purple: "bg-purple-500/10",
  primary: "bg-primary/10",
  orange: "bg-orange-500/10",
};

const defaultPrograms = [
  {
    title: "Traditional Shito-Ryu",
    description:
      "Master the foundational kata and bunkai of the Shinbukan lineage.",
    details: [
      "Comprehensive study of Shinbukan Kata lists.",
      "Detailed Bunkai applications for self-defense.",
      "Traditional breathing and power generation techniques.",
      "Rank progression recognized globally.",
    ],
    schedule: "Tue/Thu — 6:30 PM",
    ageGroup: "TEENS & ADULTS",
    icon: Shield,
    size: "md:col-span-2 md:row-span-2",
    color: "bg-primary/10",
    image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Elite Kumite",
    description:
      "Advanced sparring techniques for competition and self-defense.",
    details: [
      "Olympic-style sparring footwork and timing.",
      "High-impact offensive and defensive combinations.",
      "Competition strategy and tactical preparation.",
      "Physical conditioning and agility training.",
    ],
    schedule: "Fri — 7:30 PM",
    ageGroup: "YELLOW BELT & ABOVE",
    icon: Flame,
    size: "md:col-span-1 md:row-span-1",
    color: "bg-orange-500/10",
  },
  {
    title: "Junior Dragons",
    description: "Building confidence and discipline in the next generation.",
    details: [
      "Foundational karate movements for children.",
      "Interactive drills to build focus and coordination.",
      "Character building through dojo etiquette.",
      "Fun yet disciplined learning environment.",
    ],
    schedule: "Mon/Wed — 5:00 PM",
    ageGroup: "AGES 6-12",
    icon: Users,
    size: "md:col-span-1 md:row-span-2",
    color: "bg-blue-500/10",
  },
  {
    title: "Kobudo Martial Arts",
    description: "Traditional Okinawan weapon training.",
    details: [
      "Introduction to Bo, Sai, and Tonfa.",
      "Traditional weapon kata and pair-work.",
      "Historical understanding of Okinawan Kobudo.",
      "Coordination and full-body strength training.",
    ],
    schedule: "Sat — 10:00 AM",
    ageGroup: "ADVANCED STUDENTS",
    icon: Target,
    size: "md:col-span-1 md:row-span-1",
    color: "bg-emerald-500/10",
  },
  {
    title: "Black Belt Excellence",
    description: "The path to mastery and leadership.",
    details: [
      "Preparation for Dan-rank examinations.",
      "Leadership and instructor training modules.",
      "Advanced philosophical and tactical study.",
      "Exclusive seminars with Association masters.",
    ],
    schedule: "Sun — 9:00 AM",
    ageGroup: "BLACK BELT CANDIDATES",
    icon: Award,
    size: "md:col-span-1 md:row-span-1",
    color: "bg-purple-500/10",
  },
];

export function ProgramBento({ programs }: ProgramBentoProps) {
  const defaultLogic =
    programs && programs.length > 0 ? programs : defaultPrograms;
  const finalPrograms = defaultLogic.map((p, index) => {
    // Grid Layout Logic
    let size = "md:col-span-1 md:row-span-1";
    const total = defaultLogic.length;

    // 1 Item: Full width
    if (total === 1) {
      size = "md:col-span-4 md:row-span-2";
    }
    // 2 Items: Split
    else if (total === 2) {
      size = "md:col-span-2 md:row-span-2";
    }
    // 3 Items: 1 Big, 2 Small stacked column? Or 1 Big (2 col), 2 Small (1 col each) => Need 4 cols total
    else if (total === 3) {
      if (index === 0) size = "md:col-span-2 md:row-span-2"; // 2x2
      else size = "md:col-span-1 md:row-span-2"; // 1x2 tall strips
    }
    // 4 Items: 2x2 grid (each 2 cols, 1 row) OR 1 Big, 3 Small?
    else if (total === 4) {
      // 2x2 grid of regular cards
      size = "md:col-span-2 md:row-span-1";
    }
    // 5+ Items: The Bento (Original Logic)
    else {
      if (index === 0) size = "md:col-span-2 md:row-span-2";
      else if (index === 2) size = "md:col-span-1 md:row-span-2";
      else size = "md:col-span-1 md:row-span-1";
    }

    const colorClass = p.color
      ? ColorClassMap[p.color] || ColorClassMap["primary"]
      : ColorClassMap["primary"];

    return {
      ...p,
      details: p.benefits,
      schedule: "Contact for schedule",
      icon: IconMap[p.icon || "Shield"] || Shield,
      size,
      color: colorClass,
      image:
        index === 0
          ? "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop"
          : undefined,
    };
  });

  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  return (
    <section className='py-24 bg-background' id='programs'>
      <div className='container mx-auto px-4 lg:px-8'>
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6'>
          <div className='max-w-2xl'>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-primary font-heading font-bold uppercase tracking-[0.3em] text-sm mb-4 block'
            >
              Our Programs
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='text-4xl md:text-6xl font-heading font-black uppercase tracking-tight text-foreground leading-[0.9]'
            >
              Forging Excellence <br />
              Across All{" "}
              <span className='text-primary italic'>Disciplines</span>
            </motion.h2>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-4'>
          {finalPrograms.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-xl border border-border flex flex-col p-8 transition-all duration-500 hover:shadow-2xl hover:border-primary/50 ${program.size} ${program.color}`}
            >
              <div className='relative z-10 h-full flex flex-col pointer-events-none'>
                <program.icon className='w-10 h-10 text-primary mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12' />
                <h3 className='text-2xl font-heading font-bold uppercase mb-3 text-foreground group-hover:text-primary transition-colors'>
                  {program.title}
                </h3>
                <p className='text-muted-foreground text-sm leading-relaxed max-w-[250px] line-clamp-3'>
                  {program.description}
                </p>

                <div className='mt-auto pt-8 pointer-events-auto'>
                  <Link
                    href='/join'
                    className='text-xs font-black uppercase tracking-widest text-foreground/40 group-hover:text-primary flex items-center gap-2 transition-colors hover:translate-x-1 duration-300'
                  >
                    Join the Dojo <Zap size={12} />
                  </Link>
                </div>
              </div>

              <div className='absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-500'></div>
            </motion.div>
          ))}
        </div>

        <ProgramModal
          isOpen={!!selectedProgram}
          onClose={() => setSelectedProgram(null)}
          program={selectedProgram}
        />
      </div>
    </section>
  );
}
