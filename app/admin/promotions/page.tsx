"use client";

import { PromotionCard } from "@/components/admin/PromotionCard";
import { useState } from "react";
import { Award, Filter } from "lucide-react";

export default function PromotionsPage() {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Mock candidates eligible for promotion
    const candidates = [
        { id: 1, name: "Daniel LaRusso", currentRank: "Yellow", nextRank: "Orange" },
        { id: 2, name: "Samantha LaRusso", currentRank: "Orange", nextRank: "Green" },
        { id: 3, name: "Miguel Diaz", currentRank: "Purple", nextRank: "Brown" },
        { id: 4, name: "Bert", currentRank: "White", nextRank: "Yellow" },
        { id: 5, name: "Nathaniel", currentRank: "White", nextRank: "Yellow" },
    ];

    const handleToggle = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(item => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handlePromote = () => {
        if (selectedIds.length === 0) return;
        const confirmed = confirm(`Promote ${selectedIds.length} students to their next rank?`);
        if (confirmed) {
            alert("Promotion Successful! Osu!");
            setSelectedIds([]);
        }
    };

    return (
        <div className="p-8 h-screen flex flex-col">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading uppercase text-white tracking-widest">
                        Promotion Manager
                    </h1>
                    <p className="text-zinc-500 mt-1">Select students who passed the recent exam.</p>
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded">
                        <Filter size={16} /> Filter Eligible
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pb-24">
                <h2 className="text-zinc-500 uppercase text-xs tracking-widest mb-4">
                    Candidates ({candidates.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {candidates.map((student) => (
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
            </div>

            <div className={`fixed bottom-8 right-8 transition-transform duration-300 ${selectedIds.length > 0 ? 'translate-y-0' : 'translate-y-32'}`}>
                <button
                    onClick={handlePromote}
                    className="flex items-center gap-3 bg-action text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-red-700 transition-colors"
                >
                    <Award size={20} />
                    Promote {selectedIds.length} Students
                </button>
            </div>
        </div>
    );
}
