"use client";

import React, { useState } from "react";
import { Send, FileText, CheckCircle2 } from "lucide-react";
import { submitExamApplication } from "@/app/lib/actions";

interface Field {
    name: string;
    label: string;
    type: "text" | "date" | "textarea" | "file";
    required: boolean;
}

interface ExamApplicationFormProps {
    template: {
        id: string;
        title: string;
        description: string | null;
        fields: any; // Field[]
    };
}

export function ExamApplicationForm({ template }: ExamApplicationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fields = template.fields as Field[];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.append("templateId", template.id);

        try {
            await submitExamApplication(formData);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Failed to submit application.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 p-12 text-center rounded-sm space-y-4">
                <div className="w-16 h-16 bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-heading uppercase text-white">Application Received</h3>
                <p className="text-zinc-500 max-w-sm mx-auto">
                    Your application for <span className="text-primary font-bold">{template.title}</span> has been submitted to the Sensei for review.
                </p>
                <div className="pt-6">
                    <button
                        onClick={() => window.location.reload()}
                        className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white underline"
                    >
                        Back to Exams
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-sm space-y-8">
            <div>
                <h2 className="text-3xl font-heading font-black uppercase text-white leading-tight">{template.title}</h2>
                {template.description && <p className="text-zinc-500 mt-2 text-sm">{template.description}</p>}
            </div>

            <div className="space-y-6">
                {fields.map((field) => (
                    <div key={field.name} className="space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            {field.label} {field.required && <span className="text-primary">*</span>}
                        </label>

                        {field.type === "textarea" ? (
                            <textarea
                                name={field.name}
                                required={field.required}
                                className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors h-32"
                            />
                        ) : field.type === "file" ? (
                            <div className="relative group">
                                <input
                                    type="file"
                                    name={field.name}
                                    required={field.required}
                                    className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors file:bg-zinc-800 file:border-none file:text-white file:text-[10px] file:font-black file:uppercase file:tracking-widest file:px-4 file:py-1 file:mr-4 file:cursor-pointer"
                                />
                            </div>
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                required={field.required}
                                className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-primary outline-none transition-colors"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="pt-8 border-t border-zinc-800">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? "Processing..." : (
                        <>
                            <Send size={18} />
                            Submit Application
                        </>
                    )}
                </button>
                <p className="text-[10px] text-zinc-600 text-center mt-4 uppercase font-bold tracking-[0.2em]">
                    By submitting, you agree to the dojo grading policies.
                </p>
            </div>
        </form>
    );
}
