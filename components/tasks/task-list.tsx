"use client";

import { useState } from "react";
import { useTaskStore } from "../../store/task-store";
import { TaskItem } from "./task-item";
import { Plus } from "lucide-react";

export function TaskList() {
  const { tasks, addTask, clearCompletedTasks } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskEstimate, setNewTaskEstimate] = useState(1);
  const [isAddingTask, setIsAddingTask] = useState(false);

  function handleAddTask() {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), newTaskEstimate);
      setNewTaskTitle("");
      setNewTaskEstimate(1);
      setIsAddingTask(false);
    }
  }

  const completedTasks = tasks.filter((task) => task.isCompleted);
  const activeTasks = tasks.filter((task) => !task.isCompleted);

  return (
    <div className="bg-white dark:bg-black rounded-lg shadow-lg dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-gray-100 dark:border-white/10 p-4 sm:p-5 md:p-6 w-full h-full">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold dark:text-white">Tasks</h2>
        {completedTasks.length > 0 && (
          <button
            onClick={clearCompletedTasks}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear completed
          </button>
        )}
      </div>

      <div className="mb-4">
        {isAddingTask ? (
          <div className="border border-gray-200 dark:border-white/10 rounded-md p-3 sm:p-4 dark:bg-black">
            <input
              type="text"
              placeholder="What are you working on?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-white/20 dark:bg-black dark:text-white rounded-md mb-3 text-sm sm:text-base"
              autoFocus
            />

            <div className="flex justify-between items-center flex-wrap sm:flex-nowrap gap-2">
              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Est Pomodoros:
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={newTaskEstimate}
                  onChange={(e) => setNewTaskEstimate(Number(e.target.value))}
                  className="w-12 sm:w-16 p-1 sm:p-2 border border-gray-300 dark:border-white/20 dark:bg-black dark:text-white rounded-md text-sm"
                />
              </div>

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 border border-gray-200 dark:border-white/10 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Add Task</span>
          </button>
        )}
      </div>

      <div className="overflow-y-auto max-h-72 sm:max-h-80 md:max-h-96">
        {activeTasks.length > 0 ? (
          <div>
            {activeTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-6 sm:py-8 text-sm sm:text-base">
            No active tasks. Add one above!
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="mt-4 sm:mt-6">
            <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Completed ({completedTasks.length})
            </div>
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
