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
      className={`border-b border-gray-200 py-4 ${
        task.isActive && !task.isCompleted ? "bg-gray-50" : ""
      }`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-3 px-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            autoFocus
          />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Est Pomodoros:</label>
              <input
                type="number"
                min="1"
                max="99"
                value={editedEstimate}
                onChange={(e) => setEditedEstimate(Number(e.target.value))}
                className="w-16 p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => toggleTaskCompleted(task.id)}>
              {task.isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </button>

            <div
              className={`flex-1 ${
                task.isCompleted ? "line-through text-gray-500" : ""
              }`}
              onClick={handleSetActive}
            >
              {task.title}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {task.completedPomodoros}/{task.estimatedPomodoros}
            </div>

            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-gray-600"
            >
              <Edit className="h-4 w-4" />
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
