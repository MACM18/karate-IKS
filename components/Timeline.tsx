"use client";

import { motion } from "framer-motion";

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
}

const events: TimelineEvent[] = [
    {
        year: "1988",
        title: "The Genesis",
        description: "Founding of the first Shinbukan Dojo by Kyoshi Miyagi, dedicated to authentic Shito-Ryu."
    },
    {
        year: "1995",
        title: "Association Growth",
        description: "Expansion into the Karate Do Shito-Ryu Shinbukan Association, unifying regional dojos."
    },
    {
        year: "2005",
        title: "International Recognition",
        description: "Official affiliation with global Shito-Ryu federations and first international seminar."
    },
    {
        year: "2012",
        title: "Championship Dominance",
        description: "Shinbukan students secure top honors in major national and continental kumite championships."
    },
    {
        year: "2024",
        title: "Digital Legacy",
        description: "Launch of the modernized digital presence to preserve and transmit the art for future generations."
    }
];

export function Timeline() {
    return (
        <div className="relative py-12">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/20 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12 md:space-y-24">
                {events.map((event, index) => (
                    <motion.div
                        key={event.year}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                            }`}
                    >
                        {/* Content */}
                        <div className="flex-1 w-full text-left md:text-right md:pr-12 last:md:text-left last:md:pl-12">
                            <div className={`space-y-2 ${index % 2 === 0 ? "md:text-left md:pl-12" : "md:text-right md:pr-12"}`}>
                                <span className="text-primary font-heading font-black text-4xl md:text-6xl tracking-tighter leading-none">
                                    {event.year}
                                </span>
                                <h3 className="text-xl font-heading font-bold uppercase text-foreground leading-tight">
                                    {event.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-md ml-auto mr-auto md:ml-0 md:mr-0 lg:ml-auto lg:mr-0 last:lg:ml-0 last:lg:mr-auto">
                                    {event.description}
                                </p>
                            </div>
                        </div>

                        {/* Node */}
                        <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-background border-4 border-primary rounded-full -translate-x-1/2 z-10 flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        </div>

                        <div className="flex-1 w-full hidden md:block" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
