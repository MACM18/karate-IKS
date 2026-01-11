import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch existing settings or use defaults
  let settings = await prisma.dojoSettings.findFirst();

  // If no settings exist, create default ones
  if (!settings) {
    settings = await prisma.dojoSettings.create({
      data: {
        phoneNumbers: [],
        whatsappNumbers: [],
        senseiName: "Sensei",
      },
    });
  }

  return (
    <div className='p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Header */}
        <div className='bg-zinc-900 border border-zinc-800 p-8'>
          <h1 className='text-3xl font-heading font-black uppercase tracking-tighter text-white'>
            Dojo Settings
          </h1>
          <p className='text-sm text-zinc-500 mt-2'>
            Manage contact information and dojo details visible to students
          </p>
        </div>

        {/* Settings Form */}
        <SettingsForm initialData={settings} />
      </div>
    </div>
  );
}
