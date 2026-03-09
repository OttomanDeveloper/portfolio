import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio | Digital Architect",
  description: "Bespoke digital experiences crafted with precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={cn("min-h-screen antialiased bg-background", inter.className)}>
        <ThemeProvider>
          {/* Background Elements */}
          <div className="mesh-gradient">
            <div className="mesh-ball w-[600px] h-[600px] bg-accent/20 -top-48 -left-48" />
            <div className="mesh-ball w-[500px] h-[500px] bg-accent-secondary/10 top-1/2 -right-24" />
            <div className="mesh-ball w-[400px] h-[400px] bg-accent/10 bottom-0 left-1/4" />
          </div>
          <ParticleBackground />
          
          <GrainOverlay />
          <SpeedInsights />
          
          <main className="relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
