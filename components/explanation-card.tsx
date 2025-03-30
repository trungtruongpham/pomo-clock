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
    <ExplanationCard title="What is Pomodoro Technique?">
      <p className="text-black/90 dark:text-white/90 mb-2 sm:mb-3">
        The Pomodoro Technique is a time management method developed by
        Francesco Cirillo. It uses a timer to break work into intervals,
        traditionally 25 minutes in length (called &quot;pomodoros&quot;),
        separated by short breaks.
      </p>
      <p className="text-black/90 dark:text-white/90">
        This technique improves productivity by encouraging focused work
        sessions followed by regular breaks to promote sustained concentration
        and prevent mental fatigue.
      </p>
    </ExplanationCard>
  );
}
