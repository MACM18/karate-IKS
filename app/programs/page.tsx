"use client";

import { motion } from "framer-motion";
import { User, Users, Zap, Target, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const programs = [
    {
        title: "Little Ninjas",
        age: "Ages 4 - 7",
        description: "A fun, high-energy introduction to martial arts. We focus on listening skills, balance, coordination, and stranger danger awareness.",
        icon: Shield,
        benefits: ["Listening Skills", "Motor Coordination", "Positive Socialization"],
        color: "from-blue-500/10 to-transparent",
        accent: "text-blue-500"
    },
    {
        title: "Juniors Program",
        age: "Ages 8 - 15",
        description: "Building confidence and discipline. Students learn the full Shito-Ryu curriculum, including Kata, Kumite, and self-defense applications.",
        icon: Target,
        benefits: ["Self-Confidence", "Focus & Discipline", "Athletic Development"],
        color: "from-red-500/10 to-transparent",
        accent: "text-primary",
        featured: true
    },
    {
        title: "Adults & Teens",
        age: "Ages 16+",
        description: "Whether your goal is fitness, self-defense, or black belt excellence, our adult program offers a challenging and supportive environment.",
        icon: Zap,
        benefits: ["Stress Relief", "Practical Self-Defense", "Functional Fitness"],
        color: "from-amber-500/10 to-transparent",
        accent: "text-amber-500"
    }
];

export default function ProgramsPage() {
    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Programs Hero */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/70 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=2000&auto=format&fit=crop"
                        alt="Karate Class"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-20 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-heading font-black uppercase text-white leading-none tracking-tighter"
                    >
                        Master the <br />
                        <span className="text-primary italic">Curriculum</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6 uppercase tracking-widest font-bold"
                    >
                        Classes designed for every age and skill level.
                    </motion.p>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-8 mt-24">
                {/* Program Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {programs.map((program, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`group relative bg-muted/20 border border-border rounded-lg overflow-hidden flex flex-col p-10 transition-all duration-500 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-b ${program.color}`}
                        >
                            <div className="mb-8">
                                <program.icon className={`w-12 h-12 ${program.accent} mb-6`} />
                                <h2 className="text-3xl font-heading font-black uppercase text-foreground mb-2 leading-tight">
                                    {program.title}
                                </h2>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    {program.age}
                                </p>
                            </div>

                            <p className="text-muted-foreground leading-relaxed mb-8">
                                {program.description}
                            </p>

                            <ul className="space-y-3 mb-12 flex-grow">
                                {program.benefits.map((benefit, j) => (
                                    <li key={j} className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground/80">
                                        <CheckCircle2 size={16} className="text-primary" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/join"
                                className={`w-full py-4 text-center font-black uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2 ${program.featured
                                        ? "bg-primary text-white hover:bg-red-700"
                                        : "border border-border text-foreground hover:bg-foreground hover:text-background"
                                    }`}
                            >
                                Enroll Now <ArrowRight size={16} />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Training Philosophy Section */}
                <section className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-primary font-heading font-bold uppercase tracking-[0.3em] text-sm mb-4 block">
                            Our Methodology
                        </span>
                        <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight text-foreground leading-[0.9] mb-8">
                            Beyond <span className="text-primary italic">Technique</span>
                        </h2>
                        <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                            <p>
                                At Karate IKS, we believe that true martial arts training is a triangle: the physical, the mental, and the spiritual. One cannot exist without the others.
                            </p>
                            <p>
                                Our curriculum is meticulously structured to ensure steady progress, from the fundamental kihon (basics) to the complex bunkai (applications) of advanced Shito-Ryu kata.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-12">
                            <div className="space-y-2">
                                <h4 className="text-foreground font-heading font-bold uppercase tracking-widest text-sm">Traditional Kata</h4>
                                <p className="text-xs text-muted-foreground">Preserving the classical patterns of the Shinbukan lineage.</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-foreground font-heading font-bold uppercase tracking-widest text-sm">Elite Kumite</h4>
                                <p className="text-xs text-muted-foreground">Dynamic sparring techniques for timing and distance mastery.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-video lg:aspect-square bg-muted/30 border border-border group overflow-hidden skew-x-[-2deg]">
                        <Image
                            src="https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=800&auto=format&fit=crop"
                            alt="Karate Philosophy"
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 skew-x-[2deg]"
                        />
                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                </section>
            </div>
        </div>
    );
}

