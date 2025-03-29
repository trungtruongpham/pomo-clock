import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import icon from "@/public/icon.png";
import Header from "@/components/header/header";
import { createServerSupabase } from "@/lib/supabase-server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PomoClock - A Pomodoro Timer for Productivity",
  description:
    "A customizable Pomodoro timer to boost your productivity and focus",
  icons: {
    icon: icon.src,
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <div className={`min-h-screen flex flex-col `}>
          <Header initialUser={user} />
          <main className="flex-1 py-8">
            <div className="max-w-5xl mx-auto px-4">{children}</div>
          </main>

          <footer className="py-6 text-center text-white/70">
            <div className="max-w-5xl mx-auto">
              <p>Made with ♥ - Inspired by Pomofocus.io</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
