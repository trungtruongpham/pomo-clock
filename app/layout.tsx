import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";
import { createServerSupabase } from "@/lib/supabase-server";
import { ThemeProvider } from "@/components/theme/theme-provider";
import OneTapComponent from "@/components/auth/one-tap";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://pomostudy.app"
  ),
  title: {
    default: "PomoClock - Pomodoro Timer for Productive Study Sessions",
    template: "%s | PomoClock - Pomodoro Timer",
  },
  description:
    "Free online Pomodoro timer for effective study sessions. Boost productivity with customizable work/break intervals, task tracking, and focus management using the Pomodoro technique.",
  keywords: [
    "pomodoro",
    "pomodoro timer",
    "pomodoro technique",
    "pomodoro clock",
    "pomodoro study",
    "focus timer",
    "study timer",
    "productivity tool",
    "time management",
    "study method",
    "concentration",
    "focus tracking",
    "focus leaderboard",
    "productivity app",
  ],
  authors: [{ name: "PomoClock", url: "https://pomostudy.app" }],
  creator: "PomoClock",
  applicationName: "PomoClock",
  publisher: "PomoClock",
  formatDetection: {
    telephone: false,
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

  openGraph: {
    type: "website",
    title: "PomoClock - Pomodoro Timer for Productive Study Sessions",
    description:
      "Enhance your study sessions with this free online Pomodoro timer. Customize work/break intervals, track tasks, and improve focus with the Pomodoro technique.",
    siteName: "PomoClock",
    locale: "en_US",
    url: "https://pomostudy.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PomoClock Pomodoro Timer",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "PomoClock - Pomodoro Timer for Study",
    description:
      "Boost your productivity with this free online Pomodoro timer for effective study sessions. Customizable work/break intervals and task tracking.",
    images: ["/og-image.png"],
    creator: "@pomostudy",
    site: "@pomostudy",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png",
      },
      {
        rel: "mask-icon",
        url: "/mask-icon.svg",
        color: "#DB524D",
      },
    ],
  },

  category: "Productivity",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "PomoClock",
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-TileColor": "#DB524D",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#DB524D",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className="no-scrollbar" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://pomostudy.app" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen no-scrollbar`}
      >
        <OneTapComponent />
        <ThemeProvider>
          <div className={`min-h-screen flex flex-col`}>
            <Header initialUser={user} />
            <main className="flex-1">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <footer className="mt-auto pb-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              <p>PomoClock - Pomodoro Timer for Productivity and Study</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
