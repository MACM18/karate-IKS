import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileSettingsForm } from "@/components/student/ProfileSettingsForm";
import { decrypt } from "@/app/lib/encryption";
import { Settings } from "lucide-react";

export default async function StudentSettingsPage() {
    const session = await auth();
    if (!session || !session.user) redirect("/login");

    const profile = await prisma.studentProfile.findUnique({
        where: { userId: session.user.id },
    });

    if (!profile) return <div>Profile not found</div>;

    // Decrypt data for form display
    const phone = profile.phone ? decrypt(profile.phone) : "";
    const emergencyContact = profile.emergencyContact ? decrypt(profile.emergencyContact) : "";

    const initialData = {
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || null,
        phone,
        emergencyContact,
        bio: profile.bio || "",
    };

    return (
        <div className='container mx-auto px-4 lg:px-8 py-12 max-w-4xl'>
            <header className="mb-12 border-b border-zinc-900 pb-8">
                <div className="flex items-center gap-4 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                    <Settings size={16} /> Configuration
                </div>
                <h1 className='text-5xl font-heading font-black uppercase tracking-tighter text-white'>
                    Intelligence <span className='text-primary italic'>Profile</span>
                </h1>
                <p className='text-zinc-500 mt-2 font-medium max-w-2xl'>
                    Update your personal dossier, contact protocols, and visual identification.
                </p>
            </header>

            <ProfileSettingsForm initialData={initialData} />
        </div>
    );
}
