"use client";

import { useState } from "react";
import { TaskList } from "@/components/tasks/task-list";
import { Timer } from "../components/pomodoro/timer";
import { PomodoroExplanation } from "@/components/explanation-card";
import { FocusMode } from "@/components/focus-mode-switch";
import Script from "next/script";

export default function Home() {
  const [focusModeActive, setFocusModeActive] = useState(false);

  // JSON-LD structured data for better SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PomoClock - Pomodoro Timer",
    description:
      "Free online Pomodoro timer for effective study sessions. Boost productivity with customizable work/break intervals, task tracking, and focus management.",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    keywords:
      "pomodoro, pomodoro timer, pomodoro technique, pomodoro clock, pomodoro study",
    screenshot: "https://pomostudy.app/og-image.png",
    url: "https://pomostudy.app",
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col w-full mx-auto">
        <header className="flex justify-end mb-4 mt-2">
          <FocusMode onChange={setFocusModeActive} />
        </header>

        {focusModeActive ? (
          <section
            className="flex justify-center items-center py-6 sm:py-10"
            aria-label="Focus Mode Timer"
          >
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
              <h1 className="sr-only">PomoClock - Pomodoro Timer for Focus</h1>
              <Timer focusMode={true} />
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <section
              className="flex flex-col gap-6 sm:gap-8 md:pr-4"
              aria-label="Pomodoro Timer Section"
            >
              <div className="w-full max-w-sm sm:max-w-md mx-auto md:mx-0">
                <h1 className="sr-only">
                  PomoClock - Pomodoro Timer for Productivity
                </h1>
                <Timer />
              </div>
              <div className="w-full max-w-sm sm:max-w-md mx-auto md:mx-0">
                <PomodoroExplanation />
              </div>
            </section>

            <section
              className="w-full max-w-xl mx-auto md:mx-0"
              aria-label="Task Management Section"
            >
              <TaskList />
            </section>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>PomoClock - Pomodoro Timer for Productivity and Study</p>
        </footer>
      </div>
    </>
  );
}
