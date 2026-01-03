"use client";

import { Download, Award } from "lucide-react";

interface CertificateCardProps {
    rank: string;
    date: string;
    instructor: string;
}

export function CertificateCard({ rank, date, instructor }: CertificateCardProps) {
    return (
        <div className="group relative bg-white text-black p-1 rounded-lg overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 duration-300">
            {/* Gold Border Effect */}
            <div className="absolute inset-0 border-4 border-double border-yellow-600 pointer-events-none rounded-lg z-10"></div>

            <div className="bg-orange-50/50 p-6 h-full flex flex-col items-center justify-center text-center relative">
                {/* Watermark */}
                <div className="absolute opacity-5 pointer-events-none">
                    <Award size={150} />
                </div>

                <div className="mb-4 text-yellow-600">
                    <Award size={48} />
                </div>

                <h3 className="font-heading text-3xl uppercase tracking-widest mb-1">Certificate</h3>
                <p className="font-serif italic text-zinc-600 mb-6">of Promotion</p>

                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">This certifies that</p>
                <p className="font-script text-2xl mb-6 font-bold text-black border-b border-black/20 pb-2 w-full">Student Name</p>

                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Has achieved the rank of</p>
                <h2 className="font-heading text-2xl uppercase text-action font-bold mb-8">{rank}</h2>

                <div className="flex justify-between w-full text-xs text-zinc-500 mt-auto pt-4 border-t border-yellow-600/20">
                    <div className="text-left">
                        <p className="uppercase tracking-widest font-bold">Date</p>
                        <p>{date}</p>
                    </div>
                    <div className="text-right">
                        <p className="uppercase tracking-widest font-bold">Instructor</p>
                        <p className="font-script text-lg">{instructor}</p>
                    </div>
                </div>

                {/* Overlay / Action */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-sm">
                    <button className="bg-white text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-yellow-400 transition-colors">
                        <Download size={18} /> Download
                    </button>
                </div>
            </div>
        </div>
    );
}
