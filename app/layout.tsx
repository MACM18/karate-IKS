import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
    title: "Karate IKS",
    description: "Private Karate School Portal",
};

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${oswald.variable} antialiased`}>
                <AuthProvider>
                    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                        <Navbar />
                        {children}
                        <Footer />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

