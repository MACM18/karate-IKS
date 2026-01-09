import { HeroSection } from "@/components/HeroSection";
import { CoreValues } from "@/components/CoreValues";
import { Programs } from "@/components/Programs";

export default function Home() {
    return (
        <main>
           <HeroSection />
           <CoreValues />
           <Programs />
        </main>
    );
}
