"use client";

import { useState } from "react";
import { Task, useTaskStore } from "../../store/task-store";
import { CheckCircle, Circle, Edit, Trash } from "lucide-react";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { updateTask, deleteTask, setActiveTask, toggleTaskCompleted } =
    useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedEstimate, setEditedEstimate] = useState(task.estimatedPomodoros);

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    updateTask(task.id, {
      title: editedTitle,
      estimatedPomodoros: editedEstimate,
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setEditedTitle(task.title);
    setEditedEstimate(task.estimatedPomodoros);
    setIsEditing(false);
  }

  function handleSetActive() {
    if (!task.isCompleted) {
      setActiveTask(task.id);
    }
  }

  return (
    <div
      className={`border-b border-gray-200 dark:border-white/10 py-3 sm:py-4 ${
        task.isActive && !task.isCompleted
          ? "bg-gray-50 dark:bg-white/5"
          : "dark:bg-black"
      }`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2 sm:gap-3 px-3 sm:px-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-1.5 sm:p-2 border border-gray-300 dark:border-white/20 dark:bg-black dark:text-white rounded-md text-sm sm:text-base"
            autoFocus
          />

          <div className="flex justify-between items-center flex-wrap sm:flex-nowrap gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Est Pomodoros:
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={editedEstimate}
                onChange={(e) => setEditedEstimate(Number(e.target.value))}
                className="w-12 sm:w-16 p-1 sm:p-2 border border-gray-300 dark:border-white/20 dark:bg-black dark:text-white rounded-md text-sm"
              />
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleCancel}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => toggleTaskCompleted(task.id)}>
              {task.isCompleted ? (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              ) : (
                <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
              )}
            </button>

            <div
              className={`flex-1 text-sm sm:text-base ${
                task.isCompleted
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : "dark:text-white"
              }`}
              onClick={handleSetActive}
            >
              {task.title}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {task.completedPomodoros}/{task.estimatedPomodoros}
            </div>

            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
            >
              <Trash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
