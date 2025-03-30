import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Oops! Time&apos;s Up
      </h1>
      <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
        The page you&apos;re looking for has taken a break
      </h2>

      <div className="mb-8 bg-pomodoro text-white w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold">
        404
      </div>

      <p className="max-w-md mb-8 text-gray-600 dark:text-gray-300">
        While you&apos;re here, why not take a <strong>productive break</strong>{" "}
        with our <strong>Pomodoro timer</strong>? It&apos;s a great way to stay
        focused and manage your time effectively.
      </p>

      <Link
        href="/"
        className="px-6 py-3 bg-pomodoro hover:bg-pomodoro-darker text-white rounded-md transition-colors"
      >
        Start a Pomodoro Timer
      </Link>
    </div>
  );
}
