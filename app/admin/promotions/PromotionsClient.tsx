"use client";

import { PromotionCard } from "@/components/admin/PromotionCard";
import { useState } from "react";
import { Award, Filter, Loader2, CheckCircle2 } from "lucide-react";
import { promoteStudents } from "@/app/lib/actions";

interface Candidate {
    id: string;
    name: string;
    currentRank: string;
    nextRank: string;
    currentRankColor: string;
    nextRankColor: string;
}

export function PromotionsClient({ initialCandidates }: { initialCandidates: Candidate[] }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(item => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handlePromote = async () => {
        if (selectedIds.length === 0) return;
        const confirmed = confirm(`Promote ${selectedIds.length} students to their next rank? This will update their profiles and log the promotion history.`);
        if (confirmed) {
            setIsLoading(true);
            try {
                await promoteStudents(selectedIds);
                setMessage(`${selectedIds.length} students promoted successfully.`);
                setSelectedIds([]);
                // Reload to refresh the list (some might drop off if they no longer have approved apps since last promotion)
                window.location.reload();
            } catch (error: any) {
                alert(error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="p-8 h-screen flex flex-col max-w-7xl mx-auto w-full">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-5xl font-heading font-black uppercase tracking-tighter text-white">
                        Promotion <span className="text-primary italic">Manager</span>
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">Select students who passed the recent exam and bestow their new ranks.</p>
                </div>

                <div className="flex gap-4">
                    {message && (
                        <div className="flex items-center gap-2 text-emerald-500 text-xs font-black uppercase tracking-widest bg-emerald-500/10 px-4 py-2 border border-emerald-500/20">
                            <CheckCircle2 size={14} /> {message}
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pb-24">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                        <span className="h-px w-8 bg-zinc-800"></span>
                        Eligible Candidates ({initialCandidates.length})
                    </h2>
                </div>

                {initialCandidates.length === 0 ? (
                    <div className="py-24 text-center border border-dashed border-zinc-800 rounded-lg">
                        <Award size={48} className="mx-auto text-zinc-800 mb-4 opacity-20" />
                        <p className="text-zinc-600 font-medium italic italic">No students are currently eligible for promotion based on approved exam applications.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {initialCandidates.map((student) => (
                            <PromotionCard
                                key={student.id}
                                name={student.name}
                                currentRank={student.currentRank}
                                nextRank={student.nextRank}
                                isSelected={selectedIds.includes(student.id)}
                                onToggle={() => handleToggle(student.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className={`fixed bottom-12 right-12 transition-all duration-500 ${selectedIds.length > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-32 opacity-0 scale-90'}`}>
                <button
                    onClick={handlePromote}
                    disabled={isLoading}
                    className="flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-sm font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(220,38,38,0.3)] hover:bg-red-700 transition-all flex items-center justify-center min-w-[280px]"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <Award size={20} />
                            Bestow {selectedIds.length} Ranks
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
