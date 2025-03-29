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
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Tasks</h2>
        {completedTasks.length > 0 && (
          <button
            onClick={clearCompletedTasks}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear completed
          </button>
        )}
      </div>

      <div className="mb-4">
        {isAddingTask ? (
          <div className="border border-gray-200 rounded-md p-4">
            <input
              type="text"
              placeholder="What are you working on?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
              autoFocus
            />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Est Pomodoros:</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={newTaskEstimate}
                  onChange={(e) => setNewTaskEstimate(Number(e.target.value))}
                  className="w-16 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-5 w-5" />
            <span>Add Task</span>
          </button>
        )}
      </div>

      <div className="overflow-y-auto max-h-96">
        {activeTasks.length > 0 ? (
          <div>
            {activeTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No active tasks. Add one above!
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="mt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">
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
