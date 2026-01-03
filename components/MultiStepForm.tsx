"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

export function MultiStepForm() {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        experience: "beginner",
        goals: [],
        program: "adults",
    });

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Application Submitted! (Mock)");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
            {/* Progress Bar */}
            <div className="bg-zinc-950 p-6 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-heading uppercase text-zinc-400 tracking-widest">Step {step} of {totalSteps}</span>
                    <span className="text-xs text-zinc-500 uppercase">{
                        step === 1 ? "Personal Details" : step === 2 ? "Experience & Goals" : "Class Selection"
                    }</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-action transition-all duration-500 ease-out"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">

                {/* Step 1: Personal Details */}
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                        <h2 className="text-2xl font-heading uppercase text-white mb-6">Who is entering the Dojo?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-500">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-action focus:outline-none focus:ring-1 focus:ring-action transition-colors"
                                    placeholder="Daniel"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-500">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-action focus:outline-none focus:ring-1 focus:ring-action transition-colors"
                                    placeholder="LaRusso"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-500">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-action focus:outline-none focus:ring-1 focus:ring-action transition-colors"
                                    placeholder="daniel@miyagido.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-500">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-action focus:outline-none focus:ring-1 focus:ring-action transition-colors"
                                    placeholder="(555) 0199-342"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Experience */}
                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                        <h2 className="text-2xl font-heading uppercase text-white mb-6">Your Journey So Far</h2>

                        <div className="space-y-4">
                            <label className="text-xs uppercase tracking-widest text-zinc-500">Prior Experience</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                    <div
                                        key={level}
                                        onClick={() => setFormData({ ...formData, experience: level.toLowerCase() })}
                                        className={`p-4 border rounded cursor-pointer transition-all ${formData.experience === level.toLowerCase()
                                                ? 'border-action bg-action/10 text-white'
                                                : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-600'
                                            }`}
                                    >
                                        <span className="font-bold uppercase tracking-wide">{level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-zinc-500">Primary Goal</label>
                            <select
                                name="program"
                                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-white focus:border-action focus:outline-none"
                                onChange={handleChange}
                            >
                                <option value="">Select a Goal</option>
                                <option value="fitness">Physical Fitness</option>
                                <option value="self-defense">Self Defense</option>
                                <option value="competition">Competition</option>
                                <option value="discipline">Mental Discipline</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 3: Class Selection */}
                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                        <h2 className="text-2xl font-heading uppercase text-white mb-6">Select a Program</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div
                                onClick={() => setFormData({ ...formData, program: 'kids' })}
                                className={`p-6 border rounded cursor-pointer flex items-center justify-between group transition-all ${formData.program === 'kids'
                                        ? 'border-action bg-action/10'
                                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                                    }`}
                            >
                                <div>
                                    <h3 className={`font-heading uppercase text-lg ${formData.program === 'kids' ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>Little Ninjas (Ages 4-7)</h3>
                                    <p className="text-sm text-zinc-500">Focus, discipline, and basic motor skills.</p>
                                </div>
                            </div>

                            <div
                                onClick={() => setFormData({ ...formData, program: 'juniors' })}
                                className={`p-6 border rounded cursor-pointer flex items-center justify-between group transition-all ${formData.program === 'juniors'
                                        ? 'border-action bg-action/10'
                                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                                    }`}
                            >
                                <div>
                                    <h3 className={`font-heading uppercase text-lg ${formData.program === 'juniors' ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>Juniors (Ages 8-15)</h3>
                                    <p className="text-sm text-zinc-500">Self-defense, kata, and character building.</p>
                                </div>
                            </div>

                            <div
                                onClick={() => setFormData({ ...formData, program: 'adults' })}
                                className={`p-6 border rounded cursor-pointer flex items-center justify-between group transition-all ${formData.program === 'adults'
                                        ? 'border-action bg-action/10'
                                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                                    }`}
                            >
                                <div>
                                    <h3 className={`font-heading uppercase text-lg ${formData.program === 'adults' ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>Adults (16+)</h3>
                                    <p className="text-sm text-zinc-500">Fitness, traditional Shotokan, and sparring.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-zinc-900">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={step === 1}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${step === 1 ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        <ChevronLeft size={16} /> Back
                    </button>

                    {step < totalSteps ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded-sm"
                        >
                            Next Step <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-8 py-3 bg-action text-white font-bold uppercase tracking-widest hover:bg-red-700 transition-colors rounded-sm shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                        >
                            Submit Application <Check size={16} />
                        </button>
                    )}
                </div>

            </form>
        </div>
    );
}
