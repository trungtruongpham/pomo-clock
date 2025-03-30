import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import icon from "@/public/icon.png";
import Header from "@/components/header/header";
import { createServerSupabase } from "@/lib/supabase-server";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  ],
  authors: [{ name: "PomoClock", url: "https://pomostudy.app" }],
  creator: "PomoClock",
  applicationName: "PomoClock",
  publisher: "PomoClock",

  openGraph: {
    type: "website",
    title: "PomoClock - Pomodoro Timer for Productive Study Sessions",
    description:
      "Enhance your study sessions with this free online Pomodoro timer. Customize work/break intervals, track tasks, and improve focus with the Pomodoro technique.",
    siteName: "PomoClock",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PomoClock Pomodoro Timer",
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
  },

  icons: {
    icon: icon.src,
    apple: "/apple-touch-icon.png",
  },

  category: "Productivity",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          <div className={`min-h-screen flex flex-col`}>
            <Header initialUser={user} />
            <main className="flex-1 py-8">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
