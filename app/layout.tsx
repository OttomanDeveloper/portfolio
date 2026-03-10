import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

import { getProfile } from "@/lib/api-server";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const siteTitle = profile?.siteTitle || "Portfolio | Digital Architect";
  const description = profile?.tagline || "Bespoke digital experiences crafted with precision.";
  const favicon = profile?.faviconUrl || "/favicon.ico";

  return {
    title: siteTitle,
    description: description,
    icons: {
      icon: favicon ? `${favicon}${favicon.includes('?') ? '&' : '?'}v=${Date.now()}` : "/favicon.ico",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    alternates: {
      canonical: "./",
    },
    openGraph: {
      title: siteTitle,
      description: description,
      url: "./",
      siteName: siteTitle,
      images: [
        {
          url: profile?.avatarUrl || "/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: description,
      images: [profile?.avatarUrl || "/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

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
          <div className="site-grid" />
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
