import { MultiStepForm } from "@/components/MultiStepForm";

export default function JoinPage() {
    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background Atmosphere */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-action/5 rounded-full blur-3xl pointer-events-none" />

            <header className="text-center mb-16 relative z-10">
                <h1 className="text-5xl md:text-6xl font-heading uppercase text-white mb-4 tracking-tighter">
                    Join the Dojo
                </h1>
                <p className="text-zinc-400 max-w-xl mx-auto text-lg font-light text-balance">
                    "The ultimate aim of the art of Karate lies not in victory or defeat, but in the perfection of the character of its participants."
                </p>
            </header>

            <main className="w-full relative z-10">
                <MultiStepForm />
            </main>
        </div>
    );
}
