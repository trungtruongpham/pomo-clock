import { ReactNode } from "react";

interface ExplanationCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ExplanationCard({
  title,
  children,
  className = "",
}: ExplanationCardProps) {
  return (
    <div
      className={`bg-white dark:bg-black p-4 sm:p-5 md:p-6 rounded-lg text-black dark:text-white shadow-md sm:shadow-lg md:shadow-2xl dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-border/5 dark:border-white/10 w-full ${className}`}
    >
      <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 md:mb-4 dark:text-white">
        {title}
      </h2>
      <div className="text-sm sm:text-base">{children}</div>
    </div>
  );
}

export function PomodoroExplanation() {
  return (
    <ExplanationCard title="What is the Pomodoro Technique?">
      <p className="text-black/90 dark:text-white/90 mb-3 sm:mb-4">
        The <strong>Pomodoro Technique</strong> is a popular time management
        method developed by Francesco Cirillo in the late 1980s. It uses a{" "}
        <strong>pomodoro timer</strong> to break work into intervals,
        traditionally 25 minutes in length (called &quot;pomodoros&quot;),
        separated by short breaks to promote sustained concentration and prevent
        mental fatigue.
      </p>

      <h3 className="font-semibold text-base mb-2 dark:text-white">
        How the Pomodoro Study Method Works:
      </h3>

      <ol className="list-decimal pl-5 mb-3 space-y-1 text-black/90 dark:text-white/90">
        <li>Choose a task you want to complete</li>
        <li>
          Set the <strong>pomodoro timer</strong> for 25 minutes
        </li>
        <li>Work on the task until the timer rings</li>
        <li>Take a short 5-minute break</li>
        <li>Every 4 pomodoros, take a longer 15-30 minute break</li>
      </ol>

      <p className="text-black/90 dark:text-white/90">
        Using a dedicated <strong>pomodoro clock</strong> like PomoClock helps
        improve productivity by encouraging focused work sessions and regular
        breaks, making it ideal for students and professionals who need to
        maintain high concentration during <strong>study</strong> or work
        sessions.
      </p>
    </ExplanationCard>
  );
}
