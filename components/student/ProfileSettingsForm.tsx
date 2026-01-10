"use client";

import { useState } from "react";
import { updateStudentProfile } from "@/app/lib/actions";
import { Loader2, Save, Upload, User, Shield, Phone, HeartPulse } from "lucide-react";
import Image from "next/image";

interface ProfileSettingsFormProps {
    initialData: {
        name: string;
        email: string;
        image: string | null;
        phone: string;
        emergencyContact: string;
        bio: string;
    };
}

export function ProfileSettingsForm({ initialData }: ProfileSettingsFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(initialData.image);

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            await updateStudentProfile(formData);
            alert("Profile updated successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-12">

            {/* Identity Section */}
            <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <User size={120} />
                </div>

                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                    <Shield size={12} /> Visual Identification
                </h3>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group/image">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-900 shadow-xl bg-zinc-800 flex items-center justify-center">
                            {previewImage ? (
                                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-zinc-600" />
                            )}
                        </div>
                        <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover/image:opacity-100 transition-opacity cursor-pointer rounded-full">
                            <Upload size={20} className="mb-1" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Upload</span>
                            <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>

                    <div className="flex-1 space-y-4 w-full text-center md:text-left">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Operative Name</label>
                            <div className="text-xl font-bold text-zinc-300 font-heading uppercase tracking-wide">{initialData.name}</div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Comms ID (Email)</label>
                            <div className="text-sm font-mono text-zinc-400">{initialData.email}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Intel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl">
                    <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <Phone size={12} /> Direct Line
                    </h3>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Phone Number</label>
                        <input
                            name="phone"
                            defaultValue={initialData.phone}
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-black border border-zinc-800 p-4 text-sm font-bold text-white focus:border-primary focus:outline-none transition-colors placeholder:text-zinc-700 font-mono"
                        />
                    </div>
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl">
                    <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <HeartPulse size={12} /> Emergency Protocol
                    </h3>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Emergency Contact</label>
                        <input
                            name="emergencyContact"
                            defaultValue={initialData.emergencyContact}
                            type="text"
                            placeholder="Name & Number"
                            className="w-full bg-black border border-zinc-800 p-4 text-sm font-bold text-white focus:border-primary focus:outline-none transition-colors placeholder:text-zinc-700"
                        />
                    </div>
                </div>
            </div>

            {/* Bio / Medical */}
            <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl">
                <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                    Medical & Biographical Data
                </h3>
                <div className="space-y-2">
                    <textarea
                        name="bio"
                        defaultValue={initialData.bio}
                        rows={4}
                        placeholder="Listing any injuries, medical conditions, or personal training goals..."
                        className="w-full bg-black border border-zinc-800 p-4 text-sm font-medium text-white focus:border-primary focus:outline-none transition-colors placeholder:text-zinc-700 resize-none"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-zinc-900">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all skew-x-[-12deg] flex items-center gap-3 disabled:opacity-50"
                >
                    <span className="skew-x-[12deg] flex items-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Update Records
                    </span>
                </button>
            </div>

        </form>
    );
}
