import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { ProgramBento } from "@/components/ProgramBento";
import { LineageSection } from "@/components/LineageSection";
import { InstructorSpotlight } from "@/components/InstructorSpotlight";
import { ArrowRight, Bell, Shield, Target, Zap } from "lucide-react";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { NewsCard } from "@/components/NewsCard";
import Image from "next/image";

export default async function Home() {
    const latestPosts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3
    });

    const galleryHighlights = await prisma.galleryItem.findMany({
        orderBy: { createdAt: "desc" },
        take: 4
    });

    const session = await auth();
    let activeExams: any[] = [];
    if (session) {
        activeExams = await prisma.examTemplate.findMany({
            where: {
                isActive: true,
                openDate: { lte: new Date() },
                OR: [
                    { deadline: null },
                    { deadline: { gte: new Date() } }
                ]
            },
            take: 2
        });
    }

    return (
        <main className="bg-black min-h-screen">
            <HeroSection />

            {/* Dojo Alerts - Authenticated Only */}
            {session && activeExams.length > 0 && (
                <section className="py-8 bg-primary/5 border-y border-primary/10">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary animate-pulse">
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-heading uppercase text-white tracking-widest leading-none">Dojo Alerts</h2>
                                    <p className="text-zinc-500 text-sm mt-1 uppercase font-black tracking-widest text-[10px]">Active Exams & Registrations</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {activeExams.map((exam) => (
                                    <Link
                                        key={exam.id}
                                        href={`/student/exams?id=${exam.id}`}
                                        className="bg-black/40 border border-zinc-800 p-4 flex items-center gap-4 hover:border-primary transition-all group"
                                    >
                                        <div className="text-left">
                                            <div className="text-sm font-bold text-white uppercase group-hover:text-primary">{exam.title}</div>
                                            {exam.deadline && (
                                                <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-1 italic">
                                                    Deadline: {new Date(exam.deadline).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        <ArrowRight size={16} className="text-zinc-700 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-32 py-32">

                {/* Lineage & Tradition Section */}
                <LineageSection />

                {/* Programs Bento Grid */}
                <ProgramBento />

                {/* Latest Intelligence Section */}
                <section className="py-24 bg-muted/5">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <span className="text-primary font-heading font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Dojo Feed</span>
                                <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight text-foreground leading-[0.9]">
                                    Latest <span className="text-primary italic">Intelligence</span>
                                </h2>
                            </div>
                            <Link
                                href="/news"
                                className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                            >
                                View All Transmissions <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {latestPosts.map((post) => (
                                <NewsCard
                                    key={post.id}
                                    title={post.title}
                                    excerpt={post.content.substring(0, 120) + "..."}
                                    date={post.createdAt.toLocaleDateString()}
                                    category={post.category}
                                    imageUrl={post.imageUrl || undefined}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Visual Legacy Snippet */}
                <section className="py-24 border-t border-border">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-primary font-heading font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Archive</span>
                            <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight text-foreground">
                                Visual <span className="text-primary italic">Legacy</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {galleryHighlights.map((item, i) => (
                                <div key={item.id} className={`relative aspect-square overflow-hidden group border border-border ${i % 2 === 0 ? 'md:translate-y-8' : ''}`}>
                                    <Image
                                        src={item.url}
                                        alt={item.caption || "Gallery Image"}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-20 text-center">
                            <Link
                                href="/gallery"
                                className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-foreground hover:text-primary transition-colors border-b-2 border-primary pb-2"
                            >
                                Enter the Visual Archives
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Instructor Spotlight */}
                <InstructorSpotlight />

                {/* Impact/Stats Strip */}
                <section className="py-16 bg-primary text-white">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <h3 className="text-4xl md:text-5xl font-heading font-black mb-2">350+</h3>
                                <p className="text-sm font-bold uppercase tracking-widest opacity-80">Students</p>
                            </div>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-heading font-black mb-2">12</h3>
                                <p className="text-sm font-bold uppercase tracking-widest opacity-80">Black Belts</p>
                            </div>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-heading font-black mb-2">15</h3>
                                <p className="text-sm font-bold uppercase tracking-widest opacity-80">National Titles</p>
                            </div>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-heading font-black mb-2">10k+</h3>
                                <p className="text-sm font-bold uppercase tracking-widest opacity-80">Training Hours</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-24 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

                    <div className="container mx-auto px-4 lg:px-8 text-center">
                        <div className="max-w-3xl mx-auto">
                            <Shield className="w-16 h-16 text-primary mx-auto mb-8 animate-bounce" />
                            <h2 className="text-4xl md:text-6xl font-heading font-black uppercase text-foreground mb-6 leading-tight">
                                Your First Step Towards <br />
                                <span className="text-primary italic">Unstoppable Strength</span>
                            </h2>
                            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                                Join our community of dedicated practitioners. Whether you're a beginner or an advanced martial artist, there's a place for you in our Dojo.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link
                                    href="/join"
                                    className="px-12 py-5 bg-primary text-white font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-[6px_6px_0px_0px_rgba(220,38,38,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Register Now <ArrowRight size={20} />
                                </Link>
                                <Link
                                    href="/programs"
                                    className="px-12 py-5 border-2 border-border text-foreground font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-2"
                                >
                                    Browse Classes <Target size={20} />
                                </Link>
                            </div>

                            <p className="mt-12 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                                <Zap className="inline-block w-4 h-4 text-yellow-500 mr-2" />
                                Free introductory class for all new students
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

