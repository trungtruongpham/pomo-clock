import { TaskList } from "@/components/tasks/task-list";
import { Timer } from "../components/pomodoro/timer";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col gap-8">
        <Timer />

        <div className="bg-white bg-opacity-10 p-6 rounded-lg text-black">
          <h2 className="text-xl font-bold mb-4">
            What is Pomodoro Technique?
          </h2>
          <p className="text-black/90 mb-3">
            The Pomodoro Technique is a time management method developed by
            Francesco Cirillo. It uses a timer to break work into intervals,
            traditionally 25 minutes in length (called &quot;pomodoros&quot;),
            separated by short breaks.
          </p>
          <p className="text-black/90">
            This technique improves productivity by encouraging focused work
            sessions followed by regular breaks to promote sustained
            concentration and prevent mental fatigue.
          </p>
        </div>
      </div>

      <TaskList />
    </div>
  );
}
