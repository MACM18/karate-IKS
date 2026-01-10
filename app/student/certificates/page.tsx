import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CertificateCard } from "@/components/student/CertificateCard";
import { Award, Shield } from "lucide-react";

export default async function CertificatesPage() {
    const session = await auth();
    if (!session || !session.user) redirect("/login");

    const profile = (await prisma.studentProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            currentRank: true,
            promotions: {
                include: { rank: true },
                orderBy: { promotedAt: 'desc' }
            }
        }
    })) as any;

    if (!profile) return <div>Profile not found</div>;

    const allRanks = await prisma.rank.findMany({ orderBy: { order: 'asc' } });
    const currentOrder = profile.currentRank?.order ?? -1;
    const nextRank = allRanks.find(r => r.order === currentOrder + 1);

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-10 max-w-7xl mx-auto w-full">
            <header className="mb-16">
                <div className="flex items-center gap-4 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                    <div className="w-12 h-px bg-primary" />
                    Honors & Awards
                </div>
                <h1 className="text-6xl font-heading font-black uppercase tracking-tighter text-white">
                    Digital <span className="text-primary italic">Archives</span>
                </h1>
                <p className="text-zinc-500 mt-4 font-medium max-w-2xl">
                    Official recognitions and belt certifications issued by the Shito-Ryu Shinbukan Headquarters.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
                {/* Latest Achievement Highlight */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-zinc-900 border border-zinc-800 p-8 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Award size={180} />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-block px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest mb-6">
                                Current Standing
                            </div>
                            <h2 className="text-3xl font-heading font-black uppercase mb-4">
                                {profile.currentRank?.name || "Initiate"}
                            </h2>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-8 italic">
                                "The journey of a thousand strikes begins with a single bow." You are currently holding the rank of {profile.currentRank?.name || "White Belt"}.
                            </p>
                            {nextRank && (
                                <div className="pt-8 border-t border-zinc-800">
                                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Target Rank</div>
                                    <div className="text-xl font-heading font-black text-white uppercase">{nextRank.name}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3 mb-8">
                        <span className="h-px w-8 bg-zinc-800"></span>
                        Certification History
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile.promotions.map((promo: any) => (
                            <CertificateCard
                                key={promo.id}
                                rank={promo.rank.name}
                                date={new Date(promo.promotedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                instructor="HQ Board of Senseis"
                            />
                        ))}

                        {profile.promotions.length === 0 && (
                            <div className="md:col-span-2 p-12 text-center border border-dashed border-zinc-800 rounded-lg">
                                <Shield size={48} className="mx-auto text-zinc-800 mb-4 opacity-20" />
                                <p className="text-zinc-600 font-medium italic">No digital certifications have been issued yet. Complete a grading to earn your first award.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
