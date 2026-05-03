import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { QueryProvider } from "@/components/layout/QueryProvider";
import { Toaster } from "@/components/ui/Toaster";
import GoogleAnalytics from "@/components/layout/GoogleAnalytics";
import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/components/ui/Chatbot"), { ssr: false });
const SmoothScroll = dynamic(() => import("@/components/animations/SmoothScroll"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/animations/ScrollProgress"), { ssr: false });
const PageTransition = dynamic(() => import("@/components/animations/PageTransition"), { ssr: false });

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ethos Habitats — Socially Responsible Architecture",
    template: "%s | Ethos Habitats",
  },
  description:
    "Ethos Habitats is a socially responsible architecture studio crafting sustainable, innovative, and human-centered spaces in Chennai and beyond.",
  keywords: [
    "architecture",
    "socially responsible architecture",
    "sustainable design",
    "Chennai architects",
    "interior design",
    "residential architecture",
    "Ethos Habitats",
  ],
  authors: [{ name: "Ethos Habitats" }],
  creator: "Ethos Habitats",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Ethos Habitats",
    title: "Ethos Habitats — Socially Responsible Architecture",
    description:
      "Socially responsible architecture studio crafting sustainable, innovative spaces.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Ethos Habitats" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethos Habitats — Socially Responsible Architecture",
    description: "Socially responsible architecture studio based in Chennai.",
    images: ["/og-image.jpg"],
    creator: "@ethoshabitats",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body>
        <ThemeProvider>
          <QueryProvider>
            <SmoothScroll>
              <ScrollProgress />
              <PageTransition>
                {children}
              </PageTransition>
            </SmoothScroll>
            <Toaster />
            <Chatbot />
          </QueryProvider>
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
